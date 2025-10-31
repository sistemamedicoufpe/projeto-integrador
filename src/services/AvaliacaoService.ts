import { AvaliacaoCognitiva, CriarAvaliacaoCognitiva } from '../models/AvaliacaoCognitiva';
import { StorageService } from './StorageService';
import { PacienteService } from './PacienteService';
import { AuthService } from './AuthService';
import { EventBus, Events } from '../utils/EventBus';

export class AvaliacaoService {
  private static readonly AVALIACOES_KEY = 'avaliacoes';

  static criarAvaliacao(dados: CriarAvaliacaoCognitiva): { sucesso: boolean; mensagem: string; avaliacao?: AvaliacaoCognitiva } {
    const paciente = PacienteService.obterPorId(dados.pacienteId);
    if (!paciente) {
      return { sucesso: false, mensagem: 'Paciente não encontrado' };
    }

    const medico = AuthService.obterUsuarioAtual();
    if (!medico) {
      return { sucesso: false, mensagem: 'Usuário não autenticado' };
    }

    const percentual = (dados.pontuacao / dados.pontuacaoMaxima) * 100;

    const novaAvaliacao: AvaliacaoCognitiva = {
      id: this.gerarId(),
      pacienteId: dados.pacienteId,
      pacienteNome: paciente.nome,
      medicoId: dados.medicoId,
      medicoNome: medico.nome,
      dataAvaliacao: dados.dataAvaliacao,
      tipoAvaliacao: dados.tipoAvaliacao,
      pontuacao: dados.pontuacao,
      pontuacaoMaxima: dados.pontuacaoMaxima,
      percentual,
      dominios: dados.dominios,
      observacoes: dados.observacoes,
      diagnosticoPrelimilar: dados.diagnosticoPrelimilar,
      recomendacoes: dados.recomendacoes,
      dataCriacao: new Date(),
      dataAtualizacao: new Date()
    };

    const avaliacoes = this.obterTodas();
    avaliacoes.push(novaAvaliacao);
    StorageService.set(this.AVALIACOES_KEY, avaliacoes);

    EventBus.emit(Events.AVALIACAO_CRIADA, novaAvaliacao);
    EventBus.emit(Events.DADOS_ALTERADOS);

    return { sucesso: true, mensagem: 'Avaliação cadastrada com sucesso', avaliacao: novaAvaliacao };
  }

  static atualizarAvaliacao(id: string, dados: Partial<AvaliacaoCognitiva>): { sucesso: boolean; mensagem: string } {
    const avaliacoes = this.obterTodas();
    const index = avaliacoes.findIndex(a => a.id === id);

    if (index === -1) {
      return { sucesso: false, mensagem: 'Avaliação não encontrada' };
    }

    // Recalcular percentual se pontuação foi alterada
    let percentual = avaliacoes[index].percentual;
    if (dados.pontuacao !== undefined || dados.pontuacaoMaxima !== undefined) {
      const pontuacao = dados.pontuacao ?? avaliacoes[index].pontuacao;
      const pontuacaoMaxima = dados.pontuacaoMaxima ?? avaliacoes[index].pontuacaoMaxima;
      percentual = (pontuacao / pontuacaoMaxima) * 100;
    }

    avaliacoes[index] = {
      ...avaliacoes[index],
      ...dados,
      percentual,
      id, // Garantir que o ID não seja alterado
      dataAtualizacao: new Date()
    };

    StorageService.set(this.AVALIACOES_KEY, avaliacoes);

    EventBus.emit(Events.AVALIACAO_ATUALIZADA, avaliacoes[index]);
    EventBus.emit(Events.DADOS_ALTERADOS);

    return { sucesso: true, mensagem: 'Avaliação atualizada com sucesso' };
  }

  static obterPorId(id: string): AvaliacaoCognitiva | null {
    const avaliacoes = this.obterTodas();
    return avaliacoes.find(a => a.id === id) || null;
  }

  static obterTodas(): AvaliacaoCognitiva[] {
    return StorageService.get<AvaliacaoCognitiva[]>(this.AVALIACOES_KEY) || [];
  }

  static obterPorPaciente(pacienteId: string): AvaliacaoCognitiva[] {
    return this.obterTodas().filter(a => a.pacienteId === pacienteId);
  }

  static obterPorMedico(medicoId: string): AvaliacaoCognitiva[] {
    return this.obterTodas().filter(a => a.medicoId === medicoId);
  }

  static excluirAvaliacao(id: string): { sucesso: boolean; mensagem: string } {
    const avaliacoes = this.obterTodas();
    const novasAvaliacoes = avaliacoes.filter(a => a.id !== id);

    if (avaliacoes.length === novasAvaliacoes.length) {
      return { sucesso: false, mensagem: 'Avaliação não encontrada' };
    }

    StorageService.set(this.AVALIACOES_KEY, novasAvaliacoes);

    EventBus.emit(Events.AVALIACAO_EXCLUIDA, id);
    EventBus.emit(Events.DADOS_ALTERADOS);

    return { sucesso: true, mensagem: 'Avaliação excluída com sucesso' };
  }

  private static gerarId(): string {
    return 'AV_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  static obterEstatisticas() {
    const avaliacoes = this.obterTodas();
    const porTipo: Record<string, number> = {};

    avaliacoes.forEach(a => {
      porTipo[a.tipoAvaliacao] = (porTipo[a.tipoAvaliacao] || 0) + 1;
    });

    const pontuacoes = avaliacoes.map(a => a.percentual);
    const mediaPercentual = pontuacoes.length > 0
      ? pontuacoes.reduce((acc, p) => acc + p, 0) / pontuacoes.length
      : 0;

    return {
      total: avaliacoes.length,
      porTipo,
      mediaPercentual: Math.round(mediaPercentual * 100) / 100
    };
  }
}
