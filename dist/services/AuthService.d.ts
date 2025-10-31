import { Usuario, UsuarioLogin, UsuarioCadastro } from '../models/Usuario';
export declare class AuthService {
    private static readonly USERS_KEY;
    private static readonly CURRENT_USER_KEY;
    static cadastrarUsuario(dados: UsuarioCadastro): {
        sucesso: boolean;
        mensagem: string;
        usuario?: Usuario;
    };
    static login(credenciais: UsuarioLogin): {
        sucesso: boolean;
        mensagem: string;
        usuario?: Usuario;
    };
    static logout(): void;
    static obterUsuarioAtual(): Usuario | null;
    static estaAutenticado(): boolean;
    static atualizarPerfil(dados: Partial<Usuario>): {
        sucesso: boolean;
        mensagem: string;
    };
    private static obterTodosUsuarios;
    private static gerarId;
    static inicializarUsuarioAdmin(): void;
    static listarUsuarios(): Usuario[];
    static obterUsuarioPorId(id: string): Usuario | null;
    static atualizarUsuario(id: string, dados: Partial<Usuario>): {
        sucesso: boolean;
        mensagem: string;
    };
    static excluirUsuario(id: string): {
        sucesso: boolean;
        mensagem: string;
    };
    static resetarSenha(id: string, novaSenha: string): {
        sucesso: boolean;
        mensagem: string;
    };
}
//# sourceMappingURL=AuthService.d.ts.map