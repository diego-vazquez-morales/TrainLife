// notificaciones.js - Gestión de notificaciones en tiempo real

let currentFilter = 'all';
let notificaciones = [];

// Cargar notificaciones al iniciar
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    cargarNotificaciones();
    
    // Event listeners para filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Actualizar botones activos
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Cambiar filtro
            currentFilter = this.dataset.filter;
            cargarNotificaciones();
        });
    });
    
    // Event listener para marcar todas como leídas
    document.getElementById('markAllReadBtn').addEventListener('click', marcarTodasComoLeidas);
    
});

// Cargar notificaciones desde el servidor
function cargarNotificaciones() {
    const url = `/api/notificaciones/${USUARIO_ID}/?filtro=${currentFilter}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            notificaciones = data.notificaciones;
            actualizarBadge(data.no_leidas);
            renderizarNotificaciones();
        })
        .catch(error => {
            console.error('Error al cargar notificaciones:', error);
            mostrarError();
        });
}

// Actualizar badge de notificaciones no leídas
function actualizarBadge(count) {
    const badge = document.getElementById('unreadBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
}

// Renderizar notificaciones en el DOM
function renderizarNotificaciones() {
    const container = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    if (notificaciones.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        lucide.createIcons();
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    container.innerHTML = notificaciones.map(notif => crearNotificacionHTML(notif)).join('');
    
    // Actualizar iconos de Lucide
    lucide.createIcons();
    
    // Agregar event listeners para marcar como leída
    document.querySelectorAll('.notification-card').forEach(card => {
        card.addEventListener('click', function() {
            const notifId = parseInt(this.dataset.notifId);
            const notif = notificaciones.find(n => n.id === notifId);
            if (notif && !notif.leida) {
                marcarComoLeida(notifId);
            }
        });
    });
}

// Crear HTML para una notificación
function crearNotificacionHTML(notif) {
    const iconos = {
        'cambio_viaje': 'alert-circle',
        'nuevo_viaje': 'check-circle',
        'cancelacion': 'x-circle',
        'recordatorio': 'clock',
        'cambio_anden': 'map-pin',
        'cambio_hora': 'clock',
        'alerta': 'alert-triangle',
        'info': 'info',
        'cambio_ruta': 'alert-circle',
        'aviso_general': 'info'
    };
    
    const colores = {
        'cambio_viaje': 'warning',
        'nuevo_viaje': 'success',
        'cancelacion': 'danger',
        'recordatorio': 'info',
        'cambio_anden': 'warning',
        'cambio_hora': 'warning',
        'alerta': 'danger',
        'info': 'info',
        'cambio_ruta': 'warning',
        'aviso_general': 'info'
    };
    
    const icono = iconos[notif.tipo] || 'bell';
    const color = colores[notif.tipo] || 'default';
    const leidaClass = notif.leida ? '' : 'unread';
    
    const fecha = formatearFecha(notif.fechaCreacion);
    
    return `
        <div class="notification-card ${leidaClass}" 
             data-notif-id="${notif.id}" 
             role="listitem"
             aria-label="Notificación: ${notif.titulo}">
            ${!notif.leida ? '<div class="notification-unread-dot"></div>' : ''}
            <div class="notification-icon notification-icon-${color}">
                <i data-lucide="${icono}"></i>
            </div>
            <div class="notification-content">
                <h2 class="notification-title">${notif.titulo}</h2>
                <p class="notification-message">${notif.mensaje}</p>
                <span class="notification-time">
                    <i data-lucide="clock"></i>
                    ${fecha}
                </span>
            </div>
            <div class="notification-chevron">
                <i data-lucide="chevron-right"></i>
            </div>
        </div>
    `;
}

// Formatear fecha de forma legible
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return 'Ahora';
    } else if (diffMins < 60) {
        return `Hace ${diffMins} min`;
    } else if (diffHoras < 24) {
        return `Hace ${diffHoras}h`;
    } else if (diffDias < 7) {
        return `Hace ${diffDias}d`;
    } else {
        return fecha.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short' 
        });
    }
}

// Marcar una notificación como leída
function marcarComoLeida(notifId) {
    fetch(`/notificaciones/${USUARIO_ID}/marcar/${notifId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar estado local
            const notif = notificaciones.find(n => n.id === notifId);
            if (notif) {
                notif.leida = true;
            }
            
            // Recargar notificaciones para actualizar contador
            cargarNotificaciones();
        }
    })
    .catch(error => {
        console.error('Error al marcar notificación como leída:', error);
    });
}

// Marcar todas las notificaciones como leídas
function marcarTodasComoLeidas() {
    if (notificaciones.filter(n => !n.leida).length === 0) {
        return;
    }
    
    if (!confirm('¿Marcar todas las notificaciones como leídas?')) {
        return;
    }
    
    fetch(`/notificaciones/${USUARIO_ID}/marcar-todas/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cargarNotificaciones();
        }
    })
    .catch(error => {
        console.error('Error al marcar todas como leídas:', error);
    });
}

// Mostrar mensaje de error
function mostrarError() {
    const container = document.getElementById('notificationsList');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i data-lucide="alert-circle"></i>
            Error al cargar las notificaciones. Por favor, intenta de nuevo.
        </div>
    `;
    lucide.createIcons();
}

// Obtener cookie CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Auto-refrescar notificaciones cada 30 segundos
setInterval(() => {
    cargarNotificaciones();
}, 30000);
