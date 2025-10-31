import { AuthService } from '../services/AuthService';

export class Permissoes {
  /**
   * Verifica se o usuário atual pode cadastrar pacientes
   * Apenas médico e psicólogo podem cadastrar
   */
  static podeCadastrarPaciente(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
  }

  /**
   * Verifica se o usuário atual pode criar avaliações
   * Apenas médico e psicólogo podem criar avaliações
   */
  static podeCriarAvaliacao(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
  }

  /**
   * Verifica se o usuário atual pode acessar a página de pacientes
   * Assistente não pode acessar
   */
  static podeAcessarPacientes(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
  }

  /**
   * Verifica se o usuário atual pode acessar a página de avaliações
   * Assistente não pode acessar
   */
  static podeAcessarAvaliacoes(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
  }

  /**
   * Verifica se o usuário atual pode editar/excluir pacientes
   * Apenas admin, médico e psicólogo podem
   */
  static podeEditarPaciente(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
  }

  /**
   * Verifica se o usuário atual pode editar/excluir avaliações
   * Apenas admin, médico e psicólogo podem
   */
  static podeEditarAvaliacao(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
  }

  /**
   * Verifica se o usuário atual é admin
   */
  static isAdmin(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return usuario.cargo === 'admin';
  }

  /**
   * Verifica se o usuário atual é assistente
   */
  static isAssistente(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    if (!usuario) return false;
    return usuario.cargo === 'assistente';
  }
}
