import os, re

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # For pages with a lang-switch
            new_content = re.sub(
                r'<a href="([^"]+)" class="lang-switch">([^<]+)</a>',
                r'<div class="header-controls">\n                <button class="theme-toggle" aria-label="Toggle Theme">🌙</button>\n                <a href="\1" class="lang-switch">\2</a>\n            </div>',
                content
            )
            
            # For links/index.html which doesn't have a lang-switch, inject at the top of links-container
            if 'links-container' in content and 'theme-toggle' not in new_content:
                new_content = new_content.replace(
                    '<div class="container links-container">',
                    '<div class="container links-container">\n            <div class="header-controls" style="justify-content: flex-end; margin-bottom: 1rem;">\n                <button class="theme-toggle" aria-label="Toggle Theme">🌙</button>\n            </div>'
                )
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'Updated {path}')
