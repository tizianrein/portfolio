/* js/project-detail.js */

// Globale Variablen
let allProjects = [];
let currentProject = null;
let currentImageIndex = 0;
let mediaList = []; 

// === 1. INITIALISIERUNG ===
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // [CHANGE 1] Use absolute path for data.json
        // Since we are deep in folders, we must use "/" to go to root
        const response = await fetch('/data.json'); 
        allProjects = await response.json();

        // [CHANGE 2] Get ID from URL Path (Folder Structure)
        // Looks for 3 digits (e.g. "023") inside the current URL
        const path = window.location.pathname;
        const idMatch = path.match(/(\d{3})/); 
        const projectId = idMatch ? idMatch[1] : null;

        if (projectId) {
            currentProject = allProjects.find(p => p.id === projectId);
        }

        // Fallback
        if (!currentProject && allProjects.length > 0) {
            // Optional: Redirect to home or handle error
            console.warn("Project ID not found in URL, loading first project as fallback.");
            currentProject = allProjects[0];
        }

        if (currentProject) {
            // 1. Bilder kopieren
            mediaList = [...(currentProject.images || [])];

            // 2. Video einfügen (als Objekt mit Poster!)
            if (currentProject.video && currentProject.video.src) {
                const insertPos = currentProject.video.insertAt || 1; 
                
                const videoObj = {
                    src: currentProject.video.src,
                    poster: currentProject.video.poster || null, 
                    type: 'video'
                };
                
                mediaList.splice(insertPos, 0, videoObj);
            }

            initPage();
        } else {
            document.querySelector('#project-description').innerHTML = "Projekt nicht gefunden.";
        }

    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
});

// === 2. SEITE AUFBAUEN ===
function initPage() {
    renderText();
    renderThumbnails();
    setupFooterNav();
    setupLanguageSwitcher();
    setupKeyboardNav();
    setupTouchGestures(); 
    setupMobileMenu();
}

function renderText() {
    const lang = localStorage.getItem('userLanguage') || 'de';
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const data = currentProject[lang] || currentProject.en;
    const title = data.title;
    const desc = data.description; 

    // === SEO UPDATE START ===
    document.title = "Tizian Rein - " + title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
    }
    const plainTextDesc = desc.replace(/<[^>]*>?/gm, ' ').substring(0, 160) + "...";
    metaDesc.content = plainTextDesc;
    // === SEO UPDATE END ===

    const container = document.getElementById('project-description');
    
    container.innerHTML = `
        <span class="project-id-block">${currentProject.id}</span>
        <span class="project-title-block">${title}</span>
        <div class="info-text">
            ${desc}
        </div>
    `;

    const overlayTitle = document.getElementById('fs-project-title');
    if(overlayTitle) overlayTitle.innerText = title;
    
    const mobTitle = document.getElementById('fs-mob-title');
    if(mobTitle) mobTitle.innerText = title;
}

function createMediaElement(resource, isThumbnail = false, altText = "") {
    let src = resource;
    let poster = null;

    if (typeof resource === 'object' && resource !== null) {
        src = resource.src;
        poster = resource.poster;
    }

    // 1. Video
    if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov')) {
        const video = document.createElement('video');
        
        if (poster) video.poster = poster;
        if (altText) video.title = altText;

        if (isThumbnail) {
            video.className = 'thumb-video'; 
            video.autoplay = false;
            video.muted = true;
            video.controls = false;
            video.loop = false;
            video.preload = "metadata"; 
            
            video.onmouseover = () => video.play();
            video.onmouseout = () => { video.pause(); video.currentTime = 0; };
            
        } else {
            video.className = 'fs-img';
            video.autoplay = true;   
            video.muted = false;     
            video.controls = true;   
            video.loop = false;
            video.preload = "auto";
        }

        video.src = src;
        video.playsInline = true; 
        return video;
    }

    // 2. Iframe
    if (src.includes('youtube') || src.includes('vimeo')) {
        if (isThumbnail) {
            const div = document.createElement('div');
            div.className = 'thumb-iframe-placeholder';
            div.innerHTML = '<span>▶</span>'; 
            div.setAttribute('aria-label', altText);
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.background = '#eee';
            div.style.width = '100%';
            div.style.height = '100%';
            return div;
        }

        const iframe = document.createElement('iframe');
        iframe.className = 'fs-img';
        iframe.title = altText;
        let finalSrc = src;
        if (src.includes('vimeo') && !src.includes('?')) {
            finalSrc += '?autoplay=1&loop=1&background=1&muted=1';
        }
        iframe.src = finalSrc;
        iframe.frameBorder = '0';
        iframe.allow = "autoplay; fullscreen";
        return iframe;
    }

    // 3. Bild
    const img = document.createElement('img');
    if (!isThumbnail) img.className = 'fs-img';
    
    img.src = src;
    
    if (altText) {
        img.alt = altText;
    } else {
        img.alt = "Tizian Rein Project Image";
    }
    
    return img;
}

function renderThumbnails() {
    const grid = document.getElementById('thumbnail-grid');
    if(!grid) return; // Safety check
    
    grid.innerHTML = '';

    if (mediaList.length === 0) return;

    const lang = localStorage.getItem('userLanguage') || 'de';
    const projectTitle = (currentProject[lang] || currentProject.en).title;

    mediaList.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-item';
        
        const num = document.createElement('span');
        num.className = 'thumb-index';
        num.innerText = `${currentProject.id}.${(index + 1).toString().padStart(2, '0')}`;
        
        const altString = `${projectTitle} - Ansicht ${index + 1} - ${currentProject.category} Tizian Rein`;

        const mediaEl = createMediaElement(item, true, altString); 
        
        wrapper.appendChild(num);
        wrapper.appendChild(mediaEl);

        wrapper.onclick = () => openGallery(index);
        grid.appendChild(wrapper);
    });
}

// [CHANGE 3] Fix Footer Navigation for Folder Structure
function setupFooterNav() {
    const currentIndex = allProjects.findIndex(p => p.id === currentProject.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = allProjects.length - 1;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= allProjects.length) nextIndex = 0;

    const prevProj = allProjects[prevIndex];
    const nextProj = allProjects[nextIndex];

    const prevLink = document.getElementById('prev-project-link');
    // Ensure we use the clean URL from data.json and add a leading slash
    if(prevLink) prevLink.href = '/' + prevProj.url + '/';
    
    const nextLink = document.getElementById('next-project-link');
    if(nextLink) nextLink.href = '/' + nextProj.url + '/';

    updateFooterLabels();
}

function updateFooterLabels() {
    const lang = localStorage.getItem('userLanguage') || 'de';
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');

    if (lang === 'de') {
        if(prevLabel) prevLabel.innerText = "Vorheriges Projekt";
        if(nextLabel) nextLabel.innerText = "Nächstes Projekt";
    } else {
        if(prevLabel) prevLabel.innerText = "Previous Project";
        if(nextLabel) nextLabel.innerText = "Next Project";
    }
}

// === GALERIE LOGIK (STACKING) ===
const overlay = document.getElementById('fs-overlay');
const stack = document.getElementById('fs-image-stack');

function openGallery(index) {
    currentImageIndex = index;
    if(overlay) overlay.classList.add('active');
    
    document.querySelectorAll('.thumb-video').forEach(v => {
        v.pause();
        v.currentTime = 0;
    });

    if(stack) {
        stack.innerHTML = '';
        updateFullscreenImage(true); 
    }
}

function closeGallery() {
    if(overlay) overlay.classList.remove('active');
    if(stack) setTimeout(() => { stack.innerHTML = ''; }, 300);
}

function nextImage() {
    if (mediaList.length === 0) return;
    currentImageIndex++;
    if (currentImageIndex >= mediaList.length) currentImageIndex = 0;
    updateFullscreenImage(false);
}

function prevImage() {
    if (mediaList.length === 0) return;
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = mediaList.length - 1;
    updateFullscreenImage(false);
}

function updateFullscreenImage(isInitial = false) {
    if(!stack) return;

    Array.from(stack.children).forEach(child => {
        if (child.tagName === 'VIDEO') {
            child.pause();
        }
    });

    const existingEl = Array.from(stack.children).find(el => parseInt(el.dataset.index) === currentImageIndex);
    let el;
    let isNew = false;

    if (existingEl) {
        el = existingEl;
        stack.appendChild(el); 
        
        if (el.tagName === 'VIDEO') {
            el.currentTime = 0;
            el.play().catch(e => console.log("Auto-Play prevented:", e));
        }
    } else {
        isNew = true;
        const item = mediaList[currentImageIndex];
        
        const lang = localStorage.getItem('userLanguage') || 'de';
        const projectTitle = (currentProject[lang] || currentProject.en).title;
        const altString = `${projectTitle} - Detail ${currentImageIndex + 1} - Tizian Rein`;

        el = createMediaElement(item, false, altString);
        el.dataset.index = currentImageIndex; 
        stack.appendChild(el);
    }

    Array.from(stack.children).forEach(child => {
        child.style.zIndex = '1'; 
    });
    el.style.zIndex = '60'; 

    let scale = 1;
    if (!isInitial) {
        scale = (0.80 + Math.random() * 0.25).toFixed(3);
    }
    el.style.transform = `scale(${scale})`;

    if (isNew) {
        el.style.opacity = '0';
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
            el.style.opacity = '1';
        });
    } else {
        el.style.opacity = '1';
    }

    if (stack.children.length > 10 && isNew) {
        const bottomEl = stack.firstElementChild;
        if (bottomEl !== el) {
            stack.removeChild(bottomEl);
        }
    }
}

function setupTouchGestures() {
    if(!overlay) return;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;

    overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    }, { passive: true });

    function handleGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX < 0) nextImage();
                else prevImage();
            }
        } else {
            if (deltaY > minSwipeDistance) {
                closeGallery();
            }
        }
    }
}

// === HELPERS & SETUP ===
window.closeGallery = closeGallery;
window.nextImage = nextImage;
window.prevImage = prevImage;

function setupLanguageSwitcher() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            localStorage.setItem('userLanguage', lang);
            renderText();
            updateFooterLabels();
            renderThumbnails(); 
        };
    });
}

function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (!overlay || !overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowDown') closeGallery(); 
    });
}

function setupMobileMenu() {
    const trigger = document.querySelector('.project-trigger');
    const submenu = document.querySelector('.mobile-submenu');

    if (trigger && submenu) {
        trigger.onclick = (e) => {
            if (e.target.tagName === 'A') return;
            e.stopPropagation(); 
            submenu.classList.toggle('active');
        };

        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target)) {
                submenu.classList.remove('active');
            }
        });
    }
}