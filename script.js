const lerp = (a, b, t) => a + (b - a) * t;

const container = document.querySelector('.text-container');
const spans = document.querySelectorAll('.text-container span');

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
const targetText = '@goktugsaylam';
const symbols = '!@#$%^&*()_+-=<>?/\\';

// 5 Belirlenmiş Renk Havuzu
const colors = [
    '#DA9C1E', // Hardal Sarısı
    '#A4C723', // Açık Fıstık Yeşili
    '#1D9E99', // Petrol / Camgöbeği
    '#7C26CB', // Mor
    '#B43014'  // Kiremit Kırmızısı
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

// Harf span'lerini oluştur ve referanslarını sakla
handleEl.innerHTML = '';
const letterSpans = targetText.split('').map((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.dataset.index = index;
    handleEl.appendChild(span);
    return span;
});

let letterTweens = new Array(letterSpans.length).fill(null);

function scrambleHandle(startIndex = 0) {
    letterSpans.forEach((span, i) => {
        // Varsa bu harfin önceki çalışan animasyonunu durdur
        if (letterTweens[i]) {
            letterTweens[i].kill();
            letterTweens[i] = null;
        }

        const originalChar = targetText[i];
        // Üzerine gelinen harften uzaklığa göre dalga (ripple) gecikmesi
        const distance = Math.abs(i - startIndex);
        const delay = distance * 0.045;
        let lastSwap = 0;
        const proxy = { p: 0 };

        // Karışma esnasında renklerin anlık canlı zıplaması için transition'ı kapat
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
                // Çözülme (Resolve): Orijinal karaktere dön
                span.textContent = originalChar;
                // Renk tekrar orijinal durağan haline yumuşakça dönsün
                span.style.transition = 'color 0.35s ease';
                span.style.color = '';
                letterTweens[i] = null;
            }
        });
    });
}

// Her harfe mouse enter dinleyicisi: Hangi harfin üzerine gelinirse oradan başlar
letterSpans.forEach((span, index) => {
    span.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        scrambleHandle(index);
    });
});

// Bar alanına genel hover yapıldığında (örneğin kenardan girilirse)
const subBar = document.querySelector('.sub-bar');
if (subBar) {
    subBar.addEventListener('mouseenter', (e) => {
        if (!e.target.closest('#handle span')) {
            scrambleHandle(0);
        }
    });
}

// Sayfa yüklendiğinde bir kere baştan sona çalıştır
scrambleHandle(0);

// --- Binder / Folder Tab Switching ---
const binderTabs = document.querySelectorAll('.binder-tab');
const sheetSpreads = document.querySelectorAll('.sheet-spread');

binderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;

        // Update tabs
        binderTabs.forEach(t => {
            const isActive = t === tab;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update sheets
        sheetSpreads.forEach(sheet => {
            const isTarget = sheet.id === `sheet-${targetId}`;
            sheet.classList.toggle('active', isTarget);
        });
    });
});

// --- Sub-Tabs & Layered Sheet Stack Switching ---
document.querySelectorAll('.sheet-spread').forEach(spread => {
    const subTabsBar = spread.querySelector('.sub-tabs-bar');
    const subTabsNav = spread.querySelector('.sub-tabs');
    const subTabs = spread.querySelectorAll('.sub-tab');
    const sheets = spread.querySelectorAll('.layered-sheet');
    const prevBtn = spread.querySelector('.prev-tab');
    const nextBtn = spread.querySelector('.next-tab');

    function activateSheet(targetId) {
        let activeTab = null;
        // Update sub-tabs
        subTabs.forEach(tab => {
            const isMatch = tab.dataset.sub === targetId;
            tab.classList.toggle('active', isMatch);
            if (isMatch) activeTab = tab;
        });

        if (activeTab && subTabsNav) {
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // Activate matching sheet
        const activeSheet = spread.querySelector(`#subpane-${targetId}`);
        if (!activeSheet) return;

        sheets.forEach(sheet => {
            sheet.classList.toggle('active', sheet === activeSheet);
        });

        // Activate matching pennant subgroup if present
        const pennantGroups = spread.querySelectorAll('.pennant-subgroup');
        pennantGroups.forEach(group => {
            group.classList.toggle('active', group.id === `pennants-${targetId}`);
        });
    }

    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateSheet(tab.dataset.sub);
        });
    });

    sheets.forEach(sheet => {
        sheet.addEventListener('click', () => {
            if (!sheet.classList.contains('active')) {
                const subId = sheet.id.replace('subpane-', '');
                activateSheet(subId);
            }
        });
    });

    // Arrow navigation when tabs exceed width
    if (prevBtn && nextBtn && subTabs.length > 0) {
        prevBtn.addEventListener('click', () => {
            const currentIdx = Array.from(subTabs).findIndex(t => t.classList.contains('active'));
            const prevIdx = (currentIdx - 1 + subTabs.length) % subTabs.length;
            activateSheet(subTabs[prevIdx].dataset.sub);
        });

        nextBtn.addEventListener('click', () => {
            const currentIdx = Array.from(subTabs).findIndex(t => t.classList.contains('active'));
            const nextIdx = (currentIdx + 1) % subTabs.length;
            activateSheet(subTabs[nextIdx].dataset.sub);
        });
    }

    // Horizontal mousewheel scrolling on sub-tabs
    if (subTabsNav) {
        subTabsNav.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                subTabsNav.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
});

// --- Headless CMS (Decap CMS) Dinamik İçerik Senkronizasyonu ---
async function syncDynamicContent() {
    try {
        const aboutRes = await fetch('content/about.json');
        if (aboutRes.ok) {
            const about = await aboutRes.json();
            const sheetAbout = document.getElementById('sheet-about');
            if (sheetAbout) {
                if (about.name) sheetAbout.querySelector('.dossier-name').textContent = about.name;
                if (about.subtitle) sheetAbout.querySelector('.dossier-subtitle').textContent = about.subtitle;
                if (about.role) sheetAbout.querySelector('.dossier-role').textContent = about.role;
                if (about.sectionTitle) sheetAbout.querySelector('.section-title').textContent = about.sectionTitle;
                if (about.bio) sheetAbout.querySelector('.bio-text').textContent = about.bio;
            }
        }
    } catch (_) {}

    try {
        const contactRes = await fetch('content/contact.json');
        if (contactRes.ok) {
            const contact = await contactRes.json();
            const sheetContact = document.getElementById('sheet-contact');
            if (sheetContact) {
                if (contact.description) sheetContact.querySelector('.contact-desc').textContent = contact.description;
                if (contact.email) {
                    const mailLink = sheetContact.querySelector('.contact-mail');
                    if (mailLink) {
                        mailLink.textContent = contact.email;
                        mailLink.href = `mailto:${contact.email}`;
                    }
                }
            }
        }
    } catch (_) {}
}

syncDynamicContent();
