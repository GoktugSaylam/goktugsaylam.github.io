import os

def fix_html(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Move btn-next inside carousel-wrapper
    old_end = '''                </div>
            </div>
            <button class="carousel-btn btn-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
        </div>'''
        
    new_end = '''                </div>
                <button class="carousel-btn btn-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
            </div>'''
            
    content = content.replace(old_end, new_end)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_html('index.html')
fix_html('tr/index.html')
print("Fixed HTML.")
