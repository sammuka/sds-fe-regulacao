import {
  Sinistro,
  Cobertura,
  Beneficiario,
  Pagamento,
  Documento,
  EventoAcompanhamento,
  EventoFormal,
  EtapaFluxo,
  Especialista,
  ParecerTecnico,
  SolicitacaoDocumento,
} from '@/types'

// =============================================================================
// CENÁRIO A - Fluxo padrão (sem judicialização e sem perícia)
// =============================================================================
export const sinistroA: Sinistro = {
  id: 'SIN-2024-001001',
  numero: 'SIN-2024-001001',
  segurado: 'João Silva Santos',
  cpfSegurado: '123.456.789-00',
  tipo: 'Morte Natural',
  valor: 100000.0,
  apolice: 'VID-2023-001234',
  produto: 'Vida Individual',
  ramo: 'Vida',
  dataEmissao: '15/03/2023',
  inicioVigencia: '01/04/2023',
  terminoVigencia: '01/04/2025',
  status: 'Em Regulação',
  prazoRegulatorio: 20,
  fase: 'Cálculo de Indenização',
  comunicadoId: 'COM-2024-000123',
  dataAbertura: '01/11/2025',
  dataNascimento: '15/05/1980',
  telefone: '(11) 98765-4321',
  endereco: 'Rua das Flores, 123 - São Paulo, SP',
  sla: {
    slaTotal: 30,
    slaConsumido: 10,
    slaSuspenso: false,
    diasRestantes: 20,
  },
  dadosComunicado: {
    comunicante: {
      nome: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      telefone: '(11) 98765-4322',
    },
    dataHoraComunicado: '01/11/2025 10:25:33',
    relato: 'Comunico o falecimento do meu esposo, João Silva Santos, ocorrido em 28/10/2025 por causas naturais. Solicito a indenização do seguro de vida conforme apólice vigente.',
    documentosEnviados: ['Certidão de Óbito', 'RG do Segurado', 'CPF do Segurado', 'Comprovante de Residência'],
  },
  dadosAviso: {
    numeroAviso: 'AVI-2024-001001',
    dataOcorrencia: '28/10/2025',
    dataAviso: '01/11/2025',
    dataRegistro: '01/11/2025 10:25:33',
    naturezaEvento: 'Morte',
    causa: 'Natural',
    tipoEvento: 'Morte Natural',
    aberturaAutomatica: true,
  },
  dadosJudicial: {
    possuiProcesso: false,
  },
  dadosReserva: {
    valorReservaAtual: 102345.67,
    ultimaAlteracao: '02/11/2025 14:45:00',
    historico: [
      {
        data: '01/11/2025 10:30:00',
        valorAnterior: 0,
        valorNovo: 100000.00,
        motivo: 'Abertura do sinistro - reserva inicial',
      },
      {
        data: '02/11/2025 14:45:00',
        valorAnterior: 100000.00,
        valorNovo: 102345.67,
        motivo: 'Ajuste por correção monetária calculada',
      },
    ],
  },
  acoesAgenteAbertura: [
    'Classificou tipo de sinistro como Morte Natural',
    'Identificou cobertura provável: Morte Natural',
    'Verificou vigência da apólice: Vigente',
    'Carência verificada e cumprida',
  ],
}

// =============================================================================
// CENÁRIO B - Fluxo com perícia + pendência de documentos + judicial
// =============================================================================
export const sinistroB: Sinistro = {
  id: 'SIN-2024-001002',
  numero: 'SIN-2024-001002',
  segurado: 'Maria Oliveira Costa',
  cpfSegurado: '987.654.321-00',
  tipo: 'Invalidez Permanente Total',
  valor: 150000.0,
  apolice: 'VID-2023-001456',
  produto: 'Vida Individual',
  ramo: 'Vida',
  dataEmissao: '20/02/2023',
  inicioVigencia: '01/03/2023',
  terminoVigencia: '01/03/2025',
  status: 'Em Perícia',
  prazoRegulatorio: 15,
  fase: 'Avaliação Técnica',
  comunicadoId: 'COM-2024-000145',
  dataAbertura: '05/11/2025',
  dataNascimento: '22/08/1975',
  telefone: '(11) 91234-5678',
  endereco: 'Av. Paulista, 1000 - São Paulo, SP',
  sla: {
    slaTotal: 30,
    slaConsumido: 15,
    slaSuspenso: true,
    dataSuspensao: '10/11/2025',
    motivoSuspensao: 'Aguardando laudo médico pericial',
    diasRestantes: 15,
    periodosSuspensao: [
      {
        dataInicio: '08/11/2025',
        dataFim: '12/11/2025',
        motivo: 'Aguardando documentação complementar',
      },
      {
        dataInicio: '15/11/2025',
        motivo: 'Aguardando laudo médico pericial',
      },
    ],
  },
  dadosComunicado: {
    comunicante: {
      nome: 'Carlos Oliveira Costa',
      email: 'carlos.costa@email.com',
      telefone: '(11) 91234-5679',
    },
    dataHoraComunicado: '05/11/2025 14:30:00',
    relato: 'Comunico a invalidez permanente total de minha esposa, Maria Oliveira Costa, após acidente automobilístico ocorrido em 01/11/2025. Ela sofreu lesões que a incapacitam permanentemente para o trabalho.',
    documentosEnviados: ['Boletim de Ocorrência', 'Laudo Médico Inicial', 'RG da Segurada', 'CPF da Segurada'],
  },
  dadosAviso: {
    numeroAviso: 'AVI-2024-001002',
    dataOcorrencia: '01/11/2025',
    dataAviso: '05/11/2025',
    dataRegistro: '05/11/2025 14:30:00',
    naturezaEvento: 'Acidente',
    causa: 'Acidente de Trânsito',
    tipoEvento: 'Invalidez Permanente Total',
    aberturaAutomatica: true,
  },
  dadosJudicial: {
    possuiProcesso: true,
    numeroProcesso: '1234567-89.2025.8.26.0100',
    vara: '5ª Vara Cível',
    juizo: 'Foro Central Cível - São Paulo',
    statusJudicial: 'Aguardando perícia judicial',
    probabilidadePerda: 35,
    dataEntrada: '20/11/2025',
    observacoes: 'Processo movido pelo beneficiário contestando prazo de análise. Aguardando resultado da perícia médica para fundamentar defesa.',
  },
  dadosReserva: {
    valorReservaAtual: 225000.00,
    ultimaAlteracao: '20/11/2025 10:00:00',
    historico: [
      {
        data: '05/11/2025 14:35:00',
        valorAnterior: 0,
        valorNovo: 150000.00,
        motivo: 'Abertura do sinistro - reserva inicial',
      },
      {
        data: '20/11/2025 10:00:00',
        valorAnterior: 150000.00,
        valorNovo: 225000.00,
        motivo: 'Ajuste por processo judicial - provisionamento adicional',
      },
    ],
  },
  cicloPericia: {
    dataEnvio: '15/11/2025',
    dataPrevistaRetorno: '30/11/2025',
    status: 'aguardando-retorno',
    especialistaAtribuido: {
      id: 'ESP-002',
      nome: 'Dra. Marina Costa',
      area: 'Medicina Traumatológica',
    },
    parecerAgente: {
      texto: 'Com base nos documentos apresentados, especialmente o laudo médico inicial e boletim de ocorrência, o caso apresenta características compatíveis com invalidez permanente total. Recomenda-se perícia médica especializada para confirmação.',
      confianca: 78,
    },
  },
  acoesAgenteAbertura: [
    'Classificou tipo de sinistro como Invalidez Permanente Total',
    'Identificou cobertura provável: Invalidez Permanente por Acidente',
    'Verificou vigência da apólice: Vigente',
    'Identificou necessidade de perícia médica',
    'Gerou pendência documental: Laudo médico detalhado',
  ],
}

// Lista completa de sinistros
export const mockSinistros: Sinistro[] = [sinistroA, sinistroB]

// =============================================================================
// COBERTURAS
// =============================================================================
export const coberturasA: Cobertura[] = [
  {
    id: 'COB-A-001',
    nome: 'Morte Natural',
    valorSegurado: 100000.0,
    franquia: 0,
    apuradaComunicado: true,
    validadaAgente: true,
    vigente: true,
    carenciaCumprida: true,
  },
]

export const coberturasB: Cobertura[] = [
  {
    id: 'COB-B-001',
    nome: 'Invalidez Permanente Total por Acidente',
    valorSegurado: 150000.0,
    franquia: 0,
    apuradaComunicado: true,
    validadaAgente: true,
    vigente: true,
    carenciaCumprida: true,
  },
  {
    id: 'COB-B-002',
    nome: 'Despesas Médico-Hospitalares',
    valorSegurado: 30000.0,
    franquia: 500.0,
    apuradaComunicado: false,
    validadaAgente: true,
    vigente: true,
    carenciaCumprida: true,
  },
]

export const mockCoberturas: Cobertura[] = [...coberturasA]

// =============================================================================
// BENEFICIÁRIOS
// =============================================================================
export const beneficiariosA: Beneficiario[] = [
  {
    id: 'BEN-A-001',
    nome: 'Maria Silva Santos',
    cpf: '234.567.890-01',
    parentesco: 'Cônjuge',
    percentual: 50,
    sugeridoPorAgente: true,
    dadosBancarios: {
      banco: 'Banco do Brasil',
      agencia: '1234-5',
      conta: '12345-6',
    },
  },
  {
    id: 'BEN-A-002',
    nome: 'Pedro Silva Santos',
    cpf: '345.678.901-02',
    parentesco: 'Filho',
    percentual: 25,
    sugeridoPorAgente: true,
  },
  {
    id: 'BEN-A-003',
    nome: 'Ana Silva Santos',
    cpf: '456.789.012-03',
    parentesco: 'Filha',
    percentual: 25,
    sugeridoPorAgente: true,
  },
]

export const beneficiariosB: Beneficiario[] = [
  {
    id: 'BEN-B-001',
    nome: 'Carlos Oliveira Costa',
    cpf: '567.890.123-04',
    parentesco: 'Cônjuge',
    percentual: 100,
    sugeridoPorAgente: true,
    dadosBancarios: {
      banco: 'Itaú',
      agencia: '5678-9',
      conta: '56789-0',
    },
  },
]

export const mockBeneficiarios: Beneficiario[] = [...beneficiariosA]

// =============================================================================
// PAGAMENTOS
// =============================================================================
export const pagamentosA: Pagamento[] = [
  {
    id: 'PAG-A-001',
    numeroIdentificador: 'OP-2024-001001',
    valor: 100000.0,
    correcao: 2345.67,
    valorTotal: 102345.67,
    periodoMeses: 4,
    status: 'pendente',
    dataPrevisao: '15/12/2025',
    dataEntrada: '02/11/2025',
    calculadoPorAgente: true,
    pagamentoTotalFinal: true,
    corrigirAtePagamento: true,
    justificativaCorrecao: 'Correção monetária pelo IPCA acumulado desde a data do óbito até a data prevista de pagamento.',
    pagarMulta: false,
    valorMulta: 0,
    pagarMora: false,
    valorMora: 0,
    coberturaRelacionada: 'Morte Natural',
    favorecido: 'Todos os beneficiários (rateio)',
    detalhamento: {
      valorBase: 100000.0,
      indiceCorrecao: 'IPCA',
      percentualCorrecao: 2.35,
      valorCorrecao: 2345.67,
    },
  },
]

export const pagamentosB: Pagamento[] = [
  {
    id: 'PAG-B-001',
    numeroIdentificador: 'OP-2024-001002',
    valor: 150000.0,
    correcao: 0,
    valorTotal: 150000.0,
    periodoMeses: 0,
    status: 'bloqueado',
    dataPrevisao: 'Pendente',
    dataEntrada: '15/11/2025',
    calculadoPorAgente: true,
    pagamentoTotalFinal: true,
    corrigirAtePagamento: false,
    pagarMulta: false,
    valorMulta: 0,
    pagarMora: false,
    valorMora: 0,
    motivoBloqueio: 'Aguardando conclusão de perícia médica e resolução do processo judicial',
    coberturaRelacionada: 'Invalidez Permanente Total por Acidente',
    favorecido: 'Carlos Oliveira Costa',
    detalhamento: {
      valorBase: 150000.0,
      indiceCorrecao: '-',
      percentualCorrecao: 0,
      valorCorrecao: 0,
    },
  },
]

export const mockPagamentos: Pagamento[] = [...pagamentosA]

// =============================================================================
// DOCUMENTOS
// =============================================================================
export const documentosA: Documento[] = [
  {
    id: 'DOC-A-001',
    nome: 'Certidão de Óbito.pdf',
    tipo: 'Certidão de Óbito',
    dataUpload: '01/11/2025 10:25:33',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
    dadosExtraidos: {
      nome: 'João Silva Santos',
      dataObito: '28/10/2025',
      causa: 'Morte Natural',
      cartorio: '1º Cartório de SP',
    },
  },
  {
    id: 'DOC-A-002',
    nome: 'RG_Segurado.pdf',
    tipo: 'Documento de Identificação',
    dataUpload: '01/11/2025 10:26:15',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
    dadosExtraidos: {
      rg: '12.345.678-9',
      orgaoEmissor: 'SSP-SP',
    },
  },
  {
    id: 'DOC-A-003',
    nome: 'CPF_Segurado.pdf',
    tipo: 'CPF',
    dataUpload: '01/11/2025 10:28:42',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
    dadosExtraidos: {
      cpf: '123.456.789-00',
      status: 'Regular',
    },
  },
  {
    id: 'DOC-A-004',
    nome: 'Comprovante_Residencia.pdf',
    tipo: 'Comprovante de Residência',
    dataUpload: '01/11/2025 10:32:18',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
  },
]

export const documentosB: Documento[] = [
  {
    id: 'DOC-B-001',
    nome: 'Boletim_Ocorrencia.pdf',
    tipo: 'Boletim de Ocorrência',
    dataUpload: '05/11/2025 14:30:00',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
    dadosExtraidos: {
      numero: 'BO-2025-123456',
      data: '01/11/2025',
      delegacia: 'DP Central',
    },
  },
  {
    id: 'DOC-B-002',
    nome: 'Laudo_Medico_Inicial.pdf',
    tipo: 'Laudo Médico',
    dataUpload: '05/11/2025 14:35:00',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
    dadosExtraidos: {
      medico: 'Dr. Paulo Mendes - CRM 12345',
      diagnostico: 'Traumatismo craniano grave com sequelas',
      data: '02/11/2025',
    },
  },
  {
    id: 'DOC-B-003',
    nome: 'RG_Segurada.pdf',
    tipo: 'Documento de Identificação',
    dataUpload: '05/11/2025 14:40:00',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
    dadosExtraidos: {
      rg: '98.765.432-1',
      orgaoEmissor: 'SSP-SP',
    },
  },
  {
    id: 'DOC-B-004',
    nome: 'CPF_Segurada.pdf',
    tipo: 'CPF',
    dataUpload: '05/11/2025 14:45:00',
    status: 'analisado',
    analisadoPorAgente: true,
    extraido: true,
    dadosExtraidos: {
      cpf: '987.654.321-00',
      status: 'Regular',
    },
  },
  {
    id: 'DOC-B-005',
    nome: 'Laudo_Medico_Detalhado.pdf',
    tipo: 'Laudo Médico Detalhado',
    dataUpload: '12/11/2025 09:00:00',
    status: 'entregue',
    analisadoPorAgente: true,
    extraido: false,
    dataSolicitacao: '08/11/2025',
    prazoSugerido: '15/11/2025',
    dataEntrega: '12/11/2025',
    suspendeSLA: true,
  },
  {
    id: 'DOC-B-006',
    nome: 'Laudo_Pericia_Medica.pdf',
    tipo: 'Laudo Pericial',
    dataUpload: '',
    status: 'solicitado',
    analisadoPorAgente: false,
    extraido: false,
    dataSolicitacao: '15/11/2025',
    prazoSugerido: '30/11/2025',
    suspendeSLA: true,
  },
]

export const mockDocumentos: Documento[] = [...documentosA]

// =============================================================================
// EVENTOS DE ACOMPANHAMENTO (Timeline)
// =============================================================================
export const eventosA: EventoAcompanhamento[] = [
  {
    id: 'EVT-A-001',
    data: '01/11/2025 10:25:33',
    tipo: 'humano',
    categoria: 'Abertura',
    descricao: 'Abertura de sinistro via Portal de Comunicado',
    autor: 'Maria Silva Santos',
  },
  {
    id: 'EVT-A-002',
    data: '01/11/2025 10:26:15',
    tipo: 'agent',
    categoria: 'Agent - Validação',
    descricao: 'Buscar apólice e validar vigência',
    autor: 'Agent',
    cadeiaRaciocinio: [
      {
        id: 'CR-A-001',
        tipo: 'raciocinio',
        timestamp: '10:26:15.123',
        conteudo: 'Preciso buscar a apólice VID-2023-001234 no sistema para validar se está vigente na data do sinistro.',
      },
      {
        id: 'CR-A-002',
        tipo: 'ferramenta',
        timestamp: '10:26:15.456',
        conteudo: 'Chamando ferramenta buscar_apolice',
        ferramenta: 'buscar_apolice',
        parametros: { numero_apolice: 'VID-2023-001234' },
      },
      {
        id: 'CR-A-003',
        tipo: 'resultado',
        timestamp: '10:26:16.789',
        conteudo: 'Apólice encontrada: VID-2023-001234. Vigência: 01/04/2023 a 01/04/2025. Status: Ativa',
      },
    ],
  },
  {
    id: 'EVT-A-003',
    data: '01/11/2025 10:28:42',
    tipo: 'agent',
    categoria: 'Agent - Documentação',
    descricao: 'Upload e análise de documentos obrigatórios',
    autor: 'Agent',
  },
  {
    id: 'EVT-A-004',
    data: '01/11/2025 10:32:18',
    tipo: 'agent',
    categoria: 'Agent - Validação',
    descricao: 'Verificação de carência e prêmios em dia',
    autor: 'Agent',
  },
  {
    id: 'EVT-A-005',
    data: '01/11/2025 11:15:23',
    tipo: 'humano',
    categoria: 'Revisão',
    descricao: 'Aprovação da abertura do aviso e início da regulação',
    autor: 'Carlos Silva',
  },
  {
    id: 'EVT-A-006',
    data: '02/11/2025 09:12:45',
    tipo: 'agent',
    categoria: 'Agent - Regulação',
    descricao: 'Análise de completude e classificação de risco',
    autor: 'Agent',
  },
  {
    id: 'EVT-A-007',
    data: '02/11/2025 14:45:00',
    tipo: 'agent',
    categoria: 'Agent - Pagamento',
    descricao: 'Cálculo de indenização e preparação de pagamento',
    autor: 'Agent',
  },
  {
    id: 'EVT-A-008',
    data: '02/11/2025 15:00:00',
    tipo: 'humano',
    categoria: 'Pendente',
    descricao: 'Aprovação final e autorização de pagamento',
    autor: 'Pendente',
  },
]

export const eventosB: EventoAcompanhamento[] = [
  {
    id: 'EVT-B-001',
    data: '05/11/2025 14:30:00',
    tipo: 'humano',
    categoria: 'Abertura',
    descricao: 'Abertura de sinistro via Portal de Comunicado',
    autor: 'Carlos Oliveira Costa',
  },
  {
    id: 'EVT-B-002',
    data: '05/11/2025 14:35:00',
    tipo: 'agent',
    categoria: 'Agent - Validação',
    descricao: 'Buscar apólice e validar vigência',
    autor: 'Agent',
  },
  {
    id: 'EVT-B-003',
    data: '05/11/2025 14:45:00',
    tipo: 'agent',
    categoria: 'Agent - Documentação',
    descricao: 'Análise inicial de documentos - identificada necessidade de laudo detalhado',
    autor: 'Agent',
  },
  {
    id: 'EVT-B-004',
    data: '08/11/2025 09:00:00',
    tipo: 'agent',
    categoria: 'Agent - Pendência',
    descricao: 'Solicitação de laudo médico detalhado - SLA suspenso',
    autor: 'Agent',
  },
  {
    id: 'EVT-B-005',
    data: '12/11/2025 09:00:00',
    tipo: 'humano',
    categoria: 'Documentação',
    descricao: 'Laudo médico detalhado entregue - SLA retomado',
    autor: 'Carlos Oliveira Costa',
  },
  {
    id: 'EVT-B-006',
    data: '15/11/2025 10:00:00',
    tipo: 'agent',
    categoria: 'Agent - Perícia',
    descricao: 'Identificada necessidade de perícia médica - Encaminhado para especialista',
    autor: 'Agent',
  },
  {
    id: 'EVT-B-007',
    data: '15/11/2025 11:00:00',
    tipo: 'humano',
    categoria: 'Atribuição',
    descricao: 'Perícia atribuída à Dra. Marina Costa - Aguardando retorno',
    autor: 'Carlos Silva',
  },
  {
    id: 'EVT-B-008',
    data: '20/11/2025 10:00:00',
    tipo: 'humano',
    categoria: 'Judicial',
    descricao: 'Processo judicial registrado - Reserva ajustada',
    autor: 'Sistema Jurídico',
  },
]

export const mockEventosAcompanhamento: EventoAcompanhamento[] = [...eventosA]

// =============================================================================
// LOG FORMAL (Eventos de Negócio)
// =============================================================================
export const logFormalA: EventoFormal[] = [
  {
    id: 'LOG-A-001',
    data: '01/11/2025 10:25:33',
    ator: 'Sistema',
    evento: 'aviso-aberto',
    descricao: 'Aviso de sinistro aberto via Portal de Comunicado',
    observacao: 'Abertura automática após comunicado COM-2024-000123',
  },
  {
    id: 'LOG-A-002',
    data: '01/11/2025 11:15:23',
    ator: 'Carlos Silva',
    evento: 'inicio-regulacao',
    descricao: 'Início do processo de regulação',
    observacao: 'Documentação inicial validada pelo agente',
  },
  {
    id: 'LOG-A-003',
    data: '02/11/2025 09:00:00',
    ator: 'Agente',
    evento: 'beneficiario-cadastrado',
    descricao: 'Beneficiários cadastrados automaticamente',
    observacao: '3 beneficiários identificados: Maria (50%), Pedro (25%), Ana (25%)',
  },
  {
    id: 'LOG-A-004',
    data: '02/11/2025 14:45:00',
    ator: 'Agente',
    evento: 'pagamento-gerado',
    descricao: 'Ordem de pagamento gerada',
    observacao: 'Valor total: R$ 102.345,67 (incluindo correção IPCA)',
  },
  {
    id: 'LOG-A-005',
    data: '02/11/2025 14:45:00',
    ator: 'Agente',
    evento: 'reserva-alterada',
    descricao: 'Reserva ajustada',
    observacao: 'Novo valor: R$ 102.345,67',
  },
]

export const logFormalB: EventoFormal[] = [
  {
    id: 'LOG-B-001',
    data: '05/11/2025 14:30:00',
    ator: 'Sistema',
    evento: 'aviso-aberto',
    descricao: 'Aviso de sinistro aberto via Portal de Comunicado',
    observacao: 'Abertura automática após comunicado COM-2024-000145',
  },
  {
    id: 'LOG-B-002',
    data: '05/11/2025 14:35:00',
    ator: 'Carlos Silva',
    evento: 'inicio-regulacao',
    descricao: 'Início do processo de regulação',
  },
  {
    id: 'LOG-B-003',
    data: '08/11/2025 09:00:00',
    ator: 'Agente',
    evento: 'documento-solicitado',
    descricao: 'Laudo médico detalhado solicitado',
    observacao: 'Prazo: 15/11/2025',
  },
  {
    id: 'LOG-B-004',
    data: '08/11/2025 09:00:00',
    ator: 'Sistema',
    evento: 'sla-suspenso',
    descricao: 'SLA suspenso por pendência documental',
    observacao: 'Aguardando laudo médico detalhado',
  },
  {
    id: 'LOG-B-005',
    data: '12/11/2025 09:00:00',
    ator: 'Carlos Oliveira Costa',
    evento: 'documento-entregue',
    descricao: 'Laudo médico detalhado entregue',
  },
  {
    id: 'LOG-B-006',
    data: '12/11/2025 09:00:00',
    ator: 'Sistema',
    evento: 'sla-retomado',
    descricao: 'SLA retomado após entrega de documento',
    observacao: '4 dias suspensos',
  },
  {
    id: 'LOG-B-007',
    data: '15/11/2025 10:00:00',
    ator: 'Agente',
    evento: 'pericia-enviada',
    descricao: 'Sinistro encaminhado para perícia médica',
    observacao: 'Especialista: Dra. Marina Costa',
  },
  {
    id: 'LOG-B-008',
    data: '15/11/2025 10:00:00',
    ator: 'Sistema',
    evento: 'sla-suspenso',
    descricao: 'SLA suspenso durante perícia',
    observacao: 'Aguardando laudo pericial',
  },
  {
    id: 'LOG-B-009',
    data: '15/11/2025 11:00:00',
    ator: 'Agente',
    evento: 'beneficiario-cadastrado',
    descricao: 'Beneficiário cadastrado automaticamente',
    observacao: 'Carlos Oliveira Costa (100%)',
  },
  {
    id: 'LOG-B-010',
    data: '20/11/2025 10:00:00',
    ator: 'Sistema Jurídico',
    evento: 'processo-judicial-registrado',
    descricao: 'Processo judicial vinculado ao sinistro',
    observacao: 'Processo: 1234567-89.2025.8.26.0100',
  },
  {
    id: 'LOG-B-011',
    data: '20/11/2025 10:00:00',
    ator: 'Sistema',
    evento: 'reserva-alterada',
    descricao: 'Reserva ajustada por processo judicial',
    observacao: 'Novo valor: R$ 225.000,00',
  },
]

export const mockLogFormal: EventoFormal[] = [...logFormalA]

// =============================================================================
// ETAPAS DO FLUXO
// =============================================================================
export const mockEtapasFluxo: EtapaFluxo[] = [
  {
    id: 'ETP-001',
    numero: 1,
    nome: 'Atendimento Inicial',
    status: 'concluida',
    executadoPorAgente: false,
    aguardandoValidacao: false,
    dataInicio: '01/11/2025 10:25:33',
    dataConclusao: '01/11/2025 10:26:00',
  },
  {
    id: 'ETP-002',
    numero: 2,
    nome: 'Cadastro do Cliente',
    status: 'concluida',
    executadoPorAgente: true,
    aguardandoValidacao: false,
    dataInicio: '01/11/2025 10:26:00',
    dataConclusao: '01/11/2025 10:26:15',
  },
  {
    id: 'ETP-003',
    numero: 3,
    nome: 'Análise Jurídica',
    status: 'concluida',
    executadoPorAgente: true,
    aguardandoValidacao: false,
    dataInicio: '01/11/2025 10:26:15',
    dataConclusao: '01/11/2025 10:32:18',
  },
  {
    id: 'ETP-004',
    numero: 4,
    nome: 'Distribuição da Demanda',
    status: 'concluida',
    executadoPorAgente: true,
    aguardandoValidacao: false,
    dataInicio: '01/11/2025 10:32:18',
    dataConclusao: '01/11/2025 11:15:23',
  },
  {
    id: 'ETP-005',
    numero: 5,
    nome: 'Execução',
    status: 'concluida',
    executadoPorAgente: true,
    aguardandoValidacao: false,
    dataInicio: '01/11/2025 11:15:23',
    dataConclusao: '02/11/2025 14:45:00',
  },
  {
    id: 'ETP-006',
    numero: 6,
    nome: 'Acompanhamento',
    status: 'em-andamento',
    executadoPorAgente: false,
    aguardandoValidacao: true,
    dataInicio: '02/11/2025 14:45:00',
  },
  {
    id: 'ETP-007',
    numero: 7,
    nome: 'Encerramento',
    status: 'pendente',
    executadoPorAgente: false,
    aguardandoValidacao: false,
  },
]

// =============================================================================
// ESPECIALISTAS
// =============================================================================
export const mockEspecialistas: Especialista[] = [
  {
    id: 'ESP-001',
    nome: 'Dr. Roberto Almeida',
    especialidade: 'Médico Forense',
    email: 'roberto.almeida@sds.com.br',
    telefone: '(11) 98765-4321',
    cargaAtual: 5,
    capacidadeMaxima: 10,
    disponivel: true,
    taxaAprovacao: 94.5,
    tempoMedioAnalise: 18,
    sinistrosAtribuidos: 5,
    sinistrosConcluidos: 42,
  },
  {
    id: 'ESP-002',
    nome: 'Dra. Marina Costa',
    especialidade: 'Médica Traumatologista',
    email: 'marina.costa@sds.com.br',
    telefone: '(11) 98765-4322',
    cargaAtual: 8,
    capacidadeMaxima: 10,
    disponivel: true,
    taxaAprovacao: 91.2,
    tempoMedioAnalise: 22,
    sinistrosAtribuidos: 8,
    sinistrosConcluidos: 67,
  },
]

export const mockPareceresTecnicos: ParecerTecnico[] = []

export const mockSolicitacoesDocumento: SolicitacaoDocumento[] = []

// =============================================================================
// FUNÇÕES AUXILIARES PARA OBTER DADOS POR CENÁRIO
// =============================================================================
export function getDadosCenario(sinistroId: string) {
  const isCenarioB = sinistroId === 'SIN-2024-001002'
  
  return {
    sinistro: isCenarioB ? sinistroB : sinistroA,
    coberturas: isCenarioB ? coberturasB : coberturasA,
    beneficiarios: isCenarioB ? beneficiariosB : beneficiariosA,
    pagamentos: isCenarioB ? pagamentosB : pagamentosA,
    documentos: isCenarioB ? documentosB : documentosA,
    eventos: isCenarioB ? eventosB : eventosA,
    logFormal: isCenarioB ? logFormalB : logFormalA,
  }
}
