// notificaciones.js - Gestión de Notificaciones

// Datos de notificaciones
const notificaciones = [
    {
        id: 1,
        type: 'warning',
        title: 'Cambio de andén',
        message: 'Tu tren AVE 3012 Madrid → Barcelona saldrá desde el andén 12 en lugar del andén 8.',
        time: 'Hace 5 minutos',
        unread: true
    },
    {
        id: 2,
        type: 'success',
        title: 'Billete confirmado',
        message: 'Tu reserva para el viaje Sevilla → Valencia ha sido confirmada. Coche 04, Asiento 12A.',
        time: 'Hace 1 hora',
        unread: true
    },
    {
        id: 3,
        type: 'info',
        title: 'Recordatorio de viaje',
        message: 'Tu viaje a Barcelona es mañana a las 14:30. No olvides llegar 30 minutos antes.',
        time: 'Hace 3 horas',
        unread: false
    },
    {
        id: 4,
        type: 'warning',
        title: 'Retraso en servicio',
        message: 'El tren AVE 2150 tiene un retraso estimado de 15 minutos.',
        time: 'Hace 1 día',
        unread: false
    },
    {
        id: 5,
        type: 'success',
        title: 'Ruta guardada',
        message: 'Has guardado exitosamente la ruta Madrid → Barcelona en tus favoritos.',
        time: 'Hace 2 días',
        unread: false
    },
    {
        id: 6,
        type: 'info',
        title: 'Oferta especial',
        message: 'Descuento del 20% en viajes AVE para el próximo mes. ¡Aprovecha ahora!',
        time: 'Hace 3 días',
        unread: false
    }
];

// Estado de la aplicación
let currentFilter = 'all';
let notificacionesState = [...notificaciones];

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeNotificaciones();
    setupEventListeners();
    lucide.createIcons();
});

/**
 * Inicializa la página de notificaciones
 */
function initializeNotificaciones() {
    // Cargar notificaciones guardadas de localStorage si existen
    const savedNotifications = localStorage.getItem('notificaciones');
    if (savedNotifications) {
        notificacionesState = JSON.parse(savedNotifications);
    }

    renderNotifications();
    updateUnreadBadge();
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            handleFilterChange(filter);
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

/**
 * Maneja el cambio de filtro
 */
function handleFilterChange(filter) {
    currentFilter = filter;

    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });

    renderNotifications();
}

/**
 * Renderiza las notificaciones según el filtro activo
 */
function renderNotifications() {
    const container = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    if (!container || !emptyState) return;

    // Filtrar notificaciones
    let filteredNotifications = [...notificacionesState];
    
    if (currentFilter === 'unread') {
        filteredNotifications = filteredNotifications.filter(n => n.unread);
    } else if (currentFilter === 'alerts') {
        filteredNotifications = filteredNotifications.filter(n => n.type === 'warning');
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Mostrar empty state si no hay notificaciones
    if (filteredNotifications.length === 0) {
        emptyState.style.display = 'flex';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Renderizar cada notificación
    filteredNotifications.forEach(notif => {
        const item = createNotificationItem(notif);
        container.appendChild(item);
    });

    // Reinicializar iconos de Lucide
    lucide.createIcons();
}

/**
 * Crea un elemento de notificación
 */
function createNotificationItem(notif) {
    const item = document.createElement('div');
    item.className = `notification-item ${notif.unread ? 'unread' : ''}`;
    item.onclick = () => handleNotificationClick(notif.id);

    // Icono según tipo
    const iconMap = {
        success: 'check-circle',
        warning: 'alert-circle',
        info: 'info'
    };

    item.innerHTML = `
        <div class="notification-icon ${notif.type}">
            <i data-lucide="${iconMap[notif.type]}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-header">
                <h3 class="notification-title">${notif.title}</h3>
                ${notif.unread ? '<span class="unread-indicator"></span>' : ''}
            </div>
            <p class="notification-message">${notif.message}</p>
            <div class="notification-time">
                <i data-lucide="clock"></i>
                <span>${notif.time}</span>
            </div>
        </div>
        <i data-lucide="chevron-right" class="notification-arrow"></i>
    `;

    return item;
}

/**
 * Maneja el clic en una notificación
 */
function handleNotificationClick(id) {
    // Marcar como leída
    notificacionesState = notificacionesState.map(n => 
        n.id === id ? { ...n, unread: false } : n
    );

    saveNotifications();
    renderNotifications();
    updateUnreadBadge();

    console.log('Notificación clickeada:', id);
}

/**
 * Marca todas las notificaciones como leídas
 */
function markAllAsRead() {
    notificacionesState = notificacionesState.map(n => ({ ...n, unread: false }));
    
    saveNotifications();
    renderNotifications();
    updateUnreadBadge();

    console.log('Todas las notificaciones marcadas como leídas');
}

/**
 * Actualiza el badge de notificaciones no leídas
 */
function updateUnreadBadge() {
    const badge = document.getElementById('unreadBadge');
    if (!badge) return;

    const unreadCount = notificacionesState.filter(n => n.unread).length;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Guarda notificaciones en localStorage
 */
function saveNotifications() {
    localStorage.setItem('notificaciones', JSON.stringify(notificacionesState));
}

/**
 * Añade una nueva notificación (función auxiliar)
 */
function addNotification(type, title, message) {
    const newNotification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: 'Ahora',
        unread: true
    };

    notificacionesState.unshift(newNotification);
    saveNotifications();
    renderNotifications();
    updateUnreadBadge();
}

/**
 * Exporta funciones para uso global
 */
window.markAllAsRead = markAllAsRead;
window.addNotification = addNotification;

// Debug: Log en consola
console.log('notificaciones.js cargado correctamente');
console.log('Notificaciones:', notificacionesState.length);
console.log('No leídas:', notificacionesState.filter(n => n.unread).length);
