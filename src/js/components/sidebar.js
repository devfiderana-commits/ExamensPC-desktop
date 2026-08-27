/**
 * Sidebar component
 */

import router from '../router.js';
import state from '../state.js';
import examRepository from '../storage/examRepository.js';

class Sidebar {
    constructor() {
        this.element = null;
        this.unsubscribe = null;
        this._outsideClickHandler = null;
    }

    render() {
        const stats = examRepository.getStatistics();

        return `
            <div class="sidebar-logo">
                <span>📚</span>
                <span>EXAMENS</span>
            </div>
            <nav class="sidebar-menu">
                <div class="sidebar-section">
                    <div class="sidebar-item active" data-page="dashboard">
                        <span class="icon">📊</span>
                        <span>Tableau de bord</span>
                    </div>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-section-title">Matières</div>
                    <div class="sidebar-item" data-page="physics">
                        <span class="icon">⚛️</span>
                        <span>Physique</span>
                        <span class="badge">${stats.bySubject['Physique'] || 0}</span>
                    </div>
                    <div class="sidebar-submenu" id="physics-submenu">
                        <div class="sidebar-submenu-item" data-chapter="Mécanique">Mécanique</div>
                        <div class="sidebar-submenu-item" data-chapter="Électricité">Électricité</div>
                        <div class="sidebar-submenu-item" data-chapter="Optique">Optique</div>
                        <div class="sidebar-submenu-item" data-chapter="Thermodynamique">Thermodynamique</div>
                    </div>

                    <div class="sidebar-item" data-page="chemistry">
                        <span class="icon">🧪</span>
                        <span>Chimie</span>
                        <span class="badge">${stats.bySubject['Chimie'] || 0}</span>
                    </div>
                    <div class="sidebar-submenu" id="chemistry-submenu">
                        <div class="sidebar-submenu-item" data-chapter="Atomistique">Atomistique</div>
                        <div class="sidebar-submenu-item" data-chapter="Thermodynamique">Thermodynamique</div>
                        <div class="sidebar-submenu-item" data-chapter="Organique">Organique</div>
                        <div class="sidebar-submenu-item" data-chapter="Électrochimie">Électrochimie</div>
                    </div>

                    <div class="sidebar-item" data-page="mathematics">
                        <span class="icon">∑</span>
                        <span>Mathématiques</span>
                        <span class="badge">${stats.bySubject['Mathématiques'] || 0}</span>
                    </div>
                    <div class="sidebar-submenu" id="mathematics-submenu">
                        <div class="sidebar-submenu-item" data-chapter="Analyse">Analyse</div>
                        <div class="sidebar-submenu-item" data-chapter="Algèbre">Algèbre</div>
                    </div>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-item" data-page="favorites">
                        <span class="icon">⭐</span>
                        <span>Favoris</span>
                        <span class="badge">${stats.favorites}</span>
                    </div>
                    <div class="sidebar-item" data-page="recent">
                        <span class="icon">🕒</span>
                        <span>Récents</span>
                    </div>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-item" data-page="settings">
                        <span class="icon">⚙️</span>
                        <span>Paramètres</span>
                    </div>
                </div>
            </nav>

            <div class="sidebar-footer">
                <button class="btn btn-icon" id="sidebar-toggle" title="Basculer menu">
                    ☰
                </button>
            </div>
        `;
    }

    mount(containerSelector) {
        this.element = document.querySelector(containerSelector);
        if (!this.element) return;

        this.element.innerHTML = this.render();
        this.attachEventListeners();
        this.subscribeToStateChanges();
    }

    attachEventListeners() {
        // Page navigation
        this.element.querySelectorAll('[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.dataset.page;

                // Check if it's a subject with submenu
                if (['physics', 'chemistry', 'mathematics'].includes(page)) {
                    e.preventDefault();
                    this.toggleSubmenu(page);
                } else {
                    router.navigate(page);
                    this.updateActiveItem(page);
                }
            });
        });

        // Chapter navigation
        this.element.querySelectorAll('[data-chapter]').forEach(item => {
            item.addEventListener('click', () => {
                const chapter = item.dataset.chapter;
                const subject = this.getSubjectFromChapter(chapter);
                state.updateFilter('chapter', chapter);
                state.updateFilter('subject', subject);
                router.navigate('subject', { subject, chapter });
            });
        });

        // Menu toggle for mobile
        const toggleBtn = this.element.querySelector('#sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                state.toggleMenu();
            });
        }

        // Close menu on page click (attach once)
        if (!this._outsideClickHandler) {
            this._outsideClickHandler = (e) => {
                if (!e.target.closest('.sidebar') && 
                    !e.target.closest('#sidebar-toggle') &&
                    state.getState().isMenuOpen) {
                    state.closeMenu();
                }
            };
            document.addEventListener('click', this._outsideClickHandler);
        }
    }

    toggleSubmenu(subject) {
        const submenuId = `${subject}-submenu`;
        const submenu = this.element.querySelector(`#${submenuId}`);
        if (submenu) {
            submenu.classList.toggle('open');
        }
    }

    getSubjectFromChapter(chapter) {
        const physicsChapters = ['Mécanique', 'Électricité', 'Optique', 'Thermodynamique'];
        const chemistryChapters = ['Atomistique', 'Organique', 'Électrochimie'];
        const mathChapters = ['Analyse', 'Algèbre'];

        if (physicsChapters.includes(chapter)) return 'Physique';
        if (chemistryChapters.includes(chapter)) return 'Chimie';
        if (mathChapters.includes(chapter)) return 'Mathématiques';
        return null;
    }

    updateActiveItem(page) {
        if (!this.element) return;
        this.element.querySelectorAll('[data-page]').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = this.element.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    subscribeToStateChanges() {
        this.unsubscribe = state.subscribe((newState) => {
            const sidebarElement = document.querySelector('.sidebar');
            if (sidebarElement) {
                if (newState.isMenuOpen) {
                    sidebarElement.classList.add('open');
                } else {
                    sidebarElement.classList.remove('open');
                }
            }
        });
    }

    update() {
        this.mount('#sidebar');
    }

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        if (this._outsideClickHandler) {
            document.removeEventListener('click', this._outsideClickHandler);
            this._outsideClickHandler = null;
        }
    }
}

export default new Sidebar();
