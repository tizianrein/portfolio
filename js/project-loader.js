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

            // --- NEW: A robust function to update the visible/active slide ---
            // This function ensures only the active GIF is loaded and playing.
            const updateSlideVisibility = (activeIndex) => {
                slides.forEach((slide, index) => {
                    const img = slide.querySelector('img');
                    // Check if the image is a GIF by looking for data-src
                    if (img && img.dataset.src) {
                        // If this is the active slide, set its src to start loading/playing.
                        // Otherwise, clear the src to stop it and free up memory.
                        img.src = (index === activeIndex) ? img.dataset.src : '';
                    }
                });
                // Also update the thumbnail highlighting
                thumbnails.forEach((thumb, index) => {
                    thumb.classList.toggle('is-active', index === activeIndex);
                });
            };

            const moveToSlide = (targetSlide) => {
                const newIndex = (targetSlide + slideCount) % slideCount;
                currentSlide = newIndex;
                
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                updateSlideVisibility(currentSlide);

                if (lightbox.classList.contains('is-visible')) {
                    updateLightboxImage();
                }
            };
            
            const next = () => moveToSlide(currentSlide + 1);
            const prev = () => moveToSlide(currentSlide - 1);

            const updateLightboxImage = () => {
                const currentImage = slides[currentSlide]?.querySelector('img');
                // Use data-src for GIFs if available, otherwise fall back to src.
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

            const closeLightbox = () => {
                lightbox.classList.remove('is-visible');
                document.body.style.overflow = '';
                lightboxImage.src = ''; // Important: Stop GIF in lightbox on close
            };
            
            // --- DESKTOP NAVIGATION (No changes needed) ---
            const setupDesktopNavigation = (element) => {
                const getPositionRelativeToImage = (event) => {
                    const imageElement = element.id === 'lightbox' ? lightboxImage : slides[currentSlide]?.querySelector('img');
                    if (!imageElement) return 'outside';
                    const imgRect = imageElement.getBoundingClientRect();
                    if (event.clientX < imgRect.left || event.clientX > imgRect.right || event.clientY < imgRect.top || event.clientY > imgRect.bottom) return 'outside';
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
            
            // --- MOBILE CONTROL (MODIFIED to prevent zoom/swipe conflict) ---
            let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;
            const horizontalSwipeThreshold = 50, verticalSwipeThreshold = 70, tapThreshold = 10;
            const handleHorizontalSwipe = () => {
                if (touchEndX < touchStartX - horizontalSwipeThreshold) next();
                if (touchEndX > touchStartX + horizontalSwipeThreshold) prev();
            };
            const onTouchStart = (e) => {
                // Only track single-finger touches. If more than one finger is on the
                // screen (e.g., for pinch-zoom), invalidate the swipe start point.
                if (e.touches.length === 1) {
                    touchStartX = e.touches[0].screenX;
                    touchStartY = e.touches[0].screenY;
                } else {
                    touchStartX = null;
                    touchStartY = null;
                }
            };
            const onTouchEnd = (e) => { 
                // If touchStartX is null, it means the gesture started with more than one finger (e.g., zoom)
                // or was otherwise invalidated. Do nothing to allow native zoom.
                if (touchStartX === null) return;

                touchEndX = e.changedTouches[0].screenX; 
                touchEndY = e.changedTouches[0].screenY;
                const deltaX = Math.abs(touchStartX - touchEndX), deltaY = Math.abs(touchStartY - touchEndY);
                if (lightbox.classList.contains('is-visible')) {
                    if (deltaY > verticalSwipeThreshold && deltaY > deltaX) { closeLightbox(); return; }
                    if (deltaX > horizontalSwipeThreshold && deltaX > deltaY) { handleHorizontalSwipe(); return; }
                } else {
                    if (deltaX < tapThreshold && deltaY < tapThreshold) { openLightbox(); return; }
                    if (deltaX > horizontalSwipeThreshold && deltaX > deltaY) { handleHorizontalSwipe(); return; }
                }
            };
            gallery.addEventListener('touchstart', onTouchStart, { passive: true });
            gallery.addEventListener('touchend', onTouchEnd);
            lightbox.addEventListener('touchstart', onTouchStart, { passive: true });
            lightbox.addEventListener('touchend', onTouchEnd);

            // --- GENERAL CONTROL (No changes needed) ---
            closeButton.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('is-visible')) return;
                if (e.key === 'ArrowRight') next();
                if (e.key === 'ArrowLeft') prev();
                if (e.key === 'Escape') closeLightbox();
            });

            // --- MODIFIED: Thumbnail click behavior ---
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(thumb.dataset.index, 10);
                    
                    // First, always move the main gallery to the correct slide.
                    // This ensures the lightbox opens with the correct image.
                    moveToSlide(index);

                    // On mobile (matching the CSS breakpoint), also open the lightbox.
                    if (window.innerWidth <= 1024) {
                        openLightbox();
                    }
                });
            });

            // --- MODIFIED: Initial setup call ---
            // This now correctly loads the first slide, even if it's a GIF.
            updateSlideVisibility(0);
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
            const response = await fetch('../projects.json');
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

            // --- This part remains the same, it correctly sets up the HTML ---
            project.images.forEach((imgSrc, index) => {
                const isGif = imgSrc.toLowerCase().endsWith('.gif');
                if (isGif) {
                    // For GIFs, use data-src and leave src empty initially
                    galleryHTML += `<div class="gallery-slide"><img data-src="../${imgSrc}" alt="${content.title} view ${index + 1}"></div>`;
                } else {
                    // For static images, use src directly
                    galleryHTML += `<div class="gallery-slide"><img src="../${imgSrc}" alt="${content.title} view ${index + 1}"></div>`;
                }
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