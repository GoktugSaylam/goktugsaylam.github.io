import os

js_code = '''
    // Carousel Logic
    const carouselTracks = document.querySelectorAll('.carousel-track');
    carouselTracks.forEach(track => {
        const wrapper = track.parentElement;
        const btnPrev = wrapper.querySelector('.btn-prev');
        const btnNext = wrapper.querySelector('.btn-next');

        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                const slideWidth = track.querySelector('.carousel-slide').clientWidth + 32; // Include gap
                track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
            });

            btnNext.addEventListener('click', () => {
                const slideWidth = track.querySelector('.carousel-slide').clientWidth + 32; // Include gap
                track.scrollBy({ left: slideWidth, behavior: 'smooth' });
            });
        }
    });
'''

filepath = 'assets/js/navigation.js'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write(js_code)
print("Carousel JS added.")
