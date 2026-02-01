import re
import json
import os
import subprocess

def clean_latex_content(text):
    """Clean LaTeX content by removing artifacts and converting to HTML-friendly format"""
    if not text:
        return ""
    
    # Remove LaTeX preamble artifacts
    text = re.sub(r'\\documentclass.*?\\begin\{document\}', '', text, flags=re.DOTALL)
    text = re.sub(r'\\usepackage\{[^}]+\}', '', text)
    text = re.sub(r'\\geometry\{[^}]+\}', '', text)
    text = re.sub(r'\\hypersetup\{[^}]+\}', '', text, flags=re.DOTALL)
    text = re.sub(r'\\definecolor\{[^}]+\}\{[^}]+\}\{[^}]+\}', '', text)
    text = re.sub(r'\\newtcolorbox\{[^}]+\}.*?(?=\\n\\n|$)', '', text, flags=re.DOTALL)
    text = re.sub(r'\\newcommand\{[^}]+\}.*?(?=\\n\\n|$)', '', text, flags=re.DOTALL)
    
    # Remove table formatting artifacts
    text = re.sub(r'\{@\{\}[lrc]+@\{\}\}', '', text)  # {@{}lrc@{}}
    text = re.sub(r'\{[lrc]+\}', '', text)  # {llccccc}
    text = re.sub(r'\\toprule|\\midrule|\\bottomrule|\\cmidrule\(lr\)\{[^}]+\}', '', text)
    text = re.sub(r'\\hline', '', text)
    text = re.sub(r'\\multirow\{[^}]+\}\{[^}]+\}\{[^}]+\}', '', text)
    text = re.sub(r'\\multicolumn\{[^}]+\}\{[^}]+\}\{[^}]+\}', '', text)
    text = re.sub(r'\\cmidrule[^\n]*', '', text)
    
    # Remove figure/label artifacts
    text = re.sub(r'\\label\{[^}]+\}', '', text)
    text = re.sub(r'label\{[^}]+\}', '', text)
    text = re.sub(r'\\end\{figure\}', '', text)
    text = re.sub(r'\\includegraphics\[width=[^\]]+\]\{[^}]+\}', '', text)
    
    # Remove common LaTeX commands
    text = re.sub(r'\\maketitle|\\tableofcontents|\\newpage|\\clearpage|\\FloatBarrier', '', text)
    
    # Clean up whitespace
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    text = text.strip()
    
    return text

def classify_comment(comment_text, response_text):
    """Classify comment based on keywords"""
    combined = (comment_text + " " + response_text).lower()
    tags = []
    
    # Experiment keywords
    if any(word in combined for word in ['experiment', 'empirical', 'evaluation', 'benchmark', 'test', 'result', 'performance', 'comparison']):
        tags.append('Experiment')
    
    # Revision keywords
    if any(word in combined for word in ['revise', 'modify', 'update', 'change', 'improve', 'clarify', 'rewrite', 'edit']):
        tags.append('Revision')
    
    # New content keywords
    if any(word in combined for word in ['add', 'new', 'include', 'introduce', 'extend', 'expand', 'additional']):
        tags.append('New Content')
    
    return tags if tags else ['Revision']

def find_balanced_braces(text, start_pos):
    """Find the closing brace for an opening brace, handling nested braces"""
    count = 1
    pos = start_pos
    while pos < len(text) and count > 0:
        if text[pos] == '{' and (pos == 0 or text[pos-1] != '\\'):
            count += 1
        elif text[pos] == '}' and (pos == 0 or text[pos-1] != '\\'):
            count -= 1
        pos += 1
    return pos if count == 0 else -1

def extract_command_content(text, command):
    """Extract content from LaTeX command with balanced brace matching"""
    pattern = f'\\{command}\\[([^\\]]+)\\]\\{{'
    match = re.search(pattern, text)
    if not match:
        return None, None, -1
    
    title = match.group(1)
    start = match.end()
    end = find_balanced_braces(text, start)
    
    if end == -1:
        return None, None, -1
    
    content = text[start:end-1]
    return title, content, end

def parse_latex_file(file_path):
    """Parse the LaTeX file and extract reviewer comments and responses"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract only the document body
    if '\\begin{document}' in content:
        _, content = content.split('\\begin{document}', 1)
    if '\\end{document}' in content:
        content, _ = content.split('\\end{document}', 1)
    
    data = []
    
    # Find all reviewer sections
    section_pattern = r'\\section\*\{Response to ([^}]+)\}'
    sections = re.split(section_pattern, content)
    
    # Process each reviewer section (skip first element which is before any section)
    for i in range(1, len(sections), 2):
        if i + 1 >= len(sections):
            break
            
        reviewer_name = sections[i].strip()
        reviewer_content = sections[i + 1]
        
        comments = []
        
        # Find all \reviewercomment commands
        pos = 0
        while True:
            # Find next \reviewercomment
            idx = reviewer_content.find('\\reviewercomment[', pos)
            if idx == -1:
                break
            
            # Extract comment title and content
            comment_title, comment_content, comment_end = extract_command_content(
                reviewer_content[idx:], 'reviewercomment'
            )
            
            if comment_title is None:
                pos = idx + 1
                continue
            
            # Find corresponding \response
            response_start = reviewer_content.find('\\response{', idx + comment_end)
            if response_start == -1:
                pos = idx + comment_end
                continue
            
            # Extract response content
            response_brace_start = response_start + len('\\response{')
            response_end = find_balanced_braces(reviewer_content, response_brace_start)
            
            if response_end == -1:
                pos = idx + comment_end
                continue
            
            response_content = reviewer_content[response_brace_start:response_end-1]
            
            # Clean content
            comment_clean = clean_latex_content(comment_content)
            response_clean = clean_latex_content(response_content)
            
            # Skip empty comments
            if not comment_clean and not response_clean:
                pos = response_end
                continue
            
            # Extract images from response
            images = []
            fig_pattern = r'figs/([^"\s\}]+\.(?:png|jpg|pdf))'
            images = [f"figs/{match}" for match in re.findall(fig_pattern, response_content)]
            
            # Convert PDF to PNG if needed
            for img in images[:]:
                if img.endswith('.pdf'):
                    png_path = img.replace('.pdf', '.png')
                    if not os.path.exists(png_path):
                        try:
                            subprocess.run(['convert', '-density', '300', img, png_path], check=True)
                        except:
                            pass
                    images[images.index(img)] = png_path
            
            tags = classify_comment(comment_clean, response_clean)
            
            comments.append({
                "title": comment_title.strip(),
                "comment": comment_clean,
                "response": response_clean,
                "images": images,
                "tags": tags,
                "is_intro": False
            })
            
            pos = response_end
        
        if comments:
            data.append({
                "reviewer": reviewer_name,
                "comments": comments
            })
    
    return data

def main():
    input_file = "main.tex"
    output_file = "data.js"
    
    print(f"Parsing {input_file}...")
    data = parse_latex_file(input_file)
    
    # Write to JavaScript file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("const responseData = ")
        f.write(json.dumps(data, indent=2, ensure_ascii=False))
        f.write(";")
    
    print(f"Successfully generated {output_file}")
    print(f"Found {len(data)} reviewers with {sum(len(r['comments']) for r in data)} total comments")

if __name__ == "__main__":
    main()
