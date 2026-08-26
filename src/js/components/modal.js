/**
 * Modal Component
 */

export class Modal {
    constructor(title, content, options = {}) {
        this.title = title;
        this.content = content;
        this.options = {
            closable: true,
            buttons: [],
            onClose: null,
            size: 'medium',
            ...options
        };
        this.isOpen = false;
    }

    render() {
        let buttonsHtml = '';
        if (this.options.buttons && this.options.buttons.length > 0) {
            buttonsHtml = `
                <div class="modal-footer">
                    ${this.options.buttons.map(btn => `
                        <button class="btn ${btn.className || 'btn-secondary'}" data-action="${btn.action}">
                            ${btn.label}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        const closeBtn = this.options.closable ? '<button class="modal-close" title="Fermer">✕</button>' : '';

        return `
            <div class="modal fade-in" data-modal-id="${this.id}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${this.title}</h2>
                        ${closeBtn}
                    </div>
                    <div class="modal-body">
                        ${this.content}
                    </div>
                    ${buttonsHtml}
                </div>
            </div>
        `;
    }

    open() {
        if (this.isOpen) return;

        this.id = `modal_${Date.now()}`;
        const modalContainer = document.getElementById('modals');
        if (!modalContainer) return;

        const html = this.render();
        modalContainer.insertAdjacentHTML('beforeend', html);

        const modal = modalContainer.querySelector(`[data-modal-id="${this.id}"]`);
        this.element = modal;

        // Attach listeners
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Button listeners
        modal.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const button = this.options.buttons.find(b => b.action === action);
                if (button && button.onClick) {
                    button.onClick();
                }
            });
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal && this.options.closable) {
                this.close();
            }
        });

        // Add open class for animation
        setTimeout(() => {
            modal.classList.add('open');
        }, 10);

        this.isOpen = true;
    }

    close() {
        if (!this.isOpen || !this.element) return;

        this.element.classList.remove('open');
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.remove();
            }
            this.isOpen = false;
            if (this.options.onClose) {
                this.options.onClose();
            }
        }, 300);
    }

    updateContent(content) {
        this.content = content;
        if (this.element) {
            const bodyEl = this.element.querySelector('.modal-body');
            if (bodyEl) {
                bodyEl.innerHTML = content;
            }
        }
    }

    static confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const modal = new Modal(title, message, {
                buttons: [
                    {
                        label: options.cancelText || 'Annuler',
                        className: 'btn-secondary',
                        action: 'cancel',
                        onClick: () => {
                            modal.close();
                            resolve(false);
                        }
                    },
                    {
                        label: options.confirmText || 'Confirmer',
                        className: 'btn-primary',
                        action: 'confirm',
                        onClick: () => {
                            modal.close();
                            resolve(true);
                        }
                    }
                ],
                onClose: () => resolve(false)
            });
            modal.open();
        });
    }

    static alert(title, message) {
        return new Promise((resolve) => {
            const modal = new Modal(title, message, {
                buttons: [
                    {
                        label: 'OK',
                        className: 'btn-primary',
                        action: 'ok',
                        onClick: () => {
                            modal.close();
                            resolve();
                        }
                    }
                ]
            });
            modal.open();
        });
    }
}

export default Modal;
