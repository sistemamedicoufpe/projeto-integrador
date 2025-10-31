import { StorageService } from './StorageService.js';
import { PacienteService } from './PacienteService.js';
import { AuthService } from './AuthService.js';
import { EventBus, Events } from '../utils/EventBus.js';
export class AvaliacaoService {
    static criarAvaliacao(dados) {
        const paciente = PacienteService.obterPorId(dados.pacienteId);
        if (!paciente) {
            return { sucesso: false, mensagem: 'Paciente não encontrado' };
        }
        const medico = AuthService.obterUsuarioAtual();
        if (!medico) {
            return { sucesso: false, mensagem: 'Usuário não autenticado' };
        }
        const percentual = (dados.pontuacao / dados.pontuacaoMaxima) * 100;
        const novaAvaliacao = {
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
    static atualizarAvaliacao(id, dados) {
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
    static obterPorId(id) {
        const avaliacoes = this.obterTodas();
        return avaliacoes.find(a => a.id === id) || null;
    }
    static obterTodas() {
        return StorageService.get(this.AVALIACOES_KEY) || [];
    }
    static obterPorPaciente(pacienteId) {
        return this.obterTodas().filter(a => a.pacienteId === pacienteId);
    }
    static obterPorMedico(medicoId) {
        return this.obterTodas().filter(a => a.medicoId === medicoId);
    }
    static excluirAvaliacao(id) {
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
    static gerarId() {
        return 'AV_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    static obterEstatisticas() {
        const avaliacoes = this.obterTodas();
        const porTipo = {};
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
AvaliacaoService.AVALIACOES_KEY = 'avaliacoes';
//# sourceMappingURL=AvaliacaoService.js.map