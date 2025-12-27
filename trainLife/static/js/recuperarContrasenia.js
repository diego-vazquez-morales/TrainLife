/* recuperarContrasenia.js
   Script de interacción para recuperarContrasenia.html
   Incluye validación de formulario y toggle de contraseñas
*/

// Estado del formulario
let showNewPassword = false;
let showRepeatPassword = false;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('recuperarContrasenia.js cargado');
  
  // Inicializar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Obtener el email del localStorage y mostrarlo
  const emailDisplay = document.getElementById('emailDisplay');
  const savedEmail = localStorage.getItem('recoveryEmail');
  if (emailDisplay && savedEmail) {
    emailDisplay.textContent = savedEmail;
  }
  
  // Obtener elementos del DOM
  const form = document.getElementById('resetPasswordForm');
  const newPasswordInput = document.getElementById('newPassword');
  const repeatPasswordInput = document.getElementById('repeatPassword');
  const toggleNewPasswordBtn = document.getElementById('toggleNewPassword');
  const toggleIconNew = document.getElementById('toggleIconNew');
  const toggleRepeatPasswordBtn = document.getElementById('toggleRepeatPassword');
  const toggleIconRepeat = document.getElementById('toggleIconRepeat');
  const errorMessageNew = document.getElementById('errorMessageNew');
  const errorTextNew = document.getElementById('errorTextNew');
  const errorMessageRepeat = document.getElementById('errorMessageRepeat');
  const errorTextRepeat = document.getElementById('errorTextRepeat');
  
  // === Toggle New Password Visibility ===
  if (toggleNewPasswordBtn && newPasswordInput && toggleIconNew) {
    toggleNewPasswordBtn.addEventListener('click', function () {
      showNewPassword = !showNewPassword;
      
      // Cambiar tipo de input
      newPasswordInput.type = showNewPassword ? 'text' : 'password';
      
      // Cambiar icono
      toggleIconNew.setAttribute('data-lucide', showNewPassword ? 'eye-off' : 'eye');
      
      // Actualizar aria-label
      toggleNewPasswordBtn.setAttribute('aria-label', showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
      
      // Recrear iconos de Lucide
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }

  // === Toggle Repeat Password Visibility ===
  if (toggleRepeatPasswordBtn && repeatPasswordInput && toggleIconRepeat) {
    toggleRepeatPasswordBtn.addEventListener('click', function () {
      showRepeatPassword = !showRepeatPassword;
      
      // Cambiar tipo de input
      repeatPasswordInput.type = showRepeatPassword ? 'text' : 'password';
      
      // Cambiar icono
      toggleIconRepeat.setAttribute('data-lucide', showRepeatPassword ? 'eye-off' : 'eye');
      
      // Actualizar aria-label
      toggleRepeatPasswordBtn.setAttribute('aria-label', showRepeatPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
      
      // Recrear iconos de Lucide
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }
  
  // === Limpiar errores al escribir ===
  if (newPasswordInput) {
    newPasswordInput.addEventListener('input', function () {
      clearNewPasswordError();
    });
  }
  
  if (repeatPasswordInput) {
    repeatPasswordInput.addEventListener('input', function () {
      clearRepeatPasswordError();
    });
  }
  
  // === Manejo del submit del formulario ===
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Limpiar errores previos
      clearAllErrors();
      
      // Obtener valores
      const newPassword = newPasswordInput ? newPasswordInput.value.trim() : '';
      const repeatPassword = repeatPasswordInput ? repeatPasswordInput.value.trim() : '';
      
      let hasValidationError = false;
      
      // Validación de nueva contraseña
      if (!newPassword) {
        showNewPasswordError('La contraseña es requerida');
        hasValidationError = true;
        newPasswordInput.focus();
      } else if (newPassword.length < 6) {
        showNewPasswordError('La contraseña debe tener al menos 6 caracteres');
        hasValidationError = true;
        newPasswordInput.focus();
      }
      
      // Validación de repetir contraseña
      if (!repeatPassword) {
        showRepeatPasswordError('Debes repetir la contraseña');
        hasValidationError = true;
        if (!hasValidationError) repeatPasswordInput.focus();
      } else if (newPassword !== repeatPassword) {
        showRepeatPasswordError('Las contraseñas no coinciden');
        hasValidationError = true;
        if (!hasValidationError) repeatPasswordInput.focus();
      }
      
      // Si hay errores, detener el envío
      if (hasValidationError) {
        return;
      }
      
      // Mostrar modal de confirmación antes de cambiar la contraseña
      if (typeof window.showConfirmModal === 'function') {
        window.showConfirmModal({
          title: 'Cambiar contraseña',
          message: '¿Estás seguro de que deseas cambiar tu contraseña?',
          confirmText: 'Sí, cambiar',
          cancelText: 'Cancelar',
          type: 'info',
          onConfirm: () => {
            // Usuario confirmó, proceder con el cambio
            cambiarContrasenia(newPassword, repeatPassword);
          },
          onCancel: () => {
            console.log('Cambio de contraseña cancelado');
          }
        });
      } else {
        // Fallback si no está disponible el modal
        if (confirm('¿Estás seguro de que deseas cambiar tu contraseña?')) {
          cambiarContrasenia(newPassword, repeatPassword);
        }
      }
    });
  }
  
  /**
   * Función para cambiar la contraseña
   */
  function cambiarContrasenia(newPassword, repeatPassword) {
    // Obtener el token CSRF
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    // Enviar petición AJAX
    fetch('/recuperar-contrasenia/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        email: savedEmail,
        newPassword: newPassword,
        repeatPassword: repeatPassword
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      
      if (data.success) {
        // Mostrar modal de éxito
        console.log('Intentando mostrar modal de éxito...');
        
        const modalOptions = {
          title: '¡Realizado con éxito!',
          message: 'Contraseña cambiada correctamente.',
          duration: 2000,
          onClose: function() {
            console.log('Redirigiendo a login...');
            window.location.href = '/login/';
          }
        };
        
        console.log('Opciones del modal:', modalOptions);
        console.log('Tipo de message:', typeof modalOptions.message);
        
        if (typeof window.showSuccessModal === 'function') {
          window.showSuccessModal(modalOptions);
        } else {
          // Si no existe el modal, redirigir directamente
          alert('Contraseña cambiada correctamente');
          window.location.href = '/login/';
        }
      } else {
          // Fallback usando confirm modal
          window.showConfirmModal({
            title: '¡Contraseña cambiada!',
            message: 'Contraseña cambiada correctamente. Ya puedes iniciar sesión.',
            confirmText: 'Ir a Iniciar Sesión',
            cancelText: '',
            type: 'info',
            onConfirm: () => {
              window.location.href = '/login/';
            }
          });
        } else {
          // Fallback básico
          alert('Contraseña cambiada correctamente');
          window.location.href = '/login/';
        }
      } else {
        // Mostrar error
        showNewPasswordError(data.mensaje || 'Error al cambiar la contraseña');
      }
    })
    .catch(error => {
      console.error('Error al cambiar contraseña:', error);
      showNewPasswordError('Error al cambiar la contraseña. Inténtalo de nuevo.');
    });
  }
  
  // === Funciones auxiliares ===
  
  /**
   * Muestra mensaje de error para el campo de nueva contraseña
   */
  function showNewPasswordError(message) {
    if (errorMessageNew && errorTextNew) {
      errorTextNew.textContent = message;
      errorMessageNew.style.display = 'flex';
    }
    
    if (newPasswordInput) {
      newPasswordInput.classList.add('is-invalid');
    }
  }
  
  /**
   * Muestra mensaje de error para el campo de repetir contraseña
   */
  function showRepeatPasswordError(message) {
    if (errorMessageRepeat && errorTextRepeat) {
      errorTextRepeat.textContent = message;
      errorMessageRepeat.style.display = 'flex';
    }
    
    if (repeatPasswordInput) {
      repeatPasswordInput.classList.add('is-invalid');
    }
  }
  
  /**
   * Limpia el mensaje de error de nueva contraseña
   */
  function clearNewPasswordError() {
    if (errorMessageNew) {
      errorMessageNew.style.display = 'none';
    }
    
    if (errorTextNew) {
      errorTextNew.textContent = '';
    }
    
    if (newPasswordInput) {
      newPasswordInput.classList.remove('is-invalid');
    }
  }
  
  /**
   * Limpia el mensaje de error de repetir contraseña
   */
  function clearRepeatPasswordError() {
    if (errorMessageRepeat) {
      errorMessageRepeat.style.display = 'none';
    }
    
    if (errorTextRepeat) {
      errorTextRepeat.textContent = '';
    }
    
    if (repeatPasswordInput) {
      repeatPasswordInput.classList.remove('is-invalid');
    }
  }
  
  /**
   * Limpia todos los mensajes de error
   */
  function clearAllErrors() {
    clearNewPasswordError();
    clearRepeatPasswordError();
  }
});
