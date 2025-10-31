export class StorageService {
    static set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.PREFIX + key, serialized);
        }
        catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }
    static get(key) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            if (!item)
                return null;
            return JSON.parse(item);
        }
        catch (error) {
            console.error('Erro ao recuperar do localStorage:', error);
            return null;
        }
    }
    static remove(key) {
        localStorage.removeItem(this.PREFIX + key);
    }
    static clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
    static getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.PREFIX))
            .map(key => key.replace(this.PREFIX, ''));
    }
}
StorageService.PREFIX = 'clinica_neuro_';
//# sourceMappingURL=StorageService.js.map