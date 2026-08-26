/**
 * Main Application Entry Point
 */

import router from './router.js';
import state from './state.js';
import sidebar from './components/sidebar.js';
import header from './components/header.js';
import examRepository from './storage/examRepository.js';

// Import pages
import DashboardPage from './pages/dashboard.js';
import { PhysicsPage, ChemistryPage, MathematicsPage, SubjectPage } from './pages/subject.js';
import { FavoritesPage, RecentPage } from './pages/favorites.js';
import ViewerPage from './pages/viewer.js';
import ImportPage from './pages/import.js';
import SettingsPage from './pages/settings.js';

class App {
    constructor() {
        this.initialized = false;
    }

    async init() {
        try {
            console.log('Initializing EXAMENS application...');

            // Initialize storage and load persisted data
            await examRepository.initializeStorage();

            // Load theme preference
            const savedTheme = localStorage.getItem('examens_theme') || 'light';
            state.setTheme(savedTheme);

            // Register pages
            this.registerPages();

            // Mount components
            sidebar.mount('#sidebar');
            header.mount('#header');

            // Listen to route changes to update sidebar
            router.subscribe((currentPage) => {
                sidebar.update();
            });

            // Initialize router
            await router.navigate('dashboard');

            // Handle mobile menu close on navigation
            router.subscribe(() => {
                state.closeMenu();
            });

            this.initialized = true;
            console.log('✓ EXAMENS application initialized');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    registerPages() {
        router.registerPage('dashboard', DashboardPage);
        router.registerPage('subject', SubjectPage);
        router.registerPage('physics', PhysicsPage);
        router.registerPage('chemistry', ChemistryPage);
        router.registerPage('mathematics', MathematicsPage);
        router.registerPage('favorites', FavoritesPage);
        router.registerPage('recent', RecentPage);
        router.registerPage('viewer', ViewerPage);
        router.registerPage('import', ImportPage);
        router.registerPage('addExam', ImportPage);
        router.registerPage('settings', SettingsPage);
    }
}

// Global reference for router in HTML
window.router = router;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();

    // Make app globally accessible for debugging
    window.app = app;
    window.state = state;
    window.examRepository = examRepository;
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close menu
    if (e.key === 'Escape') {
        state.closeMenu();
    }
});

export default App;
