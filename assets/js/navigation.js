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
                    header.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
                    header.style.borderColor = 'var(--border-color)';
                } else {
                    header.style.backgroundColor = 'var(--primary)';
                    header.style.borderColor = 'transparent';
                }
            }
        };
        
        window.addEventListener('scroll', updateHeroStyles);
        updateHeroStyles(); // Initialize on load
    }
});
