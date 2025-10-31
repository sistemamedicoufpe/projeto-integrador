export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  cargo: 'admin' | 'medico' | 'psicologo' | 'assistente';
  fotoPerfil?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface UsuarioLogin {
  email: string;
  senha: string;
}

export interface UsuarioCadastro {
  nome: string;
  email: string;
  senha: string;
  cargo: 'admin' | 'medico' | 'psicologo' | 'assistente';
}
