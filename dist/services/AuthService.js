import { StorageService } from './StorageService.js';
export class AuthService {
    static cadastrarUsuario(dados) {
        const usuarios = this.obterTodosUsuarios();
        // Verificar se email já existe
        if (usuarios.some(u => u.email === dados.email)) {
            return { sucesso: false, mensagem: 'Email já cadastrado' };
        }
        const novoUsuario = {
            id: this.gerarId(),
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha, // Em produção, usar hash
            cargo: dados.cargo,
            dataCriacao: new Date(),
            dataAtualizacao: new Date()
        };
        usuarios.push(novoUsuario);
        StorageService.set(this.USERS_KEY, usuarios);
        return { sucesso: true, mensagem: 'Usuário cadastrado com sucesso', usuario: novoUsuario };
    }
    static login(credenciais) {
        const usuarios = this.obterTodosUsuarios();
        const usuario = usuarios.find(u => u.email === credenciais.email && u.senha === credenciais.senha);
        if (!usuario) {
            return { sucesso: false, mensagem: 'Email ou senha inválidos' };
        }
        // Não armazenar senha no usuário atual
        const { senha, ...usuarioSemSenha } = usuario;
        StorageService.set(this.CURRENT_USER_KEY, usuarioSemSenha);
        return { sucesso: true, mensagem: 'Login realizado com sucesso', usuario };
    }
    static logout() {
        StorageService.remove(this.CURRENT_USER_KEY);
    }
    static obterUsuarioAtual() {
        return StorageService.get(this.CURRENT_USER_KEY);
    }
    static estaAutenticado() {
        return this.obterUsuarioAtual() !== null;
    }
    static atualizarPerfil(dados) {
        const usuarioAtual = this.obterUsuarioAtual();
        if (!usuarioAtual) {
            return { sucesso: false, mensagem: 'Usuário não autenticado' };
        }
        const usuarios = this.obterTodosUsuarios();
        const index = usuarios.findIndex(u => u.id === usuarioAtual.id);
        if (index === -1) {
            return { sucesso: false, mensagem: 'Usuário não encontrado' };
        }
        usuarios[index] = {
            ...usuarios[index],
            ...dados,
            id: usuarioAtual.id, // Garantir que o ID não seja alterado
            dataAtualizacao: new Date()
        };
        StorageService.set(this.USERS_KEY, usuarios);
        const { senha, ...usuarioSemSenha } = usuarios[index];
        StorageService.set(this.CURRENT_USER_KEY, usuarioSemSenha);
        return { sucesso: true, mensagem: 'Perfil atualizado com sucesso' };
    }
    static obterTodosUsuarios() {
        return StorageService.get(this.USERS_KEY) || [];
    }
    static gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    // Método para criar usuário admin padrão
    static inicializarUsuarioAdmin() {
        const usuarios = this.obterTodosUsuarios();
        if (usuarios.length === 0) {
            this.cadastrarUsuario({
                nome: 'Administrador',
                email: 'admin@clinica.com',
                senha: 'admin123',
                cargo: 'admin'
            });
        }
    }
    // Métodos para gestão de usuários (apenas admin)
    static listarUsuarios() {
        return this.obterTodosUsuarios();
    }
    static obterUsuarioPorId(id) {
        const usuarios = this.obterTodosUsuarios();
        return usuarios.find(u => u.id === id) || null;
    }
    static atualizarUsuario(id, dados) {
        const usuarios = this.obterTodosUsuarios();
        const index = usuarios.findIndex(u => u.id === id);
        if (index === -1) {
            return { sucesso: false, mensagem: 'Usuário não encontrado' };
        }
        // Verificar se está tentando alterar email para um já existente
        if (dados.email && dados.email !== usuarios[index].email) {
            if (usuarios.some(u => u.email === dados.email && u.id !== id)) {
                return { sucesso: false, mensagem: 'Email já cadastrado' };
            }
        }
        usuarios[index] = {
            ...usuarios[index],
            ...dados,
            id, // Garantir que o ID não seja alterado
            dataAtualizacao: new Date()
        };
        StorageService.set(this.USERS_KEY, usuarios);
        // Se for o usuário atual, atualizar também
        const usuarioAtual = this.obterUsuarioAtual();
        if (usuarioAtual && usuarioAtual.id === id) {
            const { senha, ...usuarioSemSenha } = usuarios[index];
            StorageService.set(this.CURRENT_USER_KEY, usuarioSemSenha);
        }
        return { sucesso: true, mensagem: 'Usuário atualizado com sucesso' };
    }
    static excluirUsuario(id) {
        const usuarios = this.obterTodosUsuarios();
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) {
            return { sucesso: false, mensagem: 'Usuário não encontrado' };
        }
        // Não permitir excluir o próprio usuário
        const usuarioAtual = this.obterUsuarioAtual();
        if (usuarioAtual && usuarioAtual.id === id) {
            return { sucesso: false, mensagem: 'Você não pode excluir sua própria conta' };
        }
        // Verificar se é o último admin
        const admins = usuarios.filter(u => u.cargo === 'admin');
        if (usuario.cargo === 'admin' && admins.length === 1) {
            return { sucesso: false, mensagem: 'Não é possível excluir o último administrador' };
        }
        const novosUsuarios = usuarios.filter(u => u.id !== id);
        StorageService.set(this.USERS_KEY, novosUsuarios);
        return { sucesso: true, mensagem: 'Usuário excluído com sucesso' };
    }
    static resetarSenha(id, novaSenha) {
        if (novaSenha.length < 6) {
            return { sucesso: false, mensagem: 'A senha deve ter no mínimo 6 caracteres' };
        }
        const usuarios = this.obterTodosUsuarios();
        const index = usuarios.findIndex(u => u.id === id);
        if (index === -1) {
            return { sucesso: false, mensagem: 'Usuário não encontrado' };
        }
        usuarios[index] = {
            ...usuarios[index],
            senha: novaSenha,
            dataAtualizacao: new Date()
        };
        StorageService.set(this.USERS_KEY, usuarios);
        return { sucesso: true, mensagem: 'Senha resetada com sucesso' };
    }
}
AuthService.USERS_KEY = 'usuarios';
AuthService.CURRENT_USER_KEY = 'usuario_atual';
//# sourceMappingURL=AuthService.js.map