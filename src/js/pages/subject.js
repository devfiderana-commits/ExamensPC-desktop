/**
 * Subject Pages (Physics, Chemistry, Mathematics)
 */

import examRepository from '../storage/examRepository.js';
import { ExamCard } from '../components/examCard.js';
import state from '../state.js';

class SubjectPage {
    constructor(params = {}) {
        this.params = params;
        this.subject = params.subject || state.getState().filters?.subject || 'Physique';
        this.chapter = params.chapter || state.getState().filters?.chapter || null;
        this.subjectEmoji = {
            'Physique': '⚛️',
            'Chimie': '🧪',
            'Mathématiques': '∑'
        };
    }

    async render() {
        const query = (state.getState().searchQuery || '').trim().toLowerCase();
        let exams = examRepository.getExamsBySubject(this.subject);

        if (this.chapter) {
            exams = exams.filter(exam => exam.chapter === this.chapter);
        }

        if (query) {
            exams = exams.filter(exam =>
                (exam.title || '').toLowerCase().includes(query) ||
                (exam.subject || '').toLowerCase().includes(query) ||
                (exam.chapter || '').toLowerCase().includes(query) ||
                (exam.session || '').toLowerCase().includes(query) ||
                String(exam.year || '').includes(query)
            );
        }

        const stats = examRepository.getStatistics();
        const count = exams.length;
        const chapters = [...new Set(exams.map(e => e.chapter))];

        let chaptersHtml = '';
        if (chapters.length > 0) {
            chaptersHtml = `
                <div style="margin-bottom: var(--spacing-lg);">
                    <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); color: var(--color-text-secondary);">
                        Chapitres
                    </h3>
                    <div class="flex flex-wrap" style="gap: var(--spacing-md);">
                        ${chapters.map(chapter => `
                            <button class="btn btn-secondary chapter-btn" data-chapter="${chapter}">
                                ${chapter}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        let examsHtml = '';
        if (exams.length > 0) {
            examsHtml = `
                <div class="grid grid-2">
                    ${exams.map(exam => ExamCard.render(exam)).join('')}
                </div>
            `;
        } else {
            examsHtml = `
                <div class="empty-state">
                    <div class="empty-state-icon">${this.subjectEmoji[this.subject]}</div>
                    <div class="empty-state-title">Aucun sujet en ${this.subject}</div>
                    <div class="empty-state-description">Importez des sujets d'examens ou réinitialisez les filtres.</div>
                </div>
            `;
        }

        const html = `
            <div class="content-wrapper">
                <div class="breadcrumb">
                    <span class="breadcrumb-item" style="cursor: pointer;" onclick="window.router.navigate('dashboard')">Tableau de bord</span>
                    <span class="breadcrumb-separator">/</span>
                    <span>${this.subject}</span>
                </div>

                <div class="page-header">
                    <h1 class="page-title">${this.subjectEmoji[this.subject]} ${this.subject}</h1>
                    <p class="page-subtitle">${count} sujet${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}</p>
                </div>

                ${chaptersHtml}

                <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); color: var(--color-text-secondary);">
                    Tous les sujets
                </h3>
                ${examsHtml}
            </div>
        `;

        setTimeout(() => {
            ExamCard.attachListeners();
            document.querySelectorAll('.chapter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const chapter = btn.dataset.chapter;
                    state.updateFilter('chapter', chapter);
                    state.updateFilter('subject', this.subject);
                    window.router.navigate('subject', { subject: this.subject, chapter });
                });
            });
        }, 0);

        return html;
    }

    cleanup() {
        // Cleanup if needed
    }
}

export class PhysicsPage extends SubjectPage {
    constructor(params = {}) {
        super({ ...params, subject: 'Physique' });
    }
}

export class ChemistryPage extends SubjectPage {
    constructor(params = {}) {
        super({ ...params, subject: 'Chimie' });
    }
}

export class MathematicsPage extends SubjectPage {
    constructor(params = {}) {
        super({ ...params, subject: 'Mathématiques' });
    }
}

export default SubjectPage;
