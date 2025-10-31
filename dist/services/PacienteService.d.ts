import { Paciente } from '../models/Paciente';
export declare class PacienteService {
    private static readonly PACIENTES_KEY;
    static criarPaciente(dados: Omit<Paciente, 'id' | 'dataCriacao' | 'dataAtualizacao'>): {
        sucesso: boolean;
        mensagem: string;
        paciente?: Paciente;
    };
    static atualizarPaciente(id: string, dados: Partial<Paciente>): {
        sucesso: boolean;
        mensagem: string;
    };
    static obterPorId(id: string): Paciente | null;
    static obterTodos(): Paciente[];
    static obterAtivos(): Paciente[];
    static desativarPaciente(id: string): {
        sucesso: boolean;
        mensagem: string;
    };
    static ativarPaciente(id: string): {
        sucesso: boolean;
        mensagem: string;
    };
    static excluirPaciente(id: string): {
        sucesso: boolean;
        mensagem: string;
    };
    static buscarPorNome(nome: string): Paciente[];
    static buscarPorCPF(cpf: string): Paciente | null;
    private static gerarId;
    static obterEstatisticas(): {
        total: number;
        ativos: number;
        inativos: number;
    };
}
//# sourceMappingURL=PacienteService.d.ts.map