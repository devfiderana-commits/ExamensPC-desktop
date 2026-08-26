/**
 * Dashboard Page
 */

import examRepository from '../storage/examRepository.js';
import { ExamCard } from '../components/examCard.js';

export class DashboardPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        const stats = examRepository.getStatistics();
        const recent = examRepository.getRecentExams().slice(0, 5);

        let recentHtml = '';
        if (recent.length > 0) {
            recentHtml = `
                <div class="grid grid-2">
                    ${recent.map(exam => ExamCard.render(exam)).join('')}
                </div>
            `;
        } else {
            recentHtml = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <div class="empty-state-title">Aucun sujet récent</div>
                    <div class="empty-state-description">Commencez par importer ou consulter des sujets d'examens</div>
                </div>
            `;
        }

        const html = `
            <div class="content-wrapper">
                <div class="page-header">
                    <h1 class="page-title">Tableau de bord</h1>
                    <p class="page-subtitle">Vue d'ensemble de votre bibliothèque d'examens</p>
                </div>

                <!-- Statistics -->
                <div class="grid grid-4" style="margin-bottom: var(--spacing-xl);">
                    <div class="stat-card">
                        <div class="stat-card-value">${stats.totalExams}</div>
                        <div class="stat-card-label">Sujets totaux</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-value">${stats.bySubject['Physique'] || 0}</div>
                        <div class="stat-card-label">Physique</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-value">${stats.bySubject['Chimie'] || 0}</div>
                        <div class="stat-card-label">Chimie</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-value">${stats.bySubject['Mathématiques'] || 0}</div>
                        <div class="stat-card-label">Mathématiques</div>
                    </div>
                </div>

                <div class="grid grid-2" style="margin-bottom: var(--spacing-xl);">
                    <div class="stat-card">
                        <div class="stat-card-value">⭐ ${stats.favorites}</div>
                        <div class="stat-card-label">Sujets favoris</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-value">${recent.length}</div>
                        <div class="stat-card-label">Récemment ouverts</div>
                    </div>
                </div>

                <!-- Recent Exams -->
                <div>
                    <h2 style="font-size: var(--font-size-2xl); font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-text);">
                        Sujets récents
                    </h2>
                    ${recentHtml}
                </div>
            </div>
        `;

        // Attach listeners after rendering
        setTimeout(() => {
            ExamCard.attachListeners();
        }, 0);

        return html;
    }

    cleanup() {
        // Cleanup if needed
    }
}

export default DashboardPage;
