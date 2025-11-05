document.addEventListener('DOMContentLoaded', () => {

    // This function will hold the gallery and lightbox logic.
    // It's defined here but will be called ONLY after the project content is loaded.
    const initializeGallery = () => {
        const gallery = document.querySelector('.project-gallery');
        const track = document.querySelector('.gallery-track');
        
        if (gallery && track && track.children.length > 0) {
            const slides = Array.from(track.children);
            const nextButton = gallery.querySelector('.next-btn');
            const prevButton = gallery.querySelector('.prev-btn');
            const slideCount = slides.length;
            let currentSlide = 0;

            const lightbox = document.getElementById('lightbox');
            const lightboxImage = lightbox.querySelector('.lightbox-image');
            const lightboxNextButton = lightbox.querySelector('.next-btn');
            const lightboxPrevButton = lightbox.querySelector('.prev-btn');
            const closeButton = lightbox.querySelector('.lightbox-close');

            const moveToSlide = (targetSlide) => {
                if (targetSlide < 0 || targetSlide >= slideCount) return;
                track.style.transform = `translateX(-${targetSlide * 100}%)`;
                currentSlide = targetSlide;
                updateArrows();
                if (lightbox.classList.contains('is-visible')) {
                    updateLightboxImage();
                }
            };
            
            const next = () => moveToSlide(currentSlide + 1);
            const prev = () => moveToSlide(currentSlide - 1);

            const updateArrows = () => {
                const isHidden = slideCount <= 1;
                prevButton.classList.toggle('is-hidden', currentSlide === 0 || isHidden);
                nextButton.classList.toggle('is-hidden', currentSlide === slideCount - 1 || isHidden);
                lightboxPrevButton.classList.toggle('is-hidden', currentSlide === 0 || isHidden);
                lightboxNextButton.classList.toggle('is-hidden', currentSlide === slideCount - 1 || isHidden);
            };

            const updateLightboxImage = () => {
                const currentImageSrc = slides[currentSlide].querySelector('img').src;
                lightboxImage.src = currentImageSrc;
            };

            const openLightbox = () => {
                updateLightboxImage();
                lightbox.classList.add('is-visible');
                document.body.style.overflow = 'hidden';
            };

            const closeLightbox = () => {
                lightbox.classList.remove('is-visible');
                document.body.style.overflow = '';
            };

            nextButton.addEventListener('click', next);
            prevButton.addEventListener('click', prev);
            track.addEventListener('click', openLightbox);

            lightboxNextButton.addEventListener('click', next);
            lightboxPrevButton.addEventListener('click', prev);
            closeButton.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('is-visible')) return;
                if (e.key === 'ArrowRight') next();
                if (e.key === 'ArrowLeft') prev();
                if (e.key === 'Escape') closeLightbox();
            });

            let touchStartX = 0, touchEndX = 0;
            const swipeThreshold = 50;
            const handleSwipe = () => {
                if (touchEndX < touchStartX - swipeThreshold) next();
                if (touchEndX > touchStartX + swipeThreshold) prev();
            };
            const onTouchStart = (e) => { touchStartX = e.changedTouches[0].screenX; };
            const onTouchEnd = (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); };
            
            gallery.addEventListener('touchstart', onTouchStart, { passive: true });
            gallery.addEventListener('touchend', onTouchEnd);
            lightbox.addEventListener('touchstart', onTouchStart, { passive: true });
            lightbox.addEventListener('touchend', onTouchEnd);

            updateArrows();
        }
    };

    // This is the main function that fetches and injects the project data.
    const loadProjectData = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        const textElement = document.getElementById('project-text');
        const galleryTrack = document.getElementById('gallery-track');

        if (!projectId) {
            textElement.innerHTML = "<p>Error: No project ID specified.</p>";
            return;
        }

        // Fetch the project data (ensure you have created projects.json)
        // The path is relative to the HTML file (project.html)
        const response = await fetch('../js/projects.json'); 
        if (!response.ok) {
             textElement.innerHTML = "<p>Error: Could not load project data.</p>";
             return;
        }
        const allProjects = await response.json();
        const project = allProjects.find(p => p.id === projectId);

        if (!project) {
            textElement.innerHTML = `<p>Error: Project with ID "${projectId}" not found.</p>`;
            return;
        }

        // --- INJECT CONTENT INTO THE TEMPLATE ---
        document.title = `Tizian Rein - ${project.title}`;
        textElement.innerHTML = `<p>${project.description.replace(/\n/g, '<br>')}</p>`;
        
        // Build the gallery HTML
        galleryTrack.innerHTML = project.images
            .map(imgSrc => `<div class="gallery-slide"><img src="../${imgSrc}" alt="${project.title} view"></div>`)
            .join('');

        // --- CRITICAL STEP: Initialize the gallery now that the images are in the DOM ---
        initializeGallery();
    };

    // Run the loader function
    loadProjectData();
});