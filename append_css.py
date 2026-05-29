import os

with open('assets/css/style.css', 'a', encoding='utf-8') as f:
    f.write('''

/* Carousel Yapısı */
.carousel-wrapper {
    position: relative;
    width: 100%;
}
.carousel-track {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox için gizle */
    padding-bottom: 1rem;
}
.carousel-track::-webkit-scrollbar { 
    display: none; /* Chrome/Safari için gizle */
}
.carousel-slide {
    flex: 0 0 calc(50% - 1rem); /* Aynı anda tam 2 kart gösterir */
    scroll-snap-align: start;
    min-width: 0;
}
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

/* Mobil Ekranlarda Tekli Kart Görünümü */
@media (max-width: 768px) {
    .carousel-slide { flex: 0 0 100%; }
    .btn-prev { left: 0; }
    .btn-next { right: 0; }
}
''')

print("CSS appended.")
