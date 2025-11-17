// MisViajes.js - Gestión de la página de Mis Viajes

// Datos de ejemplo de viajes
const mockTrips = [
    {
        id: 1,
        origin: 'Madrid',
        destination: 'Barcelona',
        date: '2024-03-20',
        time: '10:30',
        trainNumber: 'AVE 03025',
        status: 'confirmed',
        statusText: 'Confirmado',
        departureTime: '10:30',
        arrivalTime: '13:15',
        platform: '12',
        seat: '14A',
        duration: '2h 45min',
        price: '65.00'
    },
    {
        id: 2,
        origin: 'Sevilla',
        destination: 'Valencia',
        date: '2024-03-25',
        time: '14:45',
        trainNumber: 'AVE 05132',
        status: 'delayed',
        statusText: 'Retrasado',
        departureTime: '15:15',
        arrivalTime: '19:30',
        platform: '8',
        seat: '22B',
        duration: '4h 15min',
        delay: '30 min',
        price: '72.50'
    },
    {
        id: 3,
        origin: 'Bilbao',
        destination: 'Madrid',
        date: '2024-03-28',
        time: '09:00',
        trainNumber: 'ALVIA 00674',
        status: 'cancelled',
        statusText: 'Cancelado',
        departureTime: '09:00',
        arrivalTime: '13:45',
        platform: '-',
        seat: '8C',
        duration: '4h 45min',
        cancellationReason: 'Mantenimiento de vías',
        price: '58.00'
    },
    {
        id: 4,
        origin: 'Valencia',
        destination: 'Barcelona',
        date: '2024-04-02',
        time: '16:20',
        trainNumber: 'AVE 04018',
        status: 'pending',
        statusText: 'Pendiente',
        departureTime: '16:20',
        arrivalTime: '19:30',
        platform: 'Por confirmar',
        seat: '18D',
        duration: '3h 10min',
        price: '48.00'
    }
];

// Estado de la aplicación
let allTrips = [];
let filteredTrips = [];

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeMisViajes();
    setupEventListeners();
    lucide.createIcons();
});

/**
 * Inicializa la página de Mis Viajes
 */
function initializeMisViajes() {
    // Cargar viajes (en producción, esto vendría de una API)
    loadTrips();
    
    // Renderizar viajes
    renderTrips(allTrips);
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
    const btnSearchNew = document.querySelector('.btn-search-new');
    if (btnSearchNew) {
        btnSearchNew.addEventListener('click', () => {
            window.location.href = '/verRutas';
        });
    }

    // Botón del empty state
    const btnEmptyState = document.querySelector('.empty-state .btn-primary');
    if (btnEmptyState) {
        btnEmptyState.addEventListener('click', () => {
            window.location.href = '/verRutas';
        });
    }

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
 * Carga los viajes desde el servidor o mock data
 */
function loadTrips() {
    // En producción, esto haría una llamada a la API:
    // fetch('/api/misViajes')
    //     .then(response => response.json())
    //     .then(data => {
    //         allTrips = data;
    //         renderTrips(allTrips);
    //     })
    //     .catch(error => console.error('Error cargando viajes:', error));

    // Por ahora usamos datos de ejemplo
    allTrips = [...mockTrips];
    filteredTrips = [...allTrips];
}

/**
 * Maneja la búsqueda de viajes
 */
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredTrips = [...allTrips];
    } else {
        filteredTrips = allTrips.filter(trip => {
            return trip.origin.toLowerCase().includes(searchTerm) ||
                   trip.destination.toLowerCase().includes(searchTerm) ||
                   trip.trainNumber.toLowerCase().includes(searchTerm) ||
                   trip.statusText.toLowerCase().includes(searchTerm);
        });
    }
    
    renderTrips(filteredTrips);
}

/**
 * Renderiza la lista de viajes
 */
function renderTrips(trips) {
    const tripsGrid = document.getElementById('tripsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!tripsGrid || !emptyState) return;

    // Limpiar el grid
    tripsGrid.innerHTML = '';

    // Mostrar empty state si no hay viajes
    if (trips.length === 0) {
        emptyState.style.display = 'flex';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Renderizar cada viaje
    trips.forEach(trip => {
        const tripCard = createTripCard(trip);
        tripsGrid.appendChild(tripCard);
    });

    // Reinicializar iconos de Lucide
    lucide.createIcons();
}

/**
 * Crea una tarjeta de viaje
 */
function createTripCard(trip) {
    const card = document.createElement('div');
    card.className = 'trip-card';
    card.onclick = () => navigateToTripDetails(trip.id);

    // Generar el contenido del estado
    const statusIcon = getStatusIcon(trip.status);
    const statusClass = `status-${trip.status}`;

    // Generar alerta si el viaje está retrasado o cancelado
    let alertHTML = '';
    if (trip.status === 'delayed') {
        alertHTML = `
            <div class="trip-alert alert-delayed">
                <div class="trip-alert-title">Viaje retrasado ${trip.delay}</div>
                <a href="/ViajesDetalles?id=${trip.id}" class="trip-alert-link">
                    Ver alternativas <i data-lucide="arrow-right"></i>
                </a>
            </div>
        `;
    } else if (trip.status === 'cancelled') {
        alertHTML = `
            <div class="trip-alert alert-cancelled">
                <div class="trip-alert-title">${trip.cancellationReason || 'Viaje cancelado'}</div>
                <a href="/ViajesDetalles?id=${trip.id}" class="trip-alert-link">
                    Ver alternativas <i data-lucide="arrow-right"></i>
                </a>
            </div>
        `;
    }

    // Formatear la fecha
    const formattedDate = formatDate(trip.date);

    card.innerHTML = `
        <div class="trip-card-header">
            <h3 class="trip-route">${trip.origin} → ${trip.destination}</h3>
            <span class="status-badge ${statusClass}">
                <i data-lucide="${statusIcon}"></i>
                ${trip.statusText}
            </span>
        </div>

        <div class="trip-details">
            <div class="trip-detail-item">
                <i data-lucide="calendar"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="trip-detail-item">
                <i data-lucide="clock"></i>
                <span>${trip.departureTime} - ${trip.arrivalTime}</span>
            </div>
            <div class="trip-detail-item">
                <i data-lucide="train"></i>
                <span>${trip.trainNumber}</span>
            </div>
            <div class="trip-detail-item">
                <i data-lucide="armchair"></i>
                <span>Asiento ${trip.seat}</span>
            </div>
        </div>

        ${alertHTML}

        <button class="btn-view-details" onclick="event.stopPropagation(); navigateToTripDetails(${trip.id})">
            Ver detalles
            <i data-lucide="arrow-right"></i>
        </button>
    `;

    return card;
}

/**
 * Obtiene el icono correspondiente al estado del viaje
 */
function getStatusIcon(status) {
    const icons = {
        confirmed: 'check-circle',
        pending: 'clock',
        delayed: 'alert-circle',
        cancelled: 'x-circle'
    };
    return icons[status] || 'circle';
}

/**
 * Formatea una fecha en formato legible
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Navega a la página de detalles del viaje
 */
function navigateToTripDetails(tripId) {
    window.location.href = `/ViajesDetalles?id=${tripId}`;
}

/**
 * Filtra viajes por estado
 */
function filterByStatus(status) {
    if (status === 'all') {
        filteredTrips = [...allTrips];
    } else {
        filteredTrips = allTrips.filter(trip => trip.status === status);
    }
    renderTrips(filteredTrips);
}

/**
 * Ordena viajes por fecha
 */
function sortByDate(ascending = true) {
    filteredTrips.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return ascending ? dateA - dateB : dateB - dateA;
    });
    renderTrips(filteredTrips);
}

/**
 * Exporta funciones para uso global
 */
window.navigateToTripDetails = navigateToTripDetails;
window.filterByStatus = filterByStatus;
window.sortByDate = sortByDate;

// Debug: Log en consola
console.log('MisViajes.js cargado correctamente');
console.log('Viajes cargados:', allTrips.length);
