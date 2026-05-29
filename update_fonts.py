import os

new_font_link = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">'

html_files = [
    'blog/index.html',
    'blog-post-template/index.html',
    'links/index.html',
    'tr/index.html',
    'tr/blog/index.html',
    'tr/blog-post-template/index.html',
    'tr/links/index.html'
]

for file in html_files:
    if not os.path.exists(file):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the old Inter font link
    old_font_link1 = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">'
    old_font_link2 = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&amp;display=swap" rel="stylesheet">'
    
    if old_font_link1 in content:
        content = content.replace(old_font_link1, new_font_link)
    elif old_font_link2 in content:
        content = content.replace(old_font_link2, new_font_link)

    # Also clean up tr/index.html spans
    if file == 'tr/index.html':
        content = content.replace('<span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Ekip Lideri</span>', '<span class="tech-tag" style="color: var(--text-muted); font-size: 0.85rem;">Ekip Lideri</span>')
        content = content.replace('<span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Şubat 2026</span>', '<span class="tech-tag" style="color: var(--text-muted); font-size: 0.85rem;">Şubat 2026</span>')
        content = content.replace('<span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Ekip Üyesi</span>', '<span class="tech-tag" style="color: var(--text-muted); font-size: 0.85rem;">Ekip Üyesi</span>')
        content = content.replace('<span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Aralık 2025</span>', '<span class="tech-tag" style="color: var(--text-muted); font-size: 0.85rem;">Aralık 2025</span>')
        content = content.replace('<span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Mayıs 2025</span>', '<span class="tech-tag" style="color: var(--text-muted); font-size: 0.85rem;">Mayıs 2025</span>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Update complete")
