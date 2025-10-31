export declare class Helpers {
    static formatarCPF(cpf: string): string;
    static formatarTelefone(telefone: string): string;
    static formatarCEP(cep: string): string;
    static validarEmail(email: string): boolean;
    static validarCPF(cpf: string): boolean;
    static calcularIdade(dataNascimento: Date | string): number;
    static mostrarNotificacao(mensagem: string, tipo?: 'success' | 'error' | 'warning' | 'info'): void;
    static formatarDataBR(data: Date | string): string;
    static formatarDataHoraBR(data: Date | string): string;
    static dataParaInput(data: Date | string): string;
    static confirmar(mensagem: string): boolean;
    static imageToBase64(file: File): Promise<string>;
}
//# sourceMappingURL=helpers.d.ts.map