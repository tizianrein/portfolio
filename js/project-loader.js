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

    const updateSlideVisibility = (activeIndex) => {
      slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        const vid = slide.querySelector('video');
        if (img && img.dataset.src) {
          img.src = (index === activeIndex) ? img.dataset.src : img.dataset.src;
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

    lightbox.addEventListener('touchstart', touchStartHandler, { passive: true });
    lightbox.addEventListener('touchmove', touchMoveHandler, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (startTouchCount > 1) return;
      if (isScrolling) {
        const touchEndY = e.changedTouches[0].screenY;
        const deltaY = touchEndY - touchStartY;
        if (Math.abs(deltaY) > 80) {
          closeLightbox();
          return;
        }
      }
      if (isSwiping) {
        touchEndHandler(e);
      }
    }, { passive: true });

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

      document.title = `Tizian Rein - ${content.title}`;

      let p = textElement.querySelector('p');
      if (!p) { p = document.createElement('p'); textElement.prepend(p); }
      p.innerHTML = `${project.id}<br>${content.title}<br><br>${content.description.replace(/\n/g, '<br>')}`;

      let galleryHTML = '';
      let thumbnailsHTML = '';

      project.images.forEach((imgSrc, index) => {
        galleryHTML += `
          <div class="gallery-slide">
            <img 
              src="${imgSrc}"
              data-src="${imgSrc}" 
              class="slide-image"
              alt="${content.title} - image ${index + 1}"
              loading="lazy"
              decoding="async">
          </div>
        `;

        thumbnailsHTML += `
          <img 
            src="${imgSrc}"
            data-src="${imgSrc}" 
            class="thumbnail-item"
            data-index="${index}"
            alt="${content.title} - thumbnail ${index + 1}"
            loading="lazy"
            decoding="async">
        `;
      });

      galleryTrack.innerHTML = galleryHTML;
      thumbnailGrid.innerHTML = thumbnailsHTML;

      initializeGallery();

    } catch (error) {
      console.error("Could not load project:", error);
      textElement.innerHTML = '<p style="text-align: center; color: red;">Error loading project.</p>';
    }
  };

  loadProjectData();
});
