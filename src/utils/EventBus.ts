export class EventBus {
  private static listeners: Map<string, Set<Function>> = new Map();

  static on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  static off(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  static emit(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data));
    }
  }

  static clear(): void {
    this.listeners.clear();
  }
}

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
