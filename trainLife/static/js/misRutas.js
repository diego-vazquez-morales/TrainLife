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
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botón ver detalles
    const verDetallesBton = document.getElementById("verDetalles");
    const routeDetails = document.querySelector(".route-details");
    
    if (verDetallesBton && routeDetails) {
        verDetallesBton.addEventListener("click", function() {
            routeDetails.classList.toggle("route-details-expanded");
        });
    }

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
