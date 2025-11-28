document.addEventListener('DOMContentLoaded', () => {

  // --- 1. DEFINE PROJECT ORDER & GLOBAL STATE VARIABLES ---
  const projectOrder = [
    '023', '022', '021', '020', '019', '018', '017', '016', '015', 
    '014', '013', '012', '011', '010', '009', '008', '007', '006', 
    '005', '004', '003', '002', '001'
  ];
  
  const projectGrid = document.getElementById('project-grid');
  
  // These will hold our data and current state once fetched.
  let fullProjectData = [];
  let activeFilter = 'all';

  // --- 3. REWRITTEN PROJECT DISPLAY AND FILTERING ---
  // This single function now handles filtering AND language changes.
  const displayProjects = () => {
    if (!projectGrid) return; // Exit if we're not on the main page

    // Determine the current language from localStorage.
    const lang = localStorage.getItem('userLanguage') || 'en';

    // 1. Filter the projects based on the active filter.
    const filteredData = activeFilter === 'all' 
      ? fullProjectData 
      : fullProjectData.filter(p => p.category === activeFilter);
    
    // 2. Clear the grid and display the filtered projects with the correct language.
    projectGrid.innerHTML = '';
    
    filteredData.forEach((project, index) => {
      const projectElement = document.createElement('a');
      projectElement.href = `projects/project.html?id=${project.id}`;
      projectElement.className = 'project-item';
      const layoutType = Math.floor(index / 2) % 2 === 0 ? 'a' : 'b';
      projectElement.classList.add(`layout-${layoutType}`);
      
      // *** KEY CHANGE HERE ***
      // We now select the title dynamically based on the current language (lang).
      const title = project[lang]?.title || project['en'].title; // Fallback to English

      projectElement.innerHTML = `
        <div class="project-image-container">
          <canvas class="pixelation-canvas"></canvas>
          <img 
            src="${project.thumbnail}"
            data-src="${project.thumbnail}"
            class="full-res-image"
            alt="${title}"
            loading="lazy"
            decoding="async">
        </div>
        <div class="project-info"><h3>${project.id}</h3><p>${title}</p></div>
      `;
      projectGrid.appendChild(projectElement);
    });

    // 3. Re-initialize the lazy loading and animations for the new items.
    setupImageLoading(filteredData.length);
  };

  // --- INITIAL DATA FETCHING ---
  const initializePage = async () => {
    if (!projectGrid) return;

    try {
      const response = await fetch('projects.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const allProjectsData = await response.json();

      const projectsDataMap = new Map(allProjectsData.map(p => [p.id, p]));

      // Populate our global variable `fullProjectData` in the correct order.
      fullProjectData = projectOrder
        .map(id => projectsDataMap.get(id))
        .filter(Boolean); // Filter out any IDs not found in the JSON

      // Setup filter button listeners
      const filterButtons = document.querySelectorAll('.work-submenu a, #nav-work, #nav-work-de');
      filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          activeFilter = e.target.dataset.filter || 'all';
          document.querySelectorAll('#nav-work, #nav-work-de').forEach(btn => btn.classList.add('active'));
          // Re-render the grid with the new filter
          displayProjects();
        });
      });
      
      // Initial display of all projects
      displayProjects();

    } catch (error) {
      console.error("Could not initialize project grid:", error);
      projectGrid.innerHTML = '<p style="text-align: center; color: red;">Error loading projects.</p>';
    }
  };

  // --- 2. UPDATED LANGUAGE SWITCHING LOGIC ---
  const setLanguage = (lang) => {
    if (lang !== 'de' && lang !== 'en') lang = 'en';
    
    const currentLang = localStorage.getItem('userLanguage');
    const languageHasChanged = currentLang !== lang;
    
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang-en], [data-lang-de]').forEach(el => {
      el.style.display = el.matches(`[data-lang-${lang}]`) ? '' : 'none';
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    localStorage.setItem('userLanguage', lang);

    // *** KEY CHANGE HERE ***
    // After changing the language, re-render the project grid.
    if (projectGrid) {
      displayProjects();
    }

    if (languageHasChanged && window.location.pathname.includes('/projects/project.html')) {
      location.reload();
    }
  };

  // Set initial language and add listeners
  const savedLang = localStorage.getItem('userLanguage');
  const userLang = navigator.language.substring(0, 2);
  setLanguage(savedLang || userLang);

  document.querySelectorAll('.lang-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      setLanguage(e.target.dataset.lang);
    });
  });

  // --- 4. IMAGE PIXELATION & LAZY LOADING LOGIC (Unchanged) ---
  function setupImageLoading(projectCount) {
      const BATCH_SIZE = 6;
      const MAX_CONCURRENT = 6;
      const OBS_THRESHOLD = 0.15;
      let io; let queue = []; let inFlight = 0;

      function setupLoadObserver(){if(io)io.disconnect();io=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const t=e.target.closest(".project-item");t&&enqueue(t)})},{threshold:OBS_THRESHOLD}),projectGrid.querySelectorAll(".project-image-container").forEach(e=>io.observe(e))}
      function primeFirstBatch(e){Array.from(projectGrid.querySelectorAll(".project-item")).slice(0,e).forEach(enqueue)}
      function enqueue(e){"1"!==e.dataset.queued&&(e.dataset.queued="1",queue.push(e),pump())}
      function pump(){for(;"1"===queue[0]?.dataset.loaded;)queue.shift();for(;inFlight<MAX_CONCURRENT&&queue.length;){const e=queue.shift();inFlight++,prepareInitialPixelatedImage(e).finally(()=>{inFlight--,pump()})}}
      function prepareInitialPixelatedImage(e){const t=e.querySelector(".project-image-container"),a=t.querySelector(".pixelation-canvas"),i=t.querySelector(".full-res-image");return"1"===t.dataset.loaded?Promise.resolve():new Promise(e=>{const r=new Image;r.src=i.dataset.src,r.onload=()=>{t.imageObject=r;const n=r.naturalHeight/r.naturalWidth;t.style.paddingTop=`${100*n}%`,i.src=r.src,drawPixelated(r,a,4),t.dataset.loaded="1",e()},r.onerror=()=>e()})}
      function setupHoverListeners(){const e=window.matchMedia("(pointer: coarse)").matches,t=document.querySelectorAll(".project-image-container"),a=document.querySelectorAll(".project-info");function i(e){e&&e.imageObject&&"1"!==e.dataset.animStarted&&(e.dataset.animStarted="1",startDePixelationAnimation(e))}function r(e){const t=e.closest(".project-item");return t?t.querySelector(".project-image-container"):null}if(!e){t.forEach(e=>e.addEventListener("pointerenter",()=>i(e),{passive:!0,once:!0})),a.forEach(e=>e.addEventListener("pointerenter",()=>{const t=r(e);t&&i(t)},{passive:!0,once:!0}));return}let n=0;window.addEventListener("touchmove",e=>{const t=Date.now();if(!(t-n<120)){n=t;const o=e.touches&&e.touches[0];if(!o)return;const s=document.elementFromPoint(o.clientX,o.clientY);if(!s)return;const c=s.closest(".project-image-container"),l=c||r(s);l&&i(l)}},{passive:!0})}
      function startDePixelationAnimation(e){const t=e.querySelector(".pixelation-canvas"),a=e.imageObject;let i=1;!function r(){if(i>=[4,8,16,32].length)return void e.classList.add("is-loaded");const n=[4,8,16,32][i];drawPixelated(a,t,n),i++,setTimeout(r,150)}()}
      function drawPixelated(e,t,a){const i=t.getContext("2d"),r=e.height/e.width;t.width=t.clientWidth,t.height=t.clientHeight,i.imageSmoothingEnabled=!1,i.drawImage(e,0,0,a,a*r),i.drawImage(t,0,0,a,a*r,0,0,t.width,t.height)}
      
      if (projectGrid) {
          setupHoverListeners();
          setupLoadObserver();
          primeFirstBatch(Math.min(BATCH_SIZE, projectCount));
      }
  }

  // --- START THE APPLICATION ---
  initializePage();
});

/* ========================================================= */
/* === PIXEL INVERSION TRAIL EFFECT ======================== */
/* ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create and append the canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'pixel-trail';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    // Configuration
    const FADE_DURATION = 2000; // How long the effect lasts (in ms)
    const GRID_SUBDIVISIONS = 4; // "One fourth of the width" -> 4 subdivisions
    const COLUMNS_COUNT = 6;     // Your main grid has 6 columns
    
    let activeCells = [];
    let cellSize = 50; // Will be calculated dynamically
    let gridOffsetX = 0;

    // 2. Function to resize canvas and calculate grid alignment
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Find the grid container to align our squares perfectly
        const container = document.querySelector('.grid-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(container);
            const paddingLeft = parseFloat(computedStyle.paddingLeft);
            const paddingRight = parseFloat(computedStyle.paddingRight);

            // Calculate the actual width of the content area
            const contentWidth = rect.width - paddingLeft - paddingRight;
            
            // Calculate width of one main column
            const columnWidth = contentWidth / COLUMNS_COUNT;
            
            // Your request: "Quadrant is one fourth of the width size of a column"
            cellSize = columnWidth / GRID_SUBDIVISIONS;
            
            // Calculate offset so squares align with the grid lines
            // rect.left might be negative if window is smaller than container, but usually it's positive or 0
            gridOffsetX = rect.left + paddingLeft;
        }
    }

    // 3. Animation Loop
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const now = Date.now();
        
        // Loop backwards so we can remove items cleanly
        for (let i = activeCells.length - 1; i >= 0; i--) {
            const cell = activeCells[i];
            const age = now - cell.time;
            
            if (age > FADE_DURATION) {
                // Remove cell if it's too old
                activeCells.splice(i, 1);
            } else {
                // Calculate opacity: starts at 1, fades to 0
                const opacity = 1 - (age / FADE_DURATION);
                
                // Draw the square
                // We draw WHITE. The CSS 'mix-blend-mode: difference' turns white into Inversion.
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fillRect(cell.x, cell.y, cellSize, cellSize); // Using squares (width = height)
            }
        }
        
        requestAnimationFrame(render);
    }

    // 4. Mouse Move Handler
    let lastGridX = -1;
    let lastGridY = -1;

    window.addEventListener('mousemove', (e) => {
        // Calculate which "grid cell" the mouse is currently over
        // We subtract gridOffsetX to align 0 with the start of the content
        const relativeX = e.clientX - gridOffsetX;
        
        const colIndex = Math.floor(relativeX / cellSize);
        const rowIndex = Math.floor(e.clientY / cellSize);

        // Optimization: Only add a new cell if we moved to a new coordinate
        if (colIndex !== lastGridX || rowIndex !== lastGridY) {
            
            // Snap the visual square to the grid
            const snapX = (colIndex * cellSize) + gridOffsetX;
            const snapY = rowIndex * cellSize;

            // Add to active cells
            activeCells.push({
                x: snapX,
                y: snapY,
                time: Date.now()
            });

            lastGridX = colIndex;
            lastGridY = rowIndex;
        }
    });

    // Initialize
    window.addEventListener('resize', handleResize);
    handleResize();
    requestAnimationFrame(render);
});