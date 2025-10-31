import { Paciente } from '../models/Paciente';
import { StorageService } from './StorageService';
import { EventBus, Events } from '../utils/EventBus';

export class PacienteService {
  private static readonly PACIENTES_KEY = 'pacientes';

  static criarPaciente(dados: Omit<Paciente, 'id' | 'dataCriacao' | 'dataAtualizacao'>): { sucesso: boolean; mensagem: string; paciente?: Paciente } {
    const pacientes = this.obterTodos();

    // Verificar se CPF já existe
    if (pacientes.some(p => p.cpf === dados.cpf && p.ativo)) {
      return { sucesso: false, mensagem: 'CPF já cadastrado' };
    }

    const novoPaciente: Paciente = {
      ...dados,
      id: this.gerarId(),
      dataCriacao: new Date(),
      dataAtualizacao: new Date()
    };

    pacientes.push(novoPaciente);
    StorageService.set(this.PACIENTES_KEY, pacientes);

    EventBus.emit(Events.PACIENTE_CRIADO, novoPaciente);
    EventBus.emit(Events.DADOS_ALTERADOS);

    return { sucesso: true, mensagem: 'Paciente cadastrado com sucesso', paciente: novoPaciente };
  }

  static atualizarPaciente(id: string, dados: Partial<Paciente>): { sucesso: boolean; mensagem: string } {
    const pacientes = this.obterTodos();
    const index = pacientes.findIndex(p => p.id === id);

    if (index === -1) {
      return { sucesso: false, mensagem: 'Paciente não encontrado' };
    }

    pacientes[index] = {
      ...pacientes[index],
      ...dados,
      id, // Garantir que o ID não seja alterado
      dataAtualizacao: new Date()
    };

    StorageService.set(this.PACIENTES_KEY, pacientes);

    EventBus.emit(Events.PACIENTE_ATUALIZADO, pacientes[index]);
    EventBus.emit(Events.DADOS_ALTERADOS);

    return { sucesso: true, mensagem: 'Paciente atualizado com sucesso' };
  }

  static obterPorId(id: string): Paciente | null {
    const pacientes = this.obterTodos();
    return pacientes.find(p => p.id === id) || null;
  }

  static obterTodos(): Paciente[] {
    return StorageService.get<Paciente[]>(this.PACIENTES_KEY) || [];
  }

  static obterAtivos(): Paciente[] {
    return this.obterTodos().filter(p => p.ativo);
  }

  static desativarPaciente(id: string): { sucesso: boolean; mensagem: string } {
    return this.atualizarPaciente(id, { ativo: false });
  }

  static ativarPaciente(id: string): { sucesso: boolean; mensagem: string } {
    return this.atualizarPaciente(id, { ativo: true });
  }

  static excluirPaciente(id: string): { sucesso: boolean; mensagem: string } {
    const pacientes = this.obterTodos();
    const paciente = pacientes.find(p => p.id === id);

    if (!paciente) {
      return { sucesso: false, mensagem: 'Paciente não encontrado' };
    }

    const novosPacientes = pacientes.filter(p => p.id !== id);
    StorageService.set(this.PACIENTES_KEY, novosPacientes);

    EventBus.emit(Events.PACIENTE_STATUS_ALTERADO, id);
    EventBus.emit(Events.DADOS_ALTERADOS);

    return { sucesso: true, mensagem: 'Paciente excluído permanentemente' };
  }

  static buscarPorNome(nome: string): Paciente[] {
    const pacientes = this.obterTodos();
    const termoLower = nome.toLowerCase();
    return pacientes.filter(p =>
      p.nome.toLowerCase().includes(termoLower) && p.ativo
    );
  }

  static buscarPorCPF(cpf: string): Paciente | null {
    const pacientes = this.obterTodos();
    return pacientes.find(p => p.cpf === cpf && p.ativo) || null;
  }

  private static gerarId(): string {
    return 'PAC_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  static obterEstatisticas() {
    const pacientes = this.obterTodos();
    return {
      total: pacientes.length,
      ativos: pacientes.filter(p => p.ativo).length,
      inativos: pacientes.filter(p => !p.ativo).length
    };
  }
}
