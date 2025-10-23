// main.js — schnelle, ressourcenschonende Version

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // Projekte (optional w/h für besseres aspect-ratio)
  // ============================================
  const projects = [
    { id: '053', title: 'Ipsum Dolor Sit', year: 2025, scale: 'mm', thumbnail: 'images/thumbnails/053-thumb.jpg', w: 1200, h: 1500 },
    { id: '052', title: 'Lorem Ipsum Amet', year: 2023, scale: 'm',  thumbnail: 'images/thumbnails/052-thumb.jpg',  w: 1200, h: 1500 },
    { id: '050', title: 'Sit Amet Dolor',   year: 2024, scale: 'm',  thumbnail: 'images/thumbnails/050-thumb.jpg',  w: 1200, h: 1500 },
    { id: '049', title: 'Consectetur Adipiscing', year: 2019, scale: 'cm', thumbnail: 'images/thumbnails/049-thumb.jpg', w: 1200, h: 1500 },
    { id: '047', title: 'Tempor Incididunt', year: 2016, scale: 'cm', thumbnail: 'images/thumbnails/047-thumb.jpg', w: 1200, h: 1500 },
    { id: '046', title: 'Dolor Sit Amet',    year: 2015, scale: 'mm', thumbnail: 'images/thumbnails/046-thumb.jpg', w: 1200, h: 1500 }
  ];

  const projectGrid   = document.getElementById('project-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // ============================================
  // Render-Funktion (mit Lazy, Priorität & aspect-ratio)
  // ============================================
  function displayProjects(projectsToDisplay) {
    projectGrid.innerHTML = '';

    projectsToDisplay.forEach((project, index) => {
      const projectElement = document.createElement('a');
      projectElement.href = `projects/project-${project.id}.html`;
      projectElement.className = 'project-item';
      projectElement.dataset.year = project.year;

      // Layout wie gehabt alternierend a/b
      const layoutType = Math.floor(index / 2) % 2 === 0 ? 'a' : 'b';
      projectElement.classList.add(`layout-${layoutType}`);

      // Priorität: erste 2 hoch, Rest niedrig
      const fetchPriority = index < 2 ? 'high' : 'low';

      // aspect-ratio sofort setzen (w/h bekannt → 1/ratio)
      const ratio = (project.w && project.h) ? (project.h / project.w) : (5 / 4); // Fallback 4:5
      const aspectCSS = `style="aspect-ratio: ${1 / ratio};"`

      projectElement.innerHTML = `
        <div class="project-image-container" ${aspectCSS}>
          <canvas class="pixelation-canvas"></canvas>
          <img 
            data-src="${project.thumbnail}" 
            class="full-res-image" 
            alt="${project.title}"
            loading="lazy"
            decoding="async"
            fetchpriority="${fetchPriority}">
        </div>
        <div class="project-info">
          <h3>${project.id}</h3>
          <p>${project.title}</p>
        </div>
      `;

      projectGrid.appendChild(projectElement);

      // Lazy aktivieren: Sichtbarkeit abwarten
      observeAndPrepare(projectElement);
    });
  }

  // ============================================
  // IntersectionObserver: Bild erst bei Sichtweite laden
  // ============================================
  let io;
  function getIO() {
    if (io) return io;
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          prepareInitialPixelatedImage(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '300px 0px', // Vorlauf
      threshold: 0.01
    });
    return io;
  }

  function observeAndPrepare(projectElement) {
    // Above-the-fold sofort, Rest via IO
    const index = Array.prototype.indexOf.call(projectGrid.children, projectElement);
    if (index > -1 && index < 2) {
      prepareInitialPixelatedImage(projectElement);
    } else {
      getIO().observe(projectElement);
    }
  }

  // ============================================
  // Bild vorbereiten & Pixelation starten
  // ============================================
  function prepareInitialPixelatedImage(projectElement) {
    const container  = projectElement.querySelector('.project-image-container');
    const canvas     = container.querySelector('.pixelation-canvas');
    const finalImage = container.querySelector('.full-res-image');

    // Doppelte Initialisierung vermeiden
    if (container.dataset.loading === '1') return;
    container.dataset.loading = '1';

    const highResImage = new Image();
    highResImage.src = finalImage.dataset.src;

    // Native <img> sofort starten (nutzt lazy + async decoding)
    finalImage.src = highResImage.src;

    const afterReady = () => {
      container.imageObject = highResImage;

      // Canvasgröße mit Container synchronisieren
      const setCanvasSize = () => {
        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      };
      setCanvasSize();

      // Bei Resize Canvas aktualisieren (debounced)
      let resizeTO = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => {
          setCanvasSize();
          // Bei Resize erneut letzte Pixel-Stufe zeichnen (falls noch nicht geladen)
          if (!container.classList.contains('is-loaded')) {
            drawPixelated(highResImage, canvas, 20);
          }
        }, 120);
      });

      startDePixelationAnimation(container);
    };

    if (highResImage.decode) {
      highResImage.decode().then(afterReady).catch(() => {
        highResImage.onload = afterReady;
      });
    } else {
      highResImage.onload = afterReady;
    }
  }

  // ============================================
  // Schlanke Animation (wenige Schritte → schneller)
  // ============================================
  function startDePixelationAnimation(container) {
    const canvas = container.querySelector('.pixelation-canvas');
    const highResImage = container.imageObject;

    const steps = [8, 20, 40]; // klein → weniger CPU
    let i = 0;

    function tick() {
      if (i >= steps.length) {
        container.classList.add('is-loaded'); // Canvas per CSS ausblenden
        return;
      }
      drawPixelated(highResImage, canvas, steps[i]);
      i++;
      setTimeout(tick, 120);
    }
    tick();
  }

  // ============================================
  // Pixelations-Zeichenroutine (robust)
  // ============================================
  function drawPixelated(image, canvas, size) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return; // noch nicht gelayoutet
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    canvas.width  = w;
    canvas.height = h;

    const aspect = image.naturalHeight / image.naturalWidth;
    ctx.clearRect(0, 0, w, h);

    // Runterskalieren auf "size" und wieder hochziehen → Pixel-Effekt
    ctx.drawImage(image, 0, 0, size, size * aspect);
    ctx.drawImage(canvas, 0, 0, size, size * aspect, 0, 0, w, h);
  }

  // ============================================
  // Filter-Logik (mm / cm / m / km / all)
  // ============================================
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const filter = e.currentTarget.dataset.filter;
      if (filter === 'all' || !filter) {
        displayProjects(projects);
      } else {
        const filtered = projects.filter(p => p.scale === filter);
        displayProjects(filtered);
      }
    }, { passive: true });
  });

  // Initial render
  displayProjects(projects);
});
