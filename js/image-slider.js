// js/image-slider.js

document.addEventListener('DOMContentLoaded', () => {
    const profileImageContainer = document.getElementById('profile-image-container');
    if (!profileImageContainer) return;

    const fullResImage = profileImageContainer.querySelector('.full-res-image');
    
    // Define your gallery images here.
    const galleryImages = [
        "images/about/profile.jpg",
        "images/about/profile_2.jpg", // Make sure these image paths are correct
    ];

    let currentImageIndex = 0;
    const intervalTime = 5000; // 5 seconds
    let slideshowInterval;
    let isSlideshowActive = false;

    // --- REUSED PIXELATION FUNCTIONS ---
    function startDePixelationAnimation(e){
        const t = e.querySelector(".pixelation-canvas"), a = e.imageObject;
        let i = 1;
        e.dataset.animStarted = "1"; // Mark animation as started

        !function r(){
            if(i >= [4, 8, 16, 32].length) {
                // Animation finished
                e.classList.add("is-loaded"); // This will trigger canvas fade-out

                // **** KEY CHANGE ****
                // Start the slideshow ONLY after this first animation is done.
                if (!isSlideshowActive) {
                    isSlideshowActive = true;
                    // Use setTimeout for the first slide, then setInterval for subsequent ones
                    slideshowInterval = setTimeout(showNextImage, intervalTime);
                }
                return;
            }
            const n = [4, 8, 16, 32][i];
            drawPixelated(a, t, n);
            i++;
            setTimeout(r, 150);
        }()
    }

    function drawPixelated(e, t, a){
        const i = t.getContext("2d"), r = e.height / e.width;
        t.width = t.clientWidth; t.height = t.clientHeight;
        i.imageSmoothingEnabled = false;
        i.drawImage(e, 0, 0, a, a * r);
        i.drawImage(t, 0, 0, a, a * r, 0, 0, t.width, t.height);
    }
    
    // This function now ONLY prepares the static pixelated image. It does NOT start the animation.
    function prepareStaticPixelatedImage(e){
        const t = e.querySelector(".project-image-container"), a = t.querySelector(".pixelation-canvas"), i = t.querySelector(".full-res-image");
        const r = new Image();
        r.src = i.dataset.src;
        r.onload = () => {
            t.imageObject = r;
            const n = r.naturalHeight / r.naturalWidth;
            t.style.paddingTop = `${100 * n}%`;
            i.src = r.src;
            drawPixelated(r, a, 4); // Draw the initial, static pixelated state
        };
    }

    // --- HOVER LISTENERS & SLIDESHOW LOGIC ---
    function setupHoverListeners() {
        const e = window.matchMedia("(pointer: coarse)").matches;

        function triggerOnce(container) {
            if (container && container.imageObject && "1" !== container.dataset.animStarted) {
                startDePixelationAnimation(container);
            }
        }

        if (!e) { // For mouse-based devices
            profileImageContainer.addEventListener("pointerenter", () => triggerOnce(profileImageContainer), { passive: true, once: true });
            return;
        }

        // For touch-based devices
        let n = 0;
        window.addEventListener("touchmove", touchEvent => {
            const t = Date.now();
            if (!(t - n < 120)) {
                n = t;
                const o = touchEvent.touches && touchEvent.touches[0];
                if (!o) return;
                const s = document.elementFromPoint(o.clientX, o.clientY);
                if (!s) return;
                const container = s.closest("#profile-image-container");
                if (container) {
                    // Manually disable to ensure it only runs once for touch
                    if (!isSlideshowActive) {
                        triggerOnce(container);
                    }
                }
            }
        }, { passive: true });
    }

    function updateImageWithSlide(imagePath) {
        profileImageContainer.classList.add('sliding');
        fullResImage.classList.remove('slide-active');
        profileImageContainer.classList.add('slide-from-right');

        setTimeout(() => {
            fullResImage.src = imagePath;
            fullResImage.dataset.src = imagePath;

            const tempImage = new Image();
            tempImage.src = imagePath;
            tempImage.onload = () => {
                const aspectRatio = tempImage.naturalHeight / tempImage.naturalWidth;
                profileImageContainer.style.paddingTop = `${100 * aspectRatio}%`;
                profileImageContainer.imageObject = tempImage;

                requestAnimationFrame(() => {
                    fullResImage.classList.add('slide-active');
                    profileImageContainer.classList.remove('slide-from-right');
                    profileImageContainer.classList.remove('sliding');
                });
            };
        }, 50);
    }

    function showNextImage() {
        if (slideshowInterval) {
            clearTimeout(slideshowInterval); // Clear timeout/interval
        }

        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateImageWithSlide(galleryImages[currentImageIndex]);

        // Set the interval for the next slide
        slideshowInterval = setInterval(showNextImage, intervalTime);
    }

    // --- INITIALIZATION ---
    // 1. Prepare the static pixelated image on page load.
    prepareStaticPixelatedImage(profileImageContainer.closest(".project-item"));
    
    // 2. Set up the hover/touch listeners that will trigger the first animation and then start the slideshow.
    setupHoverListeners();
});