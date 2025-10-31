import { AvaliacaoCognitiva, CriarAvaliacaoCognitiva } from '../models/AvaliacaoCognitiva';
export declare class AvaliacaoService {
    private static readonly AVALIACOES_KEY;
    static criarAvaliacao(dados: CriarAvaliacaoCognitiva): {
        sucesso: boolean;
        mensagem: string;
        avaliacao?: AvaliacaoCognitiva;
    };
    static atualizarAvaliacao(id: string, dados: Partial<AvaliacaoCognitiva>): {
        sucesso: boolean;
        mensagem: string;
    };
    static obterPorId(id: string): AvaliacaoCognitiva | null;
    static obterTodas(): AvaliacaoCognitiva[];
    static obterPorPaciente(pacienteId: string): AvaliacaoCognitiva[];
    static obterPorMedico(medicoId: string): AvaliacaoCognitiva[];
    static excluirAvaliacao(id: string): {
        sucesso: boolean;
        mensagem: string;
    };
    private static gerarId;
    static obterEstatisticas(): {
        total: number;
        porTipo: Record<string, number>;
        mediaPercentual: number;
    };
}
//# sourceMappingURL=AvaliacaoService.d.ts.map