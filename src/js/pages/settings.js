/**
 * Settings Page
 */

import state from '../state.js';
import examRepository from '../storage/examRepository.js';
import { Modal } from '../components/modal.js';

export class SettingsPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        const currentState = state.getState();
        const settings = examRepository.getSettings() || {};

        const html = `
            <div class="content-wrapper">
                <div class="page-header">
                    <h1 class="page-title">⚙️ Paramètres</h1>
                    <p class="page-subtitle">Configurez votre application</p>
                </div>

                <!-- Theme Settings -->
                <div class="card" style="margin-bottom: var(--spacing-lg);">
                    <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); color: var(--color-text); font-weight: 600;">
                        Apparence
                    </h2>
                    <div class="flex flex-between" style="align-items: center;">
                        <div>
                            <div style="color: var(--color-text); margin-bottom: var(--spacing-xs);">Thème</div>
                            <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                                Changez le thème de l'application
                            </div>
                        </div>
                        <select id="theme-select" class="input" style="padding: var(--spacing-sm) var(--spacing-md); background-color: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text);">
                            <option value="light">Clair</option>
                            <option value="dark">Sombre</option>
                            <option value="auto">Automatique</option>
                        </select>
                    </div>
                </div>

                <!-- Application Settings -->
                <div class="card" style="margin-bottom: var(--spacing-lg);">
                    <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); color: var(--color-text); font-weight: 600;">
                        Application
                    </h2>
                    <div style="margin-bottom: var(--spacing-md);">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="notifications-check" ${settings.notifications ? 'checked' : ''} style="margin-right: var(--spacing-sm); cursor: pointer;">
                            <span>Activer les notifications</span>
                        </label>
                    </div>
                </div>

                <!-- Storage Settings -->
                <div class="card" style="margin-bottom: var(--spacing-lg);">
                    <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); color: var(--color-text); font-weight: 600;">
                        Stockage
                    </h2>
                    <div class="flex flex-between" style="align-items: center; margin-bottom: var(--spacing-md);">
                        <div>
                            <div style="color: var(--color-text); margin-bottom: var(--spacing-xs);">Données locales</div>
                            <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                                Gestion des données de l'application
                            </div>
                        </div>
                    </div>
                    <div class="flex" style="gap: var(--spacing-md);">
                        <button class="btn btn-secondary" id="export-data-btn">
                            📥 Exporter les données
                        </button>
                        <button class="btn btn-ghost" id="clear-data-btn">
                            🗑️ Effacer les données
                        </button>
                    </div>
                </div>

                <!-- About -->
                <div class="card">
                    <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); color: var(--color-text); font-weight: 600;">
                        À propos
                    </h2>
                    <div style="display: grid; gap: var(--spacing-md);">
                        <div>
                            <div style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase; margin-bottom: var(--spacing-xs);">Application</div>
                            <div style="color: var(--color-text);">EXAMENS</div>
                        </div>
                        <div>
                            <div style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase; margin-bottom: var(--spacing-xs);">Version</div>
                            <div style="color: var(--color-text);">0.1.0</div>
                        </div>
                        <div>
                            <div style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase; margin-bottom: var(--spacing-xs);">Technologie</div>
                            <div style="color: var(--color-text);">Tauri 2 + Vanilla JavaScript</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach listeners
        setTimeout(() => {
            // Theme selector
            const themeSelect = document.querySelector('#theme-select');
            if (themeSelect) {
                themeSelect.value = currentState.theme;
                themeSelect.addEventListener('change', (e) => {
                    state.setTheme(e.target.value);
                    examRepository.updateSettings({ theme: e.target.value });
                });
            }

            // Export data
            const exportBtn = document.querySelector('#export-data-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.exportData();
                });
            }

            // Clear data
            const clearBtn = document.querySelector('#clear-data-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.clearData();
                });
            }
        }, 0);

        return html;
    }

    async exportData() {
        const exams = examRepository.getExams();
        const data = {
            exams,
            exportDate: new Date().toISOString(),
            version: '0.1.0'
        };

        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `examens_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        await Modal.alert('Succès', 'Les données ont été exportées avec succès');
    }

    async clearData() {
        const confirmed = await Modal.confirm(
            'Confirmer',
            'Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.',
            {
                confirmText: 'Oui, effacer',
                cancelText: 'Non, annuler'
            }
        );

        if (confirmed) {
            examRepository.clearAll();
            examRepository.initializeStorage();
            await Modal.alert('Succès', 'Les données ont été effacées et réinitialisées');
            // Refresh page
            window.location.reload();
        }
    }

    cleanup() {
        // Cleanup if needed
    }
}

export default SettingsPage;
