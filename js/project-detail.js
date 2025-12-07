/* js/project-detail.js */

// Globale Variablen
let allProjects = [];
let currentProject = null;
let currentImageIndex = 0;
let mediaList = []; // Enthält Strings (Bilder) oder Objekte (Video)

// === 1. INITIALISIERUNG ===
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('projects.json');
        allProjects = await response.json();

        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');

        if (projectId) {
            currentProject = allProjects.find(p => p.id === projectId);
        }

        // Fallback
        if (!currentProject && allProjects.length > 0) {
            currentProject = allProjects[0];
        }

        if (currentProject) {
            // 1. Bilder kopieren
            mediaList = [...(currentProject.images || [])];

            // 2. Video einfügen (als Objekt mit Poster!)
            if (currentProject.video && currentProject.video.src) {
                const insertPos = currentProject.video.insertAt || 1; 
                
                // Wir speichern ein Objekt, um auch das Poster zu haben
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
    setupMobileMenu(); // <--- Menü initialisieren
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

/**
 * Erstellt Smart-Media-Elemente (Video/Bild/Iframe)
 */
function createMediaElement(resource, isThumbnail = false) {
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
    return img;
}

function renderThumbnails() {
    const grid = document.getElementById('thumbnail-grid');
    grid.innerHTML = '';

    if (mediaList.length === 0) return;

    mediaList.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-item';
        
        const num = document.createElement('span');
        num.className = 'thumb-index';
        num.innerText = `${currentProject.id}.${(index + 1).toString().padStart(2, '0')}`;
        
        const mediaEl = createMediaElement(item, true); 
        
        wrapper.appendChild(num);
        wrapper.appendChild(mediaEl);

        wrapper.onclick = () => openGallery(index);
        grid.appendChild(wrapper);
    });
}

function setupFooterNav() {
    const currentIndex = allProjects.findIndex(p => p.id === currentProject.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = allProjects.length - 1;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= allProjects.length) nextIndex = 0;

    const prevProj = allProjects[prevIndex];
    const nextProj = allProjects[nextIndex];

    const prevLink = document.getElementById('prev-project-link');
    if(prevLink) prevLink.href = `project.html?id=${prevProj.id}`;
    
    const nextLink = document.getElementById('next-project-link');
    if(nextLink) nextLink.href = `project.html?id=${nextProj.id}`;

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
    overlay.classList.add('active');
    
    // Sicherstellen, dass Thumbnails gestoppt sind
    document.querySelectorAll('.thumb-video').forEach(v => {
        v.pause();
        v.currentTime = 0;
    });

    // Beim ersten Öffnen Stack leeren
    stack.innerHTML = '';
    updateFullscreenImage(true); 
}

function closeGallery() {
    overlay.classList.remove('active');
    setTimeout(() => { stack.innerHTML = ''; }, 300);
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

/**
 * Zeigt das Bild an. (Mit Z-Index Fix und Video-Pause)
 */
function updateFullscreenImage(isInitial = false) {
    
    // 1. Alle Videos im Hintergrund pausieren
    Array.from(stack.children).forEach(child => {
        if (child.tagName === 'VIDEO') {
            child.pause();
        }
    });

    // 2. Element holen oder erstellen
    const existingEl = Array.from(stack.children).find(el => parseInt(el.dataset.index) === currentImageIndex);
    let el;
    let isNew = false;

    if (existingEl) {
        el = existingEl;
        stack.appendChild(el); // Ans Ende schieben
        
        if (el.tagName === 'VIDEO') {
            el.currentTime = 0;
            el.play().catch(e => console.log("Auto-Play prevented:", e));
        }
    } else {
        isNew = true;
        const item = mediaList[currentImageIndex];
        el = createMediaElement(item, false);
        el.dataset.index = currentImageIndex; 
        stack.appendChild(el);
    }

    // 3. Z-Index setzen (WICHTIG!)
    Array.from(stack.children).forEach(child => {
        child.style.zIndex = '1'; 
    });
    el.style.zIndex = '60'; // Aktuelles nach vorne

    // 4. Skalierung
    let scale = 1;
    if (!isInitial) {
        scale = (0.80 + Math.random() * 0.25).toFixed(3);
    }
    el.style.transform = `scale(${scale})`;

    // 5. Animation
    if (isNew) {
        el.style.opacity = '0';
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
            el.style.opacity = '1';
        });
    } else {
        el.style.opacity = '1';
    }

    // 6. Cleanup
    if (stack.children.length > 10 && isNew) {
        const bottomEl = stack.firstElementChild;
        if (bottomEl !== el) {
            stack.removeChild(bottomEl);
        }
    }
}

// === TOUCH GESTEN (Wischen) ===
function setupTouchGestures() {
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
            // Horizontal
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX < 0) nextImage();
                else prevImage();
            }
        } else {
            // Vertikal (nur nach unten = Schließen)
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
        };
    });
}

function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowDown') closeGallery(); 
    });
} // <--- HIER WAR DIE FEHLENDE KLAMMER!

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

/* === FÜGE DIES AM ENDE VON js/project-detail.js EIN === */

(function() {
    // Variablen für den Zoom-Status
    let currentScale = 1;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let isZooming = false;
    let isPanning = false;

    // Start-Werte für Gesten
    let startDist = 0;
    let startScale = 1;
    let startX = 0;
    let startY = 0;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    // Hilfsfunktion: Aktives Bild im Stack finden
    function getActiveImage() {
        const stack = document.getElementById('fs-image-stack');
        // Wir nehmen an, das letzte Element im Stack ist das sichtbare
        if (stack && stack.lastElementChild) {
            return stack.lastElementChild;
        }
        return null;
    }

    // Hilfsfunktion: Distanz zwischen zwei Fingern
    function getDistance(touches) {
        return Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY
        );
    }

    // Transformation anwenden
    function updateTransform(el) {
        if (el) {
            // Wichtig: transform-origin muss zentriert sein
            el.style.transformOrigin = "center center";
            el.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
        }
    }

    // Zoom zurücksetzen (wird beim Bildwechsel aufgerufen)
    function resetZoom() {
        const activeImg = getActiveImage();
        if (activeImg) {
            // Animation entfernen für Reset, damit es nicht springt
            activeImg.style.transition = 'none';
            activeImg.style.transform = '';
            // Timeout, um Transition wieder zu aktivieren (falls gewünscht)
            setTimeout(() => { activeImg.style.transition = ''; }, 50);
        }
        currentScale = 1;
        currentTranslateX = 0;
        currentTranslateY = 0;
        isZooming = false;
        isPanning = false;
    }

    // === TOUCH LOGIK INITIALISIEREN ===
    const overlay = document.getElementById('fs-overlay');
    if (overlay) {
        // 1. TOUCH START
        overlay.addEventListener('touchstart', function(e) {
            const activeImg = getActiveImage();
            if (!activeImg) return;

            // Zwei Finger = ZOOM Start
            if (e.touches.length === 2) {
                isZooming = true;
                startDist = getDistance(e.touches);
                startScale = currentScale;
                e.preventDefault(); // Browser Zoom verhindern
            } 
            // Ein Finger & bereits gezoomt = PAN (Verschieben) Start
            else if (e.touches.length === 1 && currentScale > 1.05) {
                isPanning = true;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
                initialTranslateX = currentTranslateX;
                initialTranslateY = currentTranslateY;
                // Hier kein preventDefault, damit Klicks theoretisch noch möglich wären, 
                // aber swipe wird abgefangen.
            }
        }, { passive: false });

        // 2. TOUCH MOVE
        overlay.addEventListener('touchmove', function(e) {
            const activeImg = getActiveImage();
            if (!activeImg) return;

            // Zoom Bewegung
            if (isZooming && e.touches.length === 2) {
                e.preventDefault();
                const newDist = getDistance(e.touches);
                const scaleFactor = newDist / startDist;
                // Skalierung berechnen (min 1, max 4)
                currentScale = Math.min(Math.max(1, startScale * scaleFactor), 4);
                updateTransform(activeImg);
            }
            // Pan Bewegung
            else if (isPanning && e.touches.length === 1) {
                e.preventDefault(); // Scrollen der Seite verhindern
                const dx = e.touches[0].pageX - startX;
                const dy = e.touches[0].pageY - startY;
                currentTranslateX = initialTranslateX + dx;
                currentTranslateY = initialTranslateY + dy;
                updateTransform(activeImg);
            }
        }, { passive: false });

        // 3. TOUCH END
        overlay.addEventListener('touchend', function(e) {
            if (e.touches.length === 0) {
                // Verzögerung beim Beenden des Zoom-Status, um Klicks direkt danach zu blockieren
                if (isZooming) {
                    setTimeout(() => { isZooming = false; }, 200);
                }
                isPanning = false;

                // Optional: Snap back wenn Skalierung sehr klein ist
                if (currentScale < 1.1) {
                    resetZoom();
                }
            }
        });
    }

    // === NAVIGATION ÜBERSCHREIBEN ===
    // Wir speichern deine originalen Funktionen (falls vorhanden)
    // und wickeln sie in eine Prüfung ein.

    // Next Image patchen
    const originalNext = window.nextImage;
    window.nextImage = function() {
        // Blockieren, wenn gezoomt ist
        if (currentScale > 1.1 || isZooming) {
            console.log("Navigation blockiert durch Zoom");
            return;
        }
        // Erst Reset, dann Original-Funktion
        resetZoom();
        if (typeof originalNext === 'function') originalNext();
    };

    // Prev Image patchen
    const originalPrev = window.prevImage;
    window.prevImage = function() {
        // Blockieren, wenn gezoomt ist
        if (currentScale > 1.1 || isZooming) {
            console.log("Navigation blockiert durch Zoom");
            return;
        }
        // Erst Reset, dann Original-Funktion
        resetZoom();
        if (typeof originalPrev === 'function') originalPrev();
    };

    // Gallery Close patchen (damit Zoom resettet wird beim Schließen)
    const originalClose = window.closeGallery;
    window.closeGallery = function() {
        resetZoom();
        if (typeof originalClose === 'function') originalClose();
    };

})();

