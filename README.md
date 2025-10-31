# 🧠 Sistema NeuroDiagnostico

Sistema completo de gestão de pacientes e avaliações cognitivas para clínicas neurológicas.

---

## 📚 O que é este projeto?

Este é um **sistema web** desenvolvido para clínicas neurológicas gerenciarem:
- **Pacientes**: cadastro completo com dados pessoais, endereço e histórico
- **Avaliações Cognitivas**: testes como MEEM, MoCA, Clock Drawing, etc.
- **Relatórios**: geração de documentos em PDF
- **Usuários**: controle de acesso com diferentes níveis de permissão

---

## 🎯 Para quem é este sistema?

O sistema possui **4 tipos de usuários**, cada um com permissões específicas:

### 👑 **Administrador**
- Acesso total ao sistema
- Pode criar e gerenciar outros usuários
- Pode fazer tudo que médicos e psicólogos fazem

### 🩺 **Médico** e **🧑‍⚕️ Psicólogo**
- Podem cadastrar novos pacientes
- Podem criar e editar avaliações cognitivas
- Acesso a: Dashboard, Pacientes, Avaliações, Relatórios

### 📋 **Assistente**
- Acesso limitado ao Dashboard e Relatórios
- Pode apenas visualizar informações
- Não pode cadastrar ou editar

---

## 🛠️ Tecnologias Utilizadas

### **Frontend (Interface Visual)**
- **HTML5**: Estrutura das páginas
- **CSS3**: Estilos e design premium com cores UFPE
- **Bootstrap 5.3**: Framework de componentes visuais
- **TypeScript**: Linguagem de programação (JavaScript com tipos)

### **Bibliotecas**
- **jsPDF**: Geração de relatórios em PDF
- **Bootstrap Icons**: Ícones visuais

### **Armazenamento**
- **LocalStorage**: Banco de dados local do navegador (não precisa de servidor!)

---

## 📂 Estrutura do Projeto

```
clinica-neurologica/
│
├── index.html              # Página principal do sistema
├── package.json            # Configurações do projeto
├── tsconfig.json           # Configurações do TypeScript
├── fix-imports.js          # Script que corrige imports após compilação
│
├── css/
│   └── styles.css          # Estilos premium do sistema (cores UFPE)
│
├── src/                    # Código-fonte TypeScript (antes da compilação)
│   ├── app.ts              # Arquivo principal da aplicação
│   │
│   ├── models/             # Modelos de dados (estrutura dos objetos)
│   │   ├── Usuario.ts      # Estrutura de um usuário
│   │   ├── Paciente.ts     # Estrutura de um paciente
│   │   └── AvaliacaoCognitiva.ts  # Estrutura de uma avaliação
│   │
│   ├── services/           # Lógica de negócios
│   │   ├── AuthService.ts          # Autenticação e login
│   │   ├── PacienteService.ts      # Gerenciamento de pacientes
│   │   ├── AvaliacaoService.ts     # Gerenciamento de avaliações
│   │   ├── RelatorioService.ts     # Geração de relatórios
│   │   └── StorageService.ts       # Salvamento no navegador
│   │
│   ├── pages/              # Páginas do sistema
│   │   ├── DashboardPage.ts        # Página inicial
│   │   ├── PacientesPage.ts        # Gerenciamento de pacientes
│   │   ├── AvaliacoesPage.ts       # Gerenciamento de avaliações
│   │   ├── RelatoriosPage.ts       # Página de relatórios
│   │   ├── PerfilPage.ts           # Perfil do usuário
│   │   └── UsuariosPage.ts         # Gestão de usuários (admin)
│   │
│   ├── utils/              # Utilitários e helpers
│   │   ├── helpers.ts              # Funções auxiliares
│   │   ├── EventBus.ts             # Sistema de eventos
│   │   └── Permissoes.ts           # Controle de permissões
│   │
│   └── globals.d.ts        # Declarações de tipos globais
│
└── dist/                   # Código compilado (JavaScript executável)
    └── (arquivos .js gerados automaticamente)
```

---

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
Você precisa ter instalado:
- **Node.js** (versão 14 ou superior)
- **npm** (vem junto com o Node.js)
- Um navegador moderno (Chrome, Firefox, Edge, Safari)

### **Passo 1: Instalar Dependências**
No terminal, dentro da pasta do projeto, execute:
```bash
npm install
```
*Isso vai baixar todas as bibliotecas necessárias*

### **Passo 2: Compilar o TypeScript**
```bash
npm run build
```
*Isso transforma o código TypeScript em JavaScript que o navegador entende*

### **Passo 3: Abrir no Navegador**
Você pode usar um servidor local. Algumas opções:

**Opção A - Live Server (VS Code)**
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

**Opção B - Python**
```bash
python -m http.server 8000
```
Depois acesse: `http://localhost:8000`

**Opção C - Node.js (http-server)**
```bash
npx http-server -p 8000
```
Depois acesse: `http://localhost:8000`

---

## 🔑 Primeiro Acesso

O sistema cria automaticamente um **usuário administrador**:

**Login:** `admin@clinica.com`
**Senha:** `admin123`

Com este usuário você pode:
1. Acessar todas as funcionalidades
2. Criar novos usuários (médicos, psicólogos, assistentes)
3. Cadastrar pacientes
4. Registrar avaliações

---

## 🎨 Design do Sistema

### **Paleta de Cores UFPE**
- **Azul UFPE**: `#003366` (cor principal)
- **Azul Claro**: `#0055aa` (hover e detalhes)
- **Dourado UFPE**: `#D4AF37` (destaques)

### **Fontes**
- **Títulos**: Playfair Display (elegante, serif)
- **Textos**: Poppins (moderna, clean)

### **Características Visuais**
- Gradientes sofisticados
- Sombras com profundidade
- Animações suaves
- Cards com efeitos hover
- Modais modernos

---

## 💡 Conceitos de Programação Utilizados

### **1. TypeScript**
TypeScript é JavaScript com **tipos**. Isso ajuda a evitar erros:
```typescript
// JavaScript (sem tipos)
function somar(a, b) {
  return a + b;
}

// TypeScript (com tipos)
function somar(a: number, b: number): number {
  return a + b;
}
```

### **2. Classes e POO (Programação Orientada a Objetos)**
O projeto usa classes para organizar o código:
```typescript
class PacienteService {
  static criarPaciente(dados) {
    // lógica para criar paciente
  }
}
```

### **3. Modularização**
Cada arquivo tem uma responsabilidade específica. Por exemplo:
- `AuthService.ts` → cuida apenas de autenticação
- `PacienteService.ts` → cuida apenas de pacientes

### **4. LocalStorage**
É como um "mini banco de dados" no navegador:
```typescript
// Salvar
localStorage.setItem('pacientes', JSON.stringify(listaPacientes));

// Ler
const pacientes = JSON.parse(localStorage.getItem('pacientes'));
```

### **5. Event-Driven (Orientado a Eventos)**
O sistema usa um **EventBus** para comunicação entre componentes:
```typescript
// Alguém dispara um evento
EventBus.emit('PACIENTE_CRIADO', novoPaciente);

// Outro lugar escuta e reage
EventBus.on('PACIENTE_CRIADO', () => {
  atualizarTela();
});
```

### **6. SPA (Single Page Application)**
O sistema **não recarrega a página**. Tudo acontece dinamicamente:
- Quando você clica em "Pacientes", o JavaScript troca o conteúdo
- Não há redirecionamentos entre páginas HTML

---

## 🔒 Sistema de Permissões

O controle de acesso é feito através do arquivo `Permissoes.ts`:

```typescript
class Permissoes {
  // Verifica se pode cadastrar paciente
  static podeCadastrarPaciente(): boolean {
    const usuario = AuthService.obterUsuarioAtual();
    return ['admin', 'medico', 'psicologo'].includes(usuario.cargo);
  }
}
```

Isso garante que:
- Assistentes não vejam botões de cadastro
- Apenas admins acessem gestão de usuários
- A interface se adapte ao cargo do usuário

---

## 📊 Fluxo de Dados

### **Como os dados são salvos?**
```
1. Usuário preenche formulário
   ↓
2. JavaScript captura os dados
   ↓
3. Service valida as informações
   ↓
4. Dados são salvos no LocalStorage
   ↓
5. EventBus notifica a mudança
   ↓
6. Interface é atualizada automaticamente
```

### **Exemplo: Cadastrar um Paciente**
```typescript
// 1. Usuário clica em "Salvar"
salvarPaciente() {
  // 2. Coletamos os dados do formulário
  const dados = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    // ... outros campos
  };

  // 3. Validamos
  if (!Helpers.validarCPF(dados.cpf)) {
    alert('CPF inválido');
    return;
  }

  // 4. Salvamos
  const resultado = PacienteService.criarPaciente(dados);

  // 5. EventBus notifica
  EventBus.emit('PACIENTE_CRIADO', novoPaciente);

  // 6. Mostramos mensagem
  Helpers.mostrarNotificacao('Paciente cadastrado!', 'success');
}
```

---

## 🔧 Comandos Úteis

### **Compilar o projeto**
```bash
npm run build
```

### **Compilar e observar mudanças** (modo desenvolvimento)
```bash
npm run watch
```
*Recompila automaticamente quando você altera um arquivo .ts*

### **Limpar compilação**
```bash
rm -rf dist/*
```

---

## 🐛 Solução de Problemas

### **Erro: "Cannot find module"**
- Execute `npm install` novamente
- Verifique se todas as importações estão corretas

### **Erro: "Module not found" no navegador**
- Execute `npm run build` para compilar
- O arquivo `fix-imports.js` deve adicionar `.js` aos imports

### **Dados não estão salvando**
- Verifique o **Console do navegador** (F12)
- Verifique a aba **Application → Local Storage**
- O LocalStorage tem limite de ~5MB

### **Página não atualiza após mudanças**
- Limpe o cache do navegador (Ctrl + F5)
- Recompile o projeto: `npm run build`

---

## 📖 Conceitos para Estudar

Se você está começando, recomendo estudar:

### **Básico**
1. HTML, CSS e JavaScript
2. Manipulação do DOM (Document Object Model)
3. Eventos em JavaScript

### **Intermediário**
4. TypeScript (tipos, interfaces, classes)
5. LocalStorage e SessionStorage
6. Promises e async/await
7. ES6 Modules (import/export)

### **Avançado**
8. Arquitetura de Software (MVC, Services)
9. Design Patterns (Observer, Singleton)
10. Event-Driven Architecture
11. Programação Funcional

---

## 🎓 Recursos para Aprender

- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs)
- **Bootstrap**: [getbootstrap.com/docs](https://getbootstrap.com/docs)
- **JavaScript Moderno**: [javascript.info](https://javascript.info)
- **LocalStorage**: [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e uso em clínicas neurológicas.

---

## 🏥 Sobre

**Sistema NeuroDiagnostico**
Tecnologia UFPE - Universidade Federal de Pernambuco

Desenvolvido com excelência para gestão premium de pacientes e avaliações cognitivas.

---

## 🤝 Contribuindo

Se você quiser melhorar o sistema:
1. Entenda bem o código atual
2. Teste suas mudanças
3. Documente o que você fez
4. Compartilhe com a equipe

**Dica**: Sempre compile antes de testar (`npm run build`)

---

**Dúvidas?** Leia o código comentado ou consulte a documentação das tecnologias utilizadas! 🚀
