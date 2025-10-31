// Global type declarations

// Bootstrap types
declare const bootstrap: any;

// jsPDF types
declare const jsPDF: any;

// Window extensions
interface Window {
  viewPaciente: (id: string) => void;
  editPaciente: (id: string) => void;
  togglePacienteStatus: (id: string, ativar: boolean) => void;
  deletePaciente: (id: string) => void;
  viewAvaliacao: (id: string) => void;
  editAvaliacao: (id: string) => void;
  deleteAvaliacao: (id: string) => void;
  editUsuario: (id: string) => void;
  deleteUsuario: (id: string) => void;
  resetSenhaUsuario: (id: string) => void;
  jsPDF: any;
}
