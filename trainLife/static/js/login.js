/* login.js
   Script de interacción para login.html
   Incluye validación de formulario, toggle de contraseña y navegación
*/

// Estado del formulario
let showPassword = false;
let hasError = false;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('login.js cargado');
  
  // Inicializar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Obtener elementos del DOM
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleIcon = document.getElementById('toggleIcon');
  const errorMessageEmail = document.getElementById('errorMessageEmail');
  const errorTextEmail = document.getElementById('errorTextEmail');
  const errorMessagePassword = document.getElementById('errorMessagePassword');
  const errorTextPassword = document.getElementById('errorTextPassword');


  
  // === Toggle Password Visibility ===
  if (togglePasswordBtn && passwordInput && toggleIcon) {
    togglePasswordBtn.addEventListener('click', function () {
      showPassword = !showPassword;
      
      // Cambiar tipo de input
      passwordInput.type = showPassword ? 'text' : 'password';
      
      // Cambiar icono
      toggleIcon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
      
      // Actualizar aria-label
      togglePasswordBtn.setAttribute('aria-label', showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
      
      // Recrear iconos de Lucide
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }
  
  // === Limpiar errores al escribir ===
  if (emailInput) {
    emailInput.addEventListener('input', function () {
      clearEmailError();
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      clearPasswordError();
    });
  }
  
  // === Manejo del submit del formulario ===
  if (form) {
    form.addEventListener('submit', function (e) {
      // Limpiar errores previos
      clearAllErrors();
      
      // Obtener valores
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';
      
      let hasValidationError = false;
      
      // Validación de email
      if (!email) {
        e.preventDefault();
        showEmailError('El correo electrónico es requerido');
        hasValidationError = true;
        if (!hasValidationError) emailInput.focus();
      } else if (!isValidEmail(email)) {
        e.preventDefault();
        showEmailError('Por favor, introduce un correo electrónico válido');
        hasValidationError = true;
        if (!password) emailInput.focus();
      }
      
      // Validación de contraseña
      if (!password) {
        e.preventDefault();
        showPasswordError('La contraseña es requerida');
        hasValidationError = true;
        if (!email || isValidEmail(email)) passwordInput.focus();
      } else if (password.length < 6) {
        e.preventDefault();
        showPasswordError('La contraseña debe tener al menos 6 caracteres');
        hasValidationError = true;
      }
      
      // Si hay errores, detener el envío
      if (hasValidationError) {
        return;
      }
      
      // Si todo está bien, el formulario se enviará a Django
      console.log('Enviando formulario al servidor...');
    });
  }
  
  // === Funciones auxiliares ===
  
  /**
   * Valida formato de email
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Muestra mensaje de error para el campo de email
   */
  function showEmailError(message) {
    if (errorMessageEmail && errorTextEmail) {
      errorTextEmail.textContent = message;
      errorMessageEmail.style.display = 'flex';
    }
    
    if (emailInput) {
      emailInput.classList.add('is-invalid');
      const emailWrapper = emailInput.closest('.input-icon-wrapper');
      if (emailWrapper) {
        emailWrapper.classList.add('is-invalid');
      }
    }
  }
  
  /**
   * Muestra mensaje de error para el campo de contraseña
   */
  function showPasswordError(message) {
    if (errorMessagePassword && errorTextPassword) {
      errorTextPassword.textContent = message;
      errorMessagePassword.style.display = 'flex';
    }
    
    if (passwordInput) {
      passwordInput.classList.add('is-invalid');
      const passwordWrapper = passwordInput.closest('.input-icon-wrapper');
      if (passwordWrapper) {
        passwordWrapper.classList.add('is-invalid');
      }
    }
  }
  
  /**
   * Limpia el mensaje de error del email
   */
  function clearEmailError() {
    if (errorMessageEmail) {
      errorMessageEmail.style.display = 'none';
    }
    
    if (errorTextEmail) {
      errorTextEmail.textContent = '';
    }
    
    if (emailInput) {
      emailInput.classList.remove('is-invalid');
      const emailWrapper = emailInput.closest('.input-icon-wrapper');
      if (emailWrapper) {
        emailWrapper.classList.remove('is-invalid');
      }
    }
  }
  
  /**
   * Limpia el mensaje de error de la contraseña
   */
  function clearPasswordError() {
    if (errorMessagePassword) {
      errorMessagePassword.style.display = 'none';
    }
    
    if (errorTextPassword) {
      errorTextPassword.textContent = '';
    }
    
    if (passwordInput) {
      passwordInput.classList.remove('is-invalid');
      const passwordWrapper = passwordInput.closest('.input-icon-wrapper');
      if (passwordWrapper) {
        passwordWrapper.classList.remove('is-invalid');
      }
    }
  }
  
  /**
   * Limpia todos los mensajes de error
   */
  function clearAllErrors() {
    clearEmailError();
    clearPasswordError();
  }

  // === Modal de recuperación de contraseña ===
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const backToLoginLink = document.getElementById('backToLoginLink');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const recoveryEmail = document.getElementById('recoveryEmail');
  const errorMessageRecovery = document.getElementById('errorMessageRecovery');
  const errorTextRecovery = document.getElementById('errorTextRecovery');

  // Abrir modal
  if (forgotPasswordLink && forgotPasswordModal) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      forgotPasswordModal.classList.add('show');
      
      // Si hay un email en el formulario de login, pre-llenarlo
      if (emailInput && emailInput.value.trim()) {
        recoveryEmail.value = emailInput.value.trim();
      }
      
      // Inicializar iconos de Lucide en el modal
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }

  // Cerrar modal
  if (backToLoginLink && forgotPasswordModal) {
    backToLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      forgotPasswordModal.classList.remove('show');
      clearRecoveryError();
    });
  }

  // Cerrar modal al hacer clic fuera
  if (forgotPasswordModal) {
    forgotPasswordModal.addEventListener('click', function(e) {
      if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove('show');
        clearRecoveryError();
      }
    });
  }

  // Manejar envío del formulario de recuperación
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      clearRecoveryError();
      
      const email = recoveryEmail.value.trim();
      
      if (!email) {
        showRecoveryError('El correo electrónico es requerido');
        return;
      }
      
      if (!isValidEmail(email)) {
        showRecoveryError('Por favor, introduce un correo electrónico válido');
        return;
      }
      
      // Verificar si el email existe en la base de datos
      verificarEmailExiste(email);
    });
  }

  /**
   * Verifica si el email existe en la base de datos
   */
  function verificarEmailExiste(email) {
    // Obtener el token CSRF
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    // Mostrar estado de carga (opcional)
    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Verificando...';
    submitBtn.disabled = true;
    
    // Hacer petición AJAX
    fetch('/api/verificar-email/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      console.log('Respuesta del servidor:', data);
      
      if (data.existe) {
        // Email existe, continuar con el proceso
        localStorage.setItem('recoveryEmail', email);
        window.location.href = '/recuperar-contrasenia/';
      } else {
        // Email no existe, mostrar error
        showRecoveryError(data.mensaje || 'No existe ninguna cuenta con este correo electrónico');
      }
    })
    .catch(error => {
      console.error('Error al verificar email:', error);
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showRecoveryError('Error al verificar el correo electrónico. Inténtalo de nuevo.');
    });
  }

  // Limpiar error al escribir en el campo de recuperación
  if (recoveryEmail) {
    recoveryEmail.addEventListener('input', function() {
      clearRecoveryError();
    });
  }

  /**
   * Muestra mensaje de error para el campo de recuperación
   */
  function showRecoveryError(message) {
    if (errorMessageRecovery && errorTextRecovery) {
      errorTextRecovery.textContent = message;
      errorMessageRecovery.style.display = 'flex';
    }
    
    if (recoveryEmail) {
      recoveryEmail.classList.add('is-invalid');
    }
  }

  /**
   * Limpia el mensaje de error de recuperación
   */
  function clearRecoveryError() {
    if (errorMessageRecovery) {
      errorMessageRecovery.style.display = 'none';
    }
    
    if (errorTextRecovery) {
      errorTextRecovery.textContent = '';
    }
    
    if (recoveryEmail) {
      recoveryEmail.classList.remove('is-invalid');
    }
  }
});
