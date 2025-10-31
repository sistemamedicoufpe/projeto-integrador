import { AvaliacaoService } from '../services/AvaliacaoService';
import { PacienteService } from '../services/PacienteService';
import { AuthService } from '../services/AuthService';
import { AvaliacaoCognitiva, CriarAvaliacaoCognitiva } from '../models/AvaliacaoCognitiva';
import { Helpers } from '../utils/helpers';
import { Permissoes } from '../utils/Permissoes';

export class AvaliacoesPage {
  private static editingId: string | null = null;

  static render(): string {
    const avaliacoes = AvaliacaoService.obterTodas();
    const pacientes = PacienteService.obterAtivos();

    return `
      <div class="fade-in">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2><i class="bi bi-clipboard-check"></i> Avaliações Cognitivas</h2>
          ${Permissoes.podeCriarAvaliacao() ? `
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#avaliacaoModal" id="nova-avaliacao-btn">
              <i class="bi bi-plus-circle"></i> Nova Avaliação
            </button>
          ` : ''}
        </div>

        <!-- Filtros -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <select class="form-select" id="filtro-paciente">
                  <option value="">Todos os Pacientes</option>
                  ${pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                </select>
              </div>
              <div class="col-md-4">
                <select class="form-select" id="filtro-tipo">
                  <option value="">Todos os Tipos</option>
                  <option value="MEEM">MEEM</option>
                  <option value="MoCA">MoCA</option>
                  <option value="Clock Drawing">Clock Drawing</option>
                  <option value="Fluência Verbal">Fluência Verbal</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div class="col-md-4">
                <input type="date" class="form-control" id="filtro-data">
              </div>
            </div>
          </div>
        </div>

        <!-- Avaliações Table -->
        <div class="card">
          <div class="card-body">
            ${avaliacoes.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-clipboard-check"></i>
                <h3>Nenhuma avaliação registrada</h3>
                <p>Clique em "Nova Avaliação" para começar</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Paciente</th>
                      <th>Tipo</th>
                      <th>Pontuação</th>
                      <th>Desempenho</th>
                      <th>Médico</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody id="avaliacoes-tbody">
                    ${this.renderAvaliacoes(avaliacoes)}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

        <!-- Modal Avaliação -->
        ${this.renderModal()}

        <!-- Modal Visualizar Avaliação -->
        ${this.renderViewModal()}
      </div>
    `;
  }

  private static renderAvaliacoes(avaliacoes: AvaliacaoCognitiva[]): string {
    const podeEditar = Permissoes.podeEditarAvaliacao();

    return avaliacoes.sort((a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()).map(a => `
      <tr>
        <td>${Helpers.formatarDataBR(a.dataAvaliacao)}</td>
        <td><strong>${a.pacienteNome}</strong></td>
        <td><span class="badge bg-info">${a.tipoAvaliacao}</span></td>
        <td>${a.pontuacao}/${a.pontuacaoMaxima}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="badge ${a.percentual >= 70 ? 'bg-success' : a.percentual >= 50 ? 'bg-warning' : 'bg-danger'} me-2">
              ${a.percentual.toFixed(1)}%
            </div>
            <div class="progress flex-grow-1" style="height: 20px;">
              <div class="progress-bar ${a.percentual >= 70 ? 'bg-success' : a.percentual >= 50 ? 'bg-warning' : 'bg-danger'}"
                   style="width: ${a.percentual}%">
              </div>
            </div>
          </div>
        </td>
        <td>${a.medicoNome}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-info" onclick="window.viewAvaliacao('${a.id}')" title="Visualizar">
            <i class="bi bi-eye"></i>
          </button>
          ${podeEditar ? `
            <button class="btn btn-sm btn-warning" onclick="window.editAvaliacao('${a.id}')" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.deleteAvaliacao('${a.id}')" title="Excluir">
              <i class="bi bi-trash"></i>
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');
  }

  private static renderModal(): string {
    const pacientes = PacienteService.obterAtivos();

    return `
      <div class="modal fade" id="avaliacaoModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-clipboard-check"></i> <span id="modal-title">Nova Avaliação Cognitiva</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="avaliacao-form">
                <input type="hidden" id="avaliacao-id">

                <h6 class="text-primary mb-3">Informações Gerais</h6>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="avaliacao-paciente" class="form-label">Paciente *</label>
                    <select class="form-select" id="avaliacao-paciente" required>
                      <option value="">Selecione o paciente...</option>
                      ${pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="avaliacao-data" class="form-label">Data da Avaliação *</label>
                    <input type="date" class="form-control" id="avaliacao-data" required>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="avaliacao-tipo" class="form-label">Tipo de Avaliação *</label>
                    <select class="form-select" id="avaliacao-tipo" required>
                      <option value="">Selecione...</option>
                      <option value="MEEM">MEEM (Mini Exame do Estado Mental)</option>
                      <option value="MoCA">MoCA (Montreal Cognitive Assessment)</option>
                      <option value="Clock Drawing">Clock Drawing Test</option>
                      <option value="Fluência Verbal">Fluência Verbal</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <h6 class="text-primary mb-3 mt-4">Pontuação</h6>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="avaliacao-pontuacao" class="form-label">Pontuação Obtida *</label>
                    <input type="number" class="form-control" id="avaliacao-pontuacao" min="0" step="0.5" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="avaliacao-pontuacao-maxima" class="form-label">Pontuação Máxima *</label>
                    <input type="number" class="form-control" id="avaliacao-pontuacao-maxima" min="1" step="0.5" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Percentual</label>
                    <input type="text" class="form-control" id="avaliacao-percentual" readonly>
                  </div>
                </div>

                <h6 class="text-primary mb-3 mt-4">Domínios Cognitivos (0-10)</h6>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="dominio-memoria" class="form-label">Memória *</label>
                    <input type="number" class="form-control" id="dominio-memoria" min="0" max="10" step="0.5" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="dominio-atencao" class="form-label">Atenção *</label>
                    <input type="number" class="form-control" id="dominio-atencao" min="0" max="10" step="0.5" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="dominio-linguagem" class="form-label">Linguagem *</label>
                    <input type="number" class="form-control" id="dominio-linguagem" min="0" max="10" step="0.5" required>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="dominio-funcao-executiva" class="form-label">Função Executiva *</label>
                    <input type="number" class="form-control" id="dominio-funcao-executiva" min="0" max="10" step="0.5" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="dominio-visuoespacial" class="form-label">Habilidade Visuoespacial *</label>
                    <input type="number" class="form-control" id="dominio-visuoespacial" min="0" max="10" step="0.5" required>
                  </div>
                </div>

                <h6 class="text-primary mb-3 mt-4">Observações e Conclusões</h6>
                <div class="mb-3">
                  <label for="avaliacao-diagnostico" class="form-label">Diagnóstico Preliminar</label>
                  <textarea class="form-control" id="avaliacao-diagnostico" rows="2"></textarea>
                </div>

                <div class="mb-3">
                  <label for="avaliacao-recomendacoes" class="form-label">Recomendações</label>
                  <textarea class="form-control" id="avaliacao-recomendacoes" rows="2"></textarea>
                </div>

                <div class="mb-3">
                  <label for="avaliacao-observacoes" class="form-label">Observações Gerais</label>
                  <textarea class="form-control" id="avaliacao-observacoes" rows="3"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="salvar-avaliacao-btn">Salvar Avaliação</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static init(): void {
    // Setup global functions
    (window as any).viewAvaliacao = (id: string) => this.viewAvaliacao(id);
    (window as any).editAvaliacao = (id: string) => this.editAvaliacao(id);
    (window as any).deleteAvaliacao = (id: string) => this.deleteAvaliacao(id);

    // Nova Avaliação
    document.getElementById('nova-avaliacao-btn')?.addEventListener('click', () => {
      this.editingId = null;
      document.getElementById('modal-title')!.textContent = 'Nova Avaliação Cognitiva';
      (document.getElementById('avaliacao-form') as HTMLFormElement)?.reset();

      // Set data atual
      (document.getElementById('avaliacao-data') as HTMLInputElement).value = Helpers.dataParaInput(new Date());
    });

    // Salvar Avaliação
    document.getElementById('salvar-avaliacao-btn')?.addEventListener('click', () => {
      this.salvarAvaliacao();
    });

    // Calcular percentual automaticamente
    const calcularPercentual = () => {
      const pontuacao = parseFloat((document.getElementById('avaliacao-pontuacao') as HTMLInputElement).value) || 0;
      const maxima = parseFloat((document.getElementById('avaliacao-pontuacao-maxima') as HTMLInputElement).value) || 1;
      const percentual = (pontuacao / maxima) * 100;
      (document.getElementById('avaliacao-percentual') as HTMLInputElement).value = `${percentual.toFixed(1)}%`;
    };

    document.getElementById('avaliacao-pontuacao')?.addEventListener('input', calcularPercentual);
    document.getElementById('avaliacao-pontuacao-maxima')?.addEventListener('input', calcularPercentual);

    // Filtros
    document.getElementById('filtro-paciente')?.addEventListener('change', () => this.aplicarFiltros());
    document.getElementById('filtro-tipo')?.addEventListener('change', () => this.aplicarFiltros());
    document.getElementById('filtro-data')?.addEventListener('change', () => this.aplicarFiltros());
  }

  private static salvarAvaliacao(): void {
    const form = document.getElementById('avaliacao-form') as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const usuarioAtual = AuthService.obterUsuarioAtual();
    if (!usuarioAtual) {
      Helpers.mostrarNotificacao('Usuário não autenticado', 'error');
      return;
    }

    const dados: CriarAvaliacaoCognitiva = {
      pacienteId: (document.getElementById('avaliacao-paciente') as HTMLSelectElement).value,
      medicoId: usuarioAtual.id,
      dataAvaliacao: new Date((document.getElementById('avaliacao-data') as HTMLInputElement).value),
      tipoAvaliacao: (document.getElementById('avaliacao-tipo') as HTMLSelectElement).value as any,
      pontuacao: parseFloat((document.getElementById('avaliacao-pontuacao') as HTMLInputElement).value),
      pontuacaoMaxima: parseFloat((document.getElementById('avaliacao-pontuacao-maxima') as HTMLInputElement).value),
      dominios: {
        memoria: parseFloat((document.getElementById('dominio-memoria') as HTMLInputElement).value),
        atencao: parseFloat((document.getElementById('dominio-atencao') as HTMLInputElement).value),
        linguagem: parseFloat((document.getElementById('dominio-linguagem') as HTMLInputElement).value),
        funcaoExecutiva: parseFloat((document.getElementById('dominio-funcao-executiva') as HTMLInputElement).value),
        habilidadeVisuoespacial: parseFloat((document.getElementById('dominio-visuoespacial') as HTMLInputElement).value)
      },
      diagnosticoPrelimilar: (document.getElementById('avaliacao-diagnostico') as HTMLTextAreaElement).value,
      recomendacoes: (document.getElementById('avaliacao-recomendacoes') as HTMLTextAreaElement).value,
      observacoes: (document.getElementById('avaliacao-observacoes') as HTMLTextAreaElement).value
    };

    let resultado;
    if (this.editingId) {
      resultado = AvaliacaoService.atualizarAvaliacao(this.editingId, dados as any);
    } else {
      resultado = AvaliacaoService.criarAvaliacao(dados);
    }

    if (resultado.sucesso) {
      Helpers.mostrarNotificacao(resultado.mensagem, 'success');

      // Fechar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('avaliacaoModal')!);
      modal?.hide();

      // Atualizar tabela
      this.atualizarTabela(AvaliacaoService.obterTodas());
    } else {
      Helpers.mostrarNotificacao(resultado.mensagem, 'error');
    }
  }

  private static editAvaliacao(id: string): void {
    this.editingId = id;
    const avaliacao = AvaliacaoService.obterPorId(id);
    if (!avaliacao) return;

    document.getElementById('modal-title')!.textContent = 'Editar Avaliação';

    (document.getElementById('avaliacao-paciente') as HTMLSelectElement).value = avaliacao.pacienteId;
    (document.getElementById('avaliacao-data') as HTMLInputElement).value = Helpers.dataParaInput(avaliacao.dataAvaliacao);
    (document.getElementById('avaliacao-tipo') as HTMLSelectElement).value = avaliacao.tipoAvaliacao;
    (document.getElementById('avaliacao-pontuacao') as HTMLInputElement).value = avaliacao.pontuacao.toString();
    (document.getElementById('avaliacao-pontuacao-maxima') as HTMLInputElement).value = avaliacao.pontuacaoMaxima.toString();
    (document.getElementById('avaliacao-percentual') as HTMLInputElement).value = `${avaliacao.percentual.toFixed(1)}%`;

    (document.getElementById('dominio-memoria') as HTMLInputElement).value = avaliacao.dominios.memoria.toString();
    (document.getElementById('dominio-atencao') as HTMLInputElement).value = avaliacao.dominios.atencao.toString();
    (document.getElementById('dominio-linguagem') as HTMLInputElement).value = avaliacao.dominios.linguagem.toString();
    (document.getElementById('dominio-funcao-executiva') as HTMLInputElement).value = avaliacao.dominios.funcaoExecutiva.toString();
    (document.getElementById('dominio-visuoespacial') as HTMLInputElement).value = avaliacao.dominios.habilidadeVisuoespacial.toString();

    (document.getElementById('avaliacao-diagnostico') as HTMLTextAreaElement).value = avaliacao.diagnosticoPrelimilar || '';
    (document.getElementById('avaliacao-recomendacoes') as HTMLTextAreaElement).value = avaliacao.recomendacoes || '';
    (document.getElementById('avaliacao-observacoes') as HTMLTextAreaElement).value = avaliacao.observacoes || '';

    const modal = new bootstrap.Modal(document.getElementById('avaliacaoModal')!);
    modal.show();
  }

  private static renderViewModal(): string {
    return `
      <div class="modal fade" id="viewAvaliacaoModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title">
                <i class="bi bi-clipboard-check"></i> Detalhes da Avaliação Cognitiva
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="view-avaliacao-content">
              <!-- Conteúdo será preenchido dinamicamente -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private static viewAvaliacao(id: string): void {
    const avaliacao = AvaliacaoService.obterPorId(id);
    if (!avaliacao) return;

    const content = document.getElementById('view-avaliacao-content');
    if (!content) return;

    const corDesempenho = avaliacao.percentual >= 70 ? 'success' : avaliacao.percentual >= 50 ? 'warning' : 'danger';

    content.innerHTML = `
      <div class="row">
        <div class="col-md-12 mb-3">
          <h6 class="text-success border-bottom pb-2">
            <i class="bi bi-info-circle"></i> Informações Gerais
          </h6>
        </div>
        <div class="col-md-6 mb-3">
          <strong>Paciente:</strong>
          <p class="mb-1">${avaliacao.pacienteNome}</p>
        </div>
        <div class="col-md-3 mb-3">
          <strong>Tipo de Avaliação:</strong>
          <p class="mb-1"><span class="badge bg-info">${avaliacao.tipoAvaliacao}</span></p>
        </div>
        <div class="col-md-3 mb-3">
          <strong>Data da Avaliação:</strong>
          <p class="mb-1">${Helpers.formatarDataBR(avaliacao.dataAvaliacao)}</p>
        </div>
        <div class="col-md-6 mb-3">
          <strong>Médico Responsável:</strong>
          <p class="mb-1">${avaliacao.medicoNome}</p>
        </div>

        <div class="col-md-12 mt-3 mb-3">
          <h6 class="text-success border-bottom pb-2">
            <i class="bi bi-graph-up"></i> Desempenho
          </h6>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Pontuação Total:</strong>
          <p class="mb-1 fs-4">
            <span class="badge bg-${corDesempenho}">${avaliacao.pontuacao}/${avaliacao.pontuacaoMaxima}</span>
          </p>
        </div>
        <div class="col-md-8 mb-3">
          <strong>Percentual de Acerto:</strong>
          <div class="progress mt-2" style="height: 30px;">
            <div class="progress-bar bg-${corDesempenho}"
                 style="width: ${avaliacao.percentual}%"
                 role="progressbar">
              <strong>${avaliacao.percentual.toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        <div class="col-md-12 mt-3 mb-3">
          <h6 class="text-success border-bottom pb-2">
            <i class="bi bi-diagram-3"></i> Domínios Cognitivos
          </h6>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-brain text-primary" style="font-size: 2rem;"></i>
              <h6 class="mt-2">Memória</h6>
              <p class="mb-0 fs-5"><strong>${avaliacao.dominios.memoria}</strong></p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-eye text-info" style="font-size: 2rem;"></i>
              <h6 class="mt-2">Atenção</h6>
              <p class="mb-0 fs-5"><strong>${avaliacao.dominios.atencao}</strong></p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-chat-text text-success" style="font-size: 2rem;"></i>
              <h6 class="mt-2">Linguagem</h6>
              <p class="mb-0 fs-5"><strong>${avaliacao.dominios.linguagem}</strong></p>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-gear text-warning" style="font-size: 2rem;"></i>
              <h6 class="mt-2">Função Executiva</h6>
              <p class="mb-0 fs-5"><strong>${avaliacao.dominios.funcaoExecutiva}</strong></p>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-grid-3x3 text-danger" style="font-size: 2rem;"></i>
              <h6 class="mt-2">Habilidade Visuoespacial</h6>
              <p class="mb-0 fs-5"><strong>${avaliacao.dominios.habilidadeVisuoespacial}</strong></p>
            </div>
          </div>
        </div>

        ${avaliacao.diagnosticoPrelimilar ? `
          <div class="col-md-12 mt-3 mb-3">
            <h6 class="text-success border-bottom pb-2">
              <i class="bi bi-clipboard2-pulse"></i> Diagnóstico Preliminar
            </h6>
          </div>
          <div class="col-md-12 mb-3">
            <div class="alert alert-info">
              <p class="mb-0">${avaliacao.diagnosticoPrelimilar}</p>
            </div>
          </div>
        ` : ''}

        ${avaliacao.recomendacoes ? `
          <div class="col-md-12 mt-3 mb-3">
            <h6 class="text-success border-bottom pb-2">
              <i class="bi bi-lightbulb"></i> Recomendações
            </h6>
          </div>
          <div class="col-md-12 mb-3">
            <div class="alert alert-warning">
              <p class="mb-0">${avaliacao.recomendacoes}</p>
            </div>
          </div>
        ` : ''}

        ${avaliacao.observacoes ? `
          <div class="col-md-12 mt-3 mb-3">
            <h6 class="text-success border-bottom pb-2">
              <i class="bi bi-journal-text"></i> Observações
            </h6>
          </div>
          <div class="col-md-12 mb-3">
            <p class="mb-1">${avaliacao.observacoes}</p>
          </div>
        ` : ''}

        <div class="col-md-12 mt-3">
          <small class="text-muted">
            <i class="bi bi-clock"></i> Registrado em: ${Helpers.formatarDataBR(avaliacao.dataCriacao)}
            ${avaliacao.dataAtualizacao ? ` | Atualizado em: ${Helpers.formatarDataBR(avaliacao.dataAtualizacao)}` : ''}
          </small>
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('viewAvaliacaoModal')!);
    modal.show();
  }

  private static deleteAvaliacao(id: string): void {
    if (Helpers.confirmar('Deseja realmente excluir esta avaliação?')) {
      const resultado = AvaliacaoService.excluirAvaliacao(id);
      if (resultado.sucesso) {
        Helpers.mostrarNotificacao(resultado.mensagem, 'success');
        this.atualizarTabela(AvaliacaoService.obterTodas());
      }
    }
  }

  private static aplicarFiltros(): void {
    let avaliacoes = AvaliacaoService.obterTodas();

    const pacienteId = (document.getElementById('filtro-paciente') as HTMLSelectElement).value;
    if (pacienteId) {
      avaliacoes = avaliacoes.filter(a => a.pacienteId === pacienteId);
    }

    const tipo = (document.getElementById('filtro-tipo') as HTMLSelectElement).value;
    if (tipo) {
      avaliacoes = avaliacoes.filter(a => a.tipoAvaliacao === tipo);
    }

    const data = (document.getElementById('filtro-data') as HTMLInputElement).value;
    if (data) {
      avaliacoes = avaliacoes.filter(a =>
        Helpers.dataParaInput(a.dataAvaliacao) === data
      );
    }

    this.atualizarTabela(avaliacoes);
  }

  private static atualizarTabela(avaliacoes: AvaliacaoCognitiva[]): void {
    const tbody = document.getElementById('avaliacoes-tbody');
    if (tbody) {
      tbody.innerHTML = this.renderAvaliacoes(avaliacoes);
    }
  }
}
