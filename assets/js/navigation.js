const initNavigation = () => {
    // 1. Handle pending smooth scroll from cross-page navigation
    const pendingScroll = sessionStorage.getItem('pendingScroll');
    if (pendingScroll) {
        sessionStorage.removeItem('pendingScroll');
        const targetElement = document.querySelector(pendingScroll);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    } else if (window.location.hash) {
        // 2. Handle external direct links with hashes (e.g. from a shared URL)
        const hash = window.location.hash;
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        // Clean up the URL instantly
        window.history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    // 3. Intercept all clicks on links containing hashes
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || !href.includes('#')) return;

        // Skip interception if it's pointing to a completely different domain or if we are in an iframe
        if (anchor.hostname !== window.location.hostname || window.self !== window.top) return;

        // Special case: Scroll to top links
        if (href === '#' || href === '/#' || href === '/en/#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState('', document.title, window.location.pathname + window.location.search);
            return;
        }

        const [path, hash] = href.split('#');
        if (!hash) return; // If there is no hash part, just return
        const hashPart = '#' + hash;

        // Determine if target is on the current page
        const currentPath = window.location.pathname;
        const linkPath = path || currentPath; // If no path, it implies the current page

        // Normalize paths for comparison (treat / and /index.html as the same)
        const normalize = (p) => p.replace(/\/index\.html$/, '/');
        const isSamePage = normalize(linkPath) === normalize(currentPath);

        if (isSamePage) {
            e.preventDefault();
            const targetElement = document.querySelector(hashPart);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                history.pushState('', document.title, currentPath + window.location.search);
            }
        } else {
            // Different page: Save hash manually, navigate WITHOUT hash
            e.preventDefault();
            sessionStorage.setItem('pendingScroll', hashPart);
            window.location.href = path || '/';
        }
    });

    // 4. Parallax fade-out effect for hero section
    const hero = document.querySelector('.hero');
    const heroContainer = document.querySelector('.hero .container');
    const header = document.querySelector('header');
    
    if (hero && heroContainer) {
        const updateHeroStyles = () => {
            const scrollPos = window.scrollY;
            const fadePoint = window.innerHeight; // Fade over 100vh
            
            let scrollProgress = scrollPos / fadePoint;
            if (scrollProgress < 0) scrollProgress = 0;
            if (scrollProgress > 1) scrollProgress = 1;
            
            // Text fade out still happens smoothly
            heroContainer.style.opacity = 1 - scrollProgress;
        };
        
        window.addEventListener('scroll', updateHeroStyles);
        updateHeroStyles(); // Initialize on load
    }

    // 5. Fade-out effect for footer text
    const footerContainer = document.querySelector('footer .container');
    if (footerContainer) {
        const updateFooterStyles = () => {
            // Document height can change, so calculate inside
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            
            // Avoid issues on very short pages
            if (maxScroll <= 0) {
                footerContainer.style.opacity = 1;
                return;
            }

            const fadeRange = 200; // Pixels from bottom to start fading
            let distanceToBottom = maxScroll - currentScroll;
            
            // Allow a tiny margin for fractional scrolling issues
            if (distanceToBottom < 2) distanceToBottom = 0;

            let opacity = 1 - (distanceToBottom / fadeRange);
            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;

            footerContainer.style.opacity = opacity;
        };

        window.addEventListener('scroll', updateFooterStyles);
        window.addEventListener('resize', updateFooterStyles);
        updateFooterStyles();
    }

    // 6. Theme Toggle Logic (Light / Dark)
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Initialize theme
    initTheme();

    // Attach click listeners to all theme toggles
    document.addEventListener('click', (e) => {
        if (e.target.closest('.theme-toggle')) {
            toggleTheme();
        }
    });

    // 7. Mobile Hamburger Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        const toggleMenu = () => {
            const isActive = navLinks.classList.contains('active');
            if (isActive) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            } else {
                navLinks.classList.add('active');
                menuToggle.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
            }
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking on any nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 8. Handle language switch scroll position retention
    const langScrollPos = sessionStorage.getItem('langScrollPos');
    if (langScrollPos) {
        sessionStorage.removeItem('langScrollPos');
        requestAnimationFrame(() => {
            window.scrollTo({ top: parseInt(langScrollPos), behavior: 'instant' });
            document.documentElement.classList.replace('hide-for-scroll', 'fade-in-scroll');
            setTimeout(() => {
                document.documentElement.classList.remove('fade-in-scroll');
            }, 150);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.lang-switch')) {
            sessionStorage.setItem('langScrollPos', window.scrollY);
        }
    });

    // Fetch last updated time from GitHub API with fallback
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const isEnglish = !window.location.pathname.includes('/tr/');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        
        const setDate = (date) => {
            const formattedDate = date.toLocaleDateString(isEnglish ? 'en-US' : 'tr-TR', options);
            const prefix = isEnglish ? 'Last Updated: ' : 'Son Güncelleme: ';
            lastUpdatedElement.textContent = prefix + formattedDate;
        };

        fetch('https://api.github.com/repos/GoktugSaylam/goktugsaylam.github.io/commits?per_page=1')
            .then(response => {
                if (!response.ok) throw new Error('API limit or network error');
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0 && data[0].commit) {
                    const commitDate = new Date(data[0].commit.committer.date);
                    setDate(commitDate);
                } else {
                    throw new Error('Invalid response structure');
                }
            })
            .catch(error => {
                console.warn('Error fetching last updated date from API, using document.lastModified fallback:', error);
                if (document.lastModified) {
                    const localDate = new Date(document.lastModified);
                    if (!isNaN(localDate.getTime())) {
                        setDate(localDate);
                    }
                }
            });
    }

    // Lightbox Logic
    const orgImages = document.querySelectorAll('.org-card-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        orgImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        lightboxClose?.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        });
    }

    // Carousel Logic
    const carouselTracks = document.querySelectorAll('.carousel-track');
    carouselTracks.forEach(track => {
        const wrapper = track.parentElement;
        const btnPrev = wrapper.querySelector('.btn-prev');
        const btnNext = wrapper.querySelector('.btn-next');

        if (btnPrev && btnNext) {
            const updateButtons = () => {
                if (track.scrollLeft <= 0) {
                    btnPrev.innerHTML = '<i class="fa-solid fa-minus" style="transform: rotate(90deg);"></i>';
                    btnPrev.style.cursor = 'default';
                } else {
                    btnPrev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
                    btnPrev.style.cursor = 'pointer';
                }

                if (Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth) {
                    btnNext.innerHTML = '<i class="fa-solid fa-minus" style="transform: rotate(90deg);"></i>';
                    btnNext.style.cursor = 'default';
                } else {
                    btnNext.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
                    btnNext.style.cursor = 'pointer';
                }
            };

            updateButtons();
            track.addEventListener('scroll', updateButtons);
            window.addEventListener('resize', updateButtons);
            // Re-check after images load
            window.addEventListener('load', updateButtons);

            btnPrev.addEventListener('click', () => {
                if (track.scrollLeft > 0) {
                    const slideWidth = track.querySelector('.carousel-slide').clientWidth + 32; // Include gap
                    track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
                }
            });

            btnNext.addEventListener('click', () => {
                if (Math.ceil(track.scrollLeft + track.clientWidth) < track.scrollWidth) {
                    const slideWidth = track.querySelector('.carousel-slide').clientWidth + 32; // Include gap
                    track.scrollBy({ left: slideWidth, behavior: 'smooth' });
                }
            });
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}
