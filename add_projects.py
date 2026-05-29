import os

def update_html(filepath, is_tr=False):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Navbar updates
    if is_tr:
        # TR nav
        nav_target = '<li><a href="#organizasyonlar">Organizasyonlar</a></li>'
        nav_repl = nav_target + '\n                    <li><a href="#projeler">Projeler</a></li>'
    else:
        # EN nav
        nav_target = '<li><a href="#organizations">Organizations</a></li>'
        nav_repl = nav_target + '\n                    <li><a href="#projects">Projects</a></li>'

    content = content.replace(nav_target, nav_repl)

    # Section updates
    # Find the end of organizations section
    org_end = content.find('</section>', content.find('id="organizations"' if not is_tr else 'id="organizasyonlar"')) + 10

    if is_tr:
        section_id = "projeler"
        section_title = "Kişisel Projeler"
        role_label = "Rol"
        date_label = "Tarih"
        btn_link = "Proje Linki"
    else:
        section_id = "projects"
        section_title = "Personal Projects"
        role_label = "Role"
        date_label = "Date"
        btn_link = "Project Link"

    projects_section = f'''

    <!-- Projects Section -->
    <section id="{section_id}" class="section">
        <div class="container">
            <h2>{section_title}</h2>
            <div class="carousel-wrapper">
                <button class="carousel-btn btn-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="carousel-track">
                
                <!-- Project 1 -->
                <div class="carousel-slide">
                    <article class="card" style="display: flex; flex-direction: column; height: 100%;">
                    <!-- 1. Büyük Fotoğraf Alanı -->
                    <div style="width: 100%; height: 260px; overflow: hidden; border-radius: 8px; margin-bottom: 1.5rem;">
                        <img src="https://via.placeholder.com/600x400" alt="Project 1" class="org-card-img" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    
                    <!-- 2. Ana İçerik Alanı -->
                    <div class="org-card-content" style="padding: 0 0.5rem; flex-grow: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                            <span class="tech-tag" style="color: var(--primary); font-size: 0.75rem;">{role_label}</span>
                            <span class="tech-tag" style="color: var(--text-muted); font-size: 0.75rem;">{date_label}</span>
                        </div>
                        <h3 style="margin: 0 0 0.25rem 0; color: var(--text-main); font-size: 1.4rem;">Project 1</h3>
                        <p style="margin: 0 0 1.5rem 0; color: var(--text-muted); font-size: 0.95rem;">Project description goes here.</p>
                    </div>

                    <!-- 3. Aksiyon Barı -->
                    <div style="display: flex; gap: 1.25rem; padding: 1rem 0.5rem 0 0.5rem; border-top: 1px solid rgba(255,255,255,0.08);">
                        <a href="#" target="_blank" class="tech-tag" style="color: var(--text-muted); text-decoration: none; font-size: 0.75rem; transition: color 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">
                            <i class="fa-solid fa-link"></i> {btn_link}
                        </a>
                    </div>
                </article>
                </div>

                <!-- Project 2 -->
                <div class="carousel-slide">
                    <article class="card" style="display: flex; flex-direction: column; height: 100%;">
                    <!-- 1. Büyük Fotoğraf Alanı -->
                    <div style="width: 100%; height: 260px; overflow: hidden; border-radius: 8px; margin-bottom: 1.5rem;">
                        <img src="https://via.placeholder.com/600x400" alt="Project 2" class="org-card-img" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    
                    <!-- 2. Ana İçerik Alanı -->
                    <div class="org-card-content" style="padding: 0 0.5rem; flex-grow: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                            <span class="tech-tag" style="color: var(--primary); font-size: 0.75rem;">{role_label}</span>
                            <span class="tech-tag" style="color: var(--text-muted); font-size: 0.75rem;">{date_label}</span>
                        </div>
                        <h3 style="margin: 0 0 0.25rem 0; color: var(--text-main); font-size: 1.4rem;">Project 2</h3>
                        <p style="margin: 0 0 1.5rem 0; color: var(--text-muted); font-size: 0.95rem;">Project description goes here.</p>
                    </div>

                    <!-- 3. Aksiyon Barı -->
                    <div style="display: flex; gap: 1.25rem; padding: 1rem 0.5rem 0 0.5rem; border-top: 1px solid rgba(255,255,255,0.08);">
                        <a href="#" target="_blank" class="tech-tag" style="color: var(--text-muted); text-decoration: none; font-size: 0.75rem; transition: color 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">
                            <i class="fa-solid fa-link"></i> {btn_link}
                        </a>
                    </div>
                </article>
                </div>

                </div>
                <button class="carousel-btn btn-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    </section>'''

    new_content = content[:org_end] + projects_section + content[org_end:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

update_html('index.html', is_tr=False)
update_html('tr/index.html', is_tr=True)
print("Projects section added.")
