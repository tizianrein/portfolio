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