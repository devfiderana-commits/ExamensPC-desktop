/**
 * Import page for real files
 */

import examRepository from '../storage/examRepository.js';
import router from '../router.js';

class ImportPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        const html = `
            <div class="content-wrapper">
                <div class="page-header">
                    <h1 class="page-title">📥 Importer un sujet</h1>
                    <p class="page-subtitle">Ajoutez un vrai PDF ou une image de sujet dans votre bibliothèque locale.</p>
                </div>

                <div class="card" style="max-width: 720px; margin: 0 auto;">
                    <form id="import-form" class="flex flex-column" style="gap: var(--spacing-lg);">
                        <div class="form-group">
                            <label for="exam-title">Titre</label>
                            <input id="exam-title" name="title" type="text" placeholder="Ex : Examen Mécanique - 2025" required />
                        </div>

                        <div class="grid grid-2">
                            <div class="form-group">
                                <label for="exam-subject">Matière</label>
                                <select id="exam-subject" name="subject" required>
                                    <option value="Physique">Physique</option>
                                    <option value="Chimie">Chimie</option>
                                    <option value="Mathématiques">Mathématiques</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exam-chapter">Chapitre</label>
                                <input id="exam-chapter" name="chapter" type="text" placeholder="Ex : Mécanique" required />
                            </div>
                        </div>

                        <div class="grid grid-2">
                            <div class="form-group">
                                <label for="exam-year">Année</label>
                                <input id="exam-year" name="year" type="number" min="2000" max="2100" value="2026" required />
                            </div>
                            <div class="form-group">
                                <label for="exam-session">Session</label>
                                <select id="exam-session" name="session">
                                    <option value="Normale">Normale</option>
                                    <option value="Rattrapage">Rattrapage</option>
                                    <option value="Partiel">Partiel</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="exam-file">Fichier du sujet</label>
                            <input id="exam-file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
                        </div>

                        <div class="flex" style="gap: var(--spacing-md);">
                            <button type="submit" class="btn btn-primary">Importer</button>
                            <button type="button" class="btn btn-secondary" id="cancel-btn">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        setTimeout(() => this.attachListeners(), 0);
        return html;
    }

    attachListeners() {
        const form = document.querySelector('#import-form');
        if (!form) return;

        // Prevent attaching listeners multiple times
        if (form.dataset.attached) return;
        form.dataset.attached = '1';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fileInput = document.querySelector('#exam-file');
            const titleInput = document.querySelector('#exam-title');
            const subjectInput = document.querySelector('#exam-subject');
            const chapterInput = document.querySelector('#exam-chapter');
            const yearInput = document.querySelector('#exam-year');
            const sessionInput = document.querySelector('#exam-session');

            const file = fileInput?.files?.[0];
            if (!file) {
                alert('Veuillez sélectionner un fichier PDF, JPG ou PNG.');
                return;
            }

            const title = titleInput.value.trim();
            const subject = subjectInput.value;
            const chapter = chapterInput.value.trim();
            const year = Number(yearInput.value || new Date().getFullYear());
            const session = sessionInput.value;

            try {
                const exam = await examRepository.importExamFromFile(file, {
                    title,
                    subject,
                    chapter,
                    year,
                    session
                });

                if (exam && exam.id) {
                    router.navigate('viewer', { examId: exam.id });
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert(error?.message || 'Une erreur est survenue pendant l’import.');
            }
        });

        // Cancel button listener
        const cancelBtn = document.querySelector('#cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate('dashboard');
            });
        }
    }

    async mounted() {
        this.attachListeners();
    }

    async afterRender() {
        this.attachListeners();
    }

    cleanup() {
        // nothing
    }
}

export default ImportPage;
