import os

def update_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Wrap in carousel
    if '<div class="grid grid-2">' in content:
        content = content.replace('<div class="grid grid-2">', 
'''            <div class="carousel-wrapper">
                <button class="carousel-btn btn-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="carousel-track">''')
        
        # Replace the end of grid with end of track and next button
        # This requires finding where the grid ends.
        # Let's find the closing tag. We know it ends before `</div>` then `</section>`
        content = content.replace('                </article>\n\n            </div>', 
'''                </article>
                </div>
            </div>
            <button class="carousel-btn btn-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
        </div>''')

    # Wrap each article
    content = content.replace('<article class="card"', '<div class="carousel-slide">\n                    <article class="card"')
    content = content.replace('</article>', '</article>\n                    </div>')

    # Fix the double closing of carousel-slide if needed, or adjust
    
    # Remove Fiuby
    fiuby_link = '''                        <a href="#" target="_blank" class="tech-tag" style="color: var(--text-muted); text-decoration: none; font-size: 0.75rem; transition: color 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">
                            <i class="fa-solid fa-link"></i> Fiuby
                        </a>'''
    
    content = content.replace(fiuby_link, '')
    
    # Fix whitespace after Fiuby
    content = content.replace('\n                    </div>\n                </article>', '\n                    </div>\n                </article>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('index.html')
update_file('tr/index.html')
print("Updated HTML files.")
