/**
 * Tauri API Shim
 * Permet à l'application de fonctionner sans Tauri (mode web)
 * À utiliser uniquement pour développement/tests
 */

class TauriStub {
    constructor() {
        this.initialized = false;
    }

    async invoke(command, args = {}) {
        console.log(`[Tauri Stub] invoke: ${command}`, args);

        switch (command) {
            case 'get_app_data_dir':
                return Promise.resolve(navigator.storage?.getDirectory?.() || '/app-data');

            case 'read_file':
                return Promise.resolve(new Uint8Array([0, 0, 0, 0]));

            case 'get_file_metadata':
                return Promise.resolve({
                    size: 1024000,
                    modified: Date.now()
                });

            default:
                console.warn(`[Tauri Stub] Unknown command: ${command}`);
                return Promise.resolve(null);
        }
    }
}

// Export based on environment
let tauriStub;

if (typeof window !== 'undefined') {
    tauriStub = new TauriStub();
    window.__TAURI__ = {
        invoke: (cmd, args) => tauriStub.invoke(cmd, args)
    };
}

export default tauriStub;

/**
 * Mock @tauri-apps/api module
 * Usage: import { invoke } from '@tauri-apps/api/tauri'
 */
export const invoke = (command, args) => {
    if (typeof window !== 'undefined' && window.__TAURI__?.invoke) {
        return window.__TAURI__.invoke(command, args);
    }
    return tauriStub.invoke(command, args);
};
