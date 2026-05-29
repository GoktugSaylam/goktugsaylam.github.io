import os

filepath = 'assets/css/style.css'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_btn_css = '''
.carousel-btn {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg-dominant);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 1.2rem;
}
.carousel-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}
.btn-prev { left: -22px; }
.btn-next { right: -22px; }
'''

new_btn_css = '''
.carousel-btn {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    box-shadow: none;
    color: var(--text-muted);
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 2.5rem; /* İkonu büyüttük */
    padding: 0;
}
.carousel-btn:hover {
    color: var(--text-main);
    transform: translateY(-50%) scale(1.1); /* Sadece hafifçe büyür */
    border: none; /* Önceki hover'dan kalma border varsa ezmek için */
}
.btn-prev { left: -40px; }
.btn-next { right: -40px; }
'''

# The original has a slightly different format due to Python multiline strings possibly having leading newlines. 
# Let's use a regex or string replacement that is robust.
import re

content = re.sub(r'\.carousel-btn \{.*?(?=\/\* Mobil Ekranlarda Tekli Kart Görünümü \*\/)', new_btn_css + '\n', content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS updated.")
