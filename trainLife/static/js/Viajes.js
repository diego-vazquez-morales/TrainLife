// Viajes.js - Gestión de la página de Viajes
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Botón "Ver mis viajes" - Redirigir a la página de mis viajes
    const botonMisViajes = document.querySelectorAll('.card-btn')[0]; // Primer botón card-btn
    if (botonMisViajes && botonMisViajes.closest('.card-gradient-blue')) {
        botonMisViajes.addEventListener('click', function() {
            // Obtener el ID del usuario de la URL actual o desde un data attribute
            const urlParts = window.location.pathname.split('/');
            const usuarioId = urlParts[urlParts.indexOf('viajes') + 1];
            
            if (usuarioId) {
                window.location.href = `/misViajes/${usuarioId}/`;
            } else {
                // Fallback: intentar obtener desde sessionStorage o redirigir a login
                window.location.href = '/misViajes/';
            }
        });
    }
});
