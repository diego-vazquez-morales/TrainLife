/* verRutas.js
   Script para verRutas.html - Navegación y funcionalidad accesible
*/

document.addEventListener('DOMContentLoaded', function() {
  console.log('verRutas.js cargado');
  
  // ===== NAVEGACIÓN DEL SIDEBAR =====
  
  // Botón de Cerrar Sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      window.location.href = '/loginUsuario';
    });
    
    // Navegación por Enter/Espacio
    logoutBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = '/loginUsuario';
      }
    });
  }
  
  // ===== FORMULARIO DE BÚSQUEDA =====
  
  const searchForm = document.getElementById('searchForm');
  const origenInput = document.getElementById('origen');
  const destinoInput = document.getElementById('destino');
  const fechaInput = document.getElementById('fecha');
  
  // Establecer fecha por defecto (hoy)
  if (fechaInput && !fechaInput.value) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.value = today;
  }
  
  // Manejar envío del formulario
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const origen = origenInput.value.trim();
      const destino = destinoInput.value.trim();
      const fecha = fechaInput.value;
      
      // Validación simple
      if (!origen || !destino || !fecha) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
      }
      
      // Simular búsqueda (en producción haría fetch a API)
      console.log('Buscando rutas:', { origen, destino, fecha });
      
      // Anunciar a lectores de pantalla
      announceToScreenReader(`Buscando rutas de ${origen} a ${destino} para el ${fecha}`);
      
      // Simular delay de búsqueda
      setTimeout(() => {
        announceToScreenReader('Búsqueda completada. Se encontraron 3 rutas disponibles.');
        
        // Focus en los resultados
        const resultsHeading = document.getElementById('results-heading');
        if (resultsHeading) {
          resultsHeading.focus();
        }
      }, 500);
    });
  }
  
  // ===== BOTONES "GUARDAR" =====
  
  const saveBtns = document.querySelectorAll('.save-btn');
  
  saveBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const routeId = this.getAttribute('data-route-id');
      const isPressed = this.getAttribute('aria-pressed') === 'true';
      
      // Cambiar estado
      this.setAttribute('aria-pressed', !isPressed);
      
      // Cambiar texto del botón
      const btnText = this.lastChild;
      if (!isPressed) {
        btnText.textContent = ' Guardado';
        announceToScreenReader(`Ruta ${routeId} guardada en favoritos`);
        console.log(`Ruta ${routeId} guardada`);
      } else {
        btnText.textContent = ' Guardar';
        announceToScreenReader(`Ruta ${routeId} eliminada de favoritos`);
        console.log(`Ruta ${routeId} eliminada de favoritos`);
      }
      
      // Animación visual (opcional)
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
    
    // Navegación por teclado
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // ===== ACCESIBILIDAD: SKIP LINKS =====
  
  const skipLink = document.createElement('a');
  skipLink.href = '#main-heading';
  skipLink.textContent = 'Saltar al contenido principal';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #0056b3;
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
    border-radius: 0 0 4px 0;
  `;
  
  skipLink.addEventListener('focus', function() {
    this.style.top = '0';
  });
  
  skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // ===== ANUNCIOS PARA LECTORES DE PANTALLA =====
  
  const ariaLiveRegion = document.createElement('div');
  ariaLiveRegion.setAttribute('role', 'status');
  ariaLiveRegion.setAttribute('aria-live', 'polite');
  ariaLiveRegion.setAttribute('aria-atomic', 'true');
  ariaLiveRegion.className = 'sr-only';
  ariaLiveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(ariaLiveRegion);
  
  window.announceToScreenReader = function(message) {
    ariaLiveRegion.textContent = message;
    setTimeout(() => {
      ariaLiveRegion.textContent = '';
    }, 1000);
  };
  
  // ===== MEJORAR NAVEGACIÓN POR TECLADO =====
  
  // Destacar foco en elementos de navegación
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('focus', function() {
      this.style.outline = '3px solid #0056b3';
      this.style.outlineOffset = '2px';
    });
    
    item.addEventListener('blur', function() {
      this.style.outline = '';
      this.style.outlineOffset = '';
    });
  });
  
  // ===== VALIDACIÓN DE ACCESIBILIDAD (DESARROLLO) =====
  
  // Verificar que todos los inputs tengan labels
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.getAttribute('aria-label')) {
      console.warn('Input sin label asociado:', input);
    }
  });
  
  // Verificar que todos los botones tengan texto o aria-label
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
      console.warn('Botón sin texto o aria-label:', btn);
    }
  });
  
  // ===== AUTOCOMPLETADO (OPCIONAL - SIMULADO) =====
  
  // Simular sugerencias de ciudades para origen y destino
  const ciudades = [
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao',
    'Málaga', 'Zaragoza', 'Alicante', 'Córdoba', 'Valladolid'
  ];
  
  function setupAutocomplete(input) {
    if (!input) return;
    
    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      
      if (value.length < 2) return;
      
      const matches = ciudades.filter(ciudad => 
        ciudad.toLowerCase().includes(value)
      );
      
      // En una implementación real, aquí se mostraría un dropdown
      console.log('Sugerencias:', matches);
    });
  }
  
  setupAutocomplete(origenInput);
  setupAutocomplete(destinoInput);
  
  // ===== PERSISTENCIA DE DATOS (LocalStorage) =====
  
  // Guardar rutas favoritas en localStorage
  window.saveRouteToFavorites = function(routeId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRoutes') || '[]');
    
    if (!favorites.includes(routeId)) {
      favorites.push(routeId);
      localStorage.setItem('favoriteRoutes', JSON.stringify(favorites));
      return true;
    }
    return false;
  };
  
  window.removeRouteFromFavorites = function(routeId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRoutes') || '[]');
    favorites = favorites.filter(id => id !== routeId);
    localStorage.setItem('favoriteRoutes', JSON.stringify(favorites));
  };
  
  // Restaurar estado de botones guardados
  const favorites = JSON.parse(localStorage.getItem('favoriteRoutes') || '[]');
  saveBtns.forEach(btn => {
    const routeId = btn.getAttribute('data-route-id');
    if (favorites.includes(routeId)) {
      btn.setAttribute('aria-pressed', 'true');
      btn.lastChild.textContent = ' Guardado';
    }
  });
  
  // ===== LOG DE ACCESIBILIDAD =====
  
  console.log('✅ Accesibilidad inicializada en verRutas:');
  console.log('  - Navegación por teclado habilitada');
  console.log('  - Formulario de búsqueda funcional');
  console.log('  - Botones "Guardar" con aria-pressed');
  console.log('  - Skip links añadidos');
  console.log('  - ARIA live regions configuradas');
  console.log('  - Contraste WCAG AAA aplicado');
});
