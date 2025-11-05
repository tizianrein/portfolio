document.addEventListener('DOMContentLoaded', () => {

    const initializeGallery = () => {
        const gallery = document.querySelector('.project-gallery');
        const track = document.querySelector('.gallery-track');
        
        if (gallery && track && track.children.length > 0) {
            const slides = Array.from(track.children);
            const nextButton = gallery.querySelector('.next-btn');
            const prevButton = gallery.querySelector('.prev-btn');
            // NEU: Referenz zu den Thumbnails
            const thumbnails = document.querySelectorAll('.thumbnail-item');
            const slideCount = slides.length;
            let currentSlide = 0;

            const lightbox = document.getElementById('lightbox');
            const lightboxImage = lightbox.querySelector('.lightbox-image');
            const lightboxNextButton = lightbox.querySelector('.next-btn');
            const lightboxPrevButton = lightbox.querySelector('.prev-btn');
            const closeButton = lightbox.querySelector('.lightbox-close');

            // NEU: Funktion zur Aktualisierung der Thumbnail-Hervorhebung
            const updateThumbnailHighlighting = (newIndex) => {
                thumbnails.forEach((thumb, index) => {
                    if (index === newIndex) {
                        thumb.classList.add('is-active');
                    } else {
                        thumb.classList.remove('is-active');
                    }
                });
            };

            const moveToSlide = (targetSlide) => {
                if (targetSlide < 0 || targetSlide >= slideCount) return;
                track.style.transform = `translateX(-${targetSlide * 100}%)`;
                currentSlide = targetSlide;
                updateArrows();
                if (lightbox.classList.contains('is-visible')) {
                    updateLightboxImage();
                }
                // NEU: Hervorhebung bei jedem Slide-Wechsel aktualisieren
                updateThumbnailHighlighting(currentSlide);
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

            // NEU: Event Listeners für die Thumbnails hinzufügen
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const index = parseInt(thumb.dataset.index, 10);
                    moveToSlide(index);
                });
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
            // NEU: Initiales Highlight für das erste Bild setzen
            updateThumbnailHighlighting(0);
        }
    };

    const loadProjectData = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        const textElement = document.getElementById('project-text');
        const galleryTrack = document.getElementById('gallery-track');
        // NEU: Referenz zum Thumbnail-Grid-Container
        const thumbnailGrid = document.getElementById('thumbnail-grid');

        if (!projectId) {
            textElement.innerHTML = "<p>Error: No project ID specified.</p>";
            return;
        }

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
        
        const lang = localStorage.getItem('userLanguage') || 'en';
        const content = project[lang] || project.en;

        if (!content) {
            textElement.innerHTML = `<p>Error: No content found for this project.</p>`;
            return;
        }

        document.title = `Tizian Rein - ${content.title}`;
        textElement.querySelector('p').innerHTML = `${project.id}<br>${content.title}<br><br>${content.description.replace(/\n/g, '<br>')}`;
        
        // NEU: Thumbnails und Galeriebilder gleichzeitig erstellen
        let galleryHTML = '';
        let thumbnailsHTML = '';

        project.images.forEach((imgSrc, index) => {
            // HTML für die große Galerie
            galleryHTML += `<div class="gallery-slide"><img src="../${imgSrc}" alt="${content.title} view ${index + 1}"></div>`;
            
            // HTML für das Thumbnail-Grid
            thumbnailsHTML += `<img src="../${imgSrc}" class="thumbnail-item" data-index="${index}" alt="Preview ${index + 1}">`;
        });

        galleryTrack.innerHTML = galleryHTML;
        thumbnailGrid.innerHTML = thumbnailsHTML;

        initializeGallery();
    };

    loadProjectData();
});