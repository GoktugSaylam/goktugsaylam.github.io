import os

def insert_nav_link(filepath, is_tr=False):
    if not os.path.exists(filepath):
        print("Not found:", filepath)
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if is_tr:
        # We look for the Organizasyonlar link to insert Projeler right after
        target = '<li><a href="/tr/#organizasyonlar">Organizasyonlar</a></li>'
        # Only replace if Projeler is not already there
        if 'href="/tr/#projeler"' not in content and target in content:
            repl = target + '\n                    <li><a href="/tr/#projeler">Projeler</a></li>'
            content = content.replace(target, repl)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Updated:", filepath)
    else:
        # We look for the Organizations link to insert Projects right after
        target = '<li><a href="/#organizations">Organizations</a></li>'
        # Only replace if Projects is not already there
        if 'href="/#projects"' not in content and target in content:
            repl = target + '\n                    <li><a href="/#projects">Projects</a></li>'
            content = content.replace(target, repl)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Updated:", filepath)

insert_nav_link('links/index.html', is_tr=False)
insert_nav_link('tr/links/index.html', is_tr=True)
insert_nav_link('blog/index.html', is_tr=False)
insert_nav_link('tr/blog/index.html', is_tr=True)
