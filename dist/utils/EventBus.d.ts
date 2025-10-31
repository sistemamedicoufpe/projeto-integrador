export declare class EventBus {
    private static listeners;
    static on(event: string, callback: Function): void;
    static off(event: string, callback: Function): void;
    static emit(event: string, data?: any): void;
    static clear(): void;
}
export declare const Events: {
    PACIENTE_CRIADO: string;
    PACIENTE_ATUALIZADO: string;
    PACIENTE_STATUS_ALTERADO: string;
    AVALIACAO_CRIADA: string;
    AVALIACAO_ATUALIZADA: string;
    AVALIACAO_EXCLUIDA: string;
    DADOS_ALTERADOS: string;
};
//# sourceMappingURL=EventBus.d.ts.map