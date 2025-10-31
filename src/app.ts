import { AuthService } from './services/AuthService';
import { PacienteService } from './services/PacienteService';
import { AvaliacaoService } from './services/AvaliacaoService';
import { RelatorioService } from './services/RelatorioService';
import { Helpers } from './utils/helpers';
import { EventBus, Events } from './utils/EventBus';
import { Permissoes } from './utils/Permissoes';
import { DashboardPage } from './pages/DashboardPage';
import { PacientesPage } from './pages/PacientesPage';
import { AvaliacoesPage } from './pages/AvaliacoesPage';
import { RelatoriosPage } from './pages/RelatoriosPage';
import { PerfilPage } from './pages/PerfilPage';
import { UsuariosPage } from './pages/UsuariosPage';

class App {
  private currentPage: string = 'dashboard';
  private isNavigating: boolean = false;

  constructor() {
    this.init();
    this.setupDataChangeListeners();
  }

  private init(): void {
    // Inicializar usuário admin padrão
    AuthService.inicializarUsuarioAdmin();

    // Verificar autenticação
    if (AuthService.estaAutenticado()) {
      this.showMainApp();
    } else {
      this.showLoginPage();
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Forgot Password
    const forgotPassword = document.getElementById('forgot-password');
    if (forgotPassword) {
      forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleForgotPassword();
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // Navigation
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (e.target as HTMLElement).closest('[data-page]')?.getAttribute('data-page');
        if (page) {
          this.navigateTo(page);
        }
      });
    });
  }

  private handleLogin(e: Event): void {
    e.preventDefault();

    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const senha = (document.getElementById('login-senha') as HTMLInputElement).value;

    const resultado = AuthService.login({ email, senha });

    if (resultado.sucesso) {
      Helpers.mostrarNotificacao(resultado.mensagem, 'success');
      this.showMainApp();
    } else {
      Helpers.mostrarNotificacao(resultado.mensagem, 'error');
    }
  }

  private handleForgotPassword(): void {
    Helpers.mostrarNotificacao(
      'Entre em contato com o administrador do sistema para recuperar sua senha.',
      'info'
    );
  }

  private handleLogout(): void {
    if (Helpers.confirmar('Deseja realmente sair?')) {
      AuthService.logout();
      Helpers.mostrarNotificacao('Logout realizado com sucesso', 'success');
      this.showLoginPage();
    }
  }

  private showLoginPage(): void {
    document.getElementById('login-page')!.style.display = 'block';
    const registerPage = document.getElementById('register-page');
    if (registerPage) registerPage.style.display = 'none';
    document.getElementById('main-app')!.style.display = 'none';

    // Limpar form
    (document.getElementById('login-form') as HTMLFormElement)?.reset();
  }

  private showMainApp(): void {
    document.getElementById('login-page')!.style.display = 'none';
    const registerPage = document.getElementById('register-page');
    if (registerPage) registerPage.style.display = 'none';
    document.getElementById('main-app')!.style.display = 'block';

    // Atualizar informações do usuário
    this.updateUserInfo();

    // Mostrar/ocultar menu de usuários baseado no cargo
    this.updateMenuVisibility();

    // Carregar página inicial
    this.navigateTo('dashboard');
  }

  private updateUserInfo(): void {
    const usuario = AuthService.obterUsuarioAtual();
    if (usuario) {
      const userName = document.getElementById('user-name');
      if (userName) userName.textContent = usuario.nome;

      const userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
      const userIcon = document.getElementById('user-icon');

      if (usuario.fotoPerfil) {
        if (userAvatar) {
          userAvatar.src = usuario.fotoPerfil;
          userAvatar.style.display = 'inline';
        }
        if (userIcon) userIcon.style.display = 'none';
      } else {
        if (userAvatar) userAvatar.style.display = 'none';
        if (userIcon) userIcon.style.display = 'inline';
      }
    }
  }

  private updateMenuVisibility(): void {
    const usuario = AuthService.obterUsuarioAtual();

    // Menu de usuários - apenas admin
    const usuariosMenu = document.getElementById('usuarios-menu');
    if (usuariosMenu) {
      usuariosMenu.style.display = Permissoes.isAdmin() ? 'block' : 'none';
    }

    // Menu de pacientes - admin, médico e psicólogo
    const pacientesMenu = document.querySelector('[data-page="pacientes"]')?.parentElement;
    if (pacientesMenu) {
      (pacientesMenu as HTMLElement).style.display = Permissoes.podeAcessarPacientes() ? 'block' : 'none';
    }

    // Menu de avaliações - admin, médico e psicólogo
    const avaliacoesMenu = document.querySelector('[data-page="avaliacoes"]')?.parentElement;
    if (avaliacoesMenu) {
      (avaliacoesMenu as HTMLElement).style.display = Permissoes.podeAcessarAvaliacoes() ? 'block' : 'none';
    }
  }

  private navigateTo(page: string): void {
    this.currentPage = page;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

    // Load page content
    const content = document.getElementById('page-content');
    if (!content) return;

    switch (page) {
      case 'dashboard':
        content.innerHTML = DashboardPage.render();
        DashboardPage.init();
        break;
      case 'pacientes':
        if (Permissoes.podeAcessarPacientes()) {
          content.innerHTML = PacientesPage.render();
          PacientesPage.init();
        } else {
          content.innerHTML = `
            <div class="alert alert-warning">
              <h4><i class="bi bi-exclamation-triangle"></i> Acesso Restrito</h4>
              <p>Você não tem permissão para acessar esta página.</p>
            </div>
          `;
        }
        break;
      case 'avaliacoes':
        if (Permissoes.podeAcessarAvaliacoes()) {
          content.innerHTML = AvaliacoesPage.render();
          AvaliacoesPage.init();
        } else {
          content.innerHTML = `
            <div class="alert alert-warning">
              <h4><i class="bi bi-exclamation-triangle"></i> Acesso Restrito</h4>
              <p>Você não tem permissão para acessar esta página.</p>
            </div>
          `;
        }
        break;
      case 'relatorios':
        content.innerHTML = RelatoriosPage.render();
        RelatoriosPage.init();
        break;
      case 'usuarios':
        if (Permissoes.isAdmin()) {
          content.innerHTML = UsuariosPage.render();
          UsuariosPage.init();
        } else {
          content.innerHTML = `
            <div class="alert alert-warning">
              <h4><i class="bi bi-exclamation-triangle"></i> Acesso Restrito</h4>
              <p>Apenas administradores podem acessar esta página.</p>
            </div>
          `;
        }
        break;
      case 'perfil':
        content.innerHTML = PerfilPage.render();
        PerfilPage.init();
        break;
      default:
        content.innerHTML = '<h2>Página não encontrada</h2>';
    }
  }

  private setupDataChangeListeners(): void {
    // Escutar eventos de alteração de dados
    EventBus.on(Events.DADOS_ALTERADOS, () => {
      // Recarregar a página atual após um pequeno delay para garantir que o modal fechou
      if (!this.isNavigating) {
        setTimeout(() => {
          this.navigateTo(this.currentPage);
        }, 300);
      }
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
