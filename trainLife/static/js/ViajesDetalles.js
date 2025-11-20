/* ViajesDetalles.js
   Script para ViajesDetalles.html - Gestión de detalles del viaje
*/

// Mock data para los viajes
const viajesData = {
  '1': {
    fecha: '25 Mayo 2024',
    ruta: 'Madrid → Barcelona',
    tren: 'AVE 3012',
    estado: 'A tiempo',
    anden: '12',
    salida: '14:30',
    embarque: '14:10',
    coche: '04',
    asiento: '12A',
    clase: 'Turista',
    pasajero: 'Alex Doe',
    alerta: {
      titulo: 'Cambio de Andén',
      mensaje: 'El tren saldrá ahora desde el Andén 12.'
    },
    itinerario: [
      { nombre: 'Madrid - Puerta de Atocha', tipo: 'salida', hora: 'Salida 14:30 · Andén 12' },
      { nombre: 'Barcelona - Sants', tipo: 'llegada', hora: 'Llegada 17:30' }
    ]
  },
  '2': {
    fecha: '15 Noviembre 2023',
    ruta: 'Sevilla → Valencia',
    tren: 'AVE 2150',
    estado: 'Retrasado',
    anden: '2',
    salida: '09:00',
    embarque: '08:40',
    coche: '02',
    asiento: '8C',
    clase: 'Preferente',
    pasajero: 'Alex Doe',
    alerta: {
      titulo: 'Retraso en la salida',
      mensaje: 'El tren saldrá con 15 minutos de retraso.'
    },
    itinerario: [
      { nombre: 'Sevilla - Santa Justa', tipo: 'salida', hora: 'Salida 09:00 · Andén 2' },
      { nombre: 'Valencia - Joaquín Sorolla', tipo: 'llegada', hora: 'Llegada 13:30' }
    ]
  },
  '3': {
    fecha: '01 Octubre 2023',
    ruta: 'Bilbao → Madrid',
    tren: 'ALVIA 4020',
    estado: 'Cancelado',
    anden: '9',
    salida: '18:45',
    embarque: '18:25',
    coche: '06',
    asiento: '15B',
    clase: 'Turista',
    pasajero: 'Alex Doe',
    alerta: {
      titulo: 'Viaje Cancelado',
      mensaje: 'Este viaje ha sido cancelado. Contacta con atención al cliente para más información.'
    },
    itinerario: [
      { nombre: 'Bilbao - Abando', tipo: 'salida', hora: 'Salida 18:45 · Andén 9' },
      { nombre: 'Madrid - Chamartín', tipo: 'llegada', hora: 'Llegada 23:30' }
    ]
  },
  '4': {
    fecha: '10 Enero 2024',
    ruta: 'Valencia → Barcelona',
    tren: 'AVE 1890',
    estado: 'Pendiente',
    anden: '3',
    salida: '11:15',
    embarque: '10:55',
    coche: '03',
    asiento: '20D',
    clase: 'Turista',
    pasajero: 'Alex Doe',
    alerta: null,
    itinerario: [
      { nombre: 'Valencia - Joaquín Sorolla', tipo: 'salida', hora: 'Salida 11:15 · Andén 3' },
      { nombre: 'Barcelona - Sants', tipo: 'llegada', hora: 'Llegada 14:20' }
    ]
  }
};

// Estado de las notificaciones
let notificationsEnabled = true;

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
  console.log('ViajesDetalles.js cargado');
  
  // Inicializar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Obtener ID del viaje desde la URL
  const viajeId = getQueryParam('id') || '1';
  
  // Cargar datos del viaje
  loadViajeData(viajeId);
  
  // Configurar toggle de notificaciones
  setupNotificationsToggle();
});

/**
 * Obtener parámetro de la URL
 */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Cargar datos del viaje
 */
function loadViajeData(id) {
  const viaje = viajesData[id];
  
  if (!viaje) {
    console.error('Viaje no encontrado:', id);
    // Cargar datos por defecto
    loadDefaultData();
    return;
  }
  
  console.log('Cargando datos del viaje:', id, viaje);
  
  // Actualizar breadcrumb
  updateBreadcrumb(viaje.ruta);
  
  // Mostrar/ocultar alerta
  if (viaje.alerta) {
    showAlert(viaje.alerta.titulo, viaje.alerta.mensaje);
  } else {
    hideAlert();
  }
  
  // Actualizar información del ticket
  updateTicketInfo(viaje);
  
  // Actualizar itinerario
  updateItinerary(viaje.itinerario);
  
  // Recrear iconos de Lucide después de actualizar el DOM
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Actualizar breadcrumb
 */
function updateBreadcrumb(ruta) {
  const breadcrumbRuta = document.getElementById('breadcrumbRuta');
  if (breadcrumbRuta) {
    breadcrumbRuta.textContent = ruta.replace('→', '-');
  }
}

/**
 * Mostrar alerta
 */
function showAlert(titulo, mensaje) {
  const alertBox = document.getElementById('alertBox');
  const alertTitle = document.getElementById('alertTitle');
  const alertMessage = document.getElementById('alertMessage');
  
  if (alertBox && alertTitle && alertMessage) {
    alertTitle.textContent = titulo;
    alertMessage.textContent = mensaje;
    alertBox.style.display = 'flex';
  }
}

/**
 * Ocultar alerta
 */
function hideAlert() {
  const alertBox = document.getElementById('alertBox');
  if (alertBox) {
    alertBox.style.display = 'none';
  }
}

/**
 * Actualizar información del ticket
 */
function updateTicketInfo(viaje) {
  // Header
  document.getElementById('ticketDate').textContent = viaje.fecha;
  document.getElementById('ticketRoute').textContent = viaje.ruta;
  document.getElementById('ticketTrain').textContent = viaje.tren;
  
  // Status badge
  const statusBadge = document.getElementById('statusBadge');
  statusBadge.textContent = viaje.estado;
  statusBadge.className = 'status-badge ' + getStatusClass(viaje.estado);
  
  // Main details
  document.getElementById('platform').textContent = viaje.anden;
  document.getElementById('departure').textContent = viaje.salida;
  document.getElementById('boarding').textContent = viaje.embarque;
  document.getElementById('seatInfo').textContent = `${viaje.coche} / ${viaje.asiento}`;
  document.getElementById('class').textContent = viaje.clase;
  document.getElementById('passenger').textContent = viaje.pasajero;
}

/**
 * Obtener clase CSS para el estado
 */
function getStatusClass(estado) {
  const statusMap = {
    'A tiempo': 'status-ontime',
    'Retrasado': 'status-delayed',
    'Cancelado': 'status-cancelled',
    'Pendiente': 'status-pending'
  };
  
  return statusMap[estado] || 'status-ontime';
}

/**
 * Actualizar itinerario
 */
function updateItinerary(itinerario) {
  const itineraryList = document.getElementById('itineraryList');
  
  if (!itineraryList) return;
  
  // Limpiar lista
  itineraryList.innerHTML = '';
  
  // Agregar items
  itinerario.forEach((parada, index) => {
    const li = document.createElement('li');
    li.className = 'itinerary-item';
    
    // Crear icono
    const iconDiv = document.createElement('div');
    iconDiv.className = 'itinerary-icon';
    
    if (parada.tipo === 'salida') {
      iconDiv.classList.add('icon-departure');
      iconDiv.innerHTML = '<i data-lucide="train"></i>';
    } else if (parada.tipo === 'llegada') {
      iconDiv.classList.add('icon-arrival');
      iconDiv.innerHTML = '<i data-lucide="flag"></i>';
    } else {
      iconDiv.classList.add('icon-stop');
      iconDiv.innerHTML = '<span class="stop-dot"></span>';
    }
    
    // Crear contenido
    const nameP = document.createElement('p');
    nameP.className = 'itinerary-name';
    nameP.textContent = parada.nombre;
    
    const timeP = document.createElement('p');
    timeP.className = 'itinerary-time';
    timeP.textContent = parada.hora;
    
    li.appendChild(iconDiv);
    li.appendChild(nameP);
    li.appendChild(timeP);
    
    itineraryList.appendChild(li);
  });
  
  // Recrear iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Configurar toggle de notificaciones
 */
function setupNotificationsToggle() {
  const toggle = document.getElementById('notificationsToggle');
  
  if (toggle) {
    toggle.addEventListener('change', function() {
      notificationsEnabled = this.checked;
      toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
      console.log('Notificaciones:', notificationsEnabled ? 'activadas' : 'desactivadas');
      
      // Aquí se podría hacer una llamada al backend para guardar la preferencia
      // saveNotificationPreference(notificationsEnabled);
      
      // Mostrar feedback al usuario (opcional)
      showNotificationFeedback(notificationsEnabled);
    });
  }
}

/**
 * Mostrar feedback de notificaciones (opcional)
 */
function showNotificationFeedback(enabled) {
  // Implementar toast o mensaje temporal si se desea
  const message = enabled 
    ? 'Notificaciones activadas para este viaje' 
    : 'Notificaciones desactivadas para este viaje';
  
  console.log(message);
}

/**
 * Cargar datos por defecto si no se encuentra el viaje
 */
function loadDefaultData() {
  console.log('Cargando datos por defecto');
  
  // Ocultar alerta
  hideAlert();
  
  // Datos por defecto
  document.getElementById('ticketDate').textContent = 'Fecha no disponible';
  document.getElementById('ticketRoute').textContent = 'Ruta no disponible';
  document.getElementById('ticketTrain').textContent = 'N/A';
  document.getElementById('statusBadge').textContent = 'Pendiente';
  document.getElementById('platform').textContent = '--';
  document.getElementById('departure').textContent = '--:--';
  document.getElementById('boarding').textContent = '--:--';
  document.getElementById('seatInfo').textContent = '-- / --';
  document.getElementById('class').textContent = '--';
  document.getElementById('passenger').textContent = '--';
  
  // Limpiar itinerario
  const itineraryList = document.getElementById('itineraryList');
  if (itineraryList) {
    itineraryList.innerHTML = '<li class="itinerary-item"><p class="itinerary-name">No hay información de itinerario disponible</p></li>';
  }
}

/**
 * Función auxiliar para navegar
 */
function navigateTo(path) {
  window.location.href = path;
}

// Exponer funciones globalmente si es necesario
window.ViajesDetalles = {
  loadViajeData,
  navigateTo,
  viajesData
};

// Manejo de errores
window.addEventListener('error', function(e) {
  console.error('Error en ViajesDetalles.js:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Promise rechazada:', e.reason);
});
