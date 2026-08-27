/**
 * Document Viewer Page
 * Supports PDF (with PDF.js) and images
 */

import examRepository from '../storage/examRepository.js';
import router from '../router.js';
import { getFileIcon } from '../utils.js';

// PDF.js library initialization
let pdfjsLib = null;
if (typeof window !== 'undefined' && window.pdfjsLib) {
    pdfjsLib = window.pdfjsLib;
}

const toFileUrl = (filePath) => {
    if (!filePath) return '';
    const normalized = filePath.replace(/\\/g, '/');
    if (normalized.startsWith('file://')) return normalized;
    if (normalized.startsWith('/')) return `file://${normalized}`;
    return normalized;
};

export class ViewerPage {
    constructor(params = {}) {
        this.params = params;
        this.examId = params.examId;
        this.exam = examRepository.getExamById(this.examId);
        this.currentPage = 1;
        this.totalPages = 0;
        this.zoomLevel = 1.0;
        this.pdfDoc = null;
    }

    async render() {
        if (!this.exam) {
            return `
                <div class="content-wrapper">
                    <div class="empty-state">
                        <div class="empty-state-icon">❌</div>
                        <div class="empty-state-title">Sujet non trouvé</div>
                        <button class="btn btn-primary" onclick="window.router.navigate('dashboard')">
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            `;
        }

        // Mark as recently viewed
        await examRepository.addToRecent(this.examId);

        const fileIcon = getFileIcon(this.exam.fileType);
        const isFavorite = this.exam.favorite ? '⭐' : '☆';
        const viewerContent = this.getViewerContent();

        const html = `
            <div class="content-wrapper">
                <div class="flex flex-between" style="margin-bottom: var(--spacing-lg); align-items: center;">
                    <div>
                        <div class="breadcrumb">
                            <span class="breadcrumb-item" style="cursor: pointer;" onclick="window.router.navigate('dashboard')">Tableau de bord</span>
                            <span class="breadcrumb-separator">/</span>
                            <span class="breadcrumb-item" style="cursor: pointer;" onclick="window.router.navigate('subject', { subject: '${this.exam.subject}' })">
                                ${this.exam.subject}
                            </span>
                            <span class="breadcrumb-separator">/</span>
                            <span>${this.exam.chapter}</span>
                        </div>
                        <h1 class="page-title">${this.exam.title}</h1>
                    </div>
                    <button class="btn btn-icon" id="favorite-btn" data-exam-id="${this.exam.id}">
                        ${isFavorite}
                    </button>
                </div>

                <div class="card" style="margin-bottom: var(--spacing-lg);">
                    <div class="flex flex-wrap">
                        <div class="flex flex-column">
                            <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase;">Matière</span>
                            <span>${this.exam.subject}</span>
                        </div>
                        <div class="flex flex-column">
                            <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase;">Chapitre</span>
                            <span>${this.exam.chapter}</span>
                        </div>
                        <div class="flex flex-column">
                            <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase;">Année</span>
                            <span>${this.exam.year}</span>
                        </div>
                        <div class="flex flex-column">
                            <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase;">Session</span>
                            <span>${this.exam.session || 'Non spécifiée'}</span>
                        </div>
                        <div class="flex flex-column">
                            <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase;">Type</span>
                            <span>${fileIcon} ${this.exam.fileType.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div class="card" style="background-color: var(--color-bg-secondary); min-height: 600px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-direction: column; position: relative;">
                    ${viewerContent}
                </div>

                <div style="margin-top: var(--spacing-lg);">
                    <button class="btn btn-secondary" onclick="window.router.goBack()">
                        ← Retour
                    </button>
                </div>
            </div>
        `;

        setTimeout(async () => {
            const favoriteBtn = document.querySelector('#favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', async () => {
                    const isFav = await examRepository.toggleFavorite(this.exam.id);
                    favoriteBtn.textContent = isFav ? '⭐' : '☆';
                });
            }

            // Initialize PDF viewer if needed
            if (this.exam.fileType.toLowerCase() === 'pdf') {
                await this.initializePdfViewer();
            }
        }, 0);

        return html;
    }

    getViewerContent() {
        const fileType = (this.exam.fileType || '').toLowerCase();
        const fileIcon = getFileIcon(fileType);
        const fileUrl = toFileUrl(this.exam.filePath);

        if (!this.exam.filePath) {
            return `
                <div style="text-align: center;">
                    <div style="font-size: 64px; margin-bottom: var(--spacing-lg);">${fileIcon}</div>
                    <div style="color: var(--color-text-secondary); font-size: var(--font-size-lg);">
                        Aucun fichier associé
                    </div>
                    <div style="color: var(--color-text-tertiary); margin-top: var(--spacing-md); font-size: var(--font-size-sm);">
                        Importez un vrai sujet pour le visualiser ici.
                    </div>
                </div>
            `;
        }

        if (fileType === 'pdf') {
            return `
                <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
                    <div id="pdf-controls" style="display: flex; align-items: center; justify-content: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-bg); border-bottom: 1px solid var(--color-border);">
                        <button class="btn btn-sm" id="pdf-prev" title="Page précédente">← Préc</button>
                        <span id="pdf-page-info" style="min-width: 100px; text-align: center;">-</span>
                        <button class="btn btn-sm" id="pdf-next" title="Page suivante">Suiv →</button>
                        <span style="margin-left: var(--spacing-md); border-left: 1px solid var(--color-border); padding-left: var(--spacing-md); display: flex; gap: var(--spacing-sm);">
                            <button class="btn btn-sm" id="pdf-zoom-out" title="Zoom moins">−</button>
                            <span id="pdf-zoom-info" style="min-width: 60px; text-align: center;">100%</span>
                            <button class="btn btn-sm" id="pdf-zoom-in" title="Zoom plus">+</button>
                            <button class="btn btn-sm" id="pdf-zoom-reset" title="Réinitialiser">Reset</button>
                        </span>
                    </div>
                    <div id="pdf-container" style="flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
                        <canvas id="pdf-canvas" style="max-width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"></canvas>
                    </div>
                </div>
            `;
        }

        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileType)) {
            return `
                <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-bg); border-bottom: 1px solid var(--color-border);">
                        <button class="btn btn-sm" id="img-zoom-out" title="Zoom moins">−</button>
                        <span id="img-zoom-info" style="min-width: 60px; text-align: center;">100%</span>
                        <button class="btn btn-sm" id="img-zoom-in" title="Zoom plus">+</button>
                        <button class="btn btn-sm" id="img-zoom-reset" title="Réinitialiser">Reset</button>
                    </div>
                    <div id="image-container" style="flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
                        <img id="image-viewer" src="${fileUrl}" alt="Sujet d'examen" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                    </div>
                </div>
            `;
        }

        return `
            <div style="text-align: center;">
                <div style="font-size: 64px; margin-bottom: var(--spacing-lg);">${fileIcon}</div>
                <div style="color: var(--color-text-secondary); font-size: var(--font-size-lg);">
                    Format de fichier non supporté
                </div>
                <div style="color: var(--color-text-tertiary); margin-top: var(--spacing-md); font-size: var(--font-size-sm);">
                    Type : ${fileType.toUpperCase()}
                </div>
            </div>
        `;
    }

    async initializePdfViewer() {
        if (!pdfjsLib) {
            console.warn('PDF.js not loaded. Attempting to load...');
            // Try to load PDF.js from CDN
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib = window.pdfjsLib;
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                this.renderPdfPage();
            };
            document.head.appendChild(script);
            return;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        this.renderPdfPage();
    }

    async renderPdfPage() {
        try {
            const fileUrl = toFileUrl(this.exam.filePath);
            const canvas = document.querySelector('#pdf-canvas');
            if (!canvas) return;

            // Load PDF
            const pdf = await pdfjsLib.getDocument(fileUrl).promise;
            this.pdfDoc = pdf;
            this.totalPages = pdf.numPages;
            this.currentPage = 1;

            // Render first page
            await this.displayPage(this.currentPage);

            // Attach controls
            this.attachPdfControls();
        } catch (error) {
            console.error('Failed to load PDF:', error);
            const container = document.querySelector('#pdf-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; color: var(--color-text-secondary);">
                        <div style="font-size: 48px; margin-bottom: var(--spacing-md);">❌</div>
                        <div>Impossible de charger le PDF</div>
                        <div style="font-size: var(--font-size-sm); margin-top: var(--spacing-sm);">
                            ${error.message || 'Une erreur est survenue'}
                        </div>
                    </div>
                `;
            }
        }
    }

    async displayPage(pageNum) {
        if (!this.pdfDoc || pageNum < 1 || pageNum > this.totalPages) return;

        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const canvas = document.querySelector('#pdf-canvas');
            const context = canvas.getContext('2d');
            const scale = this.zoomLevel;
            const viewport = page.getViewport({ scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // Update page info
            const pageInfo = document.querySelector('#pdf-page-info');
            if (pageInfo) {
                pageInfo.textContent = `${pageNum} / ${this.totalPages}`;
            }
        } catch (error) {
            console.error('Failed to render page:', error);
        }
    }

    attachPdfControls() {
        const prevBtn = document.querySelector('#pdf-prev');
        const nextBtn = document.querySelector('#pdf-next');
        const zoomIn = document.querySelector('#pdf-zoom-in');
        const zoomOut = document.querySelector('#pdf-zoom-out');
        const zoomReset = document.querySelector('#pdf-zoom-reset');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.displayPage(this.currentPage);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.displayPage(this.currentPage);
                }
            });
        }

        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                this.zoomLevel = Math.min(this.zoomLevel + 0.2, 3.0);
                this.displayPage(this.currentPage);
                this.updateZoomInfo();
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.5);
                this.displayPage(this.currentPage);
                this.updateZoomInfo();
            });
        }

        if (zoomReset) {
            zoomReset.addEventListener('click', () => {
                this.zoomLevel = 1.0;
                this.displayPage(this.currentPage);
                this.updateZoomInfo();
            });
        }
    }

    updateZoomInfo() {
        const zoomInfo = document.querySelector('#pdf-zoom-info');
        if (zoomInfo) {
            zoomInfo.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }

    cleanup() {
        this.pdfDoc = null;
    }
}

export default ViewerPage;
