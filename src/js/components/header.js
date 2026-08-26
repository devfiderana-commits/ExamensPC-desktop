/**
 * Header component
 */

import state from '../state.js';
import router from '../router.js';

class Header {
    constructor() {
        this.element = null;
        this.unsubscribe = null;
    }

    render() {
        const currentTheme = state.getTheme();
        const themeIcon = currentTheme === 'light' ? '🌙' : '☀️';

        return `
            <div class="header-left">
                <div class="search-bar">
                    <span>🔍</span>
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="Rechercher des sujets..."
                        autocomplete="off"
                    >
                </div>
            </div>

            <div class="header-right">
                <button class="btn btn-icon" id="add-exam-btn" title="Ajouter un sujet">
                    ➕
                </button>
                <button class="btn btn-icon" id="import-btn" title="Importer des fichiers">
                    📥
                </button>
                <button class="btn btn-icon" id="theme-toggle" title="Basculer thème">
                    ${themeIcon}
                </button>
                <button class="btn btn-icon" id="menu-btn" title="Menu">
                    ⋮
                </button>
            </div>
        `;
    }

    mount(containerSelector) {
        this.element = document.querySelector(containerSelector);
        if (!this.element) return;

        this.element.innerHTML = this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Search
        const searchInput = this.element.querySelector('#search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.setSearchQuery(e.target.value);
            });
        }

        // Theme toggle
        const themeToggle = this.element.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = state.toggleTheme();
                localStorage.setItem('examens_theme', newTheme);
                this.update();
            });
        }

        // Add exam
        const addExamBtn = this.element.querySelector('#add-exam-btn');
        if (addExamBtn) {
            addExamBtn.addEventListener('click', () => {
                router.navigate('addExam');
            });
        }

        // Import
        const importBtn = this.element.querySelector('#import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                router.navigate('import');
            });
        }

        // Menu
        const menuBtn = this.element.querySelector('#menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                // Can be used for profile/settings menu
                console.log('Menu clicked');
            });
        }
    }

    update() {
        this.mount('#header');
    }

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

export default new Header();
