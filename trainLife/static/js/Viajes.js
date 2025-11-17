// Viajes.js - Gestión de la página de Viajes

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeViajes();
    setupEventListeners();
    lucide.createIcons();
});

/**
 * Inicializa la página de Viajes
 */
function initializeViajes() {
    console.log('Página de Viajes inicializada');
    
    // Cargar estadísticas (en producción, esto vendría de una API)
    loadStats();
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
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

    // Event listeners para las tarjetas de opciones
    setupOptionCards();
}

/**
 * Configura los event listeners para las tarjetas de opciones
 */
function setupOptionCards() {
    const optionCards = document.querySelectorAll('.option-card');
    
    optionCards.forEach(card => {
        // Agregar efecto de hover adicional
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Carga las estadísticas desde el servidor o mock data
 */
function loadStats() {
    // En producción, esto haría una llamada a la API:
    // fetch('/api/viajesStats')
    //     .then(response => response.json())
    //     .then(data => {
    //         updateStats(data);
    //     })
    //     .catch(error => console.error('Error cargando estadísticas:', error));

    // Por ahora usamos datos de ejemplo
    const mockStats = {
        nextTrip: {
            origin: 'Madrid',
            destination: 'Barcelona',
            date: '25 Dic, 2023',
            time: '14:30h'
        },
        activeTrips: 3,
        savedRoutes: 3
    };

    console.log('Estadísticas cargadas:', mockStats);
}

/**
 * Actualiza las estadísticas en la interfaz
 */
function updateStats(stats) {
    // Actualizar próximo viaje
    if (stats.nextTrip) {
        const routeElement = document.querySelector('.stat-route');
        const dateElement = document.querySelector('.stat-date');
        
        if (routeElement) {
            routeElement.textContent = `${stats.nextTrip.origin} → ${stats.nextTrip.destination}`;
        }
        
        if (dateElement) {
            dateElement.textContent = `${stats.nextTrip.date} - ${stats.nextTrip.time}`;
        }
    }

    // Actualizar viajes activos
    if (stats.activeTrips !== undefined) {
        const activeTripsElement = document.querySelector('.stat-number');
        if (activeTripsElement) {
            activeTripsElement.textContent = stats.activeTrips;
        }
    }

    // Actualizar rutas guardadas
    if (stats.savedRoutes !== undefined) {
        const savedRoutesElements = document.querySelectorAll('.stat-number');
        if (savedRoutesElements.length > 1) {
            savedRoutesElements[1].textContent = stats.savedRoutes;
        }
    }
}

/**
 * Navega a la página de Mis Viajes
 */
function navigateToMisViajes() {
    window.location.href = '/misViajes';
}

/**
 * Navega a la página de Buscar Rutas
 */
function navigateToBuscarRutas() {
    window.location.href = '/verRutas';
}

/**
 * Maneja el clic en las tarjetas de estadísticas
 */
function handleStatCardClick(type) {
    switch(type) {
        case 'nextTrip':
            // Navegar a detalles del próximo viaje
            const nextTripId = 1; // ID del próximo viaje
            window.location.href = `/ViajesDetalles?id=${nextTripId}`;
            break;
        case 'activeTrips':
            // Navegar a la lista de viajes activos
            window.location.href = '/misViajes';
            break;
        case 'savedRoutes':
            // Navegar a las rutas guardadas
            window.location.href = '/MisRutas';
            break;
        default:
            console.warn('Tipo de estadística no reconocido:', type);
    }
}

/**
 * Añade interactividad a las tarjetas de estadísticas
 */
function makeStatCardsClickable() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', () => {
            const types = ['nextTrip', 'activeTrips', 'savedRoutes'];
            handleStatCardClick(types[index]);
        });
    });
}

/**
 * Muestra un mensaje de bienvenida si es la primera vez
 */
function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('viajesVisited');
    
    if (!hasVisited) {
        // Marcar como visitado
        localStorage.setItem('viajesVisited', 'true');
        
        // Aquí podrías mostrar un modal o tooltip de bienvenida
        console.log('¡Bienvenido a la sección de Viajes!');
    }
}

/**
 * Maneja los enlaces de navegación del sidebar
 */
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            item.classList.add('active');
        });
    });
}

/**
 * Añade animaciones de entrada
 */
function addEntryAnimations() {
    const elements = document.querySelectorAll('.option-card, .stat-card, .help-section');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Exporta funciones para uso global
 */
window.navigateToMisViajes = navigateToMisViajes;
window.navigateToBuscarRutas = navigateToBuscarRutas;
window.handleStatCardClick = handleStatCardClick;

// Ejecutar funciones adicionales después de la carga
setTimeout(() => {
    makeStatCardsClickable();
    showWelcomeMessage();
    addEntryAnimations();
}, 100);

// Debug: Log en consola
console.log('Viajes.js cargado correctamente');
