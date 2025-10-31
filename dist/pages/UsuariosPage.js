import { AuthService } from '../services/AuthService.js';
import { Helpers } from '../utils/helpers.js';
export class UsuariosPage {
    static render() {
        return `
      <div class="usuarios-page">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2><i class="bi bi-people-fill"></i> Gestão de Usuários</h2>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#usuarioModal">
            <i class="bi bi-person-plus"></i> Novo Usuário
          </button>
        </div>

        <!-- Lista de Usuários -->
        <div class="card shadow-sm">
          <div class="card-body" id="usuarios-card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Cargo</th>
                    <th>Data Criação</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody id="usuarios-tbody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Cadastro/Edição -->
        <div class="modal fade" id="usuarioModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="usuarioModalLabel">Novo Usuário</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <form id="usuario-form">
                <div class="modal-body">
                  <input type="hidden" id="usuario-id">

                  <div class="mb-3">
                    <label for="usuario-nome" class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" id="usuario-nome" required>
                  </div>

                  <div class="mb-3">
                    <label for="usuario-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="usuario-email" required>
                  </div>

                  <div class="mb-3" id="senha-group">
                    <label for="usuario-senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="usuario-senha" minlength="6">
                    <small class="text-muted">Mínimo 6 caracteres</small>
                  </div>

                  <div class="mb-3">
                    <label for="usuario-cargo" class="form-label">Cargo</label>
                    <select class="form-select" id="usuario-cargo" required>
                      <option value="">Selecione...</option>
                      <option value="admin">Administrador</option>
                      <option value="medico">Médico</option>
                      <option value="psicologo">Psicólogo</option>
                      <option value="assistente">Assistente</option>
                    </select>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check-circle"></i> Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal Resetar Senha -->
        <div class="modal fade" id="resetSenhaModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Resetar Senha</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <form id="reset-senha-form">
                <div class="modal-body">
                  <input type="hidden" id="reset-usuario-id">

                  <div class="mb-3">
                    <label for="nova-senha" class="form-label">Nova Senha</label>
                    <input type="password" class="form-control" id="nova-senha" minlength="6" required>
                    <small class="text-muted">Mínimo 6 caracteres</small>
                  </div>

                  <div class="mb-3">
                    <label for="confirmar-senha" class="form-label">Confirmar Senha</label>
                    <input type="password" class="form-control" id="confirmar-senha" minlength="6" required>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-key"></i> Resetar Senha
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    static init() {
        this.atualizarTabela();
        this.setupEventListeners();
    }
    static setupEventListeners() {
        // Form de cadastro/edição
        const form = document.getElementById('usuario-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        // Form de reset de senha
        const resetForm = document.getElementById('reset-senha-form');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => this.handleResetSenha(e));
        }
        // Reset form ao abrir modal de novo usuário
        const modal = document.getElementById('usuarioModal');
        if (modal) {
            modal.addEventListener('show.bs.modal', () => {
                const form = document.getElementById('usuario-form');
                if (form)
                    form.reset();
                document.getElementById('usuario-id').setAttribute('value', '');
                document.getElementById('usuarioModalLabel').textContent = 'Novo Usuário';
                // Tornar senha obrigatória para novo usuário
                const senhaInput = document.getElementById('usuario-senha');
                if (senhaInput)
                    senhaInput.required = true;
            });
        }
        // Expor funções globalmente para os botões
        window.editUsuario = (id) => this.editUsuario(id);
        window.deleteUsuario = (id) => this.deleteUsuario(id);
        window.resetSenhaUsuario = (id) => this.resetSenhaUsuario(id);
    }
    static atualizarTabela() {
        const tbody = document.getElementById('usuarios-tbody');
        if (!tbody)
            return;
        const usuarios = AuthService.listarUsuarios();
        const usuarioAtual = AuthService.obterUsuarioAtual();
        if (usuarios.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-4">
            <i class="bi bi-inbox" style="font-size: 3rem;"></i>
            <p class="mt-2">Nenhum usuário cadastrado</p>
          </td>
        </tr>
      `;
            return;
        }
        tbody.innerHTML = usuarios.map(usuario => {
            const cargoLabel = this.getCargoLabel(usuario.cargo);
            const cargoClass = this.getCargoClass(usuario.cargo);
            const isCurrentUser = usuarioAtual?.id === usuario.id;
            return `
        <tr>
          <td>
            <strong>${usuario.nome}</strong>
            ${isCurrentUser ? '<span class="badge bg-info ms-2">Você</span>' : ''}
          </td>
          <td>${usuario.email}</td>
          <td>
            <span class="badge ${cargoClass}">${cargoLabel}</span>
          </td>
          <td>${Helpers.formatarDataBR(usuario.dataCriacao)}</td>
          <td class="text-center">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editUsuario('${usuario.id}')" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-warning" onclick="resetSenhaUsuario('${usuario.id}')" title="Resetar Senha">
                <i class="bi bi-key"></i>
              </button>
              ${!isCurrentUser ? `
                <button class="btn btn-outline-danger" onclick="deleteUsuario('${usuario.id}')" title="Excluir">
                  <i class="bi bi-trash"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
        }).join('');
    }
    static handleSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('usuario-id').value;
        const nome = document.getElementById('usuario-nome').value;
        const email = document.getElementById('usuario-email').value;
        const senha = document.getElementById('usuario-senha').value;
        const cargo = document.getElementById('usuario-cargo').value;
        if (!Helpers.validarEmail(email)) {
            Helpers.mostrarNotificacao('Email inválido', 'error');
            return;
        }
        let resultado;
        if (id) {
            // Edição
            const dados = { nome, email, cargo };
            // Só atualizar senha se foi preenchida
            if (senha) {
                if (senha.length < 6) {
                    Helpers.mostrarNotificacao('A senha deve ter no mínimo 6 caracteres', 'error');
                    return;
                }
                dados.senha = senha;
            }
            resultado = AuthService.atualizarUsuario(id, dados);
        }
        else {
            // Cadastro
            if (senha.length < 6) {
                Helpers.mostrarNotificacao('A senha deve ter no mínimo 6 caracteres', 'error');
                return;
            }
            resultado = AuthService.cadastrarUsuario({ nome, email, senha, cargo });
        }
        if (resultado.sucesso) {
            Helpers.mostrarNotificacao(resultado.mensagem, 'success');
            this.atualizarTabela();
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('usuarioModal'));
            if (modal)
                modal.hide();
        }
        else {
            Helpers.mostrarNotificacao(resultado.mensagem, 'error');
        }
    }
    static editUsuario(id) {
        const usuario = AuthService.obterUsuarioPorId(id);
        if (!usuario)
            return;
        // Preencher form
        document.getElementById('usuario-id').value = usuario.id;
        document.getElementById('usuario-nome').value = usuario.nome;
        document.getElementById('usuario-email').value = usuario.email;
        document.getElementById('usuario-cargo').value = usuario.cargo;
        // Limpar senha e torná-la opcional na edição
        const senhaInput = document.getElementById('usuario-senha');
        senhaInput.value = '';
        senhaInput.required = false;
        senhaInput.placeholder = 'Deixe em branco para não alterar';
        document.getElementById('usuarioModalLabel').textContent = 'Editar Usuário';
        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('usuarioModal'));
        modal.show();
    }
    static deleteUsuario(id) {
        const usuario = AuthService.obterUsuarioPorId(id);
        if (!usuario)
            return;
        const confirmacao = Helpers.confirmar(`Deseja realmente excluir o usuário:\n\n${usuario.nome}\n${usuario.email}?`);
        if (confirmacao) {
            const resultado = AuthService.excluirUsuario(id);
            if (resultado.sucesso) {
                Helpers.mostrarNotificacao(resultado.mensagem, 'success');
                this.atualizarTabela();
            }
            else {
                Helpers.mostrarNotificacao(resultado.mensagem, 'error');
            }
        }
    }
    static resetSenhaUsuario(id) {
        const usuario = AuthService.obterUsuarioPorId(id);
        if (!usuario)
            return;
        document.getElementById('reset-usuario-id').value = id;
        document.getElementById('reset-senha-form').reset();
        const modal = new bootstrap.Modal(document.getElementById('resetSenhaModal'));
        modal.show();
    }
    static handleResetSenha(e) {
        e.preventDefault();
        const id = document.getElementById('reset-usuario-id').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        if (novaSenha !== confirmarSenha) {
            Helpers.mostrarNotificacao('As senhas não coincidem', 'error');
            return;
        }
        const resultado = AuthService.resetarSenha(id, novaSenha);
        if (resultado.sucesso) {
            Helpers.mostrarNotificacao(resultado.mensagem, 'success');
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('resetSenhaModal'));
            if (modal)
                modal.hide();
        }
        else {
            Helpers.mostrarNotificacao(resultado.mensagem, 'error');
        }
    }
    static getCargoLabel(cargo) {
        const labels = {
            'admin': 'Administrador',
            'medico': 'Médico',
            'psicologo': 'Psicólogo',
            'assistente': 'Assistente'
        };
        return labels[cargo] || cargo;
    }
    static getCargoClass(cargo) {
        const classes = {
            'admin': 'bg-danger',
            'medico': 'bg-primary',
            'psicologo': 'bg-success',
            'assistente': 'bg-warning'
        };
        return classes[cargo] || 'bg-secondary';
    }
}
//# sourceMappingURL=UsuariosPage.js.map