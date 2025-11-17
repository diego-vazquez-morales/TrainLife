// verRutas.js - Gestión de Buscar Rutas

// Rutas recomendadas
const rutasRecomendadas = [
    {
        id: 'rec-1',
        titulo: 'Madrid → Barcelona (AVE)',
        descripcion: 'Ruta rápida por alta velocidad, 3h 30min',
        imagenUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        salida: '09:00',
        llegada: '12:30',
        duracion: '3h 30m',
        precio: '€47.00',
        origen: 'Madrid - Atocha',
        destino: 'Barcelona - Sants',
        transbordos: 0,
        lineas: [
            {
                nombre: 'Línea Directa: Madrid a Barcelona',
                duracion: '3h 30m',
                salida: 'Madrid - Atocha',
                llegada: 'Barcelona - Sants',
                horaSalida: '09:00',
                horaLlegada: '12:30',
                compañia: 'Renfe AVE',
                andenSalida: '4A',
                andenLlegada: '2C'
            }
        ]
    },
    {
        id: 'rec-2',
        titulo: 'Madrid → Sevilla (AVE)',
        descripcion: 'Conexión directa de alta velocidad, 4h 30min',
        imagenUrl: 'https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?w=400&h=300&fit=crop',
        salida: '11:15',
        llegada: '15:45',
        duracion: '4h 30m',
        precio: '€39.50',
        origen: 'Madrid - Chamartín',
        destino: 'Sevilla - Santa Justa',
        transbordos: 0,
        lineas: [
            {
                nombre: 'Línea Directa: Madrid a Sevilla',
                duracion: '4h 30m',
                salida: 'Madrid - Chamartín',
                llegada: 'Sevilla - Santa Justa',
                horaSalida: '11:15',
                horaLlegada: '15:45',
                compañia: 'Renfe AVE',
                andenSalida: '3B',
                andenLlegada: '5A'
            }
        ]
    },
    {
        id: 'rec-3',
        titulo: 'Madrid → Valencia (AVE)',
        descripcion: 'Viaje directo a la costa mediterránea, 3h 20min',
        imagenUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        salida: '13:00',
        llegada: '16:20',
        duracion: '3h 20m',
        precio: '€44.00',
        origen: 'Madrid - Atocha',
        destino: 'Valencia - Joaquín Sorolla',
        transbordos: 0,
        lineas: [
            {
                nombre: 'Línea Directa: Madrid a Valencia',
                duracion: '3h 20m',
                salida: 'Madrid - Atocha',
                llegada: 'Valencia - Joaquín Sorolla',
                horaSalida: '13:00',
                horaLlegada: '16:20',
                compañia: 'Renfe AVE',
                andenSalida: '6C',
                andenLlegada: '1A'
            }
        ]
    },
    {
        id: 'rec-4',
        titulo: 'Barcelona → Málaga',
        descripcion: 'Con transbordo en Madrid, 4h 45min',
        imagenUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        salida: '15:30',
        llegada: '20:15',
        duracion: '4h 45m',
        precio: '€52.75',
        origen: 'Barcelona - Sants',
        destino: 'Málaga - María Zambrano',
        transbordos: 1,
        lineas: [
            {
                nombre: 'Línea 1: Barcelona a Madrid',
                duracion: '3h 00m',
                salida: 'Barcelona - Sants',
                llegada: 'Madrid - Atocha',
                horaSalida: '15:30',
                horaLlegada: '18:30',
                compañia: 'Renfe AVE',
                andenSalida: '2C',
                andenLlegada: '4A'
            },
            {
                nombre: 'Línea 2: Madrid a Málaga',
                duracion: '1h 45m',
                salida: 'Madrid - Atocha',
                llegada: 'Málaga - María Zambrano',
                horaSalida: '18:30',
                horaLlegada: '20:15',
                compañia: 'Renfe AVE',
                andenSalida: '5B',
                andenLlegada: '3D'
            }
        ]
    }
];

// Resultados de búsqueda
const resultadosBusqueda = [
    {
        id: '1',
        titulo: 'Madrid → Barcelona (Salida Temprana)',
        descripcion: 'Primera salida del día, 3h 15min',
        imagenUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        salida: '08:30',
        llegada: '11:45',
        duracion: '3h 15m',
        precio: '€45.50',
        origen: 'Madrid - Atocha',
        destino: 'Barcelona - Sants',
        transbordos: 0,
        lineas: [
            {
                nombre: 'Línea Directa: Madrid a Barcelona',
                duracion: '3h 15m',
                salida: 'Madrid - Atocha',
                llegada: 'Barcelona - Sants',
                horaSalida: '08:30',
                horaLlegada: '11:45',
                compañia: 'Renfe AVE',
                andenSalida: '3A',
                andenLlegada: '1C'
            }
        ]
    },
    {
        id: '2',
        titulo: 'Madrid → Barcelona (Media Mañana)',
        descripcion: 'Opción rápida, 3h 10min',
        imagenUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        salida: '10:00',
        llegada: '13:10',
        duracion: '3h 10m',
        precio: '€52.00',
        origen: 'Madrid - Atocha',
        destino: 'Barcelona - Sants',
        transbordos: 0,
        lineas: [
            {
                nombre: 'Línea Directa: Madrid a Barcelona',
                duracion: '3h 10m',
                salida: 'Madrid - Atocha',
                llegada: 'Barcelona - Sants',
                horaSalida: '10:00',
                horaLlegada: '13:10',
                compañia: 'Renfe AVE',
                andenSalida: '4B',
                andenLlegada: '2A'
            }
        ]
    },
    {
        id: '3',
        titulo: 'Madrid → Barcelona (Tarde)',
        descripcion: 'Salida vespertina, 3h 15min',
        imagenUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        salida: '14:15',
        llegada: '17:30',
        duracion: '3h 15m',
        precio: '€48.75',
        origen: 'Madrid - Atocha',
        destino: 'Barcelona - Sants',
        transbordos: 0,
        lineas: [
            {
                nombre: 'Línea Directa: Madrid a Barcelona',
                duracion: '3h 15m',
                salida: 'Madrid - Atocha',
                llegada: 'Barcelona - Sants',
                horaSalida: '14:15',
                horaLlegada: '17:30',
                compañia: 'Renfe AVE',
                andenSalida: '5C',
                andenLlegada: '3B'
            }
        ]
    },
    {
        id: '4',
        titulo: 'Madrid → Barcelona (Económica)',
        descripcion: 'Con transbordo en Zaragoza, 3h 30min - Tarifa reducida',
        imagenUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        salida: '16:45',
        llegada: '20:15',
        duracion: '3h 30m',
        precio: '€43.00',
        origen: 'Madrid - Atocha',
        destino: 'Barcelona - Sants',
        transbordos: 1,
        lineas: [
            {
                nombre: 'Línea 1: Madrid a Zaragoza',
                duracion: '1h 30m',
                salida: 'Madrid - Atocha',
                llegada: 'Zaragoza - Delicias',
                horaSalida: '16:45',
                horaLlegada: '18:15',
                compañia: 'Renfe AVE',
                andenSalida: '6A',
                andenLlegada: '2C'
            },
            {
                nombre: 'Línea 2: Zaragoza a Barcelona',
                duracion: '2h 00m',
                salida: 'Zaragoza - Delicias',
                llegada: 'Barcelona - Sants',
                horaSalida: '18:15',
                horaLlegada: '20:15',
                compañia: 'Renfe AVE',
                andenSalida: '3B',
                andenLlegada: '4D'
            }
        ]
    },
    {
        id: '5',
        titulo: 'Madrid → Barcelona (Nocturna)',
        descripcion: 'Última salida del día, 3h 20min',
        imagenUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        salida: '18:30',
        llegada: '21:50',
        duracion: '3h 20m',
        precio: '€50.25',
        origen: 'Madrid - Atocha',
        destino: 'Barcelona - Sants',
        transbordos: 0,
        lineas: [
            {
                nombre: 'Línea Directa: Madrid a Barcelona',
                duracion: '3h 20m',
                salida: 'Madrid - Atocha',
                llegada: 'Barcelona - Sants',
                horaSalida: '18:30',
                horaLlegada: '21:50',
                compañia: 'Renfe AVE',
                andenSalida: '2D',
                andenLlegada: '5A'
            }
        ]
    },
    {
        id: '6',
        titulo: 'Madrid → Barcelona (Madrugadora)',
        descripcion: 'Con transbordo en Tarragona, 3h 45min - Opción económica',
        imagenUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        salida: '06:15',
        llegada: '10:00',
        duracion: '3h 45m',
        precio: '€41.00',
        origen: 'Madrid - Atocha',
        destino: 'Barcelona - Sants',
        transbordos: 1,
        lineas: [
            {
                nombre: 'Línea 1: Madrid a Tarragona',
                duracion: '2h 30m',
                salida: 'Madrid - Atocha',
                llegada: 'Tarragona',
                horaSalida: '06:15',
                horaLlegada: '08:45',
                compañia: 'Renfe AVE',
                andenSalida: '1A',
                andenLlegada: '3C'
            },
            {
                nombre: 'Línea 2: Tarragona a Barcelona',
                duracion: '1h 15m',
                salida: 'Tarragona',
                llegada: 'Barcelona - Sants',
                horaSalida: '08:45',
                horaLlegada: '10:00',
                compañia: 'Renfe Regional',
                andenSalida: '2B',
                andenLlegada: '6D'
            }
        ]
    }
];

// Estado de la aplicación
let savedRoutes = new Set();
let expandedRoute = null;
let searchPerformed = false;

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
    // Establecer fecha actual
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.value = today;
    }

    // Cargar rutas guardadas de localStorage
    loadSavedRoutes();

    // Renderizar rutas recomendadas
    renderRecommendedRoutes();
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Form submit
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSubmit);
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
 * Carga rutas guardadas de localStorage
 */
function loadSavedRoutes() {
    const saved = localStorage.getItem('savedRouteIds');
    if (saved) {
        savedRoutes = new Set(JSON.parse(saved));
    }
}

/**
 * Guarda rutas en localStorage
 */
function saveSavedRoutes() {
    localStorage.setItem('savedRouteIds', JSON.stringify([...savedRoutes]));
}

/**
 * Maneja el submit del formulario
 */
function handleSubmit(e) {
    e.preventDefault();

    const origen = document.getElementById('origen').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const fecha = document.getElementById('fecha').value;

    if (!origen || !destino || !fecha) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
    }

    console.log('Buscando rutas:', { origen, destino, fecha });
    
    searchPerformed = true;
    renderSearchResults();
    
    // Mostrar sección de resultados, ocultar recomendadas
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('recommendedSection').style.display = 'none';

    // Scroll a resultados
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Renderiza rutas recomendadas
 */
function renderRecommendedRoutes() {
    const container = document.getElementById('recommendedContainer');
    if (!container) return;

    container.innerHTML = '';
    
    rutasRecomendadas.forEach(ruta => {
        const card = createRouteCard(ruta);
        container.appendChild(card);
    });

    lucide.createIcons();
}

/**
 * Renderiza resultados de búsqueda
 */
function renderSearchResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;

    container.innerHTML = '';
    
    resultadosBusqueda.forEach(ruta => {
        const card = createRouteCard(ruta);
        container.appendChild(card);
    });

    lucide.createIcons();
}

/**
 * Crea una tarjeta de ruta
 */
function createRouteCard(ruta) {
    const card = document.createElement('div');
    card.className = 'route-card';
    card.id = `route-${ruta.id}`;

    const isSaved = savedRoutes.has(ruta.id);
    const isExpanded = expandedRoute === ruta.id;

    // Generar detalles expandidos
    let detailsHTML = '';
    if (isExpanded) {
        detailsHTML = `
            <div class="route-details">
                <div class="transbordos-info">
                    <span class="transbordos-label">Transbordos:</span>
                    <span class="transbordos-badge">${ruta.transbordos}</span>
                </div>

                <div class="lineas-container">
                    ${ruta.lineas.map((linea, index) => `
                        <div class="linea-section">
                            <h3 class="linea-title">${linea.nombre}</h3>
                            
                            <div class="linea-grid">
                                <!-- Columna 1 -->
                                <div class="linea-column">
                                    <div class="linea-field">
                                        <span class="linea-field-label">Estación de Salida</span>
                                        <span class="linea-field-value">${linea.salida}</span>
                                    </div>
                                    <div class="linea-field">
                                        <span class="linea-field-label">Estación de Llegada</span>
                                        <span class="linea-field-value">${linea.llegada}</span>
                                    </div>
                                    <div class="linea-field">
                                        <span class="linea-field-label">Hora de Salida</span>
                                        <span class="linea-field-value">${linea.horaSalida}</span>
                                    </div>
                                </div>

                                <!-- Columna 2 -->
                                <div class="linea-column">
                                    <div class="linea-field">
                                        <span class="linea-field-label">Andén de Salida</span>
                                        <span class="linea-field-value">${linea.andenSalida}</span>
                                    </div>
                                    <div class="linea-field">
                                        <span class="linea-field-label">Andén de Llegada</span>
                                        <span class="linea-field-value">${linea.andenLlegada}</span>
                                    </div>
                                    <div class="linea-field">
                                        <span class="linea-field-label">Hora de Llegada</span>
                                        <span class="linea-field-value">${linea.horaLlegada}</span>
                                    </div>
                                </div>

                                <!-- Columna 3 -->
                                <div class="linea-image-container">
                                    <span class="linea-image-label">Imagen del Trayecto de la Línea</span>
                                    <div class="linea-image-placeholder">
                                        <i data-lucide="image"></i>
                                    </div>
                                </div>
                            </div>

                            ${index < ruta.lineas.length - 1 ? '<div class="linea-separator"></div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="route-header">
            <div class="route-info">
                <h2 class="route-title">${ruta.titulo}</h2>
                <p class="route-description">${ruta.descripcion}</p>
                
                <div class="route-actions">
                    <button class="btn-toggle" onclick="toggleExpand('${ruta.id}')">
                        <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}"></i>
                        ${isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}
                    </button>
                    <button class="${isSaved ? 'btn-saved' : 'btn-save'}" onclick="toggleSave('${ruta.id}', '${ruta.titulo}')">
                        <i data-lucide="star" ${isSaved ? 'class="fill-star"' : ''}></i>
                        ${isSaved ? 'Guardado en Favoritos' : 'Agregar a Favoritos'}
                    </button>
                </div>
            </div>
            
            <img src="${ruta.imagenUrl}" alt="${ruta.titulo}" class="route-image" />
        </div>

        ${detailsHTML}
    `;

    return card;
}

/**
 * Alterna la expansión de una ruta
 */
function toggleExpand(id) {
    expandedRoute = expandedRoute === id ? null : id;
    
    if (searchPerformed) {
        renderSearchResults();
    } else {
        renderRecommendedRoutes();
    }
}

/**
 * Alterna guardar ruta en favoritos
 */
function toggleSave(id, titulo) {
    if (savedRoutes.has(id)) {
        // Mostrar modal de confirmación para eliminar
        window.showConfirmModal({
            title: '¿Eliminar ruta?',
            message: `¿Estás seguro de que deseas eliminar "${titulo}" de tus rutas guardadas?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            type: 'danger',
            onConfirm: () => {
                savedRoutes.delete(id);
                
                // Eliminar de localStorage
                const misRutasGuardadas = JSON.parse(localStorage.getItem('misRutasGuardadas') || '[]');
                const filteredRutas = misRutasGuardadas.filter(r => r.id !== id);
                localStorage.setItem('misRutasGuardadas', JSON.stringify(filteredRutas));
                
                saveSavedRoutes();
                
                if (searchPerformed) {
                    renderSearchResults();
                } else {
                    renderRecommendedRoutes();
                }
                
                console.log('Ruta eliminada de favoritos:', titulo);
            }
        });
    } else {
        savedRoutes.add(id);
        
        // Guardar en localStorage para Mis Rutas
        const allRoutes = [...rutasRecomendadas, ...resultadosBusqueda];
        const rutaToSave = allRoutes.find(r => r.id === id);
        
        if (rutaToSave) {
            const misRutasGuardadas = JSON.parse(localStorage.getItem('misRutasGuardadas') || '[]');
            if (!misRutasGuardadas.find((r) => r.id === id)) {
                misRutasGuardadas.push(rutaToSave);
                localStorage.setItem('misRutasGuardadas', JSON.stringify(misRutasGuardadas));
            }
        }
        
        saveSavedRoutes();
        
        if (searchPerformed) {
            renderSearchResults();
        } else {
            renderRecommendedRoutes();
        }
        
        // Mostrar modal de éxito
        showSuccessModal(titulo);
    }
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
window.toggleSave = toggleSave;
window.closeSuccessModal = closeSuccessModal;

// Debug: Log en consola
console.log('verRutas.js (Buscar Rutas) cargado correctamente');
console.log('Rutas recomendadas:', rutasRecomendadas.length);
console.log('Resultados búsqueda:', resultadosBusqueda.length);
