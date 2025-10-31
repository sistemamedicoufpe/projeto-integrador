import { PacienteService } from '../services/PacienteService';
import { AvaliacaoService } from '../services/AvaliacaoService';
import { Helpers } from '../utils/helpers';

export class DashboardPage {
  static render(): string {
    const estatisticasPacientes = PacienteService.obterEstatisticas();
    const estatisticasAvaliacoes = AvaliacaoService.obterEstatisticas();

    // Ordenar por data de criação e pegar os 5 mais recentes
    const pacientes = PacienteService.obterAtivos()
      .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
      .slice(0, 5);

    const avaliacoes = AvaliacaoService.obterTodas()
      .sort((a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime())
      .slice(0, 5);

    return `
      <div class="fade-in">
        <h2 class="mb-4">
          <i class="bi bi-speedometer2"></i> Dashboard Geral
        </h2>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="card stat-card">
            <div class="position-relative">
              <i class="bi bi-people stat-icon"></i>
              <div class="stat-value">${estatisticasPacientes.ativos}</div>
              <div class="stat-label">Pacientes Ativos</div>
            </div>
          </div>

          <div class="card stat-card success">
            <div class="position-relative">
              <i class="bi bi-clipboard-check stat-icon text-success"></i>
              <div class="stat-value text-success">${estatisticasAvaliacoes.total}</div>
              <div class="stat-label">Avaliações Realizadas</div>
            </div>
          </div>

          <div class="card stat-card info">
            <div class="position-relative">
              <i class="bi bi-graph-up stat-icon text-info"></i>
              <div class="stat-value text-info">${estatisticasAvaliacoes.mediaPercentual.toFixed(1)}%</div>
              <div class="stat-label">Média de Desempenho</div>
            </div>
          </div>

          <div class="card stat-card warning">
            <div class="position-relative">
              <i class="bi bi-person-x stat-icon text-warning"></i>
              <div class="stat-value text-warning">${estatisticasPacientes.inativos}</div>
              <div class="stat-label">Pacientes Inativos</div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Últimos Pacientes -->
          <div class="col-lg-6 mb-4">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-people"></i> Últimos Pacientes Cadastrados</h5>
              </div>
              <div class="card-body">
                ${pacientes.length === 0 ? `
                  <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <h5>Nenhum paciente cadastrado</h5>
                    <p>Comece cadastrando seu primeiro paciente</p>
                  </div>
                ` : `
                  <div class="list-group list-group-flush">
                    ${pacientes.map(p => `
                      <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 class="mb-1">${p.nome}</h6>
                            <small class="text-muted">CPF: ${Helpers.formatarCPF(p.cpf)}</small>
                          </div>
                          <div class="text-end">
                            <small class="text-muted">${Helpers.formatarDataBR(p.dataCriacao)}</small>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Últimas Avaliações -->
          <div class="col-lg-6 mb-4">
            <div class="card">
              <div class="card-header bg-success text-white">
                <h5 class="mb-0"><i class="bi bi-clipboard-check"></i> Últimas Avaliações</h5>
              </div>
              <div class="card-body">
                ${avaliacoes.length === 0 ? `
                  <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <h5>Nenhuma avaliação registrada</h5>
                    <p>Comece registrando sua primeira avaliação</p>
                  </div>
                ` : `
                  <div class="list-group list-group-flush">
                    ${avaliacoes.map(a => `
                      <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 class="mb-1">${a.pacienteNome}</h6>
                            <small class="text-muted">${a.tipoAvaliacao}</small>
                          </div>
                          <div class="text-end">
                            <div class="badge ${a.percentual >= 70 ? 'bg-success' : a.percentual >= 50 ? 'bg-warning' : 'bg-danger'}">
                              ${a.percentual.toFixed(1)}%
                            </div>
                            <div><small class="text-muted">${Helpers.formatarDataBR(a.dataAvaliacao)}</small></div>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>

        <!-- Avaliações por Tipo -->
        ${Object.keys(estatisticasAvaliacoes.porTipo).length > 0 ? `
        <div class="row">
          <div class="col-12 mb-4">
            <div class="card">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0"><i class="bi bi-bar-chart"></i> Avaliações por Tipo</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  ${Object.entries(estatisticasAvaliacoes.porTipo).map(([tipo, qtd]) => `
                    <div class="col-md-6 col-lg-3 mb-3">
                      <div class="card bg-light">
                        <div class="card-body text-center">
                          <h3 class="text-primary">${qtd}</h3>
                          <p class="mb-0">${tipo}</p>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }

  static init(): void {
    // Adicionar interações se necessário
  }
}
