# Interactive Reviewer Response Website

This website allows you to browse reviewer comments and responses from your LaTeX source file.

## How to Update Content

If you edit the content in `../supercomputting_respond_letter/main.tex`, you need to regenerate the website data.

### Option 1: Run the helper script (Recommended)
Open a terminal in this directory and run:

```bash
./update_website.sh
```

### Option 2: Run the Python script manually
You can also run the Python parser directly:

```bash
python3 parse_latex_to_js.py
```

## Files
- `index.html`: The main website file. Open this in your browser.
- `data.js`: The generated data file containing parsed comments and responses.
- `parse_latex_to_js.py`: The script that parses the LaTeX file and generates `data.js`.
- `style.css`: The website styling.
- `script.js`: The website logic.
