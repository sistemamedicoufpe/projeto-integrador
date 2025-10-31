export class EventBus {
    static on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }
    static off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }
    static emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
    static clear() {
        this.listeners.clear();
    }
}
EventBus.listeners = new Map();
// Eventos disponíveis
export const Events = {
    PACIENTE_CRIADO: 'paciente:criado',
    PACIENTE_ATUALIZADO: 'paciente:atualizado',
    PACIENTE_STATUS_ALTERADO: 'paciente:status',
    AVALIACAO_CRIADA: 'avaliacao:criada',
    AVALIACAO_ATUALIZADA: 'avaliacao:atualizada',
    AVALIACAO_EXCLUIDA: 'avaliacao:excluida',
    DADOS_ALTERADOS: 'dados:alterados'
};
//# sourceMappingURL=EventBus.js.map