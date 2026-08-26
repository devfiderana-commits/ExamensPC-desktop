/**
 * Global application state management
 */

class State {
    constructor() {
        this.state = {
            theme: 'light',
            language: 'fr',
            searchQuery: '',
            filters: {
                subject: null,
                chapter: null,
                year: null,
                session: null,
                isFavorite: false,
                fileType: null
            },
            isMenuOpen: false,
            currentUser: null
        };
        this.listeners = [];
    }

    getState() {
        return { ...this.state };
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    updateFilter(filterName, value) {
        this.state.filters[filterName] = value;
        this.notifyListeners();
    }

    clearFilters() {
        this.state.filters = {
            subject: null,
            chapter: null,
            year: null,
            session: null,
            isFavorite: false,
            fileType: null
        };
        this.notifyListeners();
    }

    setSearchQuery(query) {
        this.state.searchQuery = query;
        this.notifyListeners();
    }

    setTheme(theme) {
        this.state.theme = theme;
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        this.notifyListeners();
    }

    getTheme() {
        return this.state.theme;
    }

    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    toggleMenu() {
        this.state.isMenuOpen = !this.state.isMenuOpen;
        this.notifyListeners();
        return this.state.isMenuOpen;
    }

    closeMenu() {
        this.state.isMenuOpen = false;
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.getState()));
    }
}

export default new State();
