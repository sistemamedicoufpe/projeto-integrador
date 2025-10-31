import { PacienteService } from './PacienteService';
import { AvaliacaoService } from './AvaliacaoService';
import { Paciente } from '../models/Paciente';
import { AvaliacaoCognitiva } from '../models/AvaliacaoCognitiva';

export class RelatorioService {

  static gerarRelatorioPaciente(pacienteId: string): string {
    const paciente = PacienteService.obterPorId(pacienteId);
    if (!paciente) return '';

    const avaliacoes = AvaliacaoService.obterPorPaciente(pacienteId);

    let html = `
      <div class="relatorio">
        <h2>Relatório do Paciente</h2>
        <div class="info-paciente">
          <h3>Dados Pessoais</h3>
          <p><strong>Nome:</strong> ${paciente.nome}</p>
          <p><strong>CPF:</strong> ${paciente.cpf}</p>
          <p><strong>Data de Nascimento:</strong> ${this.formatarData(paciente.dataNascimento)}</p>
          <p><strong>Telefone:</strong> ${paciente.telefone}</p>
          ${paciente.email ? `<p><strong>Email:</strong> ${paciente.email}</p>` : ''}
        </div>

        <div class="info-endereco">
          <h3>Endereço</h3>
          <p>${paciente.endereco.rua}, ${paciente.endereco.numero}</p>
          ${paciente.endereco.complemento ? `<p>${paciente.endereco.complemento}</p>` : ''}
          <p>${paciente.endereco.bairro} - ${paciente.endereco.cidade}/${paciente.endereco.estado}</p>
          <p>CEP: ${paciente.endereco.cep}</p>
        </div>

        ${paciente.convenio ? `
        <div class="info-convenio">
          <h3>Convênio</h3>
          <p><strong>Convênio:</strong> ${paciente.convenio}</p>
          <p><strong>Número:</strong> ${paciente.numeroConvenio}</p>
        </div>
        ` : ''}

        <div class="info-emergencia">
          <h3>Contato de Emergência</h3>
          <p><strong>Nome:</strong> ${paciente.contatoEmergencia.nome}</p>
          <p><strong>Telefone:</strong> ${paciente.contatoEmergencia.telefone}</p>
          <p><strong>Parentesco:</strong> ${paciente.contatoEmergencia.parentesco}</p>
        </div>

        <div class="avaliacoes">
          <h3>Histórico de Avaliações (${avaliacoes.length})</h3>
          ${avaliacoes.length === 0 ? '<p>Nenhuma avaliação registrada.</p>' : ''}
          ${avaliacoes.map(av => `
            <div class="avaliacao-item">
              <h4>${av.tipoAvaliacao} - ${this.formatarData(av.dataAvaliacao)}</h4>
              <p><strong>Médico:</strong> ${av.medicoNome}</p>
              <p><strong>Pontuação:</strong> ${av.pontuacao}/${av.pontuacaoMaxima} (${av.percentual.toFixed(1)}%)</p>
              ${av.diagnosticoPrelimilar ? `<p><strong>Diagnóstico Preliminar:</strong> ${av.diagnosticoPrelimilar}</p>` : ''}
            </div>
          `).join('')}
        </div>

        ${paciente.observacoes ? `
        <div class="observacoes">
          <h3>Observações</h3>
          <p>${paciente.observacoes}</p>
        </div>
        ` : ''}
      </div>
    `;

    return html;
  }

  static gerarRelatorioAvaliacao(avaliacaoId: string): string {
    const avaliacao = AvaliacaoService.obterPorId(avaliacaoId);
    if (!avaliacao) return '';

    const paciente = PacienteService.obterPorId(avaliacao.pacienteId);

    let html = `
      <div class="relatorio">
        <h2>Relatório de Avaliação Cognitiva</h2>

        <div class="info-avaliacao">
          <h3>Informações da Avaliação</h3>
          <p><strong>Tipo:</strong> ${avaliacao.tipoAvaliacao}</p>
          <p><strong>Data:</strong> ${this.formatarData(avaliacao.dataAvaliacao)}</p>
          <p><strong>Médico Responsável:</strong> ${avaliacao.medicoNome}</p>
        </div>

        <div class="info-paciente">
          <h3>Paciente</h3>
          <p><strong>Nome:</strong> ${avaliacao.pacienteNome}</p>
          ${paciente ? `<p><strong>CPF:</strong> ${paciente.cpf}</p>` : ''}
          ${paciente ? `<p><strong>Data de Nascimento:</strong> ${this.formatarData(paciente.dataNascimento)}</p>` : ''}
        </div>

        <div class="resultados">
          <h3>Resultados</h3>
          <p><strong>Pontuação:</strong> ${avaliacao.pontuacao} de ${avaliacao.pontuacaoMaxima} (${avaliacao.percentual.toFixed(1)}%)</p>
        </div>

        <div class="dominios">
          <h3>Domínios Avaliados</h3>
          <ul>
            <li><strong>Memória:</strong> ${avaliacao.dominios.memoria}</li>
            <li><strong>Atenção:</strong> ${avaliacao.dominios.atencao}</li>
            <li><strong>Linguagem:</strong> ${avaliacao.dominios.linguagem}</li>
            <li><strong>Função Executiva:</strong> ${avaliacao.dominios.funcaoExecutiva}</li>
            <li><strong>Habilidade Visuoespacial:</strong> ${avaliacao.dominios.habilidadeVisuoespacial}</li>
          </ul>
        </div>

        ${avaliacao.diagnosticoPrelimilar ? `
        <div class="diagnostico">
          <h3>Diagnóstico Preliminar</h3>
          <p>${avaliacao.diagnosticoPrelimilar}</p>
        </div>
        ` : ''}

        ${avaliacao.recomendacoes ? `
        <div class="recomendacoes">
          <h3>Recomendações</h3>
          <p>${avaliacao.recomendacoes}</p>
        </div>
        ` : ''}

        ${avaliacao.observacoes ? `
        <div class="observacoes">
          <h3>Observações</h3>
          <p>${avaliacao.observacoes}</p>
        </div>
        ` : ''}
      </div>
    `;

    return html;
  }

  static gerarRelatorioGeral(): string {
    const estatisticasPacientes = PacienteService.obterEstatisticas();
    const estatisticasAvaliacoes = AvaliacaoService.obterEstatisticas();
    const pacientes = PacienteService.obterAtivos();
    const avaliacoes = AvaliacaoService.obterTodas();

    let html = `
      <div class="relatorio">
        <h2>Relatório Geral da Clínica</h2>
        <p><strong>Data de Geração:</strong> ${this.formatarDataHora(new Date())}</p>

        <div class="estatisticas">
          <h3>Estatísticas de Pacientes</h3>
          <p><strong>Total de Pacientes:</strong> ${estatisticasPacientes.total}</p>
          <p><strong>Pacientes Ativos:</strong> ${estatisticasPacientes.ativos}</p>
          <p><strong>Pacientes Inativos:</strong> ${estatisticasPacientes.inativos}</p>
        </div>

        <div class="estatisticas">
          <h3>Estatísticas de Avaliações</h3>
          <p><strong>Total de Avaliações:</strong> ${estatisticasAvaliacoes.total}</p>
          <p><strong>Média de Desempenho:</strong> ${estatisticasAvaliacoes.mediaPercentual.toFixed(1)}%</p>
          <h4>Avaliações por Tipo:</h4>
          <ul>
            ${Object.entries(estatisticasAvaliacoes.porTipo).map(([tipo, qtd]) =>
              `<li><strong>${tipo}:</strong> ${qtd}</li>`
            ).join('')}
          </ul>
        </div>

        <div class="ultimos-pacientes">
          <h3>Últimos Pacientes Cadastrados</h3>
          ${pacientes.slice(-5).reverse().map(p => `
            <div class="paciente-item">
              <p><strong>${p.nome}</strong> - CPF: ${p.cpf}</p>
              <p>Cadastrado em: ${this.formatarData(p.dataCriacao)}</p>
            </div>
          `).join('')}
        </div>

        <div class="ultimas-avaliacoes">
          <h3>Últimas Avaliações Realizadas</h3>
          ${avaliacoes.slice(-5).reverse().map(a => `
            <div class="avaliacao-item">
              <p><strong>${a.pacienteNome}</strong> - ${a.tipoAvaliacao}</p>
              <p>Data: ${this.formatarData(a.dataAvaliacao)} | Pontuação: ${a.percentual.toFixed(1)}%</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return html;
  }

  static downloadRelatorio(html: string, nomeArquivo: string): void {
    // Criar PDF usando jsPDF
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Remover tags HTML e extrair texto
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Configurar fonte e cores
    doc.setFont('helvetica');

    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const maxWidth = pageWidth - (margin * 2);

    // Função para adicionar nova página se necessário
    const checkPageBreak = (increment: number = 10) => {
      if (yPosition + increment > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Função para adicionar texto com quebra de linha
    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');

      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin, yPosition);
        yPosition += fontSize / 2.5;
      });
    };

    // Adicionar cabeçalho
    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Sistema NeuroDiagnostico', margin, 15);

    doc.setTextColor(0, 0, 0);
    yPosition = 35;

    // Processar conteúdo
    const elements = tempDiv.querySelectorAll('h2, h3, h4, p, li');
    elements.forEach((element) => {
      const text = element.textContent?.trim() || '';
      if (!text) return;

      checkPageBreak(15);

      if (element.tagName === 'H2') {
        yPosition += 5;
        addText(text, 16, true);
        yPosition += 3;
        doc.setDrawColor(13, 110, 253);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
      } else if (element.tagName === 'H3') {
        yPosition += 4;
        addText(text, 14, true);
        yPosition += 4;
      } else if (element.tagName === 'H4') {
        yPosition += 3;
        addText(text, 12, true);
        yPosition += 3;
      } else {
        addText(text, 10, false);
        yPosition += 2;
      }
    });

    // Adicionar rodapé em todas as páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Gerado em ${this.formatarDataHora(new Date())} - Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Salvar PDF
    doc.save(`${nomeArquivo}.pdf`);
  }

  private static formatarData(data: Date | string): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }

  private static formatarDataHora(data: Date | string): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  }
}
