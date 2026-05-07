document.addEventListener('DOMContentLoaded', () => {
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

        // Skip interception if it's pointing to a completely different domain
        if (anchor.hostname !== window.location.hostname) return;

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
            
            // Header color transition
            if (header) {
                if (scrollPos > 10) {
                    header.style.backgroundColor = 'var(--bg-dominant)';
                    header.style.borderColor = 'var(--border-color)';
                    header.classList.remove('is-hero');
                } else {
                    header.style.backgroundColor = 'var(--primary)';
                    header.style.borderColor = 'transparent';
                    header.classList.add('is-hero');
                }
            }
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
});
