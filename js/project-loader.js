document.addEventListener('DOMContentLoaded', () => {

    const initializeGallery = () => {
        const gallery = document.querySelector('.project-gallery');
        const track = document.querySelector('.gallery-track');
        
        if (gallery && track && track.children.length > 0) {
            const slides = Array.from(track.children);
            const thumbnails = document.querySelectorAll('.thumbnail-item');
            const slideCount = slides.length;
            let currentSlide = 0;

            const lightbox = document.getElementById('lightbox');
            const lightboxImage = lightbox.querySelector('.lightbox-image');
            const closeButton = lightbox.querySelector('.lightbox-close');
            const fullscreenArrow = document.querySelector('.fullscreen-arrow');

            // --- NEW: Function to handle loading/unloading of images (especially GIFs) ---
            const manageSlideImage = (index, load) => {
                const slide = slides[index];
                if (slide) {
                    const img = slide.querySelector('img');
                    // A GIF is identified by having a 'data-src' attribute.
                    if (img && img.dataset.src) {
                        // Load by setting src from data-src, unload by clearing src.
                        img.src = load ? img.dataset.src : '';
                    }
                }
            };

            const updateThumbnailHighlighting = (newIndex) => {
                thumbnails.forEach((thumb, index) => {
                    thumb.classList.toggle('is-active', index === newIndex);
                });
            };
            
            // --- MODIFIED: moveToSlide now manages GIF loading/unloading ---
            const moveToSlide = (targetSlide) => {
                const newIndex = (targetSlide + slideCount) % slideCount;
                
                if (newIndex === currentSlide && slides[newIndex].querySelector('img')?.src) {
                    return; // Do nothing if it's the same slide and already loaded
                }

                // Unload the previously active slide if it was a GIF
                manageSlideImage(currentSlide, false);

                // Update the current slide index
                currentSlide = newIndex;

                // Load the new active slide's image
                manageSlideImage(currentSlide, true);

                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                if (lightbox.classList.contains('is-visible')) {
                    updateLightboxImage();
                }
                updateThumbnailHighlighting(currentSlide);
            };
            
            const next = () => moveToSlide(currentSlide + 1);
            const prev = () => moveToSlide(currentSlide - 1);

            // --- MODIFIED: updateLightboxImage to get the correct source ---
            const updateLightboxImage = () => {
                const currentImage = slides[currentSlide]?.querySelector('img');
                // Use data-src for GIFs as the primary source, otherwise fall back to src.
                const imageSource = currentImage?.dataset.src || currentImage?.src;
                if (imageSource) {
                    lightboxImage.src = imageSource;
                }
            };

            const openLightbox = () => {
                updateLightboxImage();
                lightbox.classList.add('is-visible');
                document.body.style.overflow = 'hidden';
            };

            // --- MODIFIED: closeLightbox to stop GIF playback ---
            const closeLightbox = () => {
                lightbox.classList.remove('is-visible');
                document.body.style.overflow = '';
                lightboxImage.src = ''; // Clearing the src stops the GIF and frees memory.
            };
            
            // --- DESKTOP NAVIGATION (Klick & Maus) - No changes needed here ---
            const setupDesktopNavigation = (element) => {
                const getPositionRelativeToImage = (event) => {
                    const imageElement = element.id === 'lightbox' ? lightboxImage : slides[currentSlide]?.querySelector('img');
                    if (!imageElement) return 'outside';
                    const imgRect = imageElement.getBoundingClientRect();
                    if (event.clientX < imgRect.left || event.clientX > imgRect.right || event.clientY < imgRect.top || event.clientY > imgRect.bottom) {
                        return 'outside';
                    }
                    const midpoint = imgRect.left + imgRect.width / 2;
                    return event.clientX < midpoint ? 'left' : 'right';
                };
                element.addEventListener('mousemove', (e) => {
                    if (window.innerWidth <= 1024) return;
                    const position = getPositionRelativeToImage(e);
                    element.classList.toggle('cursor-left', position === 'left');
                    element.classList.toggle('cursor-right', position === 'right');
                });
                element.addEventListener('mouseleave', () => {
                    element.classList.remove('cursor-left', 'cursor-right');
                });
                element.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) return;
                    if (e.target.closest('.lightbox-close') || e.target.closest('.fullscreen-arrow') || e.target.closest('.thumbnail-item')) return;
                    const position = getPositionRelativeToImage(e);
                    if (position === 'left') prev();
                    else if (position === 'right') next();
                });
            };
            
            setupDesktopNavigation(gallery);
            setupDesktopNavigation(lightbox);

            if (fullscreenArrow) {
                fullscreenArrow.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openLightbox();
                });
            }
            
            // --- KORRIGIERTE MOBILE STEUERUNG (SWIPE, TAP, SCROLL) - No changes needed here ---
            let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;
            const horizontalSwipeThreshold = 50, verticalSwipeThreshold = 70, tapThreshold = 10;

            const handleHorizontalSwipe = () => {
                if (touchEndX < touchStartX - horizontalSwipeThreshold) next();
                if (touchEndX > touchStartX + horizontalSwipeThreshold) prev();
            };
            const onTouchStart = (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            };
            const onTouchEnd = (e) => { 
                touchEndX = e.changedTouches[0].screenX; 
                touchEndY = e.changedTouches[0].screenY;
                const deltaX = Math.abs(touchStartX - touchEndX), deltaY = Math.abs(touchStartY - touchEndY);
                
                if (lightbox.classList.contains('is-visible')) {
                    if (deltaY > verticalSwipeThreshold && deltaY > deltaX) {
                        closeLightbox(); return;
                    }
                    if (deltaX > horizontalSwipeThreshold && deltaX > deltaY) {
                        handleHorizontalSwipe(); return;
                    }
                } else {
                    if (deltaX < tapThreshold && deltaY < tapThreshold) {
                        openLightbox(); return;
                    }
                    if (deltaX > horizontalSwipeThreshold && deltaX > deltaY) {
                        handleHorizontalSwipe(); return;
                    }
                }
            };
            
            gallery.addEventListener('touchstart', onTouchStart, { passive: true });
            gallery.addEventListener('touchend', onTouchEnd);
            lightbox.addEventListener('touchstart', onTouchStart, { passive: true });
            lightbox.addEventListener('touchend', onTouchEnd);

            // --- ALLGEMEINE STEUERUNG (für beide Ansichten) - No changes needed here ---
            closeButton.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('is-visible')) return;
                if (e.key === 'ArrowRight') next();
                if (e.key === 'ArrowLeft') prev();
                if (e.key === 'Escape') closeLightbox();
            });
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(thumb.dataset.index, 10);
                    moveToSlide(index);
                });
            });

            // --- NEW: Load the initial slide image on startup ---
            manageSlideImage(0, true);
            updateThumbnailHighlighting(0);
        }
    };

    const loadProjectData = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        const textElement = document.getElementById('project-text');
        const galleryTrack = document.getElementById('gallery-track');
        const thumbnailGrid = document.getElementById('thumbnail-grid');

        if (!projectId) {
            textElement.innerHTML = "<p>Error: No project ID specified.</p>";
            return;
        }

        try {
            const response = await fetch('../js/projects.json');
            if (!response.ok) throw new Error('Network response was not ok');
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
            let p = textElement.querySelector('p');
            if (!p) { p = document.createElement('p'); textElement.prepend(p); }
            p.innerHTML = `${project.id}<br>${content.title}<br><br>${content.description.replace(/\n/g, '<br>')}`;
            
            let galleryHTML = '', thumbnailsHTML = '';

            // --- MODIFIED: Logic to handle GIFs during HTML generation ---
            project.images.forEach((imgSrc, index) => {
                const isGif = imgSrc.toLowerCase().endsWith('.gif');
                
                if (isGif) {
                    // For GIFs, we put the real source in 'data-src' to lazy load it later.
                    // The 'src' attribute is left empty initially.
                    galleryHTML += `<div class="gallery-slide"><img data-src="../${imgSrc}" alt="${content.title} view ${index + 1}"></div>`;
                } else {
                    // For static images (jpg, png, etc.), we load them normally.
                    galleryHTML += `<div class="gallery-slide"><img src="../${imgSrc}" alt="${content.title} view ${index + 1}"></div>`;
                }
                
                // Thumbnails always load the image directly, as they are small.
                thumbnailsHTML += `<div class="thumbnail-wrapper"><img src="../${imgSrc}" class="thumbnail-item" data-index="${index}" alt="Preview ${index + 1}"></div>`;
            });

            galleryTrack.innerHTML = galleryHTML;
            thumbnailGrid.innerHTML = thumbnailsHTML;

            initializeGallery();
        } catch (error) {
            console.error('Failed to load project data:', error);
            textElement.innerHTML = "<p>Error: Could not load project data.</p>";
        }
    };

    loadProjectData();
});