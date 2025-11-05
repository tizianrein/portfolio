document.addEventListener('DOMContentLoaded', () => {

  // --- 1. PROJECT DATA with CATEGORIES ---
  const projects = [
    { id: '023', title: 'From Structure to Action', year: 2025, category: 'research', thumbnail: 'images/thumbnails/053-thumb.jpg' },
    { id: '022', title: 'ZAKK Garden Chair', year: 2023, category: 'objects',  thumbnail: 'images/thumbnails/052-thumb.jpg' },
    { id: '021', title: 'Waldfriedhofskapelle Rhöndorf', year: 2023, category: 'architecture',  thumbnail: 'images/thumbnails/051-thumb.jpg' },
    { id: '020', title: 'Beamtenwohnung Bonn', year: 2024, category: 'architecture',  thumbnail: 'images/thumbnails/050-thumb.jpg' },
    { id: '019', title: 'Consectetur Adipiscing', year: 2019, category: 'objects', thumbnail: 'images/thumbnails/049-thumb.jpg' },
    { id: '018', title: 'Consectetur Adipiscing', year: 2019, category: 'objects', thumbnail: 'images/thumbnails/048-thumb.jpg' },
    { id: '017', title: 'Sed Do Eiusmod', year: 2018, category: 'research', thumbnail: 'images/thumbnails/047-thumb.jpg' },
    { id: '016', title: 'Versöhnungskirche Dachau', year: 2016, category: 'architecture', thumbnail: 'images/thumbnails/046-thumb.jpg' },
    { id: '015', title: 'Anamorphosen auf dem Ebertplatz', year: 2018, category: 'research', thumbnail: 'images/thumbnails/003-thumb.jpg' },
    { id: '014', title: 'From Structure to Action', year: 2025, category: 'research', thumbnail: 'images/thumbnails/053-thumb.jpg' },
    { id: '013', title: 'ZAKK Garden Chair', year: 2023, category: 'objects',  thumbnail: 'images/thumbnails/052-thumb.jpg' },
    { id: '012', title: 'Waldfriedhofskapelle Rhöndorf', year: 2023, category: 'architecture',  thumbnail: 'images/thumbnails/051-thumb.jpg' },
    { id: '011', title: 'Beamtenwohnung Bonn', year: 2024, category: 'architecture',  thumbnail: 'images/thumbnails/050-thumb.jpg' },
    { id: '010', title: 'Consectetur Adipiscing', year: 2019, category: 'objects', thumbnail: 'images/thumbnails/049-thumb.jpg' },
    { id: '009', title: 'Consectetur Adipiscing', year: 2019, category: 'objects', thumbnail: 'images/thumbnails/048-thumb.jpg' },
    { id: '008', title: 'Sed Do Eiusmod', year: 2018, category: 'research', thumbnail: 'images/thumbnails/047-thumb.jpg' },
    { id: '007', title: 'Versöhnungskirche Dachau', year: 2016, category: 'architecture', thumbnail: 'images/thumbnails/046-thumb.jpg' },
    { id: '006', title: 'Anamorphosen auf dem Ebertplatz', year: 2018, category: 'research', thumbnail: 'images/thumbnails/003-thumb.jpg' },
    { id: '005', title: 'From Structure to Action', year: 2025, category: 'research', thumbnail: 'images/thumbnails/053-thumb.jpg' },
    { id: '004', title: 'ZAKK Garden Chair', year: 2023, category: 'objects',  thumbnail: 'images/thumbnails/052-thumb.jpg' },
    { id: '003', title: 'Waldfriedhofskapelle Rhöndorf', year: 2023, category: 'architecture',  thumbnail: 'images/thumbnails/051-thumb.jpg' },
    { id: '002', title: 'Beamtenwohnung Bonn', year: 2024, category: 'architecture',  thumbnail: 'images/thumbnails/050-thumb.jpg' },
    { id: '001', title: 'Consectetur Adipiscing', year: 2019, category: 'objects', thumbnail: 'images/thumbnails/049-thumb.jpg' },
    ];

  const projectGrid = document.getElementById('project-grid');
  
// --- 2. LANGUAGE SWITCHING LOGIC ---
  const setLanguage = (lang) => {
      if (lang !== 'de' && lang !== 'en') lang = 'en'; // Default to English
      
      // === THIS IS THE MISSING PART ===
      // Get the current language BEFORE we change it.
      const currentLang = localStorage.getItem('userLanguage');
      // This will be true only if the new lang is different from the old one.
      const languageHasChanged = currentLang !== lang;
      
      // Set HTML lang attribute for accessibility
      document.documentElement.lang = lang;

      // Show/hide all elements with data-lang attributes
      document.querySelectorAll('[data-lang-en], [data-lang-de]').forEach(el => {
          if (el.matches(`[data-lang-${lang}]`)) {
              el.style.display = '';
          } else {
              el.style.display = 'none';
          }
      });

      // Update active state on language buttons
      document.querySelectorAll('.lang-btn').forEach(btn => {
          if (btn.dataset.lang === lang) {
              btn.classList.add('active');
          } else {
              btn.classList.remove('active');
          }
      });

      // Save the new chosen language to localStorage
      localStorage.setItem('userLanguage', lang);

      // Now this condition will work correctly because languageHasChanged is defined.
      if (languageHasChanged && window.location.pathname.includes('/projects/project.html')) {
          location.reload();
      }
  };

  // *** CHANGED: Check for a saved language first ***
  const savedLang = localStorage.getItem('userLanguage');
  const userLang = navigator.language.substring(0, 2);

  // Set initial language: 1st priority is saved choice, 2nd is browser default
  setLanguage(savedLang || userLang);

  // Add click listeners to all language buttons
  document.querySelectorAll('.lang-btn').forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault();
          setLanguage(e.target.dataset.lang);
      });
  });

// --- 3. PROJECT DISPLAY AND FILTERING ---
  // This section only runs if we are on the main portfolio page (where #project-grid exists)
  if (projectGrid) {
    const filterButtons = document.querySelectorAll('.work-submenu a, #nav-work, #nav-work-de');
    
    const displayProjects = (projectsToDisplay) => {
      projectGrid.innerHTML = '';
      if (!projectsToDisplay) return;

      projectsToDisplay.forEach((project, index) => {
        const projectElement = document.createElement('a');
        projectElement.href = `projects/project.html?id=${project.id}`;
        projectElement.className = 'project-item';
        const layoutType = Math.floor(index / 2) % 2 === 0 ? 'a' : 'b';
        projectElement.classList.add(`layout-${layoutType}`);
        projectElement.innerHTML = `
          <div class="project-image-container">
            <canvas class="pixelation-canvas"></canvas>
            <img data-src="${project.thumbnail}" class="full-res-image" alt="${project.title}" loading="lazy" decoding="async">
          </div>
          <div class="project-info"><h3>${project.id}</h3><p>${project.title}</p></div>
        `;
        projectGrid.appendChild(projectElement);
      });
      setupImageLoading();
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = e.target.dataset.filter;

        // CORRECTED LOGIC: Always ensure "work" is active on this page.
        document.querySelectorAll('#nav-work, #nav-work-de').forEach(btn => btn.classList.add('active'));

        if (filter === 'all' || !filter) {
          displayProjects(projects);
        } else {
          const filteredProjects = projects.filter(p => p.category === filter);
          displayProjects(filteredProjects);
        }
      });
    });

    // Initial display of all projects
    displayProjects(projects);
  }

  // --- 4. IMAGE PIXELATION & LAZY LOADING LOGIC (from original file) ---
  // This logic is reused for the project grid on the index page
  function setupImageLoading() {
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
          primeFirstBatch(Math.min(BATCH_SIZE, projects.length));
      }
  }
});