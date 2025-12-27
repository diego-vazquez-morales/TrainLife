// confirmModal.js - Sistema de modales de confirmación

/**
 * Clase para gestionar modales de confirmación
 */
class ConfirmModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.onConfirmCallback = null;
        this.onCancelCallback = null;
    }

    /**
     * Muestra el modal de confirmación
     * @param {Object} options - Opciones del modal
     * @param {string} options.title - Título del modal
     * @param {string} options.message - Mensaje del modal
     * @param {string} options.confirmText - Texto del botón confirmar (default: "Confirmar")
     * @param {string} options.cancelText - Texto del botón cancelar (default: "Cancelar")
     * @param {string} options.type - Tipo de modal: 'danger', 'warning', 'info' (default: "warning")
     * @param {Function} options.onConfirm - Callback al confirmar
     * @param {Function} options.onCancel - Callback al cancelar
     */
    show({
        title = 'Confirmar acción',
        message = '¿Estás seguro de que deseas continuar?',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        type = 'warning',
        onConfirm = null,
        onCancel = null
    } = {}) {
        // Si ya hay un modal abierto, cerrarlo primero
        if (this.isOpen) {
            this.close();
        }

        this.onConfirmCallback = onConfirm;
        this.onCancelCallback = onCancel;

        // Crear el modal
        this.modal = this.createModal({ title, message, confirmText, cancelText, type });
        
        // Agregar al DOM
        document.body.appendChild(this.modal);
        
        // Marcar como abierto
        this.isOpen = true;

        // Inicializar iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Aplicar animaciones
        requestAnimationFrame(() => {
            this.modal.classList.add('modal-active');
        });

        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Crea el elemento HTML del modal
     */
    createModal({ title, message, confirmText, cancelText, type }) {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-describedby', 'modal-message');

        // Definir colores según el tipo
        const typeConfig = {
            danger: {
                bgColor: 'modal-icon-danger',
                iconColor: 'modal-icon-danger-color',
                buttonColor: 'modal-btn-danger',
                buttonStyle: 'background-color: #dc2626;',
                icon: 'alert-triangle'
            },
            warning: {
                bgColor: 'modal-icon-warning',
                iconColor: 'modal-icon-warning-color',
                buttonColor: 'modal-btn-warning',
                buttonStyle: 'background-color: #0f49bd !important;',
                icon: 'alert-triangle'
            },
            info: {
                bgColor: 'modal-icon-info',
                iconColor: 'modal-icon-info-color',
                buttonColor: 'modal-btn-info',
                buttonStyle: 'background-color: #0d6efd;',
                icon: 'info'
            }
        };

        const config = typeConfig[type] || typeConfig.warning;

        modal.innerHTML = `
            <div class="confirm-modal-content">
                <div class="modal-header">
                    <div class="modal-header-left">
                        <div class="modal-icon ${config.bgColor}">
                            <i data-lucide="${config.icon}" class="${config.iconColor}"></i>
                        </div>
                        <h3 class="modal-title" id="modal-title">${title}</h3>
                    </div>
                    <button class="modal-close-btn" aria-label="Cerrar modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                
                <p class="modal-message" id="modal-message">${message}</p>
                
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-cancel">
                        ${cancelText}
                    </button>
                    <button class="modal-btn modal-btn-confirm ${config.buttonColor}" style="${config.buttonStyle}">
                        ${confirmText}
                    </button>
                </div>
            </div>
        `;

        // Event listeners
        const closeBtn = modal.querySelector('.modal-close-btn');
        const cancelBtn = modal.querySelector('.modal-btn-cancel');
        const confirmBtn = modal.querySelector('.modal-btn-confirm');
        const overlay = modal;

        closeBtn.addEventListener('click', () => this.handleCancel());
        cancelBtn.addEventListener('click', () => this.handleCancel());
        confirmBtn.addEventListener('click', () => this.handleConfirm());
        
        // Cerrar al hacer clic en el overlay (fondo)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.handleCancel();
            }
        });

        // Cerrar con tecla Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.handleCancel();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Guardar el handler para poder removerlo después
        modal._escapeHandler = escapeHandler;

        return modal;
    }

    /**
     * Maneja la confirmación
     */
    handleConfirm() {
        if (this.onConfirmCallback && typeof this.onConfirmCallback === 'function') {
            this.onConfirmCallback();
        }
        this.close();
    }

    /**
     * Maneja la cancelación
     */
    handleCancel() {
        if (this.onCancelCallback && typeof this.onCancelCallback === 'function') {
            this.onCancelCallback();
        }
        this.close();
    }

    /**
     * Cierra el modal
     */
    close() {
        if (!this.modal || !this.isOpen) return;

        // Remover animación de entrada
        this.modal.classList.remove('modal-active');
        
        // Remover event listener de escape
        if (this.modal._escapeHandler) {
            document.removeEventListener('keydown', this.modal._escapeHandler);
        }

        // Esperar a que termine la animación antes de remover del DOM
        setTimeout(() => {
            if (this.modal && this.modal.parentNode) {
                this.modal.parentNode.removeChild(this.modal);
            }
            this.modal = null;
            this.isOpen = false;
            this.onConfirmCallback = null;
            this.onCancelCallback = null;
            
            // Restaurar scroll del body
            document.body.style.overflow = '';
        }, 200);
    }
}

// Crear instancia global
window.confirmModal = new ConfirmModal();

/**
 * Función auxiliar para mostrar modal de confirmación rápidamente
 */
window.showConfirmModal = function(options) {
    return new Promise((resolve) => {
        window.confirmModal.show({
            ...options,
            onConfirm: () => {
                if (options.onConfirm) options.onConfirm();
                resolve(true);
            },
            onCancel: () => {
                if (options.onCancel) options.onCancel();
                resolve(false);
            }
        });
    });
};

/**
 * Muestra un modal de éxito automáticamente
 * @param {Object|string} options - Objeto de opciones o mensaje de éxito
 * @param {string} options.title - Título del modal (default: '¡Realizado con éxito!')
 * @param {string} options.message - Mensaje de éxito
 * @param {number} options.duration - Duración en ms antes de cerrar (default: 2500)
 * @param {Function} options.onClose - Callback al cerrar el modal
 */
window.showSuccessModal = function(options) {
    console.log('showSuccessModal llamado con:', options);
    
    let title = '¡Realizado con éxito!';
    let message = '';
    let duration = 2500;
    let onClose = null;
    
    // Si recibe un string, convertirlo a objeto
    if (typeof options === 'string') {
        message = options;
    } else if (options && typeof options === 'object') {
        title = options.title || title;
        message = options.message || message;
        duration = options.duration || duration;
        onClose = options.onClose || onClose;
    }
    
    console.log('Mostrando modal con:', { title, message, duration });
    
    // Crear overlay si no existe
    let overlay = document.getElementById('success-modal-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'success-modal-overlay';
        overlay.className = 'success-modal-overlay';
        overlay.innerHTML = `
            <div class="success-modal-content">
                <div class="success-icon-container">
                    <div class="success-icon-bg">
                        <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>
                <h2 class="success-title"></h2>
                <p class="success-message"></p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    // Actualizar título y mensaje
    const titleElement = overlay.querySelector('.success-title');
    const messageElement = overlay.querySelector('.success-message');
    
    if (titleElement) {
        titleElement.textContent = String(title);
        console.log('Título actualizado:', title);
    }
    if (messageElement) {
        messageElement.textContent = String(message);
        console.log('Mensaje actualizado:', message);
    }
    
    // Mostrar modal
    overlay.style.display = 'flex';
    
    // Cerrar automáticamente y ejecutar callback
    setTimeout(function() {
        overlay.style.display = 'none';
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    }, duration);
};

// Auto-mostrar modal si hay mensajes de Django
document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.alert-success, .message.success');
    if (messages.length > 0) {
        const messageText = messages[0].textContent.trim();
        window.showSuccessModal(messageText);
        // Ocultar mensaje original de Django
        messages.forEach(msg => msg.style.display = 'none');
    }
});

// Debug
console.log('confirmModal.js cargado correctamente');
