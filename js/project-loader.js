document.addEventListener('DOMContentLoaded', () => {

  const initializeGallery = () => {
    const gallery = document.querySelector('.project-gallery');
    const track = document.querySelector('.gallery-track');

    if (!gallery || !track || track.children.length === 0) return;

    const slides = Array.from(track.children);
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const slideCount = slides.length;
    let currentSlide = 0;

    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const fullscreenArrow = document.querySelector('.fullscreen-arrow');

    const isVideoSlide = (index) => !!slides[index]?.querySelector('video');

    // --- Hilfsfunktionen ---
    const updateSlideVisibility = (activeIndex) => {
      slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        const vid = slide.querySelector('video');
        if (img && img.dataset.src) {
          img.src = (index === activeIndex) ? img.dataset.src : '';
        }
        if (vid && index !== activeIndex) {
          try { vid.pause(); } catch (e) {}
        }
      });
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('is-active', index === activeIndex);
      });
    };

    const moveToSlide = (targetSlide) => {
      const newIndex = (targetSlide + slideCount) % slideCount;
      currentSlide = newIndex;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateSlideVisibility(currentSlide);
      if (lightbox.classList.contains('is-visible') && !isVideoSlide(currentSlide)) {
        updateLightboxImage();
      }
      if (fullscreenArrow) {
        fullscreenArrow.style.display = isVideoSlide(currentSlide) ? 'none' : '';
      }
    };

    const next = () => moveToSlide(currentSlide + 1);
    const prev = () => moveToSlide(currentSlide - 1);

    const updateLightboxImage = () => {
      const currentImage = slides[currentSlide]?.querySelector('img');
      const imageSource = currentImage?.dataset.src || currentImage?.src;
      if (imageSource) {
        lightboxContent.innerHTML = `<img src="${imageSource}" class="lightbox-image" alt="">`;
      }
    };

    const openLightbox = () => {
      if (isVideoSlide(currentSlide)) return;
      updateLightboxImage();
      lightbox.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
      document.body.style.overflow = '';
      lightboxContent.innerHTML = '';
    };

    // --- Desktop Navigation ---
    const setupDesktopNavigation = (element) => {
      const getPositionRelative = (event) => {
        let refEl = (element.id === 'lightbox') ? lightboxContent.querySelector('img') : (slides[currentSlide]?.querySelector('img, video, iframe') || element);
        if (!refEl) return 'outside';
        const rect = refEl.getBoundingClientRect();
        const x = event.clientX, y = event.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return 'outside';
        return x < (rect.left + rect.width / 2) ? 'left' : 'right';
      };
      element.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 1024) return;
        const pos = getPositionRelative(e);
        element.classList.toggle('cursor-left', pos === 'left');
        element.classList.toggle('cursor-right', pos === 'right');
        if (pos === 'outside') element.classList.remove('cursor-left', 'cursor-right');
      });
      element.addEventListener('mouseleave', () => element.classList.remove('cursor-left', 'cursor-right'));
      element.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 || e.target.closest('.lightbox-close, .fullscreen-arrow, .thumbnail-item, video')) return;
        const pos = getPositionRelative(e);
        if (pos === 'left') prev();
        else if (pos === 'right') next();
      });
    };
    setupDesktopNavigation(gallery);
    setupDesktopNavigation(lightbox);

    if (fullscreenArrow) {
      fullscreenArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isVideoSlide(currentSlide)) openLightbox();
      });
    }

    // --- NEUE, ROBUSTE TOUCH-LOGIK ---
    let touchStartX = 0, touchStartY = 0;
    let touchEndX = 0;
    let startTouchCount = 0;
    let isSwiping = false;
    let isScrolling = false;
    const horizontalThreshold = 50;
    const intentThreshold = 10;

    const touchStartHandler = (e) => {
      startTouchCount = e.touches.length;
      if (startTouchCount > 1) return;
      isSwiping = false;
      isScrolling = false;
      touchStartX = e.touches[0].screenX;
      touchStartY = e.touches[0].screenY;
    };

    const touchMoveHandler = (e) => {
      if (startTouchCount > 1 || (isSwiping || isScrolling)) return;
      const deltaX = Math.abs(e.touches[0].screenX - touchStartX);
      const deltaY = Math.abs(e.touches[0].screenY - touchStartY);
      if (deltaX > intentThreshold || deltaY > intentThreshold) {
        if (deltaX > deltaY) {
          isSwiping = true;
        } else {
          isScrolling = true;
        }
      }
    };

    const touchEndHandler = (e) => {
      if (startTouchCount > 1 || !isSwiping) return;
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) > horizontalThreshold) {
        if (deltaX < 0) next();
        else prev();
      }
    };

    gallery.addEventListener('touchstart', touchStartHandler, { passive: true });
    gallery.addEventListener('touchmove', touchMoveHandler, { passive: true });
    gallery.addEventListener('touchend', touchEndHandler, { passive: true });

    // Lightbox Touch-Logik
    lightbox.addEventListener('touchstart', touchStartHandler, { passive: true });
    // KORREKTUR: Der fehlende Move-Handler für die Lightbox wird hier hinzugefügt.
    lightbox.addEventListener('touchmove', touchMoveHandler, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (startTouchCount > 1) return;
        
        // Priorität: Vertikales Wischen zum Schließen
        if (isScrolling) {
            const touchEndY = e.changedTouches[0].screenY;
            const deltaY = touchEndY - touchStartY;
            if (Math.abs(deltaY) > 80) {
                closeLightbox();
                return;
            }
        }
        
        // Horizontale Wisch-Logik für Links/Rechts-Navigation
        if (isSwiping) {
            touchEndHandler(e);
        }
    }, { passive: true });
    

    // --- Lightbox & Thumbnails ---
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-visible')) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') closeLightbox();
    });

    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(thumb.dataset.index, 10);
        moveToSlide(index);
        if (window.innerWidth <= 1024 && !isVideoSlide(index)) openLightbox();
      });
    });

    // --- VIDEO-HANDLER (VEREINFACHT) ---
    slides.forEach((slide) => {
      const vid = slide.querySelector('video');
      if (!vid) return;
      vid.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) return;
        const rect = vid.getBoundingClientRect();
        const localY = e.clientY - rect.top;
        const safePx = Math.max(40, rect.height * 0.18);
        if ((rect.height - localY) <= safePx) return;
        e.preventDefault();
        e.stopPropagation();
        if ((e.clientX - rect.left) < rect.width / 2) prev();
        else next();
      });
    });

    moveToSlide(0);
  };

  const loadProjectData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const textElement = document.getElementById('project-text');
    const galleryTrack = document.getElementById('gallery-track');
    const thumbnailGrid = document.getElementById('thumbnail-grid');
    if (!projectId) { textElement.innerHTML = "<p>Error: No project ID specified.</p>"; return; }
    try {
      const response = await fetch('../projects.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const allProjects = await response.json();
      const project = allProjects.find(p => p.id === projectId);
      if (!project) { textElement.innerHTML = `<p>Error: Project with ID "${projectId}" not found.</p>`; return; }
      const prevBtn = document.getElementById('prev-project'), nextBtn = document.getElementById('next-project');
      if (prevBtn && nextBtn) {
        const currentIndex = allProjects.findIndex(p => p.id === projectId);
        if (currentIndex !== -1) {
          const prev = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
          const next = allProjects[(currentIndex + 1) % allProjects.length];
          prevBtn.href = `project.html?id=${prev.id}`;
          nextBtn.href = `project.html?id=${next.id}`;
        }
      }
      const lang = localStorage.getItem('userLanguage') || 'en';
      const content = project[lang] || project.en;
      if (!content) { textElement.innerHTML = `<p>Error: No content found for this project.</p>`; return; }
      document.title = `Tizian Rein - ${content.title}`;
      let p = textElement.querySelector('p');
      if (!p) { p = document.createElement('p'); textElement.prepend(p); }
      p.innerHTML = `${project.id}<br>${content.title}<br><br>${content.description.replace(/\n/g, '<br>')}`;
      let galleryHTML = '', thumbnailsHTML = '';

      project.images.forEach((imgSrc, index) => {
        const alt = `${content.title} – Project ${projectId} – view ${index + 1}`;
        const isGif = imgSrc.toLowerCase().endsWith('.gif');
        // --- Galerie-Bild ---
        galleryHTML += `
          <div class="gallery-slide">
            <img 
              ${isGif ? `data-src="../${imgSrc}"` : `src="../${imgSrc}"`}
              alt="${alt}"
            >
            <!-- SEO FALLBACK -->
            <noscript>
              <img src="../${imgSrc}" alt="${alt}">
            </noscript>

          </div>
        `;

        // --- Thumbnail ---
        thumbnailsHTML += `
          <div class="thumbnail-wrapper">
            <img 
              src="../${imgSrc}" 
              class="thumbnail-item" 
              data-index="${index}" 
              alt="${alt}"
            >
            <noscript>
              <img src="../${imgSrc}" alt="${alt}">
            </noscript>
          </div>
        `;
      });

      // --- Video-Bereich ---
      if (project.video && project.video.provider === 'local' && project.video.src) {
        const videoIndex = project.images.length;
        const posterAttr = project.video.poster
          ? ` poster="../${project.video.poster}"`
          : '';

        // Galerie-Video
        galleryHTML += `
          <div class="gallery-slide">
            <video 
              class="js-video" 
              controls 
              preload="metadata" 
              playsinline 
              webkit-playsinline
              ${posterAttr}>
              <source src="../${project.video.src}" type="video/mp4">
            </video>
          </div>
        `;

        // Poster-Thumbnail + SEO-Fallback
        const thumbSrc = project.video.poster || project.images[project.images.length - 1] || '';
        if (thumbSrc) {

          const altPoster = `${content.title} – Project ${projectId} – video poster`;

          thumbnailsHTML += `
            <div class="thumbnail-wrapper">
              <img 
                src="../${thumbSrc}" 
                class="thumbnail-item" 
                data-index="${videoIndex}" 
                alt="${altPoster}"
              >
              <noscript>
                <img src="../${thumbSrc}" alt="${altPoster}">
              </noscript>
            </div>
          `;
        }
      }

      galleryTrack.innerHTML = galleryHTML;
      thumbnailGrid.innerHTML = thumbnailsHTML;
      initializeGallery();
      const pager = document.querySelector('.project-pager'), container = document.querySelector('.project-main-layout'), textSection = document.getElementById('project-text');
      const placePager = () => {
        if (!pager || !container || !textSection) return;
        if (window.innerWidth <= 1024) { if (pager.parentElement !== container) container.appendChild(pager); }
        else { if (pager.parentElement !== textSection) textSection.appendChild(pager); }
      };
      placePager();
      window.addEventListener('resize', placePager);
    } catch (error) {
      console.error('Failed to load project data:', error);
      textElement.innerHTML = "<p>Error: Could not load project data.</p>";
    }
  };
  loadProjectData();
});