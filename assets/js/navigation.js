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

    // 4. Parallax fade-out and color transition effect for hero section
    const hero = document.querySelector('.hero');
    const heroContainer = document.querySelector('.hero .container');
    if (hero && heroContainer) {
        const updateHeroStyles = () => {
            const scrollPos = window.scrollY;
            const fadePoint = window.innerHeight; // Fade over 100vh
            
            let scrollProgress = scrollPos / fadePoint;
            if (scrollProgress < 0) scrollProgress = 0;
            if (scrollProgress > 1) scrollProgress = 1;
            
            // Text fade out
            heroContainer.style.opacity = 1 - scrollProgress;
            
            // Background color transition from Purple (#766DD6 -> rgb(118, 109, 214)) 
            // to Dark Gray (#121212 -> rgb(18, 18, 18))
            const rBg = Math.round(118 + (18 - 118) * scrollProgress);
            const gBg = Math.round(109 + (18 - 109) * scrollProgress);
            const bBg = Math.round(214 + (18 - 214) * scrollProgress);
            
            // Header transition: Solid purple (alpha 1) to Gray (alpha 0.8)
            const headerAlpha = 1 - (0.2 * scrollProgress);
            const borderAlpha = scrollProgress;
            
            // Button transition: White (255, 255, 255) to Purple (118, 109, 214)
            const rBtn = Math.round(255 + (118 - 255) * scrollProgress);
            const gBtn = Math.round(255 + (109 - 255) * scrollProgress);
            const bBtn = Math.round(255 + (214 - 255) * scrollProgress);
            
            // Button Text transition: Purple (118, 109, 214) to White (255, 255, 255)
            const rText = Math.round(118 + (255 - 118) * scrollProgress);
            const gText = Math.round(109 + (255 - 109) * scrollProgress);
            const bText = Math.round(214 + (255 - 214) * scrollProgress);

            hero.style.backgroundColor = `rgb(${rBg}, ${gBg}, ${bBg})`;
            document.documentElement.style.setProperty('--dyn-header-bg', `rgba(${rBg}, ${gBg}, ${bBg}, ${headerAlpha})`);
            document.documentElement.style.setProperty('--dyn-border', `rgba(39, 39, 42, ${borderAlpha})`);
            document.documentElement.style.setProperty('--dyn-btn-bg', `rgb(${rBtn}, ${gBtn}, ${bBtn})`);
            document.documentElement.style.setProperty('--dyn-btn-text', `rgb(${rText}, ${gText}, ${bText})`);
        };
        
        window.addEventListener('scroll', updateHeroStyles);
        updateHeroStyles(); // Initialize on load
    }
});
