export declare class RelatorioService {
    static gerarRelatorioPaciente(pacienteId: string): string;
    static gerarRelatorioAvaliacao(avaliacaoId: string): string;
    static gerarRelatorioGeral(): string;
    static downloadRelatorio(html: string, nomeArquivo: string): void;
    private static formatarData;
    private static formatarDataHora;
}
//# sourceMappingURL=RelatorioService.d.ts.map