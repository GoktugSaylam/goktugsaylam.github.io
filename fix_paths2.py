import os

tr_files = [
    'tr/index.html',
    'tr/blog/index.html',
    'tr/links/index.html',
    'tr/blog-post-template/index.html'
]

en_files = [
    'index.html',
    'blog/index.html',
    'links/index.html',
    'blog-post-template/index.html'
]

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (not found)")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

# We must be careful about replacement order.
# For TR (now in tr/):
tr_replacements = [
    ('href="/en/links/" class="lang-switch">EN', 'href="/links/" class="lang-switch">EN'),
    ('href="/en/blog/" class="lang-switch">EN', 'href="/blog/" class="lang-switch">EN'),
    ('href="/en/" class="lang-switch">EN', 'href="/" class="lang-switch">EN'),
    
    # Switch the logo href
    ('href="/" class="logo"', 'href="/tr/" class="logo"'),
    
    # Nav links
    ('href="/#', 'href="/tr/#'),
    ('href="/blog/"', 'href="/tr/blog/"'),
    ('href="/links/"', 'href="/tr/links/"'),
    ('href="/blog-post-template/"', 'href="/tr/blog-post-template/"'),
]

# For EN (now in root):
en_replacements = [
    ('href="/links/" class="lang-switch">TR', 'href="/tr/links/" class="lang-switch">TR'),
    ('href="/blog/" class="lang-switch">TR', 'href="/tr/blog/" class="lang-switch">TR'),
    ('href="/" class="lang-switch">TR', 'href="/tr/" class="lang-switch">TR'),
    
    # Nav links
    ('href="/en/#', 'href="/#'),
    ('href="/en/blog/"', 'href="/blog/"'),
    ('href="/en/links/"', 'href="/links/"'),
    ('href="/en/blog-post-template/"', 'href="/blog-post-template/"'),
    
    # Switch the logo href
    ('href="/en/" class="logo"', 'href="/" class="logo"'),
]

for f in tr_files:
    replace_in_file(f, tr_replacements)

for f in en_files:
    replace_in_file(f, en_replacements)
