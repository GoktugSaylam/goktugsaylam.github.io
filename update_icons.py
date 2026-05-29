import os

def update_html(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace LinkedIn icon and text
    content = content.replace('<i class="fa-brands fa-linkedin"></i> Post', '<i class="fa-brands fa-linkedin-in"></i> LinkedIn')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_html('index.html')
update_html('tr/index.html')
print("HTML updated.")
