/**
 * Router for handling navigation and view management
 */

class Router {
    constructor() {
        this.currentPage = null;
        this.pages = new Map();
        this.history = [];
        this.listeners = [];
    }

    registerPage(name, pageClass) {
        this.pages.set(name, pageClass);
    }

    async navigate(pageName, params = {}) {
        try {
            if (!this.pages.has(pageName)) {
                console.error(`Page "${pageName}" not registered`);
                return;
            }

            // Save to history
            if (this.currentPage) {
                this.history.push({
                    page: this.currentPage,
                    params: this.currentParams
                });
            }

            // Cleanup current page
            if (this.currentPage instanceof Object && this.currentPage.cleanup) {
                await this.currentPage.cleanup();
            }

            // Create and render new page
            const PageClass = this.pages.get(pageName);
            this.currentPage = new PageClass(params);
            this.currentPageName = pageName;
            this.currentParams = params;

            const content = await this.currentPage.render();
            this.renderContent(content);
            this.notifyListeners();

            // Scroll to top
            document.querySelector('.content').scrollTop = 0;
        } catch (error) {
            console.error(`Error navigating to "${pageName}":`, error);
        }
    }

    renderContent(html) {
        const contentArea = document.getElementById('content');
        if (contentArea) {
            contentArea.innerHTML = html;
        }
    }

    goBack() {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            this.navigate(previous.page, previous.params);
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentPageName));
    }

    getCurrentPage() {
        return this.currentPageName;
    }

    getCurrentParams() {
        return this.currentParams;
    }
}

export default new Router();
