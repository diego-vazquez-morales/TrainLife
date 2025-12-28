// sidebar.js - Funcionalidad del menú lateral y toggle móvil TrainLife

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar iconos Lucide en todo el sidebar (y menú mobile/toggle)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Toggle del menú lateral en modo móvil/tablet
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar sidebar al hacer click fuera (solo en móvil)
    document.addEventListener('click', (e) => {
      if (
        window.innerWidth <= 1024 &&
        !sidebar.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        sidebar.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Cerrar sidebar automáticamente si se pasa a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && sidebar && mobileToggle) {
      sidebar.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});
