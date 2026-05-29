import os

filepath = 'assets/css/style.css'
if not os.path.exists(filepath):
    print("File not found")
else:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to add padding-top: 1rem; and margin-top: -1rem; to .carousel-track
    old_track = '''.carousel-track {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox için gizle */
    padding-bottom: 1rem;
}'''
    
    new_track = '''.carousel-track {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox için gizle */
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin-top: -1rem; /* Hover anında kartın üstten kesilmemesi için boşluk */
}'''
    
    if old_track in content:
        content = content.replace(old_track, new_track)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("CSS carousel-track updated.")
    else:
        print("Could not find the exact old_track string.")
