/**
 * Storage abstraction layer backed by SQLite when running in Tauri,
 * with localStorage fallback for safe web development.
 */

import { invoke } from '../tauri-shim.js';

const STORAGE_PREFIX = 'examens_';
const STORAGE_KEYS = {
    EXAMS: 'exams',
    FAVORITES: 'favorites',
    SETTINGS: 'settings',
    RECENT: 'recent'
};

const normalizeExam = (exam = {}) => ({
    id: exam.id || exam.exam_id || `exam_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    title: exam.title || exam.titre || 'Sujet sans titre',
    subject: exam.subject || 'Physique',
    chapter: exam.chapter || 'General',
    year: Number(exam.year || new Date().getFullYear()),
    session: exam.session || 'Normale',
    filePath: exam.file_path || exam.filePath || '',
    fileType: (exam.file_type || exam.fileType || 'pdf').toLowerCase(),
    favorite: Boolean(exam.favorite),
    createdAt: exam.created_at || exam.createdAt || exam.date_ajout || new Date().toISOString(),
    lastOpenedAt: exam.last_opened_at || exam.lastOpenedAt || null,
    dateModification: exam.date_modification || exam.dateModification || exam.createdAt || null
});

class ExamRepository {
    constructor() {
        this.exams = [];
        this.favorites = [];
        this.recent = [];
        this.settings = {
            theme: 'light',
            language: 'fr'
        };
    }

    isTauriAvailable() {
        return typeof window !== 'undefined' && !!window.__TAURI__?.invoke;
    }

    async initializeStorage() {
        if (this.isTauriAvailable()) {
            try {
                await invoke('init_database');
                await this.refreshFromDb();
                return;
            } catch (error) {
                console.warn('SQLite initialization failed, falling back to localStorage:', error);
            }
        }

        this.exams = this.getLocalExams();
        this.favorites = this.getLocalFavorites();
        this.recent = this.getLocalRecent();
        this.settings = this.getSettings() || { theme: 'light', language: 'fr' };

        if (!this.exams.length) {
            this.exams = [];
        }
        if (!this.favorites.length) {
            this.favorites = [];
        }
        if (!this.recent.length) {
            this.recent = [];
        }
    }

    async refreshFromDb() {
        const exams = await invoke('list_exams');
        const favorites = await invoke('get_favorites');
        const recent = await invoke('get_recent');
        const settings = await invoke('get_settings');

        this.exams = (exams || []).map(normalizeExam);
        this.favorites = favorites || [];
        this.recent = recent || [];
        this.settings = settings || { theme: 'light', language: 'fr' };

        this.exams = this.exams.map(exam => ({
            ...exam,
            favorite: this.favorites.includes(exam.id)
        }));
    }

    getLocalExams() {
        const data = localStorage.getItem(this.getKey(STORAGE_KEYS.EXAMS));
        return data ? JSON.parse(data).map(normalizeExam) : [];
    }

    getLocalFavorites() {
        const data = localStorage.getItem(this.getKey(STORAGE_KEYS.FAVORITES));
        return data ? JSON.parse(data) : [];
    }

    getLocalRecent() {
        const data = localStorage.getItem(this.getKey(STORAGE_KEYS.RECENT));
        return data ? JSON.parse(data) : [];
    }

    getExams() {
        return this.exams;
    }

    setExams(exams) {
        this.exams = Array.isArray(exams) ? exams.map(normalizeExam) : [];
        if (!this.isTauriAvailable()) {
            localStorage.setItem(this.getKey(STORAGE_KEYS.EXAMS), JSON.stringify(this.exams));
        }
    }

    async addExam(exam) {
        const normalizedExam = normalizeExam({
            ...exam,
            id: exam.id || this.generateId(),
            createdAt: exam.createdAt || new Date().toISOString(),
            favorite: Boolean(exam.favorite)
        });

        if (this.isTauriAvailable()) {
            const created = await invoke('create_exam', {
                exam: {
                    id: normalizedExam.id,
                    title: normalizedExam.title,
                    subject: normalizedExam.subject,
                    chapter: normalizedExam.chapter,
                    year: normalizedExam.year,
                    session: normalizedExam.session,
                    file_path: normalizedExam.filePath,
                    file_type: normalizedExam.fileType,
                    favorite: normalizedExam.favorite
                }
            });
            this.exams = [normalizeExam(created), ...this.exams];
            return normalizeExam(created);
        }

        this.exams = [normalizedExam, ...this.exams];
        this.setExams(this.exams);
        return normalizedExam;
    }

    async updateExam(id, updates) {
        const index = this.exams.findIndex(exam => exam.id === id);
        if (index === -1) return null;

        const updatedExam = normalizeExam({
            ...this.exams[index],
            ...updates,
            id,
            favorite: Boolean(updates.favorite ?? this.exams[index].favorite)
        });

        this.exams[index] = updatedExam;

        if (this.isTauriAvailable()) {
            await invoke('create_exam', {
                exam: {
                    id: updatedExam.id,
                    title: updatedExam.title,
                    subject: updatedExam.subject,
                    chapter: updatedExam.chapter,
                    year: updatedExam.year,
                    session: updatedExam.session,
                    file_path: updatedExam.filePath,
                    file_type: updatedExam.fileType,
                    favorite: updatedExam.favorite
                }
            });
        } else {
            this.setExams(this.exams);
        }

        return updatedExam;
    }

    async deleteExam(id) {
        this.exams = this.exams.filter(exam => exam.id !== id);
        this.recent = this.recent.filter(examId => examId !== id);
        this.favorites = this.favorites.filter(examId => examId !== id);

        if (this.isTauriAvailable()) {
            await invoke('delete_exam', { examId: id });
        } else {
            localStorage.setItem(this.getKey(STORAGE_KEYS.EXAMS), JSON.stringify(this.exams));
            localStorage.setItem(this.getKey(STORAGE_KEYS.RECENT), JSON.stringify(this.recent));
            localStorage.setItem(this.getKey(STORAGE_KEYS.FAVORITES), JSON.stringify(this.favorites));
        }
    }

    getExamById(id) {
        return this.exams.find(exam => exam.id === id) || null;
    }

    getExamsBySubject(subject) {
        return this.exams.filter(exam => exam.subject === subject);
    }

    getExamsByChapter(chapter) {
        return this.exams.filter(exam => exam.chapter === chapter);
    }

    getExamsByYear(year) {
        return this.exams.filter(exam => Number(exam.year) === Number(year));
    }

    searchExams(query = '') {
        const lowerQuery = (query || '').trim().toLowerCase();
        if (!lowerQuery) return [...this.exams];

        return this.exams.filter(exam =>
            (exam.title || '').toLowerCase().includes(lowerQuery) ||
            (exam.subject || '').toLowerCase().includes(lowerQuery) ||
            (exam.chapter || '').toLowerCase().includes(lowerQuery) ||
            (exam.session || '').toLowerCase().includes(lowerQuery) ||
            String(exam.year || '').includes(lowerQuery)
        );
    }

    getFavorites() {
        return this.favorites;
    }

    setFavorites(favorites) {
        this.favorites = Array.isArray(favorites) ? favorites : [];
        if (!this.isTauriAvailable()) {
            localStorage.setItem(this.getKey(STORAGE_KEYS.FAVORITES), JSON.stringify(this.favorites));
        }
    }

    async toggleFavorite(examId) {
        const exam = this.getExamById(examId);
        if (!exam) return false;

        if (this.isTauriAvailable()) {
            const nextFavorite = await invoke('toggle_favorite', { examId });
            this.exams = this.exams.map(item => item.id === examId ? { ...item, favorite: nextFavorite } : item);
            this.favorites = this.exams.filter(item => item.favorite).map(item => item.id);
            return nextFavorite;
        }

        const nextFavorite = !exam.favorite;
        this.exams = this.exams.map(item => item.id === examId ? { ...item, favorite: nextFavorite } : item);
        this.favorites = this.exams.filter(item => item.favorite).map(item => item.id);
        this.setFavorites(this.favorites);
        this.setExams(this.exams);
        return nextFavorite;
    }

    removeFavorite(examId) {
        this.exams = this.exams.map(exam => exam.id === examId ? { ...exam, favorite: false } : exam);
        this.favorites = this.favorites.filter(id => id !== examId);
    }

    getFavoriteExams() {
        return this.exams.filter(exam => exam.favorite);
    }

    getRecent() {
        return this.recent;
    }

    setRecent(recent) {
        this.recent = Array.isArray(recent) ? recent : [];
        if (!this.isTauriAvailable()) {
            localStorage.setItem(this.getKey(STORAGE_KEYS.RECENT), JSON.stringify(this.recent));
        }
    }

    async addToRecent(examId) {
        const exam = this.getExamById(examId);
        if (!exam) return null;

        if (this.isTauriAvailable()) {
            const ids = await invoke('add_to_recent', { examId });
            this.recent = ids || [];
            this.exams = this.exams.map(item => item.id === examId ? { ...item, lastOpenedAt: new Date().toISOString() } : item);
            return exam;
        }

        this.recent = [examId, ...this.recent.filter(id => id !== examId)].slice(0, 20);
        this.setRecent(this.recent);
        this.exams = this.exams.map(item => item.id === examId ? { ...item, lastOpenedAt: new Date().toISOString() } : item);
        return exam;
    }

    removeRecent(examId) {
        this.recent = this.recent.filter(id => id !== examId);
    }

    getRecentExams() {
        const ids = this.recent || [];
        return ids
            .map(id => this.getExamById(id))
            .filter(Boolean);
    }

    getSettings() {
        const data = localStorage.getItem(this.getKey(STORAGE_KEYS.SETTINGS));
        if (data) {
            try {
                return JSON.parse(data);
            } catch {
                return { theme: 'light', language: 'fr' };
            }
        }
        return { theme: 'light', language: 'fr' };
    }

    setSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        localStorage.setItem(this.getKey(STORAGE_KEYS.SETTINGS), JSON.stringify(this.settings));
    }

    updateSettings(updates) {
        const updated = { ...this.settings, ...updates };
        this.setSettings(updated);
        return updated;
    }

    async importExamFromFile(file, metadata = {}) {
        const extension = (file.name.split('.').pop() || metadata.fileType || 'pdf').toLowerCase();
        const fileType = ['pdf', 'jpg', 'jpeg', 'png'].includes(extension) ? extension : 'pdf';
        const fileBuffer = await file.arrayBuffer();
        const content = Array.from(new Uint8Array(fileBuffer));

        const payload = {
            title: metadata.title || file.name,
            subject: metadata.subject || 'Physique',
            chapter: metadata.chapter || 'General',
            year: Number(metadata.year || new Date().getFullYear()),
            session: metadata.session || 'Normale',
            file_name: file.name,
            file_type: fileType,
            content
        };

        if (this.isTauriAvailable()) {
            const created = await invoke('import_exam', { payload });
            const normalized = normalizeExam(created);
            this.exams = [normalized, ...this.exams];
            return normalized;
        }

        const exam = normalizeExam({
            id: this.generateId(),
            title: payload.title,
            subject: payload.subject,
            chapter: payload.chapter,
            year: payload.year,
            session: payload.session,
            file_path: file.name,
            file_type: fileType,
            favorite: false,
            created_at: new Date().toISOString(),
            last_opened_at: null
        });

        this.exams = [exam, ...this.exams];
        this.setExams(this.exams);
        return exam;
    }

    getStatistics() {
        const stats = {
            totalExams: this.exams.length,
            favorites: this.exams.filter(e => e.favorite).length,
            bySubject: {
                'Physique': 0,
                'Chimie': 0,
                'Mathématiques': 0
            },
            byYear: {},
            bySession: {}
        };

        for (const exam of this.exams) {
            if (stats.bySubject.hasOwnProperty(exam.subject)) {
                stats.bySubject[exam.subject]++;
            }
            
            const year = exam.year;
            stats.byYear[year] = (stats.byYear[year] || 0) + 1;
            
            const session = exam.session || 'Non spécifiée';
            stats.bySession[session] = (stats.bySession[session] || 0) + 1;
        }

        return stats;
    }

    getKey(key) {
        return STORAGE_PREFIX + key;
    }

    generateId() {
        return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    clearAll() {
        this.exams = [];
        this.favorites = [];
        this.recent = [];
        localStorage.removeItem(this.getKey(STORAGE_KEYS.EXAMS));
        localStorage.removeItem(this.getKey(STORAGE_KEYS.FAVORITES));
        localStorage.removeItem(this.getKey(STORAGE_KEYS.RECENT));
        localStorage.removeItem(this.getKey(STORAGE_KEYS.SETTINGS));
    }
}

export default new ExamRepository();
