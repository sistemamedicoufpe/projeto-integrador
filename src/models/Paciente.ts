export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: Date;
  cpf: string;
  rg?: string;
  telefone: string;
  email?: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  convenio?: string;
  numeroConvenio?: string;
  contatoEmergencia: {
    nome: string;
    telefone: string;
    parentesco: string;
  };
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  ativo: boolean;
}
