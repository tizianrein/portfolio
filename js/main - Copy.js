document.addEventListener('DOMContentLoaded', () => {

    const projects = [
        { id: '053', title: 'Ipsum Dolor Sit', year: 2025, scale: 'mm', thumbnail: 'images/thumbnails/053-thumb.jpg' },
        { id: '052', title: 'Lorem Ipsum Amet', year: 2023, scale: 'm', thumbnail: 'images/thumbnails/052-thumb.jpg' },
        { id: '050', title: 'Sit Amet Dolor', year: 2024, scale: 'm', thumbnail: 'images/thumbnails/050-thumb.jpg' },
        { id: '049', title: 'Consectetur Adipiscing', year: 2019, scale: 'cm', thumbnail: 'images/thumbnails/049-thumb.jpg' },
        { id: '047', title: 'Sed Do Eiusmod', year: 2018, scale: 'cm', thumbnail: 'images/thumbnails/047-thumb.jpg' },
        { id: '046', title: 'Tempor Incididunt', year: 2016, scale: 'mm', thumbnail: 'images/thumbnails/046-thumb.jpg' }
    ];

    const projectGrid = document.getElementById('project-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    /**
     * Zeigt Projekte im 6-Spalten-Grid mit alternierendem Layout an.
     * @param {Array} projectsToDisplay - Ein Array von Projekt-Objekten.
     */
    function displayProjects(projectsToDisplay) {
        projectGrid.innerHTML = ''; // Leert das Grid zuerst

        projectsToDisplay.forEach((project, index) => {
            const projectElement = document.createElement('a');
            projectElement.href = `projects/project-${project.id}.html`;
            projectElement.className = 'project-item';
            projectElement.dataset.year = project.year;

            // Bestimmt, ob wir uns in einer geraden (0, 2, 4...) oder ungeraden (1, 3, 5...) Zeile befinden.
            // Math.floor(index / 2) gibt die Zeilennummer an (beginnend bei 0).
            // Der Modulo % 2 prüft, ob die Zeilennummer gerade oder ungerade ist.
            const layoutType = Math.floor(index / 2) % 2 === 0 ? 'a' : 'b';
            projectElement.classList.add(`layout-${layoutType}`);

            // Erstellt die inneren Elemente für Bild und Text.
            // Die Reihenfolge im DOM ist immer gleich, CSS steuert die Position.
            projectElement.innerHTML = `
                <div class="project-image">
                    <img src="${project.thumbnail}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h3>${project.id}</h3>
                    <p>${project.title}</p>
                </div>
            `;
            
            projectGrid.appendChild(projectElement);
        });
    }

    // --- Event Listeners (unverändert) ---
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

    // --- Initialisierung ---
    displayProjects(projects);
});