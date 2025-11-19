// buscarRutas.js - Gestión de Buscar Rutas con Django

// Estado de la aplicación
let expandedRoute = null;

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeBuscarRutas();
    setupEventListeners();
    lucide.createIcons();
});

/**
 * Inicializa la página de Buscar Rutas
 */
function initializeBuscarRutas() {
    // Establecer fecha actual si no está establecida
    const fechaInput = document.getElementById('fecha');
    if (fechaInput && !fechaInput.value) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.value = today;
    }
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
}

/**
 * Alterna la expansión de una ruta
 */
function toggleExpand(id) {
    const routeCard = document.getElementById(`route-${id}`);
    if (!routeCard) return;
    
    const details = routeCard.querySelector('.route-details');
    const button = routeCard.querySelector('.btn-toggle');
    const icon = button.querySelector('i');
    
    if (details.style.display === 'none' || !details.style.display) {
        // Expandir
        details.style.display = 'block';
        button.innerHTML = '<i data-lucide="chevron-up"></i> Ocultar Detalles';
        expandedRoute = id;
    } else {
        // Contraer
        details.style.display = 'none';
        button.innerHTML = '<i data-lucide="chevron-down"></i> Ver Detalles';
        expandedRoute = null;
    }
    
    // Reinicializar iconos de Lucide
    lucide.createIcons();
}

/**
 * Guarda una ruta como favorita
 */
function guardarRuta(rutaId, nombreRuta, usuarioId) {
    // Confirmar antes de guardar
    if (!confirm(`¿Deseas agregar "${nombreRuta}" a tus rutas favoritas?`)) {
        return;
    }
    
    // Redirigir a la URL de Django para agregar la ruta
    window.location.href = `/agregarRutaFavorito/${usuarioId}/${rutaId}/`;
}

/**
 * Muestra el modal de éxito
 */
function showSuccessModal(titulo) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('modalMessage');
    
    if (modal && message) {
        message.innerHTML = `La ruta <strong>"${titulo}"</strong> se ha agregado exitosamente a tus favoritos.`;
        modal.style.display = 'flex';
        lucide.createIcons();
    }
}

/**
 * Cierra el modal de éxito
 */
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Exporta funciones para uso global
 */
window.toggleExpand = toggleExpand;
window.guardarRuta = guardarRuta;
window.closeSuccessModal = closeSuccessModal;

// Debug: Log en consola
console.log('buscarRutas.js cargado correctamente');
