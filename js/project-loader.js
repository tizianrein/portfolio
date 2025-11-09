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

    // Flag, um zu verhindern, dass ein Video-Tap als Wischen interpretiert wird.
    let isVideoInteraction = false;

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
        let refEl = null;

        if (element.id === 'lightbox') {
          refEl = lightboxContent.querySelector('img');
        } else {
          refEl = slides[currentSlide]?.querySelector('img')
            || slides[currentSlide]?.querySelector('video, iframe')
            || element;
        }

        if (!refEl) return 'outside';
        const rect = refEl.getBoundingClientRect();
        const x = event.clientX, y = event.clientY;

        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return 'outside';
        const midpoint = rect.left + rect.width / 2;
        return x < midpoint ? 'left' : 'right';
      };

      element.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 1024) return;
        const pos = getPositionRelative(e);
        element.classList.toggle('cursor-left', pos === 'left');
        element.classList.toggle('cursor-right', pos === 'right');
        if (pos === 'outside') element.classList.remove('cursor-left', 'cursor-right');
      });

      element.addEventListener('mouseleave', () => {
        element.classList.remove('cursor-left', 'cursor-right');
      });

      element.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) return;
        if (
          e.target.closest('.lightbox-close') ||
          e.target.closest('.fullscreen-arrow') ||
          e.target.closest('.thumbnail-item') ||
          e.target.closest('video')
        ) return;

        const pos = getPositionRelative(e);
        if (pos === 'left') prev();
        else if (pos === 'right') next();
      });
    };
    setupDesktopNavigation(gallery);
    setupDesktopNavigation(lightbox);

    // --- Fullscreen Pfeil ---
    if (fullscreenArrow) {
      fullscreenArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isVideoSlide(currentSlide)) openLightbox();
      });
    }

    // --- TOUCHGESTEN ---
    let touchStartX = 0, touchEndX = 0;
    let touchStartY = 0, touchEndY = 0;
    let startTouchCount = 0;
    const horizontalThreshold = 50;
    const verticalThreshold = 80;

    // Galerie
    gallery.addEventListener('touchstart', (e) => {
      isVideoInteraction = false;
      startTouchCount = e.touches.length;
      if (startTouchCount > 1) return;

      touchStartX = e.touches[0].screenX;
      touchStartY = e.touches[0].screenY;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      if (isVideoInteraction) return;

      if (startTouchCount > 1) return;
      if (e.changedTouches.length > 1) return;

      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > horizontalThreshold) {
        if (deltaX < 0) next();
        else prev();
      }
    }, { passive: true });

    // Lightbox
    lightbox.addEventListener('touchstart', (e) => {
      startTouchCount = e.touches.length;
      if (startTouchCount > 1) return;
      touchStartX = e.touches[0].screenX;
      touchStartY = e.touches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (startTouchCount > 1) return;
      if (e.changedTouches.length > 1) return;
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > verticalThreshold) {
        closeLightbox();
        return;
      }

      if (Math.abs(deltaX) > horizontalThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) next();
        else prev();
      }
    }, { passive: true });

    // --- Lightbox Tastatursteuerung ---
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

    // --- Thumbnails ---
    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(thumb.dataset.index, 10);
        moveToSlide(index);
        if (window.innerWidth <= 1024 && !isVideoSlide(index)) openLightbox();
      });
    });

    // --- Video Interaktion ---
    const CONTROLS_SAFE_PX_MIN = 40;
    const CONTROLS_SAFE_FRAC  = 0.18;

    slides.forEach((slide) => {
      const vid = slide.querySelector('video');
      if (!vid) return;

      // Desktop-Klick
      vid.addEventListener('click', (e) => {
        const rect = vid.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        const safePx = Math.max(CONTROLS_SAFE_PX_MIN, rect.height * CONTROLS_SAFE_FRAC);
        const inControlsZone = (rect.height - localY) <= safePx;

        if (inControlsZone) return;
        e.preventDefault();
        e.stopPropagation();
        if (localX < rect.width / 2) prev();
        else next();
      });

      // Mobile-Tap
      vid.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 0) return;

        const t = e.changedTouches[0];
        const rect = vid.getBoundingClientRect();
        const localX = t.clientX - rect.left;
        const localY = t.clientY - rect.top;

        const safePx = Math.max(CONTROLS_SAFE_PX_MIN, rect.height * CONTROLS_SAFE_FRAC);
        const inControlsZone = (rect.height - localY) <= safePx;

        const centerMarginX = rect.width * 0.25;
        const centerMarginTop = rect.height * 0.20;
        const centerMarginBottom = rect.height * 0.20;
        const inCenterZone =
          localX > centerMarginX &&
          localX < rect.width - centerMarginX &&
          localY > centerMarginTop &&
          localY < rect.height - centerMarginBottom;

        if (inControlsZone || inCenterZone) {
          // --- KORREKTUR: Die doppelte Sicherung ---
          // 1. Setze die Sperre für den Galerie-Handler.
          isVideoInteraction = true;
          // 2. Manipuliere zusätzlich die Start-Koordinate, um die Wisch-Berechnung
          //    auf jeden Fall zu neutralisieren (deltaX wird 0).
          touchStartX = t.screenX;
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        if (localX < rect.width / 2) prev();
        else next();
      }, { passive: false });
    });

    moveToSlide(0);
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

      // Project Navigation
      const prevBtn = document.getElementById('prev-project');
      const nextBtn = document.getElementById('next-project');
      if (prevBtn && nextBtn) {
        const currentIndex = allProjects.findIndex(p => p.id === projectId);
        if (currentIndex !== -1) {
          const prev = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
          const next = allProjects[(currentIndex + 1) % allProjects.length];
          prevBtn.href = `project.html?id=${prev.id}`;
          nextBtn.href = `project.html?id=${next.id}`;
        }
      }

      // Text & Title
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

      // Gallery & Thumbnails
      let galleryHTML = '';
      let thumbnailsHTML = '';

      project.images.forEach((imgSrc, index) => {
        const isGif = imgSrc.toLowerCase().endsWith('.gif');
        if (isGif) {
          galleryHTML += `<div class="gallery-slide"><img data-src="../${imgSrc}" alt="${content.title} view ${index + 1}"></div>`;
        } else {
          galleryHTML += `<div class="gallery-slide"><img src="../${imgSrc}" alt="${content.title} view ${index + 1}"></div>`;
        }
        thumbnailsHTML += `<div class="thumbnail-wrapper"><img src="../${imgSrc}" class="thumbnail-item" data-index="${index}" alt="Preview ${index + 1}"></div>`;
      });

      if (project.video && project.video.provider === 'local' && project.video.src) {
        const videoIndex = project.images.length;
        const posterAttr = project.video.poster ? ` poster="../${project.video.poster}"` : '';
        galleryHTML += `
          <div class="gallery-slide">
            <video class="js-video" controls preload="metadata" playsinline webkit-playsinline${posterAttr}>
              <source src="../${project.video.src}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `;
        const thumbSrc = project.video.poster || project.images[project.images.length - 1] || '';
        if (thumbSrc) {
          thumbnailsHTML += `
            <div class="thumbnail-wrapper">
              <img src="../${thumbSrc}" class="thumbnail-item" data-index="${videoIndex}" alt="Video preview">
            </div>
          `;
        }
      }

      galleryTrack.innerHTML = galleryHTML;
      thumbnailGrid.innerHTML = thumbnailsHTML;

      initializeGallery();

      // Pager Position
      const pager = document.querySelector('.project-pager');
      const container = document.querySelector('.project-main-layout');
      const textSection = document.getElementById('project-text');
      const placePager = () => {
        if (!pager || !container || !textSection) return;
        if (window.innerWidth <= 1024) {
          if (pager.parentElement !== container) container.appendChild(pager);
        } else {
          if (pager.parentElement !== textSection) textSection.appendChild(pager);
        }
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