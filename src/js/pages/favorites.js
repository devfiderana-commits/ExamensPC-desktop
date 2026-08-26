/**
 * Favorites and Recent Pages
 */

import examRepository from '../storage/examRepository.js';
import { ExamCard } from '../components/examCard.js';
import state from '../state.js';

export class FavoritesPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        const query = (state.getState().searchQuery || '').trim().toLowerCase();
        let favorites = examRepository.getFavoriteExams();

        if (query) {
            favorites = favorites.filter(exam =>
                (exam.title || '').toLowerCase().includes(query) ||
                (exam.subject || '').toLowerCase().includes(query) ||
                (exam.chapter || '').toLowerCase().includes(query) ||
                (exam.session || '').toLowerCase().includes(query) ||
                String(exam.year || '').includes(query)
            );
        }

        let examsHtml = '';
        if (favorites.length > 0) {
            examsHtml = `
                <div class="grid grid-2">
                    ${favorites.map(exam => ExamCard.render(exam)).join('')}
                </div>
            `;
        } else {
            examsHtml = `
                <div class="empty-state">
                    <div class="empty-state-icon">⭐</div>
                    <div class="empty-state-title">Aucun favori</div>
                    <div class="empty-state-description">Ajoutez des sujets à vos favoris en cliquant sur l'étoile</div>
                </div>
            `;
        }

        const html = `
            <div class="content-wrapper">
                <div class="page-header">
                    <h1 class="page-title">⭐ Favoris</h1>
                    <p class="page-subtitle">${favorites.length} sujets favoris</p>
                </div>

                ${examsHtml}
            </div>
        `;

        // Attach listeners
        setTimeout(() => {
            ExamCard.attachListeners();
        }, 0);

        return html;
    }

    cleanup() {
        // Cleanup if needed
    }
}

export class RecentPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        const query = (state.getState().searchQuery || '').trim().toLowerCase();
        let recent = examRepository.getRecentExams();

        if (query) {
            recent = recent.filter(exam =>
                (exam.title || '').toLowerCase().includes(query) ||
                (exam.subject || '').toLowerCase().includes(query) ||
                (exam.chapter || '').toLowerCase().includes(query) ||
                (exam.session || '').toLowerCase().includes(query) ||
                String(exam.year || '').includes(query)
            );
        }

        let examsHtml = '';
        if (recent.length > 0) {
            examsHtml = `
                <div class="grid grid-2">
                    ${recent.map(exam => ExamCard.render(exam)).join('')}
                </div>
            `;
        } else {
            examsHtml = `
                <div class="empty-state">
                    <div class="empty-state-icon">🕒</div>
                    <div class="empty-state-title">Aucun sujet récent</div>
                    <div class="empty-state-description">Les sujets consultés apparaîtront ici</div>
                </div>
            `;
        }

        const html = `
            <div class="content-wrapper">
                <div class="page-header">
                    <h1 class="page-title">🕒 Récemment ouverts</h1>
                    <p class="page-subtitle">${recent.length} sujets récents</p>
                </div>

                ${examsHtml}
            </div>
        `;

        // Attach listeners
        setTimeout(() => {
            ExamCard.attachListeners();
        }, 0);

        return html;
    }

    cleanup() {
        // Cleanup if needed
    }
}

export default FavoritesPage;
