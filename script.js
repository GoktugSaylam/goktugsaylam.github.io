const lerp = (a, b, t) => a + (b - a) * t;

const container = document.querySelector('.text-container');
let spans = document.querySelectorAll('.text-container span');

const cursor = { x: -9999, y: -9999 };
const eased = { x: -9999, y: -9999 };
let hasMoved = false;

const updateCursor = (e) => {
    if (!hasMoved) {
        eased.x = e.clientX;
        eased.y = e.clientY;
        hasMoved = true;
    }
    cursor.x = e.clientX;
    cursor.y = e.clientY;
};

window.addEventListener('pointermove', updateCursor);
window.addEventListener('pointerdown', updateCursor);
window.addEventListener('pointerleave', () => {
    cursor.x = -9999;
    cursor.y = -9999;
});

function animate() {
    // the lag is the weight you feel
    eased.x += (cursor.x - eased.x) / 12;
    eased.y += (cursor.y - eased.y) / 12;

    // Yakından algılama yarıçapı: Uzaktan tetiklenmez, harflere yaklaşınca devreye girer
    const maxDist = 130;

    spans.forEach(span => {
        const rect = span.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const distX = eased.x - charCenterX;
        const distY = (eased.y - charCenterY) * 1.3; // dikey mesafeyi de hesaba katar
        const distance = Math.hypot(distX, distY);

        // 1 under the cursor, 0 at maxDist
        const pressure = Math.max(0, 1 - distance / maxDist);

        span.style.fontVariationSettings =
            `'wght' ${lerp(300, 800, pressure)}`;
    });

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// --- @goktugsaylam Text Scramble (Harf Karıştırma ve Renk Geçişi) ---
const handleEl = document.getElementById('handle');
let targetText = '@goktugsaylam';
const symbols = '!@#$%^&*()_+-=<>?/\\';

// 5 Belirlenmiş Renk Havuzu
let colors = [
    '#E63D19', // Canli Kirmizi
    '#F2AD21', // Sicak Altin Sari
    '#A4C723', // Acik Fistik Yesili
    '#1D9E99', // Petrol / Camgobegi
    '#7C26CB'  // Mor
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

let letterSpans = [];
let letterTweens = [];

function setupHandle(text) {
    if (!handleEl) return;
    targetText = text || '@goktugsaylam';
    handleEl.innerHTML = '';
    letterTweens.forEach(t => t && t.kill && t.kill());

    letterSpans = targetText.split('').map((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.dataset.index = index;
        span.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            scrambleHandle(index);
        });
        handleEl.appendChild(span);
        return span;
    });

    letterTweens = new Array(letterSpans.length).fill(null);
    scrambleHandle(0);
}

function scrambleHandle(startIndex = 0) {
    if (!letterSpans.length) return;
    letterSpans.forEach((span, i) => {
        if (letterTweens[i]) {
            letterTweens[i].kill();
            letterTweens[i] = null;
        }

        const originalChar = targetText[i];
        const distance = Math.abs(i - startIndex);
        const delay = distance * 0.045;
        let lastSwap = 0;
        const proxy = { p: 0 };

        span.style.transition = 'none';

        letterTweens[i] = gsap.to(proxy, {
            p: 1,
            duration: 0.55 + Math.random() * 0.15,
            delay: delay,
            ease: 'power2.out',
            onStart() {
                span.textContent = getRandomSymbol();
                span.style.color = getRandomColor();
            },
            onUpdate() {
                const now = performance.now();
                if (now - lastSwap >= 50) {
                    lastSwap = now;
                    span.textContent = getRandomSymbol();
                    span.style.color = getRandomColor();
                }
            },
            onComplete() {
                span.textContent = originalChar;
                span.style.transition = 'color 0.35s ease';
                span.style.color = '';
                letterTweens[i] = null;
            }
        });
    });
}

const subBar = document.querySelector('.sub-bar');
if (subBar) {
    subBar.addEventListener('mouseenter', (e) => {
        if (!e.target.closest('#handle span')) {
            scrambleHandle(0);
        }
    });
}

setupHandle(handleEl ? handleEl.textContent.trim() || '@goktugsaylam' : '@goktugsaylam');

// --- Binder / Folder Tab Switching ---
const binderTabs = document.querySelectorAll('.binder-tab');
const sheetSpreads = document.querySelectorAll('.sheet-spread');

binderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;

        binderTabs.forEach(t => {
            const isActive = t === tab;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        sheetSpreads.forEach(sheet => {
            const isTarget = sheet.id === `sheet-${targetId}`;
            sheet.classList.toggle('active', isTarget);
        });
    });
});

// --- Dynamic Sub-Tabs & Layered Sheet Stacks ---
function initSubTabsForSpread(spread) {
    if (!spread) return;
    const subTabsNav = spread.querySelector('.sub-tabs');
    const subTabs = spread.querySelectorAll('.sub-tab');
    const sheets = spread.querySelectorAll('.layered-sheet');
    const prevBtn = spread.querySelector('.prev-tab');
    const nextBtn = spread.querySelector('.next-tab');

    function activateSheet(targetId) {
        let activeTab = null;
        subTabs.forEach(tab => {
            const isMatch = tab.dataset.sub === targetId;
            tab.classList.toggle('active', isMatch);
            if (isMatch) activeTab = tab;
        });

        if (activeTab && subTabsNav) {
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        const activeSheet = spread.querySelector(`#subpane-${targetId}`);
        if (activeSheet) {
            sheets.forEach(sheet => {
                sheet.classList.toggle('active', sheet === activeSheet);
            });
        }

        const pennantGroups = spread.querySelectorAll('.pennant-subgroup');
        pennantGroups.forEach(group => {
            group.classList.toggle('active', group.id === `pennants-${targetId}`);
        });
    }

    subTabs.forEach(tab => {
        tab.onclick = () => activateSheet(tab.dataset.sub);
    });

    sheets.forEach(sheet => {
        sheet.onclick = () => {
            if (!sheet.classList.contains('active')) {
                const subId = sheet.id.replace('subpane-', '');
                activateSheet(subId);
            }
        };
    });

    if (prevBtn && nextBtn && subTabs.length > 0) {
        prevBtn.onclick = () => {
            const currentIdx = Array.from(subTabs).findIndex(t => t.classList.contains('active'));
            const prevIdx = (currentIdx - 1 + subTabs.length) % subTabs.length;
            if (subTabs[prevIdx]) activateSheet(subTabs[prevIdx].dataset.sub);
        };

        nextBtn.onclick = () => {
            const currentIdx = Array.from(subTabs).findIndex(t => t.classList.contains('active'));
            const nextIdx = (currentIdx + 1) % subTabs.length;
            if (subTabs[nextIdx]) activateSheet(subTabs[nextIdx].dataset.sub);
        };
    }

    if (subTabsNav && !subTabsNav.dataset.wheelBound) {
        subTabsNav.dataset.wheelBound = 'true';
        subTabsNav.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                subTabsNav.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
}

// Initial binding for existing HTML
document.querySelectorAll('.sheet-spread').forEach(initSubTabsForSpread);

// --- SVG Icons Platform Lookup ---
const SVG_ICONS = {
    itch: `<svg viewBox="0 0 24 24"><path d="M4.5 4A2.5 2.5 0 0 0 2 6.5v1.2a4.4 4.4 0 0 0 1.4 3.2L4 18.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5l.6-7.6a4.4 4.4 0 0 0 1.4-3.2V6.5A2.5 2.5 0 0 0 19.5 4h-15zm3.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm8 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM9 16h6v1.5H9V16z"/></svg>`,
    github: `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    email: `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    bento: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    socials: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    x: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    discord: `<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    bluesky: `<svg viewBox="0 0 24 24"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.01 1.5 1.99 1.5 3.5c0 1.233.568 5.765.94 7.024.965 3.275 3.905 4.316 6.84 3.73-3.67 1.34-6.425 4.306-3.864 8.016 3.125 4.529 6.13-1.393 6.584-2.47.454 1.077 3.459 7 6.584 2.47 2.56-3.71-.194-6.676-3.864-8.016 2.935.586 5.875-.455 6.84-3.73.372-1.259.94-5.791.94-7.024 0-1.51-1.066-2.49-3.702-.695C16.046 4.747 13.087 8.686 12 10.8z"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
    spotify: `<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
    steam: `<svg viewBox="0 0 24 24"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12S18.605 0 11.979 0z"/></svg>`,
    website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normalizeLinks(rawLinks) {
    if (!rawLinks) return [];
    if (Array.isArray(rawLinks)) {
        return rawLinks
            .filter(item => item && item.url && item.url.trim() !== '')
            .map(item => ({
                platform: (item.platform || 'website').toLowerCase().trim(),
                url: item.url.trim(),
                title: item.title || item.label || capitalize(item.platform || 'Link')
            }));
    }
    if (typeof rawLinks === 'object') {
        const out = [];
        for (const [key, val] of Object.entries(rawLinks)) {
            if (val && typeof val === 'string' && val.trim() !== '') {
                out.push({
                    platform: key.toLowerCase().trim(),
                    url: val.trim(),
                    title: capitalize(key)
                });
            }
        }
        return out;
    }
    return [];
}

function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderPennant(link) {
    const platform = (link.platform || 'website').toLowerCase();
    const icon = SVG_ICONS[platform] || SVG_ICONS.website;
    const title = escapeHtml(link.title || capitalize(platform));
    let href = link.url;
    if (platform === 'email' && !href.startsWith('mailto:')) {
        href = `mailto:${href}`;
    }
    const extraClass = platform === 'bento' ? ' pennant-socials' : '';
    return `
        <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="binder-pennant pennant-${escapeHtml(platform)}${extraClass}" title="${title}">
            ${icon}
        </a>
    `.trim();
}

// --- CMS Content Rendering Engines ---
function renderListSection(spreadId, data, prefix) {
    const spread = document.getElementById(spreadId);
    if (!spread || !data) return;

    // Update Left Page Header
    if (data.header) {
        const codeEl = spread.querySelector('.dossier-code');
        const nameEl = spread.querySelector('.dossier-name');
        const subEl = spread.querySelector('.dossier-subtitle');
        const roleEl = spread.querySelector('.dossier-role');

        if (codeEl) {
            if (data.header.code && data.header.code.trim() !== '') {
                codeEl.textContent = data.header.code;
                codeEl.style.display = '';
            } else {
                codeEl.textContent = '';
                codeEl.style.display = 'none';
            }
        }
        if (nameEl && data.header.title) nameEl.textContent = data.header.title;
        if (subEl) {
            if (data.header.subtitle && data.header.subtitle.trim() !== '') {
                subEl.textContent = data.header.subtitle;
                subEl.style.display = '';
            } else {
                subEl.textContent = '';
                subEl.style.display = 'none';
            }
        }
        if (roleEl) {
            if (data.header.role && data.header.role !== '---' && data.header.role.trim() !== '') {
                roleEl.textContent = data.header.role;
                roleEl.style.display = '';
            } else {
                roleEl.textContent = '';
                roleEl.style.display = 'none';
            }
        }

        // Also update binder tab title if matching
        const tabKey = spreadId.replace('sheet-', '');
        const binderTab = document.querySelector(`.binder-tab[data-tab="${tabKey}"]`);
        if (binderTab) {
            if (data.header.code) binderTab.setAttribute('title', data.header.code);
            const tabCodeEl = binderTab.querySelector('.tab-code');
            if (tabCodeEl && data.header.code) {
                const match = data.header.code.match(/^([0-9]{2})/);
                if (match) tabCodeEl.textContent = match[1];
            }
        }
    }

    if (!Array.isArray(data.items) || data.items.length === 0) return;

    const subTabsNav = spread.querySelector('.sub-tabs');
    const stack = spread.querySelector('.layered-stack');
    const pennantsAside = spread.querySelector('.binder-bottom-pennants');

    if (!subTabsNav || !stack) return;

    // 1. Build Sub-Tabs
    subTabsNav.innerHTML = data.items.map((item, idx) => `
        <button class="sub-tab ${idx === 0 ? 'active' : ''}" data-sub="${prefix}-${idx + 1}">${escapeHtml(item.title || '')}</button>
    `).join('');

    // 2. Build Layered Stack Sheets
    stack.innerHTML = data.items.map((item, idx) => {
        let role = (item.role || '').trim();
        let date = (item.date || '').trim();

        // Auto-split if date is missing but role contains '•'
        if (!date && role.includes('•')) {
            const parts = role.split('•');
            role = parts[0].trim();
            date = parts[1].trim();
        }

        let metaHtml = '';
        if (date && role) {
            metaHtml = `<span class="sheet-role">${escapeHtml(role)}</span><span class="sheet-date">${escapeHtml(date)}</span>`;
        } else if (item.tag && role) {
            metaHtml = `<span class="sheet-role">${escapeHtml(role)}</span><span class="sheet-tag">${escapeHtml(item.tag)}</span>`;
        } else if (role) {
            metaHtml = `<span class="sheet-role">${escapeHtml(role)}</span>`;
        } else if (date) {
            metaHtml = `<span class="sheet-date">${escapeHtml(date)}</span>`;
        } else if (item.tag) {
            metaHtml = `<span class="sheet-tag">${escapeHtml(item.tag)}</span>`;
        }

        const subHtml = item.sub ? `<p class="sheet-sub">${escapeHtml(item.sub)}</p>` : '';
        const descHtml = item.description ? `<p class="sheet-text">${escapeHtml(item.description)}</p>` : '';

        return `
            <div class="layered-sheet ${idx === 0 ? 'active' : ''}" id="subpane-${prefix}-${idx + 1}">
                ${metaHtml ? `<div class="sheet-meta-row">${metaHtml}</div>` : ''}
                <h3 class="sheet-title">${escapeHtml(item.title || '')}</h3>
                ${subHtml}
                ${descHtml}
            </div>
        `;
    }).join('');

    // 3. Build Pennant Subgroups
    if (pennantsAside) {
        pennantsAside.innerHTML = data.items.map((item, idx) => {
            const links = normalizeLinks(item.links);
            const pennantsHtml = links.map(renderPennant).join('');
            return `
                <div class="pennant-subgroup ${idx === 0 ? 'active' : ''}" id="pennants-${prefix}-${idx + 1}">
                    ${pennantsHtml}
                </div>
            `;
        }).join('');
    }

    // Rebind listeners for the freshly rendered items
    initSubTabsForSpread(spread);
}

function renderHero(greeting, name) {
    const textContainer = document.querySelector('.text-container');
    if (!textContainer) return;

    greeting = (greeting !== undefined && greeting !== null) ? greeting : "Hello, I'm";
    name = (name !== undefined && name !== null) ? name : "Göktuğ Saylam";

    let html = '';
    for (let i = 0; i < greeting.length; i++) {
        const char = greeting[i];
        if (char === ' ') {
            html += '<span>&nbsp;</span>';
        } else {
            html += `<span class="white-text">${escapeHtml(char)}</span>`;
        }
    }
    if (greeting && name) {
        html += '<span>&nbsp;</span>';
    }
    for (let i = 0; i < name.length; i++) {
        const char = name[i];
        if (char === ' ') {
            html += '<span>&nbsp;</span>';
        } else {
            html += `<span class="accent-text">${escapeHtml(char)}</span>`;
        }
    }
    textContainer.innerHTML = html;
    spans = document.querySelectorAll('.text-container span');
    try {
        localStorage.setItem('site_hero_greeting', greeting);
        localStorage.setItem('site_hero_name', name);
    } catch(e){}
}

function renderAbout(data) {
    if (!data) return;
    if (data.heroGreeting !== undefined || data.heroName !== undefined) {
        renderHero(data.heroGreeting, data.heroName);
    }
    const sheetAbout = document.getElementById('sheet-about');
    if (sheetAbout) {
        const codeEl = sheetAbout.querySelector('.dossier-code');
        const nameEl = sheetAbout.querySelector('.dossier-name');
        const subEl = sheetAbout.querySelector('.dossier-subtitle');
        const roleEl = sheetAbout.querySelector('.dossier-role');
        const sectionTitleEl = sheetAbout.querySelector('.section-title');
        const bioEl = sheetAbout.querySelector('.bio-text');

        if (codeEl) {
            if (data.code && data.code.trim() !== '') {
                codeEl.textContent = data.code;
                codeEl.style.display = '';
            } else {
                codeEl.textContent = '';
                codeEl.style.display = 'none';
            }
        }
        if (nameEl && data.name) nameEl.textContent = data.name;

        if (subEl) {
            if (data.subtitle && data.subtitle.trim() !== '') {
                subEl.textContent = data.subtitle;
                subEl.style.display = '';
            } else {
                subEl.textContent = '';
                subEl.style.display = 'none';
            }
        }

        if (roleEl) {
            if (data.role && data.role !== '---' && data.role.trim() !== '') {
                roleEl.textContent = data.role;
                roleEl.style.display = '';
            } else {
                roleEl.textContent = '';
                roleEl.style.display = 'none';
            }
        }

        if (sectionTitleEl) {
            if (data.sectionTitle && data.sectionTitle.trim() !== '') {
                sectionTitleEl.textContent = data.sectionTitle;
                sectionTitleEl.style.display = '';
            } else {
                sectionTitleEl.textContent = '';
                sectionTitleEl.style.display = 'none';
            }
        }

        if (bioEl) {
            if (data.bio && data.bio.trim() !== '') {
                bioEl.textContent = data.bio;
                bioEl.style.display = '';
            } else {
                bioEl.textContent = '';
                bioEl.style.display = 'none';
            }
        }

        // Update binder tab 00 title
        const binderTab = document.querySelector('.binder-tab[data-tab="about"]');
        if (binderTab && data.code) binderTab.setAttribute('title', data.code);
    }

    if (data.handleSub) {
        const subLabel = document.querySelector('.sub-label');
        if (subLabel) subLabel.textContent = data.handleSub;
    }

    if (data.handle && data.handle !== targetText) {
        setupHandle(data.handle);
    }
}

function renderContact(data) {
    if (!data) return;
    const sheetContact = document.getElementById('sheet-contact');
    if (!sheetContact) return;

    // Left Page Header
    if (data.header) {
        const codeEl = sheetContact.querySelector('.dossier-code');
        const nameEl = sheetContact.querySelector('.dossier-name');
        const subEl = sheetContact.querySelector('.dossier-subtitle');
        const roleEl = sheetContact.querySelector('.dossier-role');

        if (codeEl) {
            if (data.header.code && data.header.code.trim() !== '') {
                codeEl.textContent = data.header.code;
                codeEl.style.display = '';
            } else {
                codeEl.textContent = '';
                codeEl.style.display = 'none';
            }
        }
        if (nameEl && data.header.title) nameEl.textContent = data.header.title;

        if (subEl) {
            if (data.header.subtitle && data.header.subtitle.trim() !== '') {
                subEl.textContent = data.header.subtitle;
                subEl.style.display = '';
            } else {
                subEl.textContent = '';
                subEl.style.display = 'none';
            }
        }

        if (roleEl) {
            if (data.header.role && data.header.role !== '---' && data.header.role.trim() !== '') {
                roleEl.textContent = data.header.role;
                roleEl.style.display = '';
            } else {
                roleEl.textContent = '';
                roleEl.style.display = 'none';
            }
        }

        const binderTab = document.querySelector('.binder-tab[data-tab="contact"]');
        if (binderTab && data.header.code) binderTab.setAttribute('title', data.header.code);
    }

    // Right Page
    const sectionTitleEl = sheetContact.querySelector('.section-title');
    const descEl = sheetContact.querySelector('.contact-desc');
    const mailEl = sheetContact.querySelector('.contact-mail');

    if (sectionTitleEl) {
        if (data.sectionTitle && data.sectionTitle.trim() !== '') {
            sectionTitleEl.textContent = data.sectionTitle;
            sectionTitleEl.style.display = '';
        } else {
            sectionTitleEl.textContent = '';
            sectionTitleEl.style.display = 'none';
        }
    }

    if (descEl) {
        if (data.description && data.description.trim() !== '') {
            descEl.textContent = data.description;
            descEl.style.display = '';
        } else {
            descEl.textContent = '';
            descEl.style.display = 'none';
        }
    }

    if (mailEl) {
        if (data.email && data.email.trim() !== '') {
            mailEl.textContent = data.email;
            mailEl.href = `mailto:${data.email.trim()}`;
            mailEl.style.display = '';
        } else {
            mailEl.textContent = '';
            mailEl.style.display = 'none';
        }
    }

    // Bottom Social Pennants
    const pennantsAside = sheetContact.querySelector('.binder-bottom-pennants');
    if (pennantsAside) {
        const socialsList = normalizeLinks(data.socials || data.links);
        let pennantsHtml = '';

        if (data.email) {
            pennantsHtml += renderPennant({ platform: 'email', url: data.email, title: 'Email' });
        }

        pennantsHtml += socialsList.map(renderPennant).join('');

        pennantsAside.innerHTML = `
            <div class="pennant-subgroup active">
                ${pennantsHtml}
            </div>
        `;
    }
}

// --- Dynamic Theme & Colors Engine ---
function applyTheme(theme) {
    if (!theme) return;
    try {
        localStorage.setItem('site_theme', JSON.stringify(theme));
    } catch(e){}
    const root = document.documentElement;
    if (theme.base) {
        if (theme.base.bg) root.style.setProperty('--color-bg', theme.base.bg);
        if (theme.base.gridEnabled !== undefined) {
            root.style.setProperty('--grid-display', theme.base.gridEnabled ? 'block' : 'none');
        }
        if (theme.base.gridEnabled !== undefined) {

            root.style.setProperty('--grid-display', theme.base.gridEnabled ? 'block' : 'none');

        }

        if (theme.base.gridLine) root.style.setProperty('--color-grid-line', theme.base.gridLine);
        if (theme.base.folder) root.style.setProperty('--color-folder', theme.base.folder);
        if (theme.base.textMain) root.style.setProperty('--color-text-main', theme.base.textMain);
        if (theme.base.accent) root.style.setProperty('--color-accent', theme.base.accent);
        if (theme.base.role) root.style.setProperty('--color-role', theme.base.role);
        if (theme.base.heroAccent) root.style.setProperty('--color-hero-accent', theme.base.heroAccent);
    }
    if (theme.tabs) {
        if (theme.tabs.tab00) root.style.setProperty('--color-tab-00', theme.tabs.tab00);
        if (theme.tabs.tab01) root.style.setProperty('--color-tab-01', theme.tabs.tab01);
        if (theme.tabs.tab02) root.style.setProperty('--color-tab-02', theme.tabs.tab02);
        if (theme.tabs.tab03) root.style.setProperty('--color-tab-03', theme.tabs.tab03);
        if (theme.tabs.tab04) root.style.setProperty('--color-tab-04', theme.tabs.tab04);
    }
    if (theme.scramble) {
        const s = theme.scramble;
        const list = [s.color1, s.color2, s.color3, s.color4, s.color5].filter(c => c && c.trim() !== '');
        if (list.length > 0) colors = list;
    } else if (theme.tabs) {
        colors = [
            theme.base?.heroAccent || theme.tabs?.tab00 || '#E63D19',
            theme.tabs?.tab01 || theme.base?.accent || '#F2AD21',
            theme.tabs?.tab02 || theme.base?.role || '#A4C723',
            theme.tabs?.tab03 || '#1D9E99',
            theme.tabs?.tab04 || '#7C26CB'
        ];
    }
}

// --- Sync Dynamic Content from Decap / Sveltia CMS JSONs ---
async function syncDynamicContent() {
    const timestamp = Date.now();

    // Theme & Palette
    try {
        const res = await fetch(`content/theme.json?t=${timestamp}`);
        if (res.ok) applyTheme(await res.json());
    } catch (err) {
        console.warn('Could not load theme.json', err);
    }

    // 00: About
    try {
        const res = await fetch(`content/about.json?t=${timestamp}`);
        if (res.ok) renderAbout(await res.json());
    } catch (err) {
        console.warn('Could not load about.json', err);
    }

    // 01: Organizations
    try {
        const res = await fetch(`content/organizations.json?t=${timestamp}`);
        if (res.ok) renderListSection('sheet-organizations', await res.json(), 'org');
    } catch (err) {
        console.warn('Could not load organizations.json', err);
    }

    // 02: Projects
    try {
        const res = await fetch(`content/projects.json?t=${timestamp}`);
        if (res.ok) renderListSection('sheet-projects', await res.json(), 'proj');
    } catch (err) {
        console.warn('Could not load projects.json', err);
    }

    // 03: Awards
    try {
        const res = await fetch(`content/awards.json?t=${timestamp}`);
        if (res.ok) renderListSection('sheet-awards', await res.json(), 'award');
    } catch (err) {
        console.warn('Could not load awards.json', err);
    }

    // 04: Contact
    try {
        const res = await fetch(`content/contact.json?t=${timestamp}`);
        if (res.ok) renderContact(await res.json());
    } catch (err) {
        console.warn('Could not load contact.json', err);
    }
}

// Execute sync
syncDynamicContent();
