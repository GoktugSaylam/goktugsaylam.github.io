import os
import re

def insert_linkedin(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    idx1 = content.find("<!-- OSTİMTECH Jam 2026 -->")
    idx2 = content.find("<!-- AYAZJAM'25 -->")
    
    if idx1 == -1 or idx2 == -1: return
    
    card1 = content[idx1:idx2]
    
    # We want to insert the LinkedIn link just before the Itch.io link in card 1
    # Find the Itch link
    itch_link_start = card1.find('<a href="https://itch.io/jam/ostimtechjam26"')
    
    if itch_link_start != -1:
        linkedin_link = '''<a href="#" target="_blank" class="tech-tag" style="color: var(--text-muted); text-decoration: none; font-size: 0.75rem; transition: color 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">
                            <i class="fa-brands fa-linkedin-in"></i> LinkedIn
                        </a>
                        '''
        card1 = card1[:itch_link_start] + linkedin_link + card1[itch_link_start:]
        
        new_content = content[:idx1] + card1 + content[idx2:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Inserted LinkedIn to", filepath)

insert_linkedin('index.html')
insert_linkedin('tr/index.html')
