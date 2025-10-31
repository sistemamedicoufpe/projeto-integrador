import { RelatorioService } from '../services/RelatorioService.js';
import { PacienteService } from '../services/PacienteService.js';
import { AvaliacaoService } from '../services/AvaliacaoService.js';
import { Helpers } from '../utils/helpers.js';
export class RelatoriosPage {
    static render() {
        const pacientes = PacienteService.obterAtivos();
        const avaliacoes = AvaliacaoService.obterTodas();
        return `
      <div class="fade-in">
        <h2 class="mb-4">
          <i class="bi bi-file-text"></i> Relatórios
        </h2>

        <div class="row">
          <!-- Relatório Geral -->
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-graph-up"></i> Relatório Geral</h5>
              </div>
              <div class="card-body">
                <p>Gere um relatório completo com estatísticas gerais da clínica, incluindo dados de pacientes e avaliações.</p>
                <button class="btn btn-primary w-100" id="gerar-relatorio-geral">
                  <i class="bi bi-file-earmark-text"></i> Gerar Relatório Geral
                </button>
              </div>
            </div>
          </div>

          <!-- Relatório de Paciente -->
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-header bg-success text-white">
                <h5 class="mb-0"><i class="bi bi-person"></i> Relatório de Paciente</h5>
              </div>
              <div class="card-body">
                <p>Selecione um paciente para gerar um relatório detalhado com histórico de avaliações.</p>
                <select class="form-select mb-3" id="select-paciente-relatorio">
                  <option value="">Selecione um paciente...</option>
                  ${pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                </select>
                <button class="btn btn-success w-100" id="gerar-relatorio-paciente" disabled>
                  <i class="bi bi-file-earmark-person"></i> Gerar Relatório do Paciente
                </button>
              </div>
            </div>
          </div>

          <!-- Relatório de Avaliação -->
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0"><i class="bi bi-clipboard-check"></i> Relatório de Avaliação</h5>
              </div>
              <div class="card-body">
                <p>Selecione uma avaliação para gerar um relatório detalhado.</p>
                <select class="form-select mb-2" id="select-paciente-avaliacao">
                  <option value="">Selecione um paciente...</option>
                  ${pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                </select>
                <select class="form-select mb-3" id="select-avaliacao-relatorio" disabled>
                  <option value="">Primeiro selecione um paciente...</option>
                </select>
                <button class="btn btn-info w-100" id="gerar-relatorio-avaliacao" disabled>
                  <i class="bi bi-file-earmark-medical"></i> Gerar Relatório da Avaliação
                </button>
              </div>
            </div>
          </div>

          <!-- Área de Visualização -->
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-header bg-warning text-dark">
                <h5 class="mb-0"><i class="bi bi-eye"></i> Pré-visualização</h5>
              </div>
              <div class="card-body">
                <p>Após gerar um relatório, você pode visualizá-lo aqui antes de fazer o download.</p>
                <div id="preview-area" class="border rounded p-3 bg-light" style="min-height: 200px; max-height: 400px; overflow-y: auto;">
                  <div class="text-center text-muted">
                    <i class="bi bi-file-earmark" style="font-size: 3rem;"></i>
                    <p class="mt-3">Nenhum relatório gerado ainda</p>
                  </div>
                </div>
                <button class="btn btn-warning w-100 mt-3" id="download-relatorio" disabled>
                  <i class="bi bi-download"></i> Download do Relatório
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estatísticas Rápidas -->
        <div class="card">
          <div class="card-header bg-dark text-white">
            <h5 class="mb-0"><i class="bi bi-bar-chart"></i> Estatísticas Rápidas</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body">
                    <i class="bi bi-people text-primary" style="font-size: 2rem;"></i>
                    <h3 class="mt-2">${PacienteService.obterEstatisticas().ativos}</h3>
                    <p class="mb-0">Pacientes Ativos</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body">
                    <i class="bi bi-clipboard-check text-success" style="font-size: 2rem;"></i>
                    <h3 class="mt-2">${AvaliacaoService.obterEstatisticas().total}</h3>
                    <p class="mb-0">Avaliações</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body">
                    <i class="bi bi-graph-up text-info" style="font-size: 2rem;"></i>
                    <h3 class="mt-2">${AvaliacaoService.obterEstatisticas().mediaPercentual.toFixed(1)}%</h3>
                    <p class="mb-0">Média de Desempenho</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body">
                    <i class="bi bi-person-x text-warning" style="font-size: 2rem;"></i>
                    <h3 class="mt-2">${PacienteService.obterEstatisticas().inativos}</h3>
                    <p class="mb-0">Pacientes Inativos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    static init() {
        // Gerar Relatório Geral
        document.getElementById('gerar-relatorio-geral')?.addEventListener('click', () => {
            this.gerarRelatorioGeral();
        });
        // Selecionar Paciente para Relatório
        document.getElementById('select-paciente-relatorio')?.addEventListener('change', (e) => {
            const pacienteId = e.target.value;
            const btn = document.getElementById('gerar-relatorio-paciente');
            btn.disabled = !pacienteId;
        });
        // Gerar Relatório de Paciente
        document.getElementById('gerar-relatorio-paciente')?.addEventListener('click', () => {
            const pacienteId = document.getElementById('select-paciente-relatorio').value;
            if (pacienteId) {
                this.gerarRelatorioPaciente(pacienteId);
            }
        });
        // Selecionar Paciente para Avaliação
        document.getElementById('select-paciente-avaliacao')?.addEventListener('change', (e) => {
            const pacienteId = e.target.value;
            const selectAvaliacao = document.getElementById('select-avaliacao-relatorio');
            const btn = document.getElementById('gerar-relatorio-avaliacao');
            if (pacienteId) {
                const avaliacoes = AvaliacaoService.obterPorPaciente(pacienteId);
                selectAvaliacao.innerHTML = avaliacoes.length === 0
                    ? '<option value="">Nenhuma avaliação encontrada</option>'
                    : `<option value="">Selecione uma avaliação...</option>${avaliacoes.map(a => `<option value="${a.id}">${a.tipoAvaliacao} - ${Helpers.formatarDataBR(a.dataAvaliacao)}</option>`).join('')}`;
                selectAvaliacao.disabled = avaliacoes.length === 0;
                btn.disabled = true;
            }
            else {
                selectAvaliacao.innerHTML = '<option value="">Primeiro selecione um paciente...</option>';
                selectAvaliacao.disabled = true;
                btn.disabled = true;
            }
        });
        // Selecionar Avaliação
        document.getElementById('select-avaliacao-relatorio')?.addEventListener('change', (e) => {
            const avaliacaoId = e.target.value;
            const btn = document.getElementById('gerar-relatorio-avaliacao');
            btn.disabled = !avaliacaoId;
        });
        // Gerar Relatório de Avaliação
        document.getElementById('gerar-relatorio-avaliacao')?.addEventListener('click', () => {
            const avaliacaoId = document.getElementById('select-avaliacao-relatorio').value;
            if (avaliacaoId) {
                this.gerarRelatorioAvaliacao(avaliacaoId);
            }
        });
        // Download Relatório
        document.getElementById('download-relatorio')?.addEventListener('click', () => {
            if (this.currentRelatorioHtml) {
                RelatorioService.downloadRelatorio(this.currentRelatorioHtml, this.currentRelatorioNome);
                Helpers.mostrarNotificacao('Relatório baixado com sucesso', 'success');
            }
        });
    }
    static gerarRelatorioGeral() {
        const html = RelatorioService.gerarRelatorioGeral();
        this.mostrarPreview(html, 'Relatorio_Geral');
        Helpers.mostrarNotificacao('Relatório geral gerado com sucesso', 'success');
    }
    static gerarRelatorioPaciente(pacienteId) {
        const paciente = PacienteService.obterPorId(pacienteId);
        if (!paciente) {
            Helpers.mostrarNotificacao('Paciente não encontrado', 'error');
            return;
        }
        const html = RelatorioService.gerarRelatorioPaciente(pacienteId);
        this.mostrarPreview(html, `Relatorio_Paciente_${paciente.nome.replace(/\s/g, '_')}`);
        Helpers.mostrarNotificacao('Relatório do paciente gerado com sucesso', 'success');
    }
    static gerarRelatorioAvaliacao(avaliacaoId) {
        const avaliacao = AvaliacaoService.obterPorId(avaliacaoId);
        if (!avaliacao) {
            Helpers.mostrarNotificacao('Avaliação não encontrada', 'error');
            return;
        }
        const html = RelatorioService.gerarRelatorioAvaliacao(avaliacaoId);
        this.mostrarPreview(html, `Relatorio_Avaliacao_${avaliacao.pacienteNome.replace(/\s/g, '_')}_${Helpers.formatarDataBR(avaliacao.dataAvaliacao).replace(/\//g, '-')}`);
        Helpers.mostrarNotificacao('Relatório da avaliação gerado com sucesso', 'success');
    }
    static mostrarPreview(html, nome) {
        this.currentRelatorioHtml = html;
        this.currentRelatorioNome = nome;
        const previewArea = document.getElementById('preview-area');
        if (previewArea) {
            previewArea.innerHTML = html;
        }
        const downloadBtn = document.getElementById('download-relatorio');
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }
    }
}
RelatoriosPage.currentRelatorioHtml = '';
RelatoriosPage.currentRelatorioNome = '';
//# sourceMappingURL=RelatoriosPage.js.map