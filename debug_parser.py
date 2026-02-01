
with open('main.tex', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract document body
if '\\begin{document}' in content:
    _, content = content.split('\\begin{document}', 1)
if '\\end{document}' in content:
    content, _ = content.split('\\end{document}', 1)

# Test section pattern
section_pattern = r'\\section\*\{Response to ([^}]+)\}'
sections = re.findall(section_pattern, content)
print(f"Found {len(sections)} sections:")
for s in sections:
    print(f"  - {s}")

# Test on a specific section
if sections:
    # Get content after first section
    parts = re.split(section_pattern, content)
    if len(parts) > 2:
        first_section_content = parts[2][:1000]  # First 1000 chars
        print(f"\nFirst section content preview:\n{first_section_content[:500]}")
        
        # Test comment pattern
        pattern = r'\\reviewercomment\[([^\]]+)\]\{(.*?)\}\\response\{(.*?)\}(?=\\reviewercomment|\\section|\\reviewerdivider|$)'
        matches = re.findall(pattern, first_section_content, re.DOTALL)
        print(f"\nFound {len(matches)} comments in first section")
