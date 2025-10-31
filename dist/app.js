import { AuthService } from './services/AuthService.js';
import { Helpers } from './utils/helpers.js';
import { EventBus, Events } from './utils/EventBus.js';
import { Permissoes } from './utils/Permissoes.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { PacientesPage } from './pages/PacientesPage.js';
import { AvaliacoesPage } from './pages/AvaliacoesPage.js';
import { RelatoriosPage } from './pages/RelatoriosPage.js';
import { PerfilPage } from './pages/PerfilPage.js';
import { UsuariosPage } from './pages/UsuariosPage.js';
class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.isNavigating = false;
        this.init();
        this.setupDataChangeListeners();
    }
    init() {
        // Inicializar usuário admin padrão
        AuthService.inicializarUsuarioAdmin();
        // Verificar autenticação
        if (AuthService.estaAutenticado()) {
            this.showMainApp();
        }
        else {
            this.showLoginPage();
        }
        this.setupEventListeners();
    }
    setupEventListeners() {
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
                const page = e.target.closest('[data-page]')?.getAttribute('data-page');
                if (page) {
                    this.navigateTo(page);
                }
            });
        });
    }
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        const resultado = AuthService.login({ email, senha });
        if (resultado.sucesso) {
            Helpers.mostrarNotificacao(resultado.mensagem, 'success');
            this.showMainApp();
        }
        else {
            Helpers.mostrarNotificacao(resultado.mensagem, 'error');
        }
    }
    handleForgotPassword() {
        Helpers.mostrarNotificacao('Entre em contato com o administrador do sistema para recuperar sua senha.', 'info');
    }
    handleLogout() {
        if (Helpers.confirmar('Deseja realmente sair?')) {
            AuthService.logout();
            Helpers.mostrarNotificacao('Logout realizado com sucesso', 'success');
            this.showLoginPage();
        }
    }
    showLoginPage() {
        document.getElementById('login-page').style.display = 'block';
        const registerPage = document.getElementById('register-page');
        if (registerPage)
            registerPage.style.display = 'none';
        document.getElementById('main-app').style.display = 'none';
        // Limpar form
        document.getElementById('login-form')?.reset();
    }
    showMainApp() {
        document.getElementById('login-page').style.display = 'none';
        const registerPage = document.getElementById('register-page');
        if (registerPage)
            registerPage.style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        // Atualizar informações do usuário
        this.updateUserInfo();
        // Mostrar/ocultar menu de usuários baseado no cargo
        this.updateMenuVisibility();
        // Carregar página inicial
        this.navigateTo('dashboard');
    }
    updateUserInfo() {
        const usuario = AuthService.obterUsuarioAtual();
        if (usuario) {
            const userName = document.getElementById('user-name');
            if (userName)
                userName.textContent = usuario.nome;
            const userAvatar = document.getElementById('user-avatar');
            const userIcon = document.getElementById('user-icon');
            if (usuario.fotoPerfil) {
                if (userAvatar) {
                    userAvatar.src = usuario.fotoPerfil;
                    userAvatar.style.display = 'inline';
                }
                if (userIcon)
                    userIcon.style.display = 'none';
            }
            else {
                if (userAvatar)
                    userAvatar.style.display = 'none';
                if (userIcon)
                    userIcon.style.display = 'inline';
            }
        }
    }
    updateMenuVisibility() {
        const usuario = AuthService.obterUsuarioAtual();
        // Menu de usuários - apenas admin
        const usuariosMenu = document.getElementById('usuarios-menu');
        if (usuariosMenu) {
            usuariosMenu.style.display = Permissoes.isAdmin() ? 'block' : 'none';
        }
        // Menu de pacientes - admin, médico e psicólogo
        const pacientesMenu = document.querySelector('[data-page="pacientes"]')?.parentElement;
        if (pacientesMenu) {
            pacientesMenu.style.display = Permissoes.podeAcessarPacientes() ? 'block' : 'none';
        }
        // Menu de avaliações - admin, médico e psicólogo
        const avaliacoesMenu = document.querySelector('[data-page="avaliacoes"]')?.parentElement;
        if (avaliacoesMenu) {
            avaliacoesMenu.style.display = Permissoes.podeAcessarAvaliacoes() ? 'block' : 'none';
        }
    }
    navigateTo(page) {
        this.currentPage = page;
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        // Load page content
        const content = document.getElementById('page-content');
        if (!content)
            return;
        switch (page) {
            case 'dashboard':
                content.innerHTML = DashboardPage.render();
                DashboardPage.init();
                break;
            case 'pacientes':
                if (Permissoes.podeAcessarPacientes()) {
                    content.innerHTML = PacientesPage.render();
                    PacientesPage.init();
                }
                else {
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
                }
                else {
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
                }
                else {
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
    setupDataChangeListeners() {
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
//# sourceMappingURL=app.js.map