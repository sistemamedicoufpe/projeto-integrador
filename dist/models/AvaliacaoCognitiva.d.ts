export interface AvaliacaoCognitiva {
    id: string;
    pacienteId: string;
    pacienteNome: string;
    medicoId: string;
    medicoNome: string;
    dataAvaliacao: Date;
    tipoAvaliacao: 'MEEM' | 'MoCA' | 'Clock Drawing' | 'Fluência Verbal' | 'Outro';
    pontuacao: number;
    pontuacaoMaxima: number;
    percentual: number;
    dominios: {
        memoria: number;
        atencao: number;
        linguagem: number;
        funcaoExecutiva: number;
        habilidadeVisuoespacial: number;
    };
    observacoes?: string;
    diagnosticoPrelimilar?: string;
    recomendacoes?: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}
export interface CriarAvaliacaoCognitiva {
    pacienteId: string;
    medicoId: string;
    dataAvaliacao: Date;
    tipoAvaliacao: 'MEEM' | 'MoCA' | 'Clock Drawing' | 'Fluência Verbal' | 'Outro';
    pontuacao: number;
    pontuacaoMaxima: number;
    dominios: {
        memoria: number;
        atencao: number;
        linguagem: number;
        funcaoExecutiva: number;
        habilidadeVisuoespacial: number;
    };
    observacoes?: string;
    diagnosticoPrelimilar?: string;
    recomendacoes?: string;
}
//# sourceMappingURL=AvaliacaoCognitiva.d.ts.map