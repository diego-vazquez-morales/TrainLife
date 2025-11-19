// misRutas.js - Funcionalidad para Mis Rutas Guardadas

document.addEventListener("DOMContentLoaded", function() {
    initializeMisRutas();
    setupEventListeners();
    lucide.createIcons();
});

/**
 * Inicializa la página de Mis Rutas
 */
function initializeMisRutas() {
    console.log('Mis Rutas cargado');
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botones ver detalles (múltiples rutas)
    const expandButtons = document.querySelectorAll(".expand-route");
    
    expandButtons.forEach(button => {
        button.addEventListener("click", function() {
            const routeId = this.getAttribute('data-route-id');
            const routeDetails = document.getElementById(`route-${routeId}-details`);
            const routeCard = this.closest('.route-card');
            
            if (routeDetails) {
                const isExpanded = routeDetails.style.display === 'block';
                
                if (isExpanded) {
                    routeDetails.style.display = 'none';
                    this.setAttribute('aria-expanded', 'false');
                    routeCard.classList.remove('route-card-expanded');
                    this.querySelector('span').textContent = 'Ver Detalles';
                } else {
                    routeDetails.style.display = 'block';
                    this.setAttribute('aria-expanded', 'true');
                    routeCard.classList.add('route-card-expanded');
                    this.querySelector('span').textContent = 'Ocultar Detalles';
                }
            }
        });
    });

    // Hover en tarjetas de rutas
    const routeCards = document.querySelectorAll(".route-card");
    routeCards.forEach(function(routeCard) {
        routeCard.addEventListener("mouseenter", function() {
            routeCard.classList.add("route-card-selected");
        });
        routeCard.addEventListener("mouseleave", function() {
            routeCard.classList.remove("route-card-selected");
        });
    });

    // Sidebar mobile toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Cerrar sidebar al hacer clic fuera en móvil
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // Cerrar sidebar al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
}
