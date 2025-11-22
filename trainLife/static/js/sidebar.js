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
      sidebar.classList.toggle('active');
    });

    // Cerrar sidebar al hacer click fuera (solo en móvil)
    document.addEventListener('click', (e) => {
      if (
        window.innerWidth <= 1024 &&
        !sidebar.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Cerrar sidebar automáticamente si se pasa a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && sidebar) {
      sidebar.classList.remove('active');
    }
  });
});
