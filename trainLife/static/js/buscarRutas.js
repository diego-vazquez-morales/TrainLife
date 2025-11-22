// buscarRutas.js - Funcionalidad para Buscar Rutas

document.addEventListener("DOMContentLoaded", function() {
    initializeBuscarRutas();
    setupEventListeners();
    lucide.createIcons();
});

/**
 * Inicializa la página de Buscar Rutas
 */
function initializeBuscarRutas() {
    console.log('Buscar Rutas cargado');
    
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botones de expandir/colapsar detalles
    const toggleButtons = document.querySelectorAll(".btn-toggle");
    toggleButtons.forEach(button => {
        button.addEventListener("click", function() {
            const routeCard = this.closest('.route-card');
            const routeId = routeCard.dataset.routeId;
            toggleExpand(routeId);
        });
    });

    // Botones de guardar en favoritos
    const saveButtons = document.querySelectorAll(".btn-save");
    saveButtons.forEach(button => {
        button.addEventListener("click", function() {
            const routeId = this.dataset.routeId;
            const routeName = this.dataset.routeName;
            const userId = this.dataset.userId;
            
            guardarRuta(routeId, routeName, userId);
        });
    });
}

/**
 * Obtiene el ID de usuario desde la URL
 */
function getUserId() {
    // Intentar obtener desde la URL: /buscar-rutas/{userId}/
    const pathParts = window.location.pathname.split('/');
    const userIdIndex = pathParts.findIndex(part => part === 'buscar-rutas') + 1;
    
    if (userIdIndex > 0 && pathParts[userIdIndex]) {
        return pathParts[userIdIndex];
    }
    
    return null;
}

/**
 * Expande o colapsa los detalles de una ruta
 * @param {number} routeId - ID de la ruta
 */
function toggleExpand(routeId) {
    const routeCard = document.getElementById(`route-${routeId}`);
    if (!routeCard) return;
    
    const detailsSection = routeCard.querySelector('.route-details');
    const toggleButton = routeCard.querySelector('.btn-toggle');
    const icon = toggleButton.querySelector('i');
    const buttonText = toggleButton.childNodes[toggleButton.childNodes.length - 1];
    
    if (detailsSection.style.display === 'none' || !detailsSection.style.display) {
        // Expandir
        detailsSection.style.display = 'block';
        routeCard.classList.add('expanded');
        icon.setAttribute('data-lucide', 'chevron-up');
        buttonText.textContent = ' Ocultar Detalles';
    } else {
        // Colapsar
        detailsSection.style.display = 'none';
        routeCard.classList.remove('expanded');
        icon.setAttribute('data-lucide', 'chevron-down');
        buttonText.textContent = ' Ver Detalles';
    }
    
    // Actualizar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Guarda una ruta en favoritos con confirmación
 * @param {number} routeId - ID de la ruta
 * @param {string} routeName - Nombre de la ruta
 * @param {number} userId - ID del usuario
 */
function guardarRuta(routeId, routeName, userId) {
    if (!userId) {
        console.error('Usuario no identificado');
        alert('Error: No se pudo identificar el usuario');
        return;
    }
    
    // Mostrar modal de confirmación
    if (window.confirmModal) {
        window.confirmModal.show({
            title: 'Añadir a Favoritos',
            message: `¿Deseas añadir "${routeName}" a tus rutas favoritas?`,
            confirmText: 'Sí, añadir',
            cancelText: 'Cancelar',
            type: 'info',
            onConfirm: () => {
                // Redirigir a la URL para guardar la ruta
                const saveUrl = `/agregarRutaFavorito/${userId}/${routeId}/`;
                window.location.href = saveUrl;
            }
        });
    } else {
        // Fallback al confirm nativo si el modal no está disponible
        if (confirm(`¿Añadir "${routeName}" a favoritos?`)) {
            const saveUrl = `/agregarRutaFavorito/${userId}/${routeId}/`;
            window.location.href = saveUrl;
        }
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
 * Muestra el modal de éxito
 * @param {string} message - Mensaje a mostrar
 */
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        
        // Actualizar iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Exponer funciones globalmente para compatibilidad con onclick
window.toggleExpand = toggleExpand;
window.guardarRuta = guardarRuta;
window.closeSuccessModal = closeSuccessModal;
window.showSuccessModal = showSuccessModal;
