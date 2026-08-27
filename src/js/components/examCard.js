/**
 * Exam Card Component
 */

import { getFileIcon, formatDate } from '../utils.js';
import examRepository from '../storage/examRepository.js';
import router from '../router.js';

export class ExamCard {
    static render(exam) {
        const isFavorite = exam.favorite ? '⭐' : '☆';
        const fileIcon = getFileIcon(exam.fileType);

        return `
            <div class="card card-clickable" data-exam-id="${exam.id}">
                <div class="card-header">
                    <div>
                        <div class="card-title">${exam.title}</div>
                        <div class="card-subtitle">${exam.subject} - ${exam.chapter}</div>
                    </div>
                </div>

                <div class="card-meta">
                    <div class="card-meta-item">
                        <span>📅</span>
                        <span>${exam.year}</span>
                    </div>
                    <div class="card-meta-item">
                        <span>🗂️</span>
                        <span>${exam.session || 'Non spécifiée'}</span>
                    </div>
                    <div class="card-meta-item">
                        <span>${fileIcon}</span>
                        <span>${exam.fileType.toUpperCase()}</span>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn btn-small btn-primary open-btn" data-exam-id="${exam.id}">
                        📖 Ouvrir
                    </button>
                    <button class="btn btn-small btn-ghost favorite-btn" data-exam-id="${exam.id}" title="Ajouter aux favoris">
                        ${isFavorite}
                    </button>
                </div>
            </div>
        `;
    }

    static attachListeners() {
        document.querySelectorAll('[data-exam-id]').forEach(card => {
            // Avoid re-attaching listeners
            if (card.dataset.listenersAttached) return;
            card.dataset.listenersAttached = '1';

            const examId = card.dataset.examId;
            const openBtn = card.querySelector('.open-btn');
            const favoriteBtn = card.querySelector('.favorite-btn');

            if (openBtn) {
                openBtn.addEventListener('click', () => {
                    examRepository.addToRecent(examId);
                    router.navigate('viewer', { examId });
                });
            }

            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        const isFavorite = await examRepository.toggleFavorite(examId);
                        favoriteBtn.textContent = isFavorite ? '⭐' : '☆';
                    } catch (err) {
                        console.error('toggleFavorite failed:', err);
                    }
                });
            }

            // Click card to open
            card.addEventListener('click', () => {
                examRepository.addToRecent(examId);
                router.navigate('viewer', { examId });
            });
        });
    }
}

export default ExamCard;
