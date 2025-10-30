// types.ts
export interface Medico {
    id: number;
    nome: string;
    email: string;
    senha: string;
    crm: string;
    especialidade: string;
    avatar: string;
}

export interface Paciente {
    id: number;
    medicoId: number;
    nome: string;
    idade: number;
    codigo: string;
    ultimaConsulta: string;
    dataNascimento: string;
    genero: string;
    contato: string;
    responsavel: string;
    historicoFamiliar: string;
    comorbidades: string;
    testes: Teste[];
    risco: string;
    descricaoRisco: string;
    recomendacoes: string[];
    ativo: boolean;
}

export interface Teste {
    id: number;
    nome: string;
    status: 'concluido' | 'pendente';
    pontuacao: string;
    dataAplicacao?: string;
    observacoes?: string;
}

export interface Diagnostico {
    id: number;
    pacienteId: number;
    medicoId: number;
    descricao: string;
    data: string;
    testesRelacionados: number[];
    gravidade: 'leve' | 'moderado' | 'grave';
}

export interface Estatisticas {
    pacientesAtivos: number;
    testesRealizados: number;
    diagnosticos: number;
}

export interface AppState {
    usuarioLogado: Medico | null;
    pacienteSelecionado: Paciente | null;
    grafico: any;
    view: 'dashboard' | 'pacientes' | 'testes' | 'diagnosticos' | 'relatorios';
}

export interface NovoPacienteData {
    nome: string;
    dataNascimento: string;
    genero: string;
    contato: string;
    responsavel: string;
    historicoFamiliar: string;
    comorbidades: string;
}