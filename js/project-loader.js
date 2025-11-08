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

      const isVideoSlide = (index) => {
        const s = slides[index];
        return !!(s && s.querySelector('video'));
      };

      // Nächstes / vorheriges NICHT-Video in bestimmter Richtung suchen
      const findNextNonVideo = (fromIndex, step) => {
        let i = fromIndex;
        for (let t = 0; t < slideCount; t++) {
          i = (i + step + slideCount) % slideCount;
          if (!isVideoSlide(i)) return i;
        }
        return fromIndex; // Fallback (falls alles Videos wäre)
      };

      // --- Lightbox aufräumen
      const clearLightboxContent = () => {
        while (lightboxContent.firstChild) {
          const node = lightboxContent.firstChild;
          if (node.tagName === 'VIDEO') { try { node.pause(); } catch(e){} }
          lightboxContent.removeChild(node);
        }
      };

      // --- Nur aktives GIF laden/abspielen, Videos außerhalb pausieren
      const updateSlideVisibility = (activeIndex) => {
        slides.forEach((slide, index) => {
          const img = slide.querySelector('img');
          const vid = slide.querySelector('video');

          if (img && img.dataset && img.dataset.src) {
            img.src = (index === activeIndex) ? img.dataset.src : '';
          }
          if (vid && index !== activeIndex) { try { vid.pause(); } catch(e){} }
        });

        thumbnails.forEach((thumb, index) => {
          thumb.classList.toggle('is-active', index === activeIndex);
        });
      };

      const updateLightboxMedia = () => {
        clearLightboxContent();

        const currentSlideEl = slides[currentSlide];
        if (!currentSlideEl) return;

        // Videos werden in der Lightbox bewusst NICHT angezeigt
        if (currentSlideEl.querySelector('video')) return;

        const imgEl = currentSlideEl.querySelector('img');
        const iframeEl = currentSlideEl.querySelector('iframe');

        if (imgEl) {
          const clone = new Image();
          clone.src = imgEl.dataset?.src || imgEl.src;
          clone.className = 'lightbox-image';
          lightboxContent.appendChild(clone);
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
        }
      };

      const moveToSlide = (targetSlide) => {
        let newIndex = (targetSlide + slideCount) % slideCount;

        // Wenn Lightbox offen ist: NIE auf ein Video springen, stattdessen überspringen
        if (lightbox.classList.contains('is-visible') && isVideoSlide(newIndex)) {
          const step = (newIndex > currentSlide) ? +1 : -1;
          newIndex = findNextNonVideo(currentSlide, step);
        }

        currentSlide = newIndex;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateSlideVisibility(currentSlide);

        if (lightbox.classList.contains('is-visible')) {
          updateLightboxMedia();
        }
      };

      const next = () => {
        if (lightbox.classList.contains('is-visible')) {
          moveToSlide(findNextNonVideo(currentSlide, +1));
        } else {
          moveToSlide(currentSlide + 1);
        }
      };
      const prev = () => {
        if (lightbox.classList.contains('is-visible')) {
          moveToSlide(findNextNonVideo(currentSlide, -1));
        } else {
          moveToSlide(currentSlide - 1);
        }
      };

      const openLightbox = () => {
        // Lightbox NIE bei Video-Slide öffnen
        if (isVideoSlide(currentSlide)) return;
        updateLightboxMedia();
        lightbox.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
      };

      const closeLightbox = () => {
        lightbox.classList.remove('is-visible');
        document.body.style.overflow = '';
        clearLightboxContent();
      };

      // --- DESKTOP: Cursor-Navi über dem Medienbereich
      const setupDesktopNavigation = (element) => {
        const getMediaElement = () => {
          if (element.id === 'lightbox') return lightboxContent.firstChild || null;
          const s = slides[currentSlide];
          // Videos absichtlich ausnehmen, da Lightbox keine Videos zeigt
          return s?.querySelector('img, iframe') || null;
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
          // Bei Video nichts tun
          if (!isVideoSlide(currentSlide)) openLightbox();
        });
      }

      // --- MOBILE: Wischkonflikte vermeiden, Video-Gesten respektieren
      let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;
      const horizontalSwipeThreshold = 50, verticalSwipeThreshold = 70, tapThreshold = 10;

      const handleHorizontalSwipe = () => {
        if (touchEndX < touchStartX - horizontalSwipeThreshold) next();
        if (touchEndX > touchStartX + horizontalSwipeThreshold) prev();
      };

      const onTouchStart = (e) => {
        // Start auf Video: Galeriegesten ignorieren
        if (e.target.closest('video')) {
          touchStartX = null;
          touchStartY = null;
          return;
        }
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].screenX;
          touchStartY = e.touches[0].screenY;
        } else {
          touchStartX = null;
          touchStartY = null;
        }
      };

      const onTouchEnd = (e) => {
        // Ende auf Video: Galeriegesten ignorieren
        if (e.target.closest('video')) return;

        if (touchStartX === null) return; // multi-touch oder Video-Geste

        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const deltaX = Math.abs(touchStartX - touchEndX);
        const deltaY = Math.abs(touchStartY - touchEndY);

        if (lightbox.classList.contains('is-visible')) {
          if (deltaY > verticalSwipeThreshold && deltaY > deltaX) { closeLightbox(); return; }
          if (deltaX > horizontalSwipeThreshold && deltaX > deltaY) { handleHorizontalSwipe(); return; }
        } else {
          if (deltaX < tapThreshold && deltaY < tapThreshold) {
            // Tap öffnet Lightbox nur, wenn kein Video aktiv ist
            if (!isVideoSlide(currentSlide)) openLightbox();
            return;
          }
          if (deltaX > horizontalSwipeThreshold && deltaX > deltaY) { handleHorizontalSwipe(); return; }
        }
      };

      gallery.addEventListener('touchstart', onTouchStart, { passive: true });
      gallery.addEventListener('touchend', onTouchEnd);
      lightbox.addEventListener('touchstart', onTouchStart, { passive: true });
      lightbox.addEventListener('touchend', onTouchEnd);

      // --- Klicks auf das Video: nie Auto-Play, nur Controls-Play ---
      slides.forEach((slide) => {
        const vid = slide.querySelector('video');
        if (vid) {
          // iOS Inline
          vid.setAttribute('playsinline', '');
          vid.setAttribute('webkit-playsinline', '');
          vid.setAttribute('preload', 'metadata');

          // Klicks auf die Video-Fläche unterdrücken, damit nur der Play-Button der Controls startet
          vid.addEventListener('click', (ev) => {
            // Wenn der Klick nicht auf ein Controls-Element zeigt, verhindere Default
            // (Browser-spezifisch: sichere Variante – verhindert das ungewollte Auto-Play)
            ev.preventDefault();
            ev.stopPropagation();
          });

          // Auch Pointerdown stoppen (zusätzliche Sicherheit gegen Klick-Delegation)
          vid.addEventListener('pointerdown', (ev) => {
            ev.stopPropagation();
          });
        }
      });

      // --- GENERAL CONTROL ---
      closeButton.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-visible')) return;
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'Escape') closeLightbox();
      });

      // --- Thumbnails: bei Video nie Lightbox öffnen, keine Auto-Play-Aktion ---
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(thumb.dataset.index, 10);
          moveToSlide(index);

          if (window.innerWidth <= 1024) {
            if (isVideoSlide(index)) {
              // kein openLightbox, kein programmatic play
              return;
            }
            openLightbox();
          }
        });
      });

      // Initial
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

      // --- Galerie & Thumbs aufbauen ---
      let galleryHTML = '';
      let thumbnailsHTML = '';
      let slideIndex = 0;

      // 1) Bilder zuerst (GIF lazy via data-src)
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

      // 2) Video am Schluss (nur auf Standard-Seite sichtbar, keine Lightbox)
      if (project.video && project.video.provider === 'local' && project.video.src) {
        const videoIndex = slideIndex;
        const posterAttr = project.video.poster ? ` poster="../${project.video.poster}"` : '';

        galleryHTML += `
          <div class="gallery-slide">
            <video controls preload="metadata"${posterAttr} playsinline webkit-playsinline>
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
