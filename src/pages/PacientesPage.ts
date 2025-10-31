import { PacienteService } from '../services/PacienteService';
import { Paciente } from '../models/Paciente';
import { Helpers } from '../utils/helpers';
import { Permissoes } from '../utils/Permissoes';

export class PacientesPage {
  private static editingId: string | null = null;
  private static readonly FILTRO_KEY = 'pacientes_filtro_status';

  static render(): string {
    // Recuperar filtro salvo ou usar 'ativos' como padrão
    const filtroSalvo = localStorage.getItem(this.FILTRO_KEY) || 'ativos';
    const pacientes = this.obterPacientesPorFiltro(filtroSalvo);

    return `
      <div class="fade-in">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2><i class="bi bi-people"></i> Gerenciamento de Pacientes</h2>
          ${Permissoes.podeCadastrarPaciente() ? `
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pacienteModal" id="novo-paciente-btn">
              <i class="bi bi-plus-circle"></i> Novo Paciente
            </button>
          ` : ''}
        </div>

        <!-- Search Bar and Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <input type="text" class="form-control" id="busca-paciente" placeholder="Buscar por nome...">
              </div>
              <div class="col-md-4">
                <input type="text" class="form-control" id="busca-cpf" placeholder="Buscar por CPF...">
              </div>
              <div class="col-md-4">
                <select class="form-select" id="filtro-status">
                  <option value="ativos">Pacientes Ativos</option>
                  <option value="inativos">Pacientes Inativos</option>
                  <option value="todos">Todos os Pacientes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Pacientes Table -->
        <div class="card">
          <div class="card-body" id="pacientes-card-body">
            ${pacientes.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-people"></i>
                <h3>Nenhum paciente cadastrado</h3>
                <p>Clique em "Novo Paciente" para começar</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Telefone</th>
                      <th>Idade</th>
                      <th>Cidade</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody id="pacientes-tbody">
                    ${this.renderPacientes(pacientes)}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

        <!-- Modal Paciente -->
        ${this.renderModal()}

        <!-- Modal Visualizar Paciente -->
        ${this.renderViewModal()}
      </div>
    `;
  }

  private static renderPacientes(pacientes: Paciente[]): string {
    const podeEditar = Permissoes.podeEditarPaciente();

    return pacientes.map(p => `
      <tr>
        <td><strong>${p.nome}</strong></td>
        <td>${Helpers.formatarCPF(p.cpf)}</td>
        <td>${Helpers.formatarTelefone(p.telefone)}</td>
        <td>${Helpers.calcularIdade(p.dataNascimento)} anos</td>
        <td>${p.endereco.cidade}/${p.endereco.estado}</td>
        <td>
          <span class="badge ${p.ativo ? 'bg-success' : 'bg-secondary'}">
            ${p.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td class="table-actions">
          <button class="btn btn-sm btn-info" onclick="window.viewPaciente('${p.id}')" title="Visualizar">
            <i class="bi bi-eye"></i>
          </button>
          ${podeEditar ? `
            <button class="btn btn-sm btn-warning" onclick="window.editPaciente('${p.id}')" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            ${p.ativo ? `
              <button class="btn btn-sm btn-danger" onclick="window.togglePacienteStatus('${p.id}', false)" title="Desativar">
                <i class="bi bi-x-circle"></i>
              </button>
            ` : `
              <button class="btn btn-sm btn-success" onclick="window.togglePacienteStatus('${p.id}', true)" title="Reativar">
                <i class="bi bi-check-circle"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.deletePaciente('${p.id}')" title="Excluir Permanentemente">
                <i class="bi bi-trash"></i>
              </button>
            `}
          ` : ''}
        </td>
      </tr>
    `).join('');
  }

  private static renderModal(): string {
    return `
      <div class="modal fade" id="pacienteModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-person-plus"></i> <span id="modal-title">Novo Paciente</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="paciente-form">
                <input type="hidden" id="paciente-id">

                <h6 class="text-primary mb-3">Dados Pessoais</h6>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="paciente-nome" class="form-label">Nome Completo *</label>
                    <input type="text" class="form-control" id="paciente-nome" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="paciente-data-nascimento" class="form-label">Data de Nascimento *</label>
                    <input type="date" class="form-control" id="paciente-data-nascimento" required>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="paciente-cpf" class="form-label">CPF *</label>
                    <input type="text" class="form-control" id="paciente-cpf" maxlength="14" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="paciente-rg" class="form-label">RG</label>
                    <input type="text" class="form-control" id="paciente-rg">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="paciente-telefone" class="form-label">Telefone *</label>
                    <input type="text" class="form-control" id="paciente-telefone" maxlength="15" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="paciente-email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="paciente-email">
                </div>

                <h6 class="text-primary mb-3 mt-4">Endereço</h6>
                <div class="row">
                  <div class="col-md-8 mb-3">
                    <label for="paciente-rua" class="form-label">Rua *</label>
                    <input type="text" class="form-control" id="paciente-rua" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="paciente-numero" class="form-label">Número *</label>
                    <input type="text" class="form-control" id="paciente-numero" required>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="paciente-complemento" class="form-label">Complemento</label>
                    <input type="text" class="form-control" id="paciente-complemento">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="paciente-bairro" class="form-label">Bairro *</label>
                    <input type="text" class="form-control" id="paciente-bairro" required>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-5 mb-3">
                    <label for="paciente-cidade" class="form-label">Cidade *</label>
                    <input type="text" class="form-control" id="paciente-cidade" required>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="paciente-estado" class="form-label">Estado *</label>
                    <select class="form-select" id="paciente-estado" required>
                      <option value="">Selecione...</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="paciente-cep" class="form-label">CEP *</label>
                    <input type="text" class="form-control" id="paciente-cep" maxlength="9" required>
                  </div>
                </div>

                <h6 class="text-primary mb-3 mt-4">Convênio</h6>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="paciente-convenio" class="form-label">Convênio</label>
                    <input type="text" class="form-control" id="paciente-convenio">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="paciente-numero-convenio" class="form-label">Número do Convênio</label>
                    <input type="text" class="form-control" id="paciente-numero-convenio">
                  </div>
                </div>

                <h6 class="text-primary mb-3 mt-4">Contato de Emergência</h6>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="paciente-emergencia-nome" class="form-label">Nome *</label>
                    <input type="text" class="form-control" id="paciente-emergencia-nome" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="paciente-emergencia-telefone" class="form-label">Telefone *</label>
                    <input type="text" class="form-control" id="paciente-emergencia-telefone" maxlength="15" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="paciente-emergencia-parentesco" class="form-label">Parentesco *</label>
                    <input type="text" class="form-control" id="paciente-emergencia-parentesco" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="paciente-observacoes" class="form-label">Observações</label>
                  <textarea class="form-control" id="paciente-observacoes" rows="3"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="salvar-paciente-btn">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static init(): void {
    // Setup global functions
    (window as any).viewPaciente = (id: string) => this.viewPaciente(id);
    (window as any).editPaciente = (id: string) => this.editPaciente(id);
    (window as any).togglePacienteStatus = (id: string, ativar: boolean) => this.toggleStatus(id, ativar);
    (window as any).deletePaciente = (id: string) => this.deletePaciente(id);

    // Restaurar filtro salvo
    const filtroSalvo = localStorage.getItem(this.FILTRO_KEY) || 'ativos';
    const selectFiltro = document.getElementById('filtro-status') as HTMLSelectElement;
    if (selectFiltro) {
      selectFiltro.value = filtroSalvo;
    }

    // Novo Paciente
    document.getElementById('novo-paciente-btn')?.addEventListener('click', () => {
      this.editingId = null;
      document.getElementById('modal-title')!.textContent = 'Novo Paciente';
      (document.getElementById('paciente-form') as HTMLFormElement)?.reset();
    });

    // Salvar Paciente
    document.getElementById('salvar-paciente-btn')?.addEventListener('click', () => {
      this.salvarPaciente();
    });

    // Busca por nome
    document.getElementById('busca-paciente')?.addEventListener('input', () => {
      this.aplicarFiltros();
    });

    // Busca por CPF
    document.getElementById('busca-cpf')?.addEventListener('input', () => {
      this.aplicarFiltros();
    });

    // Filtro de status
    document.getElementById('filtro-status')?.addEventListener('change', () => {
      this.aplicarFiltros();
    });

    // Máscaras
    this.setupMasks();
  }

  private static setupMasks(): void {
    // CPF mask
    document.getElementById('paciente-cpf')?.addEventListener('input', (e) => {
      let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      (e.target as HTMLInputElement).value = value;
    });

    // Telefone mask
    const telefoneMask = (e: Event) => {
      let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      (e.target as HTMLInputElement).value = value;
    };

    document.getElementById('paciente-telefone')?.addEventListener('input', telefoneMask);
    document.getElementById('paciente-emergencia-telefone')?.addEventListener('input', telefoneMask);

    // CEP mask
    document.getElementById('paciente-cep')?.addEventListener('input', (e) => {
      let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      (e.target as HTMLInputElement).value = value;
    });
  }

  private static salvarPaciente(): void {
    const form = document.getElementById('paciente-form') as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const cpf = (document.getElementById('paciente-cpf') as HTMLInputElement).value.replace(/\D/g, '');

    if (!Helpers.validarCPF(cpf)) {
      Helpers.mostrarNotificacao('CPF inválido', 'error');
      return;
    }

    const dados: any = {
      nome: (document.getElementById('paciente-nome') as HTMLInputElement).value,
      dataNascimento: new Date((document.getElementById('paciente-data-nascimento') as HTMLInputElement).value),
      cpf: cpf,
      rg: (document.getElementById('paciente-rg') as HTMLInputElement).value,
      telefone: (document.getElementById('paciente-telefone') as HTMLInputElement).value.replace(/\D/g, ''),
      email: (document.getElementById('paciente-email') as HTMLInputElement).value,
      endereco: {
        rua: (document.getElementById('paciente-rua') as HTMLInputElement).value,
        numero: (document.getElementById('paciente-numero') as HTMLInputElement).value,
        complemento: (document.getElementById('paciente-complemento') as HTMLInputElement).value,
        bairro: (document.getElementById('paciente-bairro') as HTMLInputElement).value,
        cidade: (document.getElementById('paciente-cidade') as HTMLInputElement).value,
        estado: (document.getElementById('paciente-estado') as HTMLSelectElement).value,
        cep: (document.getElementById('paciente-cep') as HTMLInputElement).value.replace(/\D/g, '')
      },
      convenio: (document.getElementById('paciente-convenio') as HTMLInputElement).value,
      numeroConvenio: (document.getElementById('paciente-numero-convenio') as HTMLInputElement).value,
      contatoEmergencia: {
        nome: (document.getElementById('paciente-emergencia-nome') as HTMLInputElement).value,
        telefone: (document.getElementById('paciente-emergencia-telefone') as HTMLInputElement).value.replace(/\D/g, ''),
        parentesco: (document.getElementById('paciente-emergencia-parentesco') as HTMLInputElement).value
      },
      observacoes: (document.getElementById('paciente-observacoes') as HTMLTextAreaElement).value,
      ativo: true
    };

    let resultado;
    if (this.editingId) {
      resultado = PacienteService.atualizarPaciente(this.editingId, dados);
    } else {
      resultado = PacienteService.criarPaciente(dados);
    }

    if (resultado.sucesso) {
      Helpers.mostrarNotificacao(resultado.mensagem, 'success');

      // Fechar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('pacienteModal')!);
      modal?.hide();

      // Atualizar tabela
      this.aplicarFiltros();
    } else {
      Helpers.mostrarNotificacao(resultado.mensagem, 'error');
    }
  }

  private static editPaciente(id: string): void {
    this.editingId = id;
    const paciente = PacienteService.obterPorId(id);
    if (!paciente) return;

    document.getElementById('modal-title')!.textContent = 'Editar Paciente';

    (document.getElementById('paciente-nome') as HTMLInputElement).value = paciente.nome;
    (document.getElementById('paciente-data-nascimento') as HTMLInputElement).value = Helpers.dataParaInput(paciente.dataNascimento);
    (document.getElementById('paciente-cpf') as HTMLInputElement).value = Helpers.formatarCPF(paciente.cpf);
    (document.getElementById('paciente-rg') as HTMLInputElement).value = paciente.rg || '';
    (document.getElementById('paciente-telefone') as HTMLInputElement).value = Helpers.formatarTelefone(paciente.telefone);
    (document.getElementById('paciente-email') as HTMLInputElement).value = paciente.email || '';

    (document.getElementById('paciente-rua') as HTMLInputElement).value = paciente.endereco.rua;
    (document.getElementById('paciente-numero') as HTMLInputElement).value = paciente.endereco.numero;
    (document.getElementById('paciente-complemento') as HTMLInputElement).value = paciente.endereco.complemento || '';
    (document.getElementById('paciente-bairro') as HTMLInputElement).value = paciente.endereco.bairro;
    (document.getElementById('paciente-cidade') as HTMLInputElement).value = paciente.endereco.cidade;
    (document.getElementById('paciente-estado') as HTMLSelectElement).value = paciente.endereco.estado;
    (document.getElementById('paciente-cep') as HTMLInputElement).value = Helpers.formatarCEP(paciente.endereco.cep);

    (document.getElementById('paciente-convenio') as HTMLInputElement).value = paciente.convenio || '';
    (document.getElementById('paciente-numero-convenio') as HTMLInputElement).value = paciente.numeroConvenio || '';

    (document.getElementById('paciente-emergencia-nome') as HTMLInputElement).value = paciente.contatoEmergencia.nome;
    (document.getElementById('paciente-emergencia-telefone') as HTMLInputElement).value = Helpers.formatarTelefone(paciente.contatoEmergencia.telefone);
    (document.getElementById('paciente-emergencia-parentesco') as HTMLInputElement).value = paciente.contatoEmergencia.parentesco;

    (document.getElementById('paciente-observacoes') as HTMLTextAreaElement).value = paciente.observacoes || '';

    const modal = new bootstrap.Modal(document.getElementById('pacienteModal')!);
    modal.show();
  }

  private static renderViewModal(): string {
    return `
      <div class="modal fade" id="viewPacienteModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-person-circle"></i> Informações do Paciente
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="view-paciente-content">
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

  private static viewPaciente(id: string): void {
    const paciente = PacienteService.obterPorId(id);
    if (!paciente) return;

    const content = document.getElementById('view-paciente-content');
    if (!content) return;

    content.innerHTML = `
      <div class="row">
        <div class="col-md-12 mb-3">
          <h6 class="text-primary border-bottom pb-2">
            <i class="bi bi-person"></i> Dados Pessoais
          </h6>
        </div>
        <div class="col-md-6 mb-3">
          <strong>Nome Completo:</strong>
          <p class="mb-1">${paciente.nome}</p>
        </div>
        <div class="col-md-3 mb-3">
          <strong>Data de Nascimento:</strong>
          <p class="mb-1">${Helpers.formatarDataBR(paciente.dataNascimento)}</p>
        </div>
        <div class="col-md-3 mb-3">
          <strong>Idade:</strong>
          <p class="mb-1">${Helpers.calcularIdade(paciente.dataNascimento)} anos</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>CPF:</strong>
          <p class="mb-1">${Helpers.formatarCPF(paciente.cpf)}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>RG:</strong>
          <p class="mb-1">${paciente.rg || 'Não informado'}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Telefone:</strong>
          <p class="mb-1">${Helpers.formatarTelefone(paciente.telefone)}</p>
        </div>
        <div class="col-md-6 mb-3">
          <strong>Email:</strong>
          <p class="mb-1">${paciente.email || 'Não informado'}</p>
        </div>
        <div class="col-md-6 mb-3">
          <strong>Status:</strong>
          <p class="mb-1">
            <span class="badge ${paciente.ativo ? 'bg-success' : 'bg-secondary'}">
              ${paciente.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </p>
        </div>

        <div class="col-md-12 mt-3 mb-3">
          <h6 class="text-primary border-bottom pb-2">
            <i class="bi bi-geo-alt"></i> Endereço
          </h6>
        </div>
        <div class="col-md-8 mb-3">
          <strong>Logradouro:</strong>
          <p class="mb-1">${paciente.endereco.rua}, ${paciente.endereco.numero}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Complemento:</strong>
          <p class="mb-1">${paciente.endereco.complemento || 'Não informado'}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Bairro:</strong>
          <p class="mb-1">${paciente.endereco.bairro}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Cidade:</strong>
          <p class="mb-1">${paciente.endereco.cidade}/${paciente.endereco.estado}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>CEP:</strong>
          <p class="mb-1">${Helpers.formatarCEP(paciente.endereco.cep)}</p>
        </div>

        ${paciente.convenio ? `
          <div class="col-md-12 mt-3 mb-3">
            <h6 class="text-primary border-bottom pb-2">
              <i class="bi bi-card-heading"></i> Convênio
            </h6>
          </div>
          <div class="col-md-6 mb-3">
            <strong>Convênio:</strong>
            <p class="mb-1">${paciente.convenio}</p>
          </div>
          <div class="col-md-6 mb-3">
            <strong>Número do Convênio:</strong>
            <p class="mb-1">${paciente.numeroConvenio || 'Não informado'}</p>
          </div>
        ` : ''}

        <div class="col-md-12 mt-3 mb-3">
          <h6 class="text-primary border-bottom pb-2">
            <i class="bi bi-telephone-plus"></i> Contato de Emergência
          </h6>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Nome:</strong>
          <p class="mb-1">${paciente.contatoEmergencia.nome}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Telefone:</strong>
          <p class="mb-1">${Helpers.formatarTelefone(paciente.contatoEmergencia.telefone)}</p>
        </div>
        <div class="col-md-4 mb-3">
          <strong>Parentesco:</strong>
          <p class="mb-1">${paciente.contatoEmergencia.parentesco}</p>
        </div>

        ${paciente.observacoes ? `
          <div class="col-md-12 mt-3 mb-3">
            <h6 class="text-primary border-bottom pb-2">
              <i class="bi bi-journal-text"></i> Observações
            </h6>
          </div>
          <div class="col-md-12 mb-3">
            <p class="mb-1">${paciente.observacoes}</p>
          </div>
        ` : ''}

        <div class="col-md-12 mt-3">
          <small class="text-muted">
            <i class="bi bi-clock"></i> Cadastrado em: ${Helpers.formatarDataBR(paciente.dataCriacao)}
            ${paciente.dataAtualizacao ? ` | Atualizado em: ${Helpers.formatarDataBR(paciente.dataAtualizacao)}` : ''}
          </small>
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('viewPacienteModal')!);
    modal.show();
  }

  private static toggleStatus(id: string, ativar: boolean): void {
    const mensagem = ativar
      ? 'Deseja realmente reativar este paciente?'
      : 'Deseja realmente desativar este paciente?';

    if (Helpers.confirmar(mensagem)) {
      const resultado = ativar
        ? PacienteService.ativarPaciente(id)
        : PacienteService.desativarPaciente(id);

      if (resultado.sucesso) {
        Helpers.mostrarNotificacao(resultado.mensagem, 'success');
        this.aplicarFiltros();
      }
    }
  }

  private static deletePaciente(id: string): void {
    const paciente = PacienteService.obterPorId(id);
    if (!paciente) return;

    const confirmacao = Helpers.confirmar(
      `ATENÇÃO: Você está prestes a EXCLUIR PERMANENTEMENTE o paciente:\n\n` +
      `${paciente.nome}\nCPF: ${Helpers.formatarCPF(paciente.cpf)}\n\n` +
      `Esta ação NÃO PODE ser desfeita!\n\n` +
      `Deseja realmente continuar?`
    );

    if (confirmacao) {
      const resultado = PacienteService.excluirPaciente(id);
      if (resultado.sucesso) {
        Helpers.mostrarNotificacao(resultado.mensagem, 'warning');
        this.aplicarFiltros();
      } else {
        Helpers.mostrarNotificacao(resultado.mensagem, 'error');
      }
    }
  }

  private static obterPacientesPorFiltro(filtro: string): Paciente[] {
    let pacientes = PacienteService.obterTodos();
    if (filtro === 'ativos') {
      return pacientes.filter(p => p.ativo);
    } else if (filtro === 'inativos') {
      return pacientes.filter(p => !p.ativo);
    }
    return pacientes;
  }

  private static aplicarFiltros(): void {
    // Filtro de status
    const filtroStatus = (document.getElementById('filtro-status') as HTMLSelectElement)?.value;

    // Salvar filtro no localStorage
    if (filtroStatus) {
      localStorage.setItem(this.FILTRO_KEY, filtroStatus);
    }

    let pacientes = this.obterPacientesPorFiltro(filtroStatus);

    // Busca por nome
    const termoBusca = (document.getElementById('busca-paciente') as HTMLInputElement)?.value;
    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase();
      pacientes = pacientes.filter(p => p.nome.toLowerCase().includes(termoLower));
    }

    // Busca por CPF
    const cpfBusca = (document.getElementById('busca-cpf') as HTMLInputElement)?.value.replace(/\D/g, '');
    if (cpfBusca && cpfBusca.length >= 3) {
      pacientes = pacientes.filter(p => p.cpf.includes(cpfBusca));
    }

    this.atualizarTabela(pacientes);
  }

  private static atualizarTabela(pacientes: Paciente[]): void {
    const cardBody = document.getElementById('pacientes-card-body');
    if (!cardBody) return;

    if (pacientes.length === 0) {
      // Mostrar mensagem quando não há pacientes
      const filtroStatus = (document.getElementById('filtro-status') as HTMLSelectElement)?.value;
      let mensagem = 'Nenhum paciente encontrado';

      if (filtroStatus === 'inativos') {
        mensagem = 'Nenhum paciente inativo encontrado';
      } else if (filtroStatus === 'ativos') {
        mensagem = 'Nenhum paciente ativo encontrado';
      }

      cardBody.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-people"></i>
          <h3>${mensagem}</h3>
          <p>Use os filtros acima para ajustar a busca</p>
        </div>
      `;
    } else {
      // Mostrar tabela com pacientes
      cardBody.innerHTML = `
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Idade</th>
                <th>Cidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="pacientes-tbody">
              ${this.renderPacientes(pacientes)}
            </tbody>
          </table>
        </div>
      `;
    }
  }
}
