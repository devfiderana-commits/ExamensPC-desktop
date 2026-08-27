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

            // Call lifecycle hooks if present so pages can attach listeners reliably
            if (this.currentPage && typeof this.currentPage.mounted === 'function') {
                try { await this.currentPage.mounted(); } catch (e) { console.error('mounted() error:', e); }
            }
            if (this.currentPage && typeof this.currentPage.afterRender === 'function') {
                try { await this.currentPage.afterRender(); } catch (e) { console.error('afterRender() error:', e); }
            }

            this.notifyListeners();

            // Scroll to top
            const contentArea = document.getElementById('content') || document.querySelector('.content');
            if (contentArea) contentArea.scrollTop = 0;
        } catch (error) {
            console.error(`Error navigating to "${pageName}":`, error);
            const contentArea = document.getElementById('content');
            if (contentArea) {
                contentArea.innerHTML = `
                    <div class="content-wrapper">
                        <div class="empty-state">
                            <div class="empty-state-icon">❌</div>
                            <div class="empty-state-title">Erreur lors du chargement</div>
                            <div class="empty-state-description">Une erreur est survenue lors de la navigation. Vérifiez la console pour plus de détails.</div>
                        </div>
                    </div>
                `;
            }
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
