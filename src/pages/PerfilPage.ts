import { AuthService } from '../services/AuthService';
import { Helpers } from '../utils/helpers';

export class PerfilPage {
  static render(): string {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) {
      return '<div class="alert alert-danger">Usuário não autenticado</div>';
    }

    return `
      <div class="fade-in">
        <h2 class="mb-4">
          <i class="bi bi-person-circle"></i> Meu Perfil
        </h2>

        <div class="row">
          <!-- Card de Foto e Info Básica -->
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <div class="profile-photo-container mb-3">
                  ${usuario.fotoPerfil ? `
                    <img src="${usuario.fotoPerfil}" alt="Foto de perfil" class="profile-photo" id="profile-photo">
                  ` : `
                    <div class="profile-photo-placeholder" id="profile-photo">
                      <i class="bi bi-person"></i>
                    </div>
                  `}
                  <label for="photo-upload" class="profile-photo-upload">
                    <i class="bi bi-camera"></i>
                  </label>
                  <input type="file" id="photo-upload" accept="image/*" style="display: none;">
                </div>

                <h4>${usuario.nome}</h4>
                <p class="text-muted">${usuario.email}</p>
                <span class="badge bg-primary">${this.getCargoPtBr(usuario.cargo)}</span>

                <hr>

                <div class="text-start">
                  <p class="mb-2"><small class="text-muted">Membro desde:</small></p>
                  <p><strong>${Helpers.formatarDataBR(usuario.dataCriacao)}</strong></p>

                  <p class="mb-2 mt-3"><small class="text-muted">Última atualização:</small></p>
                  <p><strong>${Helpers.formatarDataBR(usuario.dataAtualizacao)}</strong></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card de Edição de Perfil -->
          <div class="col-md-8 mb-4">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-pencil-square"></i> Editar Informações</h5>
              </div>
              <div class="card-body">
                <form id="perfil-form">
                  <div class="mb-3">
                    <label for="perfil-nome" class="form-label">Nome Completo *</label>
                    <input type="text" class="form-control" id="perfil-nome" value="${usuario.nome}" required>
                  </div>

                  <div class="mb-3">
                    <label for="perfil-email" class="form-label">Email *</label>
                    <input type="email" class="form-control" id="perfil-email" value="${usuario.email}" required>
                  </div>

                  <div class="mb-3">
                    <label for="perfil-cargo" class="form-label">Cargo *</label>
                    <select class="form-select" id="perfil-cargo" required>
                      <option value="admin" ${usuario.cargo === 'admin' ? 'selected' : ''}>Administrador</option>
                      <option value="medico" ${usuario.cargo === 'medico' ? 'selected' : ''}>Médico</option>
                      <option value="psicologo" ${usuario.cargo === 'psicologo' ? 'selected' : ''}>Psicólogo</option>
                      <option value="assistente" ${usuario.cargo === 'assistente' ? 'selected' : ''}>Assistente</option>
                    </select>
                  </div>

                  <hr>

                  <h6 class="text-primary mb-3">Alterar Senha</h6>
                  <p class="text-muted small">Deixe em branco se não deseja alterar a senha</p>

                  <div class="mb-3">
                    <label for="perfil-senha-nova" class="form-label">Nova Senha</label>
                    <input type="password" class="form-control" id="perfil-senha-nova" minlength="6">
                    <small class="text-muted">Mínimo de 6 caracteres</small>
                  </div>

                  <div class="mb-3">
                    <label for="perfil-senha-confirmar" class="form-label">Confirmar Nova Senha</label>
                    <input type="password" class="form-control" id="perfil-senha-confirmar" minlength="6">
                  </div>

                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-check-circle"></i> Salvar Alterações
                    </button>
                    <button type="button" class="btn btn-outline-secondary" id="reset-form">
                      <i class="bi bi-arrow-counterclockwise"></i> Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Estatísticas do Usuário -->
            ${usuario.cargo === 'medico' || usuario.cargo === 'psicologo' ? `
            <div class="card mt-4">
              <div class="card-header bg-success text-white">
                <h5 class="mb-0"><i class="bi bi-graph-up"></i> Minhas Estatísticas</h5>
              </div>
              <div class="card-body">
                <div class="row text-center">
                  <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                      <div class="card-body">
                        <i class="bi bi-clipboard-check text-success" style="font-size: 2rem;"></i>
                        <h3 class="mt-2" id="total-avaliacoes-usuario">0</h3>
                        <p class="mb-0">Avaliações Realizadas</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                      <div class="card-body">
                        <i class="bi bi-calendar-check text-info" style="font-size: 2rem;"></i>
                        <h3 class="mt-2" id="avaliacoes-mes">0</h3>
                        <p class="mb-0">Este Mês</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Card de Ajuda -->
        <div class="card">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0"><i class="bi bi-info-circle"></i> Informações</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6><i class="bi bi-shield-check text-success"></i> Segurança</h6>
                <p class="text-muted small">
                  Seus dados são armazenados localmente no navegador usando LocalStorage.
                  Certifique-se de fazer backups regulares dos dados importantes.
                </p>
              </div>
              <div class="col-md-6">
                <h6><i class="bi bi-camera text-primary"></i> Foto de Perfil</h6>
                <p class="text-muted small">
                  Clique no ícone da câmera para alterar sua foto de perfil.
                  A imagem será armazenada em formato Base64.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static init(): void {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return;

    // Upload de foto
    document.getElementById('photo-upload')?.addEventListener('change', async (e) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          Helpers.mostrarNotificacao('A imagem deve ter no máximo 2MB', 'error');
          return;
        }

        try {
          const base64 = await Helpers.imageToBase64(file);
          const resultado = AuthService.atualizarPerfil({ fotoPerfil: base64 });

          if (resultado.sucesso) {
            Helpers.mostrarNotificacao('Foto de perfil atualizada', 'success');

            // Atualizar preview
            const photoElement = document.getElementById('profile-photo');
            if (photoElement) {
              photoElement.outerHTML = `<img src="${base64}" alt="Foto de perfil" class="profile-photo" id="profile-photo">`;
            }

            // Atualizar foto no navbar
            const userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
            const userIcon = document.getElementById('user-icon');
            if (userAvatar && userIcon) {
              userAvatar.src = base64;
              userAvatar.style.display = 'inline';
              userIcon.style.display = 'none';
            }
          }
        } catch (error) {
          Helpers.mostrarNotificacao('Erro ao carregar imagem', 'error');
        }
      }
    });

    // Salvar perfil
    document.getElementById('perfil-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.salvarPerfil();
    });

    // Reset form
    document.getElementById('reset-form')?.addEventListener('click', () => {
      this.resetForm();
    });

    // Carregar estatísticas do usuário
    this.carregarEstatisticas();
  }

  private static salvarPerfil(): void {
    const nome = (document.getElementById('perfil-nome') as HTMLInputElement).value;
    const email = (document.getElementById('perfil-email') as HTMLInputElement).value;
    const cargo = (document.getElementById('perfil-cargo') as HTMLSelectElement).value as any;
    const senhaNova = (document.getElementById('perfil-senha-nova') as HTMLInputElement).value;
    const senhaConfirmar = (document.getElementById('perfil-senha-confirmar') as HTMLInputElement).value;

    if (!Helpers.validarEmail(email)) {
      Helpers.mostrarNotificacao('Email inválido', 'error');
      return;
    }

    const dados: any = { nome, email, cargo };

    // Validar senha se foi preenchida
    if (senhaNova) {
      if (senhaNova.length < 6) {
        Helpers.mostrarNotificacao('A senha deve ter no mínimo 6 caracteres', 'error');
        return;
      }

      if (senhaNova !== senhaConfirmar) {
        Helpers.mostrarNotificacao('As senhas não coincidem', 'error');
        return;
      }

      dados.senha = senhaNova;
    }

    const resultado = AuthService.atualizarPerfil(dados);

    if (resultado.sucesso) {
      Helpers.mostrarNotificacao(resultado.mensagem, 'success');

      // Limpar campos de senha
      (document.getElementById('perfil-senha-nova') as HTMLInputElement).value = '';
      (document.getElementById('perfil-senha-confirmar') as HTMLInputElement).value = '';

      // Atualizar nome no navbar
      const userName = document.getElementById('user-name');
      if (userName) userName.textContent = nome;
    } else {
      Helpers.mostrarNotificacao(resultado.mensagem, 'error');
    }
  }

  private static resetForm(): void {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return;

    (document.getElementById('perfil-nome') as HTMLInputElement).value = usuario.nome;
    (document.getElementById('perfil-email') as HTMLInputElement).value = usuario.email;
    (document.getElementById('perfil-cargo') as HTMLSelectElement).value = usuario.cargo;
    (document.getElementById('perfil-senha-nova') as HTMLInputElement).value = '';
    (document.getElementById('perfil-senha-confirmar') as HTMLInputElement).value = '';
  }

  private static carregarEstatisticas(): void {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario || (usuario.cargo !== 'medico' && usuario.cargo !== 'psicologo')) return;

    // Importar dinamicamente para evitar circular dependency
    import('../services/AvaliacaoService').then(({ AvaliacaoService }) => {
      const avaliacoes = AvaliacaoService.obterPorMedico(usuario.id);

      const totalElement = document.getElementById('total-avaliacoes-usuario');
      if (totalElement) {
        totalElement.textContent = avaliacoes.length.toString();
      }

      // Avaliacoes deste mês
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      const avaliacoesDoMes = avaliacoes.filter(a => {
        const data = new Date(a.dataAvaliacao);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      });

      const mesElement = document.getElementById('avaliacoes-mes');
      if (mesElement) {
        mesElement.textContent = avaliacoesDoMes.length.toString();
      }
    });
  }

  private static getCargoPtBr(cargo: string): string {
    const cargos: Record<string, string> = {
      admin: 'Administrador',
      medico: 'Médico',
      psicologo: 'Psicólogo',
      assistente: 'Assistente'
    };
    return cargos[cargo] || cargo;
  }
}
