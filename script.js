// script.js
// Dados iniciais do sistema
let mockData = {
    medicos: [
        {
            id: 1,
            nome: "Dr. Silva",
            email: "dr.silva@neurodiagnostico.com",
            senha: "123456",
            crm: "12345-SP",
            especialidade: "Neurologia",
            avatar: "https://i.pravatar.cc/150?img=12"
        },
        {
            id: 2,
            nome: "Dra. Costa",
            email: "dra.costa@neurodiagnostico.com",
            senha: "123456",
            crm: "54321-SP",
            especialidade: "Geriatria",
            avatar: "https://i.pravatar.cc/150?img=5"
        }
    ],
    pacientes: [
        {
            id: 1,
            medicoId: 1,
            nome: "Maria Oliveira",
            idade: 72,
            codigo: "#P-00482",
            ultimaConsulta: "15/03/2023",
            dataNascimento: "15/08/1951",
            genero: "Feminino",
            contato: "(11) 98765-4321",
            responsavel: "João Oliveira (filho)",
            historicoFamiliar: "Mãe com DA",
            comorbidades: "Hipertensão, Diabetes",
            testes: [
                { id: 1, nome: "Mini-Mental (MMSE)", status: "concluido", pontuacao: "24/30", dataAplicacao: "15/03/2023" },
                { id: 2, nome: "MoCA", status: "concluido", pontuacao: "18/30", dataAplicacao: "15/03/2023" },
                { id: 3, nome: "CDR", status: "concluido", pontuacao: "1.0", dataAplicacao: "15/03/2023" },
                { id: 4, nome: "Teste do Relógio", status: "pendente", pontuacao: "-" }
            ],
            risco: "Moderado",
            descricaoRisco: "Paciente apresenta declínio cognitivo significativo com pontuações abaixo do esperado para idade e escolaridade.",
            recomendacoes: [
                "Realizar exames de neuroimagem (RM ou TC de crânio)",
                "Avaliação com geriatra para manejo de comorbidades",
                "Iniciar acompanhamento com terapia ocupacional",
                "Reavaliar em 6 meses com bateria completa de testes",
                "Orientar família sobre segurança e adaptações no ambiente doméstico"
            ],
            ativo: true
        },
        {
            id: 2,
            medicoId: 1,
            nome: "José Santos",
            idade: 68,
            codigo: "#P-00483",
            ultimaConsulta: "10/03/2023",
            dataNascimento: "22/05/1955",
            genero: "Masculino",
            contato: "(11) 98765-4322",
            responsavel: "Maria Santos (esposa)",
            historicoFamiliar: "Pai com DA",
            comorbidades: "Hipertensão",
            testes: [
                { id: 1, nome: "Mini-Mental (MMSE)", status: "concluido", pontuacao: "26/30", dataAplicacao: "10/03/2023" },
                { id: 2, nome: "MoCA", status: "concluido", pontuacao: "22/30", dataAplicacao: "10/03/2023" },
                { id: 3, nome: "CDR", status: "concluido", pontuacao: "0.5", dataAplicacao: "10/03/2023" },
                { id: 4, nome: "Teste do Relógio", status: "concluido", pontuacao: "8/10", dataAplicacao: "10/03/2023" }
            ],
            risco: "Baixo",
            descricaoRisco: "Paciente apresenta leve declínio cognitivo com pontuações dentro do esperado para idade e escolaridade.",
            recomendacoes: [
                "Acompanhamento semestral",
                "Estimulação cognitiva",
                "Manter atividade física regular",
                "Reavaliar em 12 meses"
            ],
            ativo: true
        }
    ],
    diagnosticos: [
        {
            id: 1,
            pacienteId: 1,
            medicoId: 1,
            descricao: "Comprometimento Cognitivo Leve com alta probabilidade de conversão para Demência tipo Alzheimer",
            data: "15/03/2023",
            testesRelacionados: [1, 2, 3],
            gravidade: "moderado"
        },
        {
            id: 2,
            pacienteId: 2,
            medicoId: 1,
            descricao: "Declínio Cognitivo Leve relacionado à idade",
            data: "10/03/2023",
            testesRelacionados: [1, 2, 3, 4],
            gravidade: "leve"
        }
    ],
    estatisticas: {
        pacientesAtivos: 42,
        testesRealizados: 128,
        diagnosticos: 24
    }
};

// Estado da aplicação
let state = {
    usuarioLogado: null,
    pacienteSelecionado: null,
    grafico: null,
    view: 'dashboard'
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    carregarDadosLocalStorage();
    configurarLogin();
    configurarCadastro();
    configurarCadastroPaciente();
    configurarEventos();
    configurarNavegacao();
}

function carregarDadosLocalStorage() {
    const dadosSalvos = localStorage.getItem('neurodiagnostico_dados');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        mockData.medicos = [...mockData.medicos, ...dados.medicos];
        mockData.pacientes = [...mockData.pacientes, ...dados.pacientes];
        mockData.diagnosticos = [...mockData.diagnosticos, ...dados.diagnosticos];
    }
}

function salvarDadosLocalStorage() {
    const medicosCadastrados = mockData.medicos.filter(m => m.id > 2);
    const pacientesCadastrados = mockData.pacientes.filter(p => p.id > 2);
    const diagnosticosCadastrados = mockData.diagnosticos.filter(d => d.id > 2);
    
    const dadosParaSalvar = {
        medicos: medicosCadastrados,
        pacientes: pacientesCadastrados,
        diagnosticos: diagnosticosCadastrados
    };
    localStorage.setItem('neurodiagnostico_dados', JSON.stringify(dadosParaSalvar));
}

function configurarLogin() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;
        
        const medico = mockData.medicos.find(m => m.email === email && m.senha === senha);
        
        if (medico) {
            state.usuarioLogado = medico;
            fazerLogin(medico);
        } else {
            mostrarNotificacao('E-mail ou senha incorretos!', 'error');
        }
    });
}

function configurarCadastro() {
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const registerModal = document.getElementById('registerModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const registerForm = document.getElementById('registerForm');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');

    showRegisterBtn.addEventListener('click', function() {
        registerModal.classList.add('active');
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            registerModal.classList.remove('active');
            registerForm.reset();
        });
    });

    registerModal.addEventListener('click', function(e) {
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
            registerForm.reset();
        }
    });

    registerSubmitBtn.addEventListener('click', function() {
        const nome = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const senha = document.getElementById('registerPassword').value;
        const confirmarSenha = document.getElementById('registerConfirmPassword').value;
        const crm = document.getElementById('registerCRM').value;
        const especialidade = document.getElementById('registerSpecialty').value;

        if (!nome || !email || !senha || !confirmarSenha || !crm || !especialidade) {
            mostrarNotificacao('Por favor, preencha todos os campos!', 'error');
            return;
        }

        if (senha !== confirmarSenha) {
            mostrarNotificacao('As senhas não coincidem!', 'error');
            return;
        }

        if (senha.length < 6) {
            mostrarNotificacao('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        const emailExistente = mockData.medicos.find(m => m.email === email);
        if (emailExistente) {
            mostrarNotificacao('Este e-mail já está cadastrado!', 'error');
            return;
        }

        const novoMedico = {
            id: Math.max(...mockData.medicos.map(m => m.id)) + 1,
            nome: nome,
            email: email,
            senha: senha,
            crm: crm,
            especialidade: especialidade,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
        };

        mockData.medicos.push(novoMedico);
        salvarDadosLocalStorage();

        registerModal.classList.remove('active');
        registerForm.reset();
        mostrarNotificacao('Cadastro realizado com sucesso! Agora você pode fazer login.', 'success');
    });
}

function configurarCadastroPaciente() {
    const cadastrarPacienteBtn = document.getElementById('cadastrarPacienteBtn');
    const cadastrarPacienteModal = document.getElementById('cadastrarPacienteModal');
    const cadastrarPacienteForm = document.getElementById('cadastrarPacienteForm');
    const cadastrarPacienteSubmitBtn = document.getElementById('cadastrarPacienteSubmitBtn');

    if (cadastrarPacienteBtn) {
        cadastrarPacienteBtn.addEventListener('click', function() {
            cadastrarPacienteModal.classList.add('active');
        });
    }

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            cadastrarPacienteModal.classList.remove('active');
            if (cadastrarPacienteForm) cadastrarPacienteForm.reset();
        });
    });

    cadastrarPacienteModal.addEventListener('click', function(e) {
        if (e.target === cadastrarPacienteModal) {
            cadastrarPacienteModal.classList.remove('active');
            if (cadastrarPacienteForm) cadastrarPacienteForm.reset();
        }
    });

    if (cadastrarPacienteSubmitBtn) {
        cadastrarPacienteSubmitBtn.addEventListener('click', function() {
            const nome = document.getElementById('pacienteNome').value;
            const dataNascimento = document.getElementById('pacienteDataNascimento').value;
            const genero = document.getElementById('pacienteGenero').value;
            const contato = document.getElementById('pacienteContato').value;
            const responsavel = document.getElementById('pacienteResponsavel').value;
            const historicoFamiliar = document.getElementById('pacienteHistoricoFamiliar').value;
            const comorbidades = document.getElementById('pacienteComorbidades').value;

            if (!nome || !dataNascimento || !genero || !contato) {
                mostrarNotificacao('Por favor, preencha os campos obrigatórios!', 'error');
                return;
            }

            const idade = calcularIdade(dataNascimento);

            const novoPaciente = {
                id: Math.max(...mockData.pacientes.map(p => p.id)) + 1,
                medicoId: state.usuarioLogado.id,
                nome: nome,
                idade: idade,
                codigo: `#P-${String(Math.max(...mockData.pacientes.map(p => p.id)) + 1).padStart(5, '0')}`,
                ultimaConsulta: new Date().toLocaleDateString('pt-BR'),
                dataNascimento: new Date(dataNascimento).toLocaleDateString('pt-BR'),
                genero: genero,
                contato: contato,
                responsavel: responsavel,
                historicoFamiliar: historicoFamiliar,
                comorbidades: comorbidades,
                testes: [
                    { id: 1, nome: "Mini-Mental (MMSE)", status: "pendente", pontuacao: "-" },
                    { id: 2, nome: "MoCA", status: "pendente", pontuacao: "-" },
                    { id: 3, nome: "CDR", status: "pendente", pontuacao: "-" },
                    { id: 4, nome: "Teste do Relógio", status: "pendente", pontuacao: "-" }
                ],
                risco: "Não avaliado",
                descricaoRisco: "Paciente ainda não avaliado.",
                recomendacoes: [
                    "Realizar avaliação cognitiva completa"
                ],
                ativo: true
            };

            mockData.pacientes.push(novoPaciente);
            salvarDadosLocalStorage();

            cadastrarPacienteModal.classList.remove('active');
            cadastrarPacienteForm.reset();
            mostrarNotificacao('Paciente cadastrado com sucesso!', 'success');
            
            if (state.view === 'pacientes') {
                carregarListaPacientes();
            }
            atualizarEstatisticas();
        });
    }
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function configurarEventos() {
    document.getElementById('logoutBtn').addEventListener('click', fazerLogout);
    document.getElementById('generateReportBtn').addEventListener('click', gerarRelatorio);
    document.getElementById('scheduleAppointmentBtn').addEventListener('click', agendarRetorno);

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const titulo = this.querySelector('.card-title').textContent;
            mostrarNotificacao(`Visualizando detalhes de: ${titulo}`, 'info');
        });
    });
}

function configurarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.querySelector('a').getAttribute('href')?.substring(1) || 'dashboard';
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            state.view = target;
            alternarView(target);
        });
    });
}

function alternarView(view) {
    document.querySelectorAll('.view-section').forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(`${view}View`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    switch(view) {
        case 'dashboard':
            carregarDadosDashboard();
            break;
        case 'pacientes':
            carregarListaPacientes();
            break;
        case 'testes':
            carregarTestesRealizados();
            break;
        case 'diagnosticos':
            carregarDiagnosticos();
            break;
        case 'relatorios':
            carregarRelatorios();
            break;
    }
}

function fazerLogin(medico) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'flex';
    
    document.getElementById('userName').textContent = medico.nome;
    document.getElementById('userAvatar').src = medico.avatar;
    
    carregarDadosDashboard();
}

function fazerLogout() {
    state.usuarioLogado = null;
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('loginForm').reset();
}

function carregarDadosDashboard() {
    const pacientesMedico = mockData.pacientes.filter(p => p.medicoId === state.usuarioLogado.id && p.ativo);
    state.pacienteSelecionado = pacientesMedico[0] || null;
    
    atualizarEstatisticas();
    
    if (state.pacienteSelecionado) {
        carregarDadosPaciente(state.pacienteSelecionado);
    } else {
        document.getElementById('patientInfo').style.display = 'none';
        document.getElementById('testsSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('riskAssessment').style.display = 'none';
    }
}

function atualizarEstatisticas() {
    const pacientesAtivos = mockData.pacientes.filter(p => p.medicoId === state.usuarioLogado.id && p.ativo).length;
    const testesRealizados = mockData.pacientes
        .filter(p => p.medicoId === state.usuarioLogado.id)
        .reduce((total, paciente) => total + paciente.testes.filter(t => t.status === 'concluido').length, 0);
    const diagnosticos = mockData.diagnosticos.filter(d => d.medicoId === state.usuarioLogado.id).length;

    document.getElementById('activePatients').textContent = pacientesAtivos;
    document.getElementById('testsCompleted').textContent = testesRealizados;
    document.getElementById('diagnoses').textContent = diagnosticos;
}

function carregarDadosPaciente(paciente) {
    document.getElementById('patientName').textContent = `${paciente.nome}, ${paciente.idade} anos`;
    document.getElementById('patientDetails').innerHTML = `ID: ${paciente.codigo} | Última consulta: ${paciente.ultimaConsulta}`;

    document.getElementById('infoBirthDate').textContent = paciente.dataNascimento;
    document.getElementById('infoGender').textContent = paciente.genero;
    document.getElementById('infoContact').textContent = paciente.contato;
    document.getElementById('infoResponsible').textContent = paciente.responsavel;
    document.getElementById('infoFamilyHistory').textContent = paciente.historicoFamiliar;
    document.getElementById('infoComorbidities').textContent = paciente.comorbidades;

    carregarTestesCognitivos(paciente.testes);
    carregarAvaliacaoRisco(paciente);
    inicializarGrafico();
}

function carregarTestesCognitivos(testes) {
    const gridTestes = document.getElementById('testsGrid');
    gridTestes.innerHTML = '';

    testes.forEach(test => {
        const cardTeste = document.createElement('div');
        cardTeste.className = 'test-card';
        cardTeste.innerHTML = `
            <div class="test-name">${test.nome}</div>
            <div class="test-status status-${test.status}">${formatarStatus(test.status)}</div>
            <div class="test-score">${test.pontuacao}</div>
        `;
        
        cardTeste.addEventListener('click', () => {
            abrirModalTeste(test);
        });
        
        gridTestes.appendChild(cardTeste);
    });
}

function carregarAvaliacaoRisco(paciente) {
    const indicadorRisco = document.getElementById('riskIndicator');
    indicadorRisco.textContent = paciente.risco;
    indicadorRisco.className = `risk-indicator risk-${paciente.risco.toLowerCase().split(' ')[0]}`;

    document.getElementById('riskTitle').textContent = `Risco de Demência: ${paciente.risco}`;
    document.getElementById('riskDescription').textContent = paciente.descricaoRisco;

    const listaRecomendacoes = document.getElementById('recommendationsList');
    listaRecomendacoes.innerHTML = '';
    
    paciente.recomendacoes.forEach(recomendacao => {
        const item = document.createElement('li');
        item.textContent = recomendacao;
        listaRecomendacoes.appendChild(item);
    });
}

function carregarListaPacientes() {
    const pacientesList = document.getElementById('pacientesList');
    if (!pacientesList) return;

    const pacientesMedico = mockData.pacientes.filter(p => p.medicoId === state.usuarioLogado.id && p.ativo);
    
    pacientesList.innerHTML = '';
    
    pacientesMedico.forEach(paciente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paciente.codigo}</td>
            <td>${paciente.nome}</td>
            <td>${paciente.idade}</td>
            <td>${paciente.genero}</td>
            <td>${paciente.contato}</td>
            <td>
                <span class="status-badge risk-${paciente.risco.toLowerCase().split(' ')[0]}">${paciente.risco}</span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm ver-paciente" data-id="${paciente.id}">Ver</button>
                <button class="btn btn-outline btn-sm editar-paciente" data-id="${paciente.id}">Editar</button>
            </td>
        `;
        pacientesList.appendChild(row);
    });

    document.querySelectorAll('.ver-paciente').forEach(btn => {
        btn.addEventListener('click', function() {
            const pacienteId = parseInt(this.getAttribute('data-id'));
            const paciente = mockData.pacientes.find(p => p.id === pacienteId);
            state.pacienteSelecionado = paciente;
            state.view = 'dashboard';
            alternarView('dashboard');
            document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
            document.querySelector('.nav-links li:first-child').classList.add('active');
        });
    });
}

function carregarTestesRealizados() {
    const testesList = document.getElementById('testesList');
    if (!testesList) return;

    const pacientesMedico = mockData.pacientes.filter(p => p.medicoId === state.usuarioLogado.id);
    const todosTestes = pacientesMedico.flatMap(paciente => 
        paciente.testes.filter(t => t.status === 'concluido').map(teste => ({
            ...teste,
            pacienteNome: paciente.nome,
            pacienteCodigo: paciente.codigo
        }))
    );

    testesList.innerHTML = '';
    
    todosTestes.forEach(teste => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teste.pacienteCodigo}</td>
            <td>${teste.pacienteNome}</td>
            <td>${teste.nome}</td>
            <td>${teste.pontuacao}</td>
            <td>${teste.dataAplicacao || 'N/A'}</td>
            <td>
                <button class="btn btn-outline btn-sm ver-teste" data-id="${teste.id}">Detalhes</button>
            </td>
        `;
        testesList.appendChild(row);
    });
}

function carregarDiagnosticos() {
    const diagnosticosList = document.getElementById('diagnosticosList');
    if (!diagnosticosList) return;

    const diagnosticosMedico = mockData.diagnosticos.filter(d => d.medicoId === state.usuarioLogado.id);
    
    diagnosticosList.innerHTML = '';
    
    diagnosticosMedico.forEach(diagnostico => {
        const paciente = mockData.pacientes.find(p => p.id === diagnostico.pacienteId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paciente?.codigo || 'N/A'}</td>
            <td>${paciente?.nome || 'N/A'}</td>
            <td>${diagnostico.descricao.substring(0, 100)}...</td>
            <td>${diagnostico.data}</td>
            <td>
                <span class="status-badge risk-${diagnostico.gravidade}">${diagnostico.gravidade}</span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm ver-diagnostico" data-id="${diagnostico.id}">Ver</button>
            </td>
        `;
        diagnosticosList.appendChild(row);
    });
}

function carregarRelatorios() {
    // Implementação para carregar relatórios
    mostrarNotificacao('Funcionalidade de relatórios em desenvolvimento', 'info');
}

function formatarStatus(status) {
    const statusMap = {
        'concluido': 'Concluído',
        'pendente': 'Pendente'
    };
    return statusMap[status] || status;
}

function inicializarGrafico() {
    const ctx = document.getElementById('progressChart')?.getContext('2d');
    if (!ctx) return;
    
    if (state.grafico) {
        state.grafico.destroy();
    }

    state.grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan/2022', 'Mar/2022', 'Jun/2022', 'Set/2022', 'Dez/2022', 'Mar/2023'],
            datasets: [{
                label: 'Pontuação MMSE',
                data: [28, 26, 25, 24, 23, 24],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }, {
                label: 'Pontuação MoCA',
                data: [22, 20, 19, 18, 17, 18],
                borderColor: '#9b59b6',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Progressão das Avaliações Cognitivas',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 30,
                    title: {
                        display: true,
                        text: 'Pontuação',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data da Avaliação',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                }
            }
        }
    });
}

function gerarRelatorio() {
    mostrarNotificacao('Relatório sendo gerado...', 'info');
    
    const btnRelatorio = document.getElementById('generateReportBtn');
    const textoOriginal = btnRelatorio.innerHTML;
    btnRelatorio.innerHTML = '<div class="loading"></div> Gerando...';
    btnRelatorio.disabled = true;
    
    setTimeout(() => {
        btnRelatorio.innerHTML = textoOriginal;
        btnRelatorio.disabled = false;
        mostrarNotificacao('Relatório gerado com sucesso!', 'success');
        simularDownloadRelatorio();
    }, 3000);
}

function agendarRetorno() {
    mostrarNotificacao('Abrindo calendário para agendamento...', 'info');
    setTimeout(() => {
        abrirModalAgendamento();
    }, 1000);
}

function simularDownloadRelatorio() {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(gerarConteudoRelatorio());
    link.download = `relatorio_${state.pacienteSelecionado.nome.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function gerarConteudoRelatorio() {
    const p = state.pacienteSelecionado;
    return `
RELATÓRIO NEURODIAGNÓSTICO

Paciente: ${p.nome}
ID: ${p.codigo}
Data de Nascimento: ${p.dataNascimento}
Idade: ${p.idade} anos

AVALIAÇÕES COGNITIVAS:
${p.testes.map(t => `${t.nome}: ${t.pontuacao} (${formatarStatus(t.status)})`).join('\n')}

AVALIAÇÃO DE RISCO: ${p.risco}

RECOMENDAÇÕES:
${p.recomendacoes.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Data de emissão: ${new Date().toLocaleDateString('pt-BR')}
Médico responsável: ${state.usuarioLogado.nome}
CRM: ${state.usuarioLogado.crm}
Especialidade: ${state.usuarioLogado.especialidade}
    `.trim();
}

function abrirModalTeste(test) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Detalhes do Teste - ${test.nome}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="test-info">
                    <div class="info-row">
                        <strong>Status:</strong> 
                        <span class="status-badge status-${test.status}">${formatarStatus(test.status)}</span>
                    </div>
                    <div class="info-row">
                        <strong>Pontuação:</strong> ${test.pontuacao}
                    </div>
                    <div class="info-row">
                        <strong>Data da Última Aplicação:</strong> ${test.dataAplicacao || 'N/A'}
                    </div>
                    <div class="info-row">
                        <strong>Interpretação:</strong> ${obterInterpretacaoTeste(test.nome, test.pontuacao)}
                    </div>
                    <div class="info-row">
                        <strong>Observações:</strong> ${obterObservacoesTeste(test.nome)}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline close-modal">Fechar</button>
                ${test.status === 'pendente' ? 
                    '<button class="btn btn-primary aplicar-teste">Aplicar Teste</button>' : 
                    '<button class="btn btn-primary ver-detalhes">Ver Detalhes Completos</button>'
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => modal.remove();
    
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    const btnAplicar = modal.querySelector('.aplicar-teste');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', () => {
            mostrarNotificacao(`Iniciando aplicação do ${test.nome}...`, 'info');
            closeModal();
        });
    }

    const btnDetalhes = modal.querySelector('.ver-detalhes');
    if (btnDetalhes) {
        btnDetalhes.addEventListener('click', () => {
            mostrarNotificacao(`Carregando detalhes completos do ${test.nome}...`, 'info');
            closeModal();
        });
    }
}

function abrirModalAgendamento() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Agendar Retorno</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Paciente</label>
                    <input type="text" class="form-control" value="${state.pacienteSelecionado.nome}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Data do Retorno</label>
                    <input type="date" class="form-control" id="dataRetorno" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label class="form-label">Horário</label>
                    <select class="form-control" id="horarioRetorno">
                        <option value="">Selecione um horário</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Observações</label>
                    <textarea class="form-control" id="observacoesRetorno" rows="3" placeholder="Adicione observações sobre o retorno..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline close-modal">Cancelar</button>
                <button class="btn btn-primary confirmar-agendamento">Confirmar Agendamento</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => modal.remove();
    
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modal.querySelector('.confirmar-agendamento').addEventListener('click', () => {
        const data = modal.querySelector('#dataRetorno').value;
        const horario = modal.querySelector('#horarioRetorno').value;
        
        if (!data || !horario) {
            mostrarNotificacao('Por favor, preencha data e horário!', 'error');
            return;
        }
        
        mostrarNotificacao(`Retorno agendado para ${new Date(data).toLocaleDateString('pt-BR')} às ${horario}`, 'success');
        closeModal();
    });
}

function obterInterpretacaoTeste(nomeTeste, pontuacao) {
    const interpretacoes = {
        "Mini-Mental (MMSE)": pontuacao === "24/30" ? "Comprometimento cognitivo leve" : "Avaliar resultado",
        "MoCA": pontuacao === "18/30" ? "Comprometimento cognitivo moderado" : "Avaliar resultado",
        "CDR": pontuacao === "1.0" ? "Demência leve" : "Avaliar resultado",
        "Teste do Relógio": "Aguardando aplicação"
    };
    return interpretacoes[nomeTeste] || "Resultado não disponível";
}

function obterObservacoesTeste(nomeTeste) {
    const observacoes = {
        "Mini-Mental (MMSE)": "Paciente apresentou dificuldades principalmente na memória recente e orientação temporal.",
        "MoCA": "Dificuldades significativas nas funções executivas e memória visuoespacial.",
        "CDR": "Comprometimento leve nas atividades instrumentais de vida diária.",
        "Teste do Relógio": "Teste ainda não aplicado."
    };
    return observacoes[nomeTeste] || "Sem observações adicionais.";
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-conteudo">
            <i class="fas ${obterIconeNotificacao(tipo)}"></i>
            <span>${mensagem}</span>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.remove();
    }, 4000);
}

function obterIconeNotificacao(tipo) {
    const icones = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icones[tipo] || 'fa-info-circle';
}