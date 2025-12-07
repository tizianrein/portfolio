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
/* === FÜGE DIES AM ENDE VON js/project-detail.js EIN (Ersetze den vorherigen Block) === */

(function() {
    // Status-Variablen
    let state = {
        scale: 1,
        pX: 0,
        pY: 0,
        x: 0,
        y: 0
    };

    // Temporäre Variablen für die Geste
    let gesture = {
        startX: 0,
        startY: 0,
        startScale: 1,
        startDist: 0,
        // Für Focal Point Zoom
        midX: 0,
        midY: 0,
        isZooming: false,
        isPanning: false,
        wasInteracting: false // Flag um Klicks nach Zoom zu blockieren
    };

    const overlay = document.getElementById('fs-overlay');

    // Hilfsfunktion: Aktives Bild holen
    function getActiveImage() {
        const stack = document.getElementById('fs-image-stack');
        if (stack && stack.lastElementChild) {
            return stack.lastElementChild;
        }
        return null;
    }

    // Hilfsfunktion: Distanz zwischen 2 Fingern
    function getDistance(t1, t2) {
        return Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
    }

    // Hilfsfunktion: Mittelpunkt zwischen 2 Fingern
    function getMidpoint(t1, t2) {
        return {
            x: (t1.pageX + t2.pageX) / 2,
            y: (t1.pageY + t2.pageY) / 2
        };
    }

    // Transform anwenden
    function updateTransform(el) {
        if (!el) return;
        // Wir nutzen Matrix-ähnliche Logik mit Translate und Scale
        // WICHTIG: Im CSS muss .fs-img { transform-origin: 0 0; } stehen!
        el.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    }

    // Reset
    function resetZoom() {
        state = { scale: 1, pX: 0, pY: 0, x: 0, y: 0 };
        const el = getActiveImage();
        if (el) {
            el.style.transition = 'transform 0.3s ease';
            el.style.transform = '';
            setTimeout(() => { el.style.transition = ''; }, 300);
        }
        gesture.isZooming = false;
        gesture.isPanning = false;
        // Flag kurz halten, um Klicks beim Loslassen noch zu blocken
        setTimeout(() => { gesture.wasInteracting = false; }, 100);
    }

    if (overlay) {
        // === TOUCH START ===
        overlay.addEventListener('touchstart', function(e) {
            const el = getActiveImage();
            if (!el) return;

            // Transition ausschalten für direkte Reaktion
            el.style.transition = 'none';

            if (e.touches.length === 2) {
                // --- ZOOM START ---
                gesture.isZooming = true;
                gesture.wasInteracting = true;
                
                const t1 = e.touches[0];
                const t2 = e.touches[1];

                gesture.startDist = getDistance(t1, t2);
                gesture.startScale = state.scale;

                // Mittelpunkt der Finger berechnen
                const mid = getMidpoint(t1, t2);
                
                // Wir speichern, wo wir "gegriffen" haben relativ zum aktuellen Bild
                gesture.midX = mid.x;
                gesture.midY = mid.y;
                
                // Position speichern vor dem neuen Zoom
                gesture.startX = state.x;
                gesture.startY = state.y;

                e.preventDefault();
            } 
            else if (e.touches.length === 1 && state.scale > 1.05) {
                // --- PANNING START (Nur wenn schon gezoomt) ---
                gesture.isPanning = true;
                gesture.wasInteracting = true;
                gesture.startX = e.touches[0].pageX - state.x;
                gesture.startY = e.touches[0].pageY - state.y;
                // Kein preventDefault hier, falls es doch ein Tap sein soll? 
                // Doch, um Scrollen zu verhindern. Klick wird später simuliert falls keine Bewegung war.
                // Aber wir blocken hier Browser-Scroll:
                e.preventDefault(); 
            }
        }, { passive: false });

        // === TOUCH MOVE ===
        overlay.addEventListener('touchmove', function(e) {
            const el = getActiveImage();
            if (!el) return;

            if (gesture.isZooming && e.touches.length === 2) {
                e.preventDefault();

                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const newDist = getDistance(t1, t2);
                
                // Skalierungsfaktor der aktuellen Geste
                const scaleChange = newDist / gesture.startDist;
                
                // Neuer absoluter Scale
                let newScale = gesture.startScale * scaleChange;
                // Limits
                newScale = Math.min(Math.max(1, newScale), 5);

                // Focal Point Logik:
                // Das Bild soll sich so verschieben, dass der Punkt zwischen den Fingern (midX, midY)
                // an der gleichen Stelle auf dem Bildschirm bleibt.
                const mid = getMidpoint(t1, t2);
                
                // Wie viel hat sich der Mittelpunkt bewegt?
                const moveX = mid.x - gesture.midX;
                const moveY = mid.y - gesture.midY;

                // Mathe für Zoom zum Punkt:
                // Alte Pos + Bewegung + (Mittelpunkt - Alte Pos) * (1 - Wachstumsfaktor)
                // Es ist einfacher, das Delta zu berechnen:
                
                // Position berechnen:
                // StartPos + Verschiebung der Finger + Zoom-Korrektur
                // (Das ist eine vereinfachte Focal-Point Rechnung, funktioniert aber meist gut)
                const ratio = 1 - (newScale / gesture.startScale);
                
                state.x = gesture.startX + (mid.x - gesture.startX) * ratio + moveX;
                state.y = gesture.startY + (mid.y - gesture.startY) * ratio + moveY;
                state.scale = newScale;

                updateTransform(el);
            }
            else if (gesture.isPanning && e.touches.length === 1) {
                e.preventDefault();
                state.x = e.touches[0].pageX - gesture.startX;
                state.y = e.touches[0].pageY - gesture.startY;
                updateTransform(el);
            }
        }, { passive: false });

        // === TOUCH END ===
        overlay.addEventListener('touchend', function(e) {
            // Wenn alle Finger weg sind
            if (e.touches.length === 0) {
                const el = getActiveImage();
                
                // Snap Back, wenn scale < 1
                if (state.scale < 1.1) {
                    resetZoom();
                } else {
                    // Limits beim Panning (damit man das Bild nicht wegwerfen kann)
                    // (Optional: Hier könnte man Grenzen berechnen)
                }

                gesture.isZooming = false;
                gesture.isPanning = false;

                // WICHTIG: Flag erst verzögert löschen, damit nachfolgende Klick-Events
                // (die der Browser 300ms später feuert) geblockt werden können.
                setTimeout(() => {
                    gesture.wasInteracting = false;
                }, 300); // 300ms Puffer
            }
        });

        // === KLICKS ABFANGEN ===
        // Wir fangen ALLE Klicks im Overlay ab.
        // Wenn gerade gezoomt wurde, stoppen wir den Klick (kein Close, kein Next).
        // Wenn nicht gezoomt wurde, müssen wir entscheiden, was passiert.
        overlay.addEventListener('click', function(e) {
            
            // 1. Wenn wir gerade gezoomt/bewegt haben -> BLOCKIEREN
            if (gesture.wasInteracting || state.scale > 1.1) {
                e.stopPropagation();
                e.preventDefault();
                console.log("Klick blockiert wegen Zoom");
                return false;
            }

            // 2. Normale Navigation Logik (Tap links/rechts)
            // Da wir .click-zone auf pointer-events: none gesetzt haben (für Touch),
            // müssen wir jetzt manuell berechnen, ob links oder rechts getippt wurde.
            
            // Nur wenn KEIN Zoom aktiv ist:
            const width = window.innerWidth;
            const clickX = e.clientX;

            // Klick auf Close Button? (Muss manuell geprüft werden, da im Overlay)
            // Prüfen ob das Target ein Close-Button ist oder darin liegt
            if (e.target.closest('.fs-close-right') || e.target.closest('.fs-corner')) {
                // Close Button Logik lassen wir durch (Browser bubbling)
                return; 
            }

            // Zone Links (0 - 30% der Breite) -> Zurück
            if (clickX < width * 0.3) {
                window.prevImage();
            } 
            // Zone Rechts (70% - 100% der Breite) -> Vor
            else if (clickX > width * 0.7) {
                window.nextImage();
            }
            // Mitte -> Optional: Close oder nichts
            else {
                // closeGallery(); // Oder nichts tun
            }

        }, true); // Use Capture phase to catch it early
    }


    // === NAVIGATION ÜBERSCHREIBEN (Sicherheitshalber) ===
    const originalNext = window.nextImage;
    window.nextImage = function() {
        if (state.scale > 1.1) return; // Blockieren
        resetZoom();
        if (originalNext) originalNext();
    };

    const originalPrev = window.prevImage;
    window.prevImage = function() {
        if (state.scale > 1.1) return; // Blockieren
        resetZoom();
        if (originalPrev) originalPrev();
    };

    const originalClose = window.closeGallery;
    window.closeGallery = function() {
        resetZoom();
        if (originalClose) originalClose();
    };

})();