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
      const lightboxContent = lightbox.querySelector('.lightbox-content');
      const closeButton = lightbox.querySelector('.lightbox-close');
      const fullscreenArrow = document.querySelector('.fullscreen-arrow');

      // --- Utility: clear and stop media inside the lightbox
      const clearLightboxContent = () => {
        while (lightboxContent.firstChild) {
          const node = lightboxContent.firstChild;
          if (node.tagName === 'VIDEO') {
            try { node.pause(); } catch(e){}
          }
          lightboxContent.removeChild(node);
        }
      };

      // --- Only the active GIF should load/play; also pause any <video> on non-active slides
      const updateSlideVisibility = (activeIndex) => {
        slides.forEach((slide, index) => {
          const img = slide.querySelector('img');
          const vid = slide.querySelector('video');

          // Handle GIFs that use data-src (lazy load)
          if (img && img.dataset && img.dataset.src) {
            img.src = (index === activeIndex) ? img.dataset.src : '';
          }

          // Pause videos that are off-screen
          if (vid) {
            if (index === activeIndex) {
              // do nothing: user decides to play
            } else {
              try { vid.pause(); } catch(e){}
            }
          }
        });

        // Update thumbnail active state
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
          updateLightboxMedia();
        }
      };

      const next = () => moveToSlide(currentSlide + 1);
      const prev = () => moveToSlide(currentSlide - 1);

      // --- Lightbox: support IMG (incl. GIF via data-src), VIDEO, IFRAME
      const updateLightboxMedia = () => {
        clearLightboxContent();

        const currentSlideEl = slides[currentSlide];
        if (!currentSlideEl) return;

        const imgEl = currentSlideEl.querySelector('img');
        const videoEl = currentSlideEl.querySelector('video');
        const iframeEl = currentSlideEl.querySelector('iframe');

        if (imgEl) {
          const clone = new Image();
          clone.src = imgEl.dataset?.src || imgEl.src;
          clone.className = 'lightbox-image';
          lightboxContent.appendChild(clone);
          return;
        }

        if (videoEl) {
          const clone = document.createElement('video');
          clone.controls = true;
          clone.playsInline = true;
          if (videoEl.poster) clone.poster = videoEl.poster;

          // copy source
          const src = videoEl.querySelector('source')?.src || videoEl.src;
          if (src) {
            const source = document.createElement('source');
            source.src = src;
            // Keep type as MP4 (most common); if you add other types later, add logic to read type attr
            source.type = 'video/mp4';
            clone.appendChild(source);
          }

          lightboxContent.appendChild(clone);
          // Optional: uncomment to autoplay muted in lightbox
          // clone.muted = true;
          // clone.play().catch(() => {});
          return;
        }

        if (iframeEl) {
          const clone = document.createElement('iframe');
          clone.src = iframeEl.src;
          clone.width = '100%';
          clone.height = '85vh';
          clone.frameBorder = '0';
          clone.allow = iframeEl.getAttribute('allow') || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
          clone.referrerPolicy = 'origin';
          clone.allowFullscreen = true;
          lightboxContent.appendChild(clone);
          return;
        }
      };

      const openLightbox = () => {
        updateLightboxMedia();
        lightbox.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
      };

      const closeLightbox = () => {
        lightbox.classList.remove('is-visible');
        document.body.style.overflow = '';
        clearLightboxContent(); // stops GIFs/videos in the overlay
      };

      // --- DESKTOP NAVIGATION ---
      const setupDesktopNavigation = (element) => {
        const getMediaElement = () => {
          if (element.id === 'lightbox') {
            // Prefer whatever is currently shown in lightbox
            return lightboxContent.firstChild || null;
          }
          // In-gallery: use current slide media
          const s = slides[currentSlide];
          return s?.querySelector('img, video, iframe') || null;
        };

        const getPositionRelativeToMedia = (event) => {
          const el = getMediaElement();
          if (!el) return 'outside';
          const rect = el.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return 'outside';
          const midpoint = rect.left + rect.width / 2;
          return event.clientX < midpoint ? 'left' : 'right';
        };

        element.addEventListener('mousemove', (e) => {
          if (window.innerWidth <= 1024) return;
          const position = getPositionRelativeToMedia(e);
          element.classList.toggle('cursor-left', position === 'left');
          element.classList.toggle('cursor-right', position === 'right');
        });

        element.addEventListener('mouseleave', () => {
          element.classList.remove('cursor-left', 'cursor-right');
        });

        element.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) return;
          if (e.target.closest('.lightbox-close') || e.target.closest('.fullscreen-arrow') || e.target.closest('.thumbnail-item')) return;
          const position = getPositionRelativeToMedia(e);
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

      // --- MOBILE CONTROL (prevents zoom/swipe conflict) ---
      let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;
      const horizontalSwipeThreshold = 50, verticalSwipeThreshold = 70, tapThreshold = 10;

      const handleHorizontalSwipe = () => {
        if (touchEndX < touchStartX - horizontalSwipeThreshold) next();
        if (touchEndX > touchStartX + horizontalSwipeThreshold) prev();
      };

      const onTouchStart = (e) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].screenX;
          touchStartY = e.touches[0].screenY;
        } else {
          touchStartX = null;
          touchStartY = null;
        }
      };

      const onTouchEnd = (e) => {
        if (touchStartX === null) return; // multi-touch started, ignore

        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const deltaX = Math.abs(touchStartX - touchEndX);
        const deltaY = Math.abs(touchStartY - touchEndY);

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

      // --- GENERAL CONTROL ---
      closeButton.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-visible')) return;
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'Escape') closeLightbox();
      });

      // --- Thumbnails click -> move + open (mobile)
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(thumb.dataset.index, 10);
          moveToSlide(index);
          if (window.innerWidth <= 1024) {
            openLightbox();
          }
        });
      });

      // Initial state
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

      // --- Build gallery & thumbnails ---
      let galleryHTML = '';
      let thumbnailsHTML = '';
      let slideIndex = 0; // true index as we append slides

      // 1) Images first (keep GIF lazy behavior)
      project.images.forEach((imgSrc) => {
        const isGif = imgSrc.toLowerCase().endsWith('.gif');

        if (isGif) {
          galleryHTML += `
            <div class="gallery-slide">
              <img data-src="../${imgSrc}" alt="${content.title} view ${slideIndex + 1}">
            </div>`;
        } else {
          galleryHTML += `
            <div class="gallery-slide">
              <img src="../${imgSrc}" alt="${content.title} view ${slideIndex + 1}">
            </div>`;
        }

        thumbnailsHTML += `
          <div class="thumbnail-wrapper">
            <img src="../${imgSrc}" class="thumbnail-item" data-index="${slideIndex}" alt="Preview ${slideIndex + 1}">
          </div>`;

        slideIndex++;
      });

      // 2) Video last (local or iframe-ready if you add provider === 'youtube' later)
      if (project.video && project.video.provider === 'local' && project.video.src) {
        const videoIndex = slideIndex;
        const posterAttr = project.video.poster ? ` poster="../${project.video.poster}"` : '';

        galleryHTML += `
          <div class="gallery-slide">
            <video controls preload="metadata"${posterAttr} playsinline>
              <source src="../${project.video.src}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>`;

        const thumbSrc = project.video.poster
          ? `../${project.video.poster}`
          : (project.images.length ? `../${project.images[project.images.length - 1]}` : '');

        if (thumbSrc) {
          thumbnailsHTML += `
            <div class="thumbnail-wrapper">
              <img src="${thumbSrc}" class="thumbnail-item" data-index="${videoIndex}" alt="Video">
            </div>`;
        }

        slideIndex++;
      }

      // Inject built markup and init
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
