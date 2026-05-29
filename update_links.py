import os
import re

def update_html(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    idx1 = content.find("<!-- OSTİMTECH Jam 2026 -->")
    idx2 = content.find("<!-- AYAZJAM'25 -->")
    idx3 = content.find("<!-- OSTİMTECH Jam 2025 -->")
    
    # We must find the end of the carousel section to safely slice
    end_idx = content.find('<button class="carousel-btn btn-next"', idx3)

    if idx1 == -1 or idx2 == -1 or idx3 == -1 or end_idx == -1:
        print("Could not find sections in", filepath)
        return

    card1 = content[idx1:idx2]
    card2 = content[idx2:idx3]
    card3 = content[idx3:end_idx]

    # Card 1: set itch.io link, remove linkedin
    card1 = re.sub(r'<a href="[^"]*".*?<i class="fa-brands fa-linkedin-in"></i> LinkedIn\s*</a>', '', card1, flags=re.DOTALL)
    card1 = card1.replace('href="#"', 'href="https://itch.io/jam/ostimtechjam26"')

    # Card 2:
    card2_itch = 'https://itch.io/jam/ayazjam25'
    card2_li = 'https://www.linkedin.com/posts/goktugsaylam_tr-aylard%C4%B1r-%C3%BCzerinde-%C3%A7al%C4%B1%C5%9Ft%C4%B1%C4%9F%C4%B1m%C4%B1z-ayaz-activity-7405935751911174144-DQ40?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFAWMLkBFlFubPLZhhIMeSbmLlPexuX82tk'
    
    card2 = card2.replace('href="#"', f'href="{card2_li}"', 1)
    card2 = card2.replace('href="#"', f'href="{card2_itch}"', 1)

    # Card 3:
    card3_itch = 'https://itch.io/jam/ostimtech-jam-2025'
    card3_li = 'https://www.linkedin.com/posts/goktugsaylam_uzun-s%C3%BCredir-%C3%BCzerinde-%C3%A7al%C4%B1%C5%9Ft%C4%B1%C4%9F%C4%B1m%C4%B1z-osti%CC%87mtech-activity-7328120182038487042-T5qf?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFAWMLkBFlFubPLZhhIMeSbmLlPexuX82tk'
    
    card3 = card3.replace('href="#"', f'href="{card3_li}"', 1)
    card3 = card3.replace('href="#"', f'href="{card3_itch}"', 1)

    new_content = content[:idx1] + card1 + card2 + card3 + content[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

update_html('index.html')
update_html('tr/index.html')
print("Links updated")
