import { FluxoVisual, NoFluxo, ConexaoFluxo, NODE_HEIGHT, NODE_SPACING_Y, NODE_SPACING_X, NODE_WIDTH } from '@/types/fluxo-visual'

// Constantes de posicionamento
const COL_PRINCIPAL = 40
const COL_DESVIO = COL_PRINCIPAL + NODE_SPACING_X
const ROW_START = 20
const ROW_GAP = NODE_HEIGHT + NODE_SPACING_Y

// =============================================================================
// CENÁRIO 1: Fluxo Simples (1 comunicado, sem desvios)
// =============================================================================
const nosFluxoSimples: NoFluxo[] = [
  {
    id: 'com-1',
    tipo: 'comunicado',
    titulo: 'Comunicado',
    descricao: 'COM-2024-000123',
    status: 'concluido',
    executor: 'humano',
    dataInicio: '01/11/2025 10:25',
    dataConclusao: '01/11/2025 10:25',
    posicao: { x: COL_PRINCIPAL, y: ROW_START },
  },
  {
    id: 'aviso-1',
    tipo: 'aviso',
    titulo: 'Aviso de Sinistro',
    descricao: 'AVI-2024-001001',
    status: 'concluido',
    executor: 'sistema',
    dataInicio: '01/11/2025 10:26',
    dataConclusao: '01/11/2025 10:26',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP },
  },
  {
    id: 'reserva-1',
    tipo: 'reserva',
    titulo: 'Reserva',
    descricao: 'R$ 100.000,00',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '01/11/2025 10:27',
    dataConclusao: '01/11/2025 10:28',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 2 },
    metadata: { valorReserva: 100000, confiancaAgente: 95 },
  },
  {
    id: 'docs-1',
    tipo: 'analise-documental',
    titulo: 'Análise Docs',
    descricao: '4 documentos',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '01/11/2025 10:28',
    dataConclusao: '01/11/2025 10:32',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 3 },
    documentosRelacionados: ['DOC-A-001', 'DOC-A-002', 'DOC-A-003', 'DOC-A-004'],
  },
  {
    id: 'cob-1',
    tipo: 'validacao-cobertura',
    titulo: 'Val. Cobertura',
    descricao: 'Morte Natural',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '01/11/2025 10:32',
    dataConclusao: '01/11/2025 10:35',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 4 },
    metadata: { confiancaAgente: 98 },
  },
  {
    id: 'ben-1',
    tipo: 'beneficiarios',
    titulo: 'Beneficiários',
    descricao: '3 identificados',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '01/11/2025 10:35',
    dataConclusao: '01/11/2025 10:40',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 5 },
  },
  {
    id: 'calc-1',
    tipo: 'calculo',
    titulo: 'Cálculo',
    descricao: 'R$ 102.345,67',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '02/11/2025 09:00',
    dataConclusao: '02/11/2025 14:45',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 6 },
    metadata: { confiancaAgente: 99 },
  },
  {
    id: 'pag-1',
    tipo: 'pagamento',
    titulo: 'Pagamento',
    descricao: 'Aguardando',
    status: 'em-andamento',
    executor: 'humano',
    dataInicio: '02/11/2025 14:45',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 7 },
  },
  {
    id: 'enc-1',
    tipo: 'encerramento',
    titulo: 'Encerramento',
    status: 'pendente',
    executor: 'sistema',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 8 },
  },
]

const conexoesFluxoSimples: ConexaoFluxo[] = [
  { id: 'c1', origem: 'com-1', destino: 'aviso-1', tipo: 'principal' },
  { id: 'c2', origem: 'aviso-1', destino: 'reserva-1', tipo: 'principal' },
  { id: 'c3', origem: 'reserva-1', destino: 'docs-1', tipo: 'principal' },
  { id: 'c4', origem: 'docs-1', destino: 'cob-1', tipo: 'principal' },
  { id: 'c5', origem: 'cob-1', destino: 'ben-1', tipo: 'principal' },
  { id: 'c6', origem: 'ben-1', destino: 'calc-1', tipo: 'principal' },
  { id: 'c7', origem: 'calc-1', destino: 'pag-1', tipo: 'principal' },
  { id: 'c8', origem: 'pag-1', destino: 'enc-1', tipo: 'principal' },
]

export const fluxoSimples: FluxoVisual = {
  id: 'fluxo-simples',
  sinistroId: 'SIN-2024-001001',
  nos: nosFluxoSimples,
  conexoes: conexoesFluxoSimples,
  tipoFluxo: 'simples',
  dataAtualizacao: '02/11/2025 15:00',
}

// =============================================================================
// CENÁRIO 2: Múltiplos Comunicados (consolidação)
// =============================================================================
const nosMultiplosComunicados: NoFluxo[] = [
  {
    id: 'com-m1',
    tipo: 'comunicado',
    titulo: 'Comunicado 1',
    descricao: 'COM-2024-000200',
    status: 'concluido',
    executor: 'humano',
    dataInicio: '05/11/2025 08:00',
    dataConclusao: '05/11/2025 08:00',
    posicao: { x: 20, y: ROW_START },
  },
  {
    id: 'com-m2',
    tipo: 'comunicado',
    titulo: 'Comunicado 2',
    descricao: 'COM-2024-000201',
    status: 'concluido',
    executor: 'humano',
    dataInicio: '05/11/2025 09:30',
    dataConclusao: '05/11/2025 09:30',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START },
  },
  {
    id: 'com-m3',
    tipo: 'comunicado',
    titulo: 'Comunicado 3',
    descricao: 'COM-2024-000202',
    status: 'concluido',
    executor: 'humano',
    dataInicio: '05/11/2025 11:00',
    dataConclusao: '05/11/2025 11:00',
    posicao: { x: 20 + (NODE_WIDTH + 15) * 2, y: ROW_START },
  },
  {
    id: 'aviso-m1',
    tipo: 'aviso',
    titulo: 'Aviso Consolidado',
    descricao: '3 comunicados',
    status: 'concluido',
    executor: 'sistema',
    dataInicio: '05/11/2025 11:05',
    dataConclusao: '05/11/2025 11:10',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP },
  },
  {
    id: 'reserva-m1',
    tipo: 'reserva',
    titulo: 'Reserva',
    descricao: 'R$ 250.000,00',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '05/11/2025 11:10',
    dataConclusao: '05/11/2025 11:15',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP * 2 },
    metadata: { valorReserva: 250000, confiancaAgente: 92 },
  },
  {
    id: 'docs-m1',
    tipo: 'analise-documental',
    titulo: 'Análise Docs',
    descricao: '8 de 3 fontes',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '05/11/2025 11:15',
    dataConclusao: '05/11/2025 12:00',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP * 3 },
  },
  {
    id: 'cob-m1',
    tipo: 'validacao-cobertura',
    titulo: 'Val. Cobertura',
    descricao: 'Morte Acidental',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '05/11/2025 12:00',
    dataConclusao: '05/11/2025 12:15',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP * 4 },
  },
  {
    id: 'ben-m1',
    tipo: 'beneficiarios',
    titulo: 'Beneficiários',
    descricao: '2 identificados',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '05/11/2025 12:15',
    dataConclusao: '05/11/2025 12:30',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP * 5 },
  },
  {
    id: 'calc-m1',
    tipo: 'calculo',
    titulo: 'Cálculo',
    descricao: 'R$ 256.789,00',
    status: 'em-andamento',
    executor: 'agent',
    dataInicio: '05/11/2025 14:00',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP * 6 },
  },
  {
    id: 'pag-m1',
    tipo: 'pagamento',
    titulo: 'Pagamento',
    status: 'pendente',
    executor: 'humano',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP * 7 },
  },
  {
    id: 'enc-m1',
    tipo: 'encerramento',
    titulo: 'Encerramento',
    status: 'pendente',
    executor: 'sistema',
    posicao: { x: 20 + NODE_WIDTH + 15, y: ROW_START + ROW_GAP * 8 },
  },
]

const conexoesMultiplosComunicados: ConexaoFluxo[] = [
  { id: 'cm1', origem: 'com-m1', destino: 'aviso-m1', tipo: 'principal' },
  { id: 'cm2', origem: 'com-m2', destino: 'aviso-m1', tipo: 'principal' },
  { id: 'cm3', origem: 'com-m3', destino: 'aviso-m1', tipo: 'principal' },
  { id: 'cm4', origem: 'aviso-m1', destino: 'reserva-m1', tipo: 'principal' },
  { id: 'cm5', origem: 'reserva-m1', destino: 'docs-m1', tipo: 'principal' },
  { id: 'cm6', origem: 'docs-m1', destino: 'cob-m1', tipo: 'principal' },
  { id: 'cm7', origem: 'cob-m1', destino: 'ben-m1', tipo: 'principal' },
  { id: 'cm8', origem: 'ben-m1', destino: 'calc-m1', tipo: 'principal' },
  { id: 'cm9', origem: 'calc-m1', destino: 'pag-m1', tipo: 'principal' },
  { id: 'cm10', origem: 'pag-m1', destino: 'enc-m1', tipo: 'principal' },
]

export const fluxoMultiplosComunicados: FluxoVisual = {
  id: 'fluxo-multiplos-comunicados',
  sinistroId: 'SIN-2024-001003',
  nos: nosMultiplosComunicados,
  conexoes: conexoesMultiplosComunicados,
  tipoFluxo: 'multiplos-comunicados',
  dataAtualizacao: '05/11/2025 14:30',
}

// =============================================================================
// CENÁRIO 3: Com Desvio para Perícia
// =============================================================================
const nosComPericia: NoFluxo[] = [
  {
    id: 'com-p1',
    tipo: 'comunicado',
    titulo: 'Comunicado',
    descricao: 'COM-2024-000145',
    status: 'concluido',
    executor: 'humano',
    dataInicio: '05/11/2025 14:30',
    dataConclusao: '05/11/2025 14:30',
    posicao: { x: COL_PRINCIPAL, y: ROW_START },
  },
  {
    id: 'aviso-p1',
    tipo: 'aviso',
    titulo: 'Aviso',
    descricao: 'AVI-2024-001002',
    status: 'concluido',
    executor: 'sistema',
    dataInicio: '05/11/2025 14:31',
    dataConclusao: '05/11/2025 14:32',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP },
  },
  {
    id: 'reserva-p1',
    tipo: 'reserva',
    titulo: 'Reserva',
    descricao: 'R$ 150.000,00',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '05/11/2025 14:32',
    dataConclusao: '05/11/2025 14:35',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 2 },
    metadata: { valorReserva: 150000 },
  },
  {
    id: 'docs-p1',
    tipo: 'analise-documental',
    titulo: 'Análise Docs',
    descricao: 'Análise completa',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '05/11/2025 14:35',
    dataConclusao: '05/11/2025 14:45',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 3 },
  },
  {
    id: 'cob-p1',
    tipo: 'validacao-cobertura',
    titulo: 'Val. Cobertura',
    descricao: 'Requer perícia',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '05/11/2025 14:45',
    dataConclusao: '05/11/2025 15:00',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 4 },
    metadata: { confiancaAgente: 78, parecer: 'Necessário parecer especialista' },
  },
  {
    id: 'pericia-p1',
    tipo: 'pericia',
    titulo: 'Perícia Médica',
    descricao: 'Dra. Marina',
    status: 'em-andamento',
    executor: 'externo',
    dataInicio: '15/11/2025 10:00',
    posicao: { x: COL_DESVIO, y: ROW_START + ROW_GAP * 4 },
    metadata: { especialista: 'Dra. Marina Costa', motivoSuspensao: 'Aguardando laudo' },
  },
  {
    id: 'retorno-p1',
    tipo: 'retorno-pericia',
    titulo: 'Retorno Perícia',
    descricao: 'Prazo até 30/11',
    status: 'pendente',
    executor: 'externo',
    posicao: { x: COL_DESVIO, y: ROW_START + ROW_GAP * 5 },
  },
  {
    id: 'ben-p1',
    tipo: 'beneficiarios',
    titulo: 'Beneficiários',
    descricao: '1 identificado',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '15/11/2025 11:00',
    dataConclusao: '15/11/2025 11:15',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 5 },
  },
  {
    id: 'calc-p1',
    tipo: 'calculo',
    titulo: 'Cálculo',
    descricao: 'Aguardando perícia',
    status: 'suspenso',
    executor: 'agent',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 6 },
    metadata: { motivoSuspensao: 'Aguardando perícia' },
  },
  {
    id: 'pag-p1',
    tipo: 'pagamento',
    titulo: 'Pagamento',
    status: 'pendente',
    executor: 'humano',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 7 },
  },
  {
    id: 'enc-p1',
    tipo: 'encerramento',
    titulo: 'Encerramento',
    status: 'pendente',
    executor: 'sistema',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 8 },
  },
]

const conexoesComPericia: ConexaoFluxo[] = [
  { id: 'cp1', origem: 'com-p1', destino: 'aviso-p1', tipo: 'principal' },
  { id: 'cp2', origem: 'aviso-p1', destino: 'reserva-p1', tipo: 'principal' },
  { id: 'cp3', origem: 'reserva-p1', destino: 'docs-p1', tipo: 'principal' },
  { id: 'cp4', origem: 'docs-p1', destino: 'cob-p1', tipo: 'principal' },
  { id: 'cp5', origem: 'cob-p1', destino: 'pericia-p1', tipo: 'desvio', label: 'Requer parecer' },
  { id: 'cp6', origem: 'pericia-p1', destino: 'retorno-p1', tipo: 'desvio' },
  { id: 'cp7', origem: 'retorno-p1', destino: 'calc-p1', tipo: 'retorno', label: 'Após laudo' },
  { id: 'cp8', origem: 'cob-p1', destino: 'ben-p1', tipo: 'principal' },
  { id: 'cp9', origem: 'ben-p1', destino: 'calc-p1', tipo: 'principal' },
  { id: 'cp10', origem: 'calc-p1', destino: 'pag-p1', tipo: 'principal' },
  { id: 'cp11', origem: 'pag-p1', destino: 'enc-p1', tipo: 'principal' },
]

export const fluxoComPericia: FluxoVisual = {
  id: 'fluxo-com-pericia',
  sinistroId: 'SIN-2024-001002',
  nos: nosComPericia,
  conexoes: conexoesComPericia,
  tipoFluxo: 'com-pericia',
  dataAtualizacao: '20/11/2025 10:00',
}

// =============================================================================
// CENÁRIO 4: Com Solicitação de Documentos (SLA Suspenso)
// =============================================================================
const nosComPendenciaDocs: NoFluxo[] = [
  {
    id: 'com-d1',
    tipo: 'comunicado',
    titulo: 'Comunicado',
    descricao: 'COM-2024-000300',
    status: 'concluido',
    executor: 'humano',
    dataInicio: '10/11/2025 09:00',
    dataConclusao: '10/11/2025 09:00',
    posicao: { x: COL_PRINCIPAL, y: ROW_START },
  },
  {
    id: 'aviso-d1',
    tipo: 'aviso',
    titulo: 'Aviso',
    descricao: 'AVI-2024-001004',
    status: 'concluido',
    executor: 'sistema',
    dataInicio: '10/11/2025 09:01',
    dataConclusao: '10/11/2025 09:02',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP },
  },
  {
    id: 'reserva-d1',
    tipo: 'reserva',
    titulo: 'Reserva',
    descricao: 'R$ 80.000,00',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '10/11/2025 09:02',
    dataConclusao: '10/11/2025 09:05',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 2 },
    metadata: { valorReserva: 80000 },
  },
  {
    id: 'docs-d1',
    tipo: 'analise-documental',
    titulo: 'Análise Docs',
    descricao: 'Docs incompletos',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '10/11/2025 09:05',
    dataConclusao: '10/11/2025 09:30',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 3 },
  },
  {
    id: 'solic-d1',
    tipo: 'solicitacao-docs',
    titulo: 'Solic. Docs',
    descricao: 'SLA Suspenso',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '10/11/2025 09:30',
    dataConclusao: '15/11/2025 14:00',
    posicao: { x: COL_DESVIO, y: ROW_START + ROW_GAP * 3 },
    metadata: {
      documentosSolicitados: ['Laudo Médico', 'Exames'],
      motivoSuspensao: 'Aguardando docs',
    },
  },
  {
    id: 'docs-d2',
    tipo: 'analise-documental',
    titulo: 'Reanálise Docs',
    descricao: 'Docs recebidos',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '15/11/2025 14:00',
    dataConclusao: '15/11/2025 14:30',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 4 },
  },
  {
    id: 'cob-d1',
    tipo: 'validacao-cobertura',
    titulo: 'Val. Cobertura',
    descricao: 'Invalidez Parcial',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '15/11/2025 14:30',
    dataConclusao: '15/11/2025 15:00',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 5 },
  },
  {
    id: 'ben-d1',
    tipo: 'beneficiarios',
    titulo: 'Beneficiários',
    descricao: '1 identificado',
    status: 'concluido',
    executor: 'agent',
    dataInicio: '15/11/2025 15:00',
    dataConclusao: '15/11/2025 15:15',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 6 },
  },
  {
    id: 'calc-d1',
    tipo: 'calculo',
    titulo: 'Cálculo',
    descricao: 'R$ 48.000,00',
    status: 'em-andamento',
    executor: 'agent',
    dataInicio: '15/11/2025 15:15',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 7 },
  },
  {
    id: 'pag-d1',
    tipo: 'pagamento',
    titulo: 'Pagamento',
    status: 'pendente',
    executor: 'humano',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 8 },
  },
  {
    id: 'enc-d1',
    tipo: 'encerramento',
    titulo: 'Encerramento',
    status: 'pendente',
    executor: 'sistema',
    posicao: { x: COL_PRINCIPAL, y: ROW_START + ROW_GAP * 9 },
  },
]

const conexoesComPendenciaDocs: ConexaoFluxo[] = [
  { id: 'cd1', origem: 'com-d1', destino: 'aviso-d1', tipo: 'principal' },
  { id: 'cd2', origem: 'aviso-d1', destino: 'reserva-d1', tipo: 'principal' },
  { id: 'cd3', origem: 'reserva-d1', destino: 'docs-d1', tipo: 'principal' },
  { id: 'cd4', origem: 'docs-d1', destino: 'solic-d1', tipo: 'desvio', label: 'Docs faltantes' },
  { id: 'cd5', origem: 'solic-d1', destino: 'docs-d2', tipo: 'retorno', label: 'Recebidos' },
  { id: 'cd6', origem: 'docs-d2', destino: 'cob-d1', tipo: 'principal' },
  { id: 'cd7', origem: 'cob-d1', destino: 'ben-d1', tipo: 'principal' },
  { id: 'cd8', origem: 'ben-d1', destino: 'calc-d1', tipo: 'principal' },
  { id: 'cd9', origem: 'calc-d1', destino: 'pag-d1', tipo: 'principal' },
  { id: 'cd10', origem: 'pag-d1', destino: 'enc-d1', tipo: 'principal' },
]

export const fluxoComPendenciaDocs: FluxoVisual = {
  id: 'fluxo-com-pendencia-docs',
  sinistroId: 'SIN-2024-001004',
  nos: nosComPendenciaDocs,
  conexoes: conexoesComPendenciaDocs,
  tipoFluxo: 'com-pendencia-docs',
  dataAtualizacao: '15/11/2025 15:30',
}

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================
export function getFluxoVisualPorSinistro(sinistroId: string): FluxoVisual {
  switch (sinistroId) {
    case 'SIN-2024-001001':
      return fluxoSimples
    case 'SIN-2024-001002':
      return fluxoComPericia
    case 'SIN-2024-001003':
      return fluxoMultiplosComunicados
    case 'SIN-2024-001004':
      return fluxoComPendenciaDocs
    default:
      return fluxoSimples
  }
}

export const todosFluxos: FluxoVisual[] = [
  fluxoSimples,
  fluxoMultiplosComunicados,
  fluxoComPericia,
  fluxoComPendenciaDocs,
]
