// MisViajes.js - Gestión de la página de Mis Viajes
// Los viajes se cargan desde Django, no desde datos simulados

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeMisViajes();
    setupEventListeners();
    
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/**
 * Inicializa la página de Mis Viajes
 */
function initializeMisViajes() {
    console.log('MisViajes.js cargado correctamente');
    // Los viajes ya están renderizados por Django
    // Solo inicializamos la funcionalidad de búsqueda
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Búsqueda de viajes
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Botón buscar nuevo viaje
    const btnSearchNew = document.getElementById('btnSearchNew');
    if (btnSearchNew) {
        btnSearchNew.addEventListener('click', () => {
            window.location.href = '/buscarRutas';
        });
    }

    // Botón del empty state
    const btnEmptySearch = document.getElementById('btnEmptySearch');
    if (btnEmptySearch) {
        btnEmptySearch.addEventListener('click', () => {
            window.location.href = '/buscarRutas';
        });
    }
}

/**
 * Maneja la búsqueda de viajes en tiempo real
 */
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const tripCards = document.querySelectorAll('.trip-card');
    let visibleCount = 0;

    tripCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Mostrar/ocultar empty state según resultados
    const emptyState = document.getElementById('emptyState');
    const tripsGrid = document.getElementById('tripsGrid');
    
    if (emptyState && tripsGrid) {
        if (visibleCount === 0 && searchTerm !== '') {
            // No hay resultados de búsqueda
            emptyState.querySelector('.empty-title').textContent = 'No se encontraron viajes';
            emptyState.querySelector('.empty-text').textContent = `No hay viajes que coincidan con "${searchTerm}"`;
            emptyState.style.display = 'flex';
            emptyState.setAttribute('aria-hidden', 'false');
        } else if (tripCards.length === 0) {
            // No hay viajes en absoluto
            emptyState.querySelector('.empty-title').textContent = 'No tienes viajes programados';
            emptyState.querySelector('.empty-text').textContent = 'Los billetes que compres aparecerán aquí.';
            emptyState.style.display = 'flex';
            emptyState.setAttribute('aria-hidden', 'false');
        } else {
            // Hay viajes visibles
            emptyState.style.display = 'none';
            emptyState.setAttribute('aria-hidden', 'true');
        }
    }
}

// Log en consola
console.log('MisViajes.js cargado - Viajes cargados desde Django');
