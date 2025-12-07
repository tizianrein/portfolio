/* === js/main.js === */

document.addEventListener("DOMContentLoaded", function() {
    
    // === MOBILE MENU TOGGLE ===
    // Sucht das Element mit der Klasse .project-trigger (Projekte unten rechts)
    const projTrigger = document.querySelector('.project-trigger');
    const projBtn = document.getElementById('mobile-proj-btn'); // Der Text "projekte"

    // Nur ausführen, wenn die Elemente auf der Seite existieren
    if (projTrigger) {
        // Event-Listener für den Klick auf den Container oder den Text
        projTrigger.addEventListener('click', function(e) {
            // Verhindert Standard-Verhalten, falls nötig
            // e.preventDefault(); 
            
            // Toggle die Klasse 'is-open'. 
            // In deinem CSS (style.css) musst du sicherstellen, dass:
            // .project-trigger.is-open .mobile-submenu { display: flex; }
            this.classList.toggle('is-open');
        });

        // Optional: Menü schließen, wenn man irgendwo anders hinklickt
        document.addEventListener('click', function(e) {
            // Wenn der Klick NICHT innerhalb des Projekt-Triggers war
            if (!projTrigger.contains(e.target)) {
                projTrigger.classList.remove('is-open');
            }
        });
    }
});