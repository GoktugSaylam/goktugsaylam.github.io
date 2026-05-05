import os, re

root_dir = '.'

for root, dirs, files in os.walk(root_dir):
    # Skip .git directory
    dirs[:] = [d for d in dirs if d != '.git']
    
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Remove duplicate navigation.js from <head> (keep only the one at end of body)
            new_content = re.sub(
                r'\n?\s*<script src="/assets/js/navigation\.js"></script>\s*\n?(?=.*<body)',
                '',
                content,
                flags=re.DOTALL
            )
            
            # Make sure there's one at end of body if missing
            if '<script src="/assets/js/navigation.js"></script>' not in new_content:
                new_content = new_content.replace('</body>', '    <script src="/assets/js/navigation.js"></script>\n</body>')
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'Fixed duplicate script in {path}')
            else:
                print(f'No change needed: {path}')
