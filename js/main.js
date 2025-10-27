document.addEventListener('DOMContentLoaded', () => {

  const projects = [
    { id: '053', title: 'From Structure to Action', year: 2025, scale: 'mm', thumbnail: 'images/thumbnails/053-thumb.jpg' },
    { id: '052', title: 'ZAKK Garden Chair', year: 2023, scale: 'm',  thumbnail: 'images/thumbnails/052-thumb.jpg' },
    { id: '051', title: 'Waldfriedhofskapelle Rhöndorf', year: 2023, scale: 'm',  thumbnail: 'images/thumbnails/051-thumb.jpg' },
    { id: '050', title: 'Beamtenwohnung Bonn', year: 2024, scale: 'm',  thumbnail: 'images/thumbnails/050-thumb.jpg' },
    { id: '049', title: 'Consectetur Adipiscing', year: 2019, scale: 'cm', thumbnail: 'images/thumbnails/049-thumb.jpg' },
    { id: '048', title: 'Consectetur Adipiscing', year: 2019, scale: 'cm', thumbnail: 'images/thumbnails/048-thumb.jpg' },
    { id: '047', title: 'Sed Do Eiusmod', year: 2018, scale: 'cm', thumbnail: 'images/thumbnails/047-thumb.jpg' },
    { id: '046', title: 'Versöhnungskirche Dachau', year: 2016, scale: 'mm', thumbnail: 'images/thumbnails/046-thumb.jpg' },
    { id: '003', title: 'Anamorphosen auf dem Ebertplatz', year: 2018, scale: 'cm', thumbnail: 'images/thumbnails/003-thumb.jpg' }
  ];

  const projectGrid   = document.getElementById('project-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // --- Loading knobs (ONLY affects when we start loading; not the visuals)
  const BATCH_SIZE     = 6;  // first items to load immediately
  const MAX_CONCURRENT = 6;  // limit parallel decodes
  const OBS_THRESHOLD  = 0.15;

  let io;                   // IntersectionObserver
  let queue = [];           // elements waiting to be prepared
  let inFlight = 0;         // current parallel loads

  function displayProjects(projectsToDisplay) {
    projectGrid.innerHTML = '';

    projectsToDisplay.forEach((project, index) => {
      const projectElement = document.createElement('a');
      projectElement.href = `projects/project-${project.id}.html`;
      projectElement.className = 'project-item';
      projectElement.dataset.year = project.year;

      const layoutType = Math.floor(index / 2) % 2 === 0 ? 'a' : 'b';
      projectElement.classList.add(`layout-${layoutType}`);

      projectElement.innerHTML = `
        <div class="project-image-container">
          <canvas class="pixelation-canvas"></canvas>
          <img
            data-src="${project.thumbnail}"
            class="full-res-image"
            alt="${project.title}"
            loading="lazy"
            decoding="async"
          >
        </div>
        <div class="project-info">
          <h3>${project.id}</h3>
          <p>${project.title}</p>
        </div>
      `;
      projectGrid.appendChild(projectElement);

      // Give the very first items higher fetch priority (above the fold)
      if (index < BATCH_SIZE) {
        projectElement.querySelector('.full-res-image')
          .setAttribute('fetchpriority', 'high');
      }
    });

    // Keep your existing hover/interaction behavior
    setupHoverListeners();

    // New: lazy/batch loading trigger (does NOT change visuals/animation)
    setupLoadObserver();

    // Prime the first batch immediately
    primeFirstBatch(Math.min(BATCH_SIZE, projectsToDisplay.length));
  }

  // ---- Loading control (queue + concurrency) ----------------------------
  function setupLoadObserver() {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const item = entry.target.closest('.project-item');
        if (item) enqueue(item);
      });
    }, { threshold: OBS_THRESHOLD });

    projectGrid.querySelectorAll('.project-image-container').forEach(c => io.observe(c));
  }

  function primeFirstBatch(n) {
    const firstItems = Array.from(projectGrid.querySelectorAll('.project-item')).slice(0, n);
    firstItems.forEach(enqueue);
  }

  function enqueue(item) {
    if (item.dataset.queued === '1') return;
    item.dataset.queued = '1';
    queue.push(item);
    pump();
  }

  function pump() {
    while (inFlight < MAX_CONCURRENT && queue.length) {
      const item = queue.shift();
      inFlight++;
      prepareInitialPixelatedImage(item).finally(() => {
        inFlight--;
        pump();
      });
    }
  }

  // ---- Your original functions (unchanged visuals) ----------------------

  /**
   * Loads the image, sets paddingTop to keep your layout logic, places the real <img> under the canvas,
   * and draws the first pixel step. (Same effect; just called later via queue/observer.)
   */
  function prepareInitialPixelatedImage(projectElement) {
    const container  = projectElement.querySelector('.project-image-container');
    const canvas     = container.querySelector('.pixelation-canvas');
    const finalImage = container.querySelector('.full-res-image');

    if (container.dataset.loaded === '1') return Promise.resolve();

    const highResImage = new Image();
    highResImage.src = finalImage.dataset.src;

    return new Promise((resolve) => {
      highResImage.onload = () => {
        container.imageObject = highResImage;

        // keep your layout method: padding-top sets height based on natural aspect
        const aspect = highResImage.naturalHeight / highResImage.naturalWidth;
        container.style.paddingTop = `${aspect * 100}%`;

        // put the real image underneath the canvas (exactly as before)
        finalImage.src = highResImage.src;

        // draw the first pixelation step exactly as before
        drawPixelated(highResImage, canvas, 4);

        container.dataset.loaded = '1';
        resolve();
      };
      highResImage.onerror = () => resolve();
    });
  }

  // (Unchanged) – your hover/touch trigger logic
  function setupHoverListeners() {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const containers = document.querySelectorAll('.project-image-container');
    const infos = document.querySelectorAll('.project-info');

    function triggerOnce(container) {
      if (!container || !container.imageObject) return;
      if (container.dataset.animStarted === '1') return;
      container.dataset.animStarted = '1';
      startDePixelationAnimation(container);
    }

    function containerFor(el) {
      const item = el.closest('.project-item');
      return item ? item.querySelector('.project-image-container') : null;
    }

    if (!isCoarse) {
      containers.forEach(c => {
        c.addEventListener('pointerenter', () => triggerOnce(c), { passive: true, once: true });
      });
      infos.forEach(info => {
        info.addEventListener('pointerenter', () => {
          const c = containerFor(info);
          if (c) triggerOnce(c);
        }, { passive: true, once: true });
      });
      return;
    }

    let last = 0;
    window.addEventListener('touchmove', (e) => {
      const now = Date.now();
      if (now - last < 120) return;
      last = now;
      const t = e.touches && e.touches[0];
      if (!t) return;
      const el = document.elementFromPoint(t.clientX, t.clientY);
      if (!el) return;
      const directImg = el.closest('.project-image-container');
      const targetContainer = directImg || containerFor(el);
      if (targetContainer) triggerOnce(targetContainer);
    }, { passive: true });
  }

  // (Unchanged) – your reveal sequence
  function startDePixelationAnimation(container) {
    const canvas = container.querySelector('.pixelation-canvas');
    const highResImage = container.imageObject;

    const pixelationSteps = [4, 8, 16, 32];
    let currentStep = 1;

    function animate() {
      if (currentStep >= pixelationSteps.length) {
        container.classList.add('is-loaded');
        return;
      }
      const size = pixelationSteps[currentStep];
      drawPixelated(highResImage, canvas, size);
      currentStep++;
      setTimeout(animate, 150);
    }
    animate();
  }

  // (Unchanged) – your pixelation renderer
  function drawPixelated(image, canvas, size) {
    const ctx = canvas.getContext('2d');
    const aspect = image.height / image.width;
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, size, size * aspect);
    ctx.drawImage(canvas, 0, 0, size, size * aspect, 0, 0, canvas.width, canvas.height);
  }

  // Filters (unchanged)
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.dataset.filter;
      if (filter === 'all' || !filter) {
        displayProjects(projects);
      } else {
        const filteredProjects = projects.filter(p => p.scale === filter);
        displayProjects(filteredProjects);
      }
    });
  });

  // Init
  displayProjects(projects);
});
