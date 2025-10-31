import { AuthService } from '../services/AuthService.js';
export class Permissoes {
    /**
     * Verifica se o usuário atual pode cadastrar pacientes
     * Apenas médico e psicólogo podem cadastrar
     */
    static podeCadastrarPaciente() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
    }
    /**
     * Verifica se o usuário atual pode criar avaliações
     * Apenas médico e psicólogo podem criar avaliações
     */
    static podeCriarAvaliacao() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
    }
    /**
     * Verifica se o usuário atual pode acessar a página de pacientes
     * Assistente não pode acessar
     */
    static podeAcessarPacientes() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
    }
    /**
     * Verifica se o usuário atual pode acessar a página de avaliações
     * Assistente não pode acessar
     */
    static podeAcessarAvaliacoes() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
    }
    /**
     * Verifica se o usuário atual pode editar/excluir pacientes
     * Apenas admin, médico e psicólogo podem
     */
    static podeEditarPaciente() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
    }
    /**
     * Verifica se o usuário atual pode editar/excluir avaliações
     * Apenas admin, médico e psicólogo podem
     */
    static podeEditarAvaliacao() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
    }
    /**
     * Verifica se o usuário atual é admin
     */
    static isAdmin() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return usuario.cargo === 'admin';
    }
    /**
     * Verifica se o usuário atual é assistente
     */
    static isAssistente() {
        const usuario = AuthService.obterUsuarioAtual();
        if (!usuario)
            return false;
        return usuario.cargo === 'assistente';
    }
}
//# sourceMappingURL=Permissoes.js.map