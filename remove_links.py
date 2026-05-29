import os

def remove_contact_links(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find the contact section
    start_contact = content.find('<!-- Contact Section -->')
    end_contact = content.find('</section>', start_contact)
    
    if start_contact == -1 or end_contact == -1:
        return
        
    contact_section = content[start_contact:end_contact]
    
    # We want to remove the div that contains the links
    # It starts with <div style="margin-top: 2rem; display: flex; gap: 1.5rem; flex-wrap: wrap;">
    # and ends with </div> right before the </section> (which is right before the </main> if any)
    
    div_start = contact_section.find('<div style="margin-top: 2rem;')
    if div_start != -1:
        div_end = contact_section.find('</div>', div_start) + 6
        
        # Remove the div
        new_contact_section = contact_section[:div_start] + contact_section[div_end:]
        
        # Clean up any trailing whitespace
        new_contact_section = new_contact_section.replace('\n            \n        </div>', '\n        </div>')
        
        # Replace in content
        content = content[:start_contact] + new_contact_section + content[end_contact:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Removed links from", filepath)

remove_contact_links('index.html')
remove_contact_links('tr/index.html')
