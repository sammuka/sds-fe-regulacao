// Tipos principais do domínio de Regulação

export type PerfilUsuario = 'analista' | 'analista-admin' | 'perito'

export type StatusSinistro = 
  | 'Em Análise'
  | 'Aguardando Perícia'
  | 'Em Regulação'
  | 'Aguardando Documentos'
  | 'Aprovado'
  | 'Negado'
  | 'Encerrado'
  | 'Em Perícia'
  | 'Judicial'

export type FaseSinistro =
  | 'Abertura do Aviso'
  | 'Análise Documental'
  | 'Avaliação Técnica'
  | 'Cálculo de Indenização'
  | 'Aguardando Pagamento'
  | 'Encerrado'

// Período de suspensão do SLA
export interface PeriodoSuspensao {
  dataInicio: string
  dataFim?: string
  motivo: string
}

export interface SLASinistro {
  slaTotal: number           // 30 dias
  slaConsumido: number       // Dias já utilizados
  slaSuspenso: boolean       // Se está suspenso
  dataSuspensao?: string     // Quando foi suspenso
  motivoSuspensao?: string   // "Aguardando documento X"
  diasRestantes: number      // Dias restantes
  periodosSuspensao?: PeriodoSuspensao[] // Histórico de suspensões
}

// Dados do Comunicado (coletado no front do usuário final)
export interface DadosComunicado {
  comunicante: {
    nome: string
    email?: string
    telefone?: string
  }
  dataHoraComunicado: string
  relato: string
  documentosEnviados: string[]
}

// Dados formais do Aviso
export interface DadosAviso {
  numeroAviso: string
  dataOcorrencia: string
  dataAviso: string
  dataRegistro: string
  naturezaEvento: string
  causa: string
  tipoEvento: string
  aberturaAutomatica: boolean
}

// Dados judiciais
export interface DadosJudicial {
  possuiProcesso: boolean
  numeroProcesso?: string
  vara?: string
  juizo?: string
  statusJudicial?: string
  probabilidadePerda?: number // percentual
  dataEntrada?: string
  observacoes?: string
}

// Dados de reserva
export interface DadosReserva {
  valorReservaAtual: number
  ultimaAlteracao: string
  historico?: {
    data: string
    valorAnterior: number
    valorNovo: number
    motivo: string
  }[]
}

// Ciclo da Perícia
export type StatusPericia = 'nao-iniciada' | 'enviada' | 'aguardando-retorno' | 'concluida'

export interface CicloPericia {
  dataEnvio?: string
  dataPrevistaRetorno?: string
  dataRetorno?: string
  status: StatusPericia
  especialistaAtribuido?: {
    id: string
    nome: string
    area: string
  }
  parecerAgente?: {
    texto: string
    confianca: number
  }
  decisaoEspecialista?: 'concorda' | 'diverge'
  observacoesEspecialista?: string
}

export interface Sinistro {
  id: string
  numero: string
  segurado: string
  cpfSegurado?: string
  tipo: string
  valor: number
  apolice: string
  produto: string
  ramo: string
  dataEmissao: string
  inicioVigencia: string
  terminoVigencia: string
  status: StatusSinistro
  prazoRegulatorio: number
  fase: FaseSinistro
  comunicadoId: string
  sla?: SLASinistro
  dataAbertura?: string
  dataNascimento?: string
  telefone?: string
  endereco?: string
  // Novos campos complementares
  dadosComunicado?: DadosComunicado
  dadosAviso?: DadosAviso
  dadosJudicial?: DadosJudicial
  dadosReserva?: DadosReserva
  cicloPericia?: CicloPericia
  // Ações do agente na abertura
  acoesAgenteAbertura?: string[]
}

export interface Apolice {
  numero: string
  produto: string
  ramo: string
  segurado: string
  dataEmissao: string
  inicioVigencia: string
  terminoVigencia: string
}

export interface Cobertura {
  id: string
  nome: string
  valorSegurado: number
  franquia: number
  apuradaComunicado: boolean
  validadaAgente: boolean
  vigente?: boolean
  carenciaCumprida?: boolean
}

export interface Beneficiario {
  id: string
  nome: string
  cpf: string
  parentesco: string
  percentual: number
  sugeridoPorAgente: boolean
  dadosBancarios?: {
    banco: string
    agencia: string
    conta: string
  }
}

export type StatusPagamento = 'pendente' | 'aprovado' | 'pago' | 'bloqueado'

export interface Pagamento {
  id: string
  valor: number
  correcao: number
  valorTotal: number
  periodoMeses: number
  status: StatusPagamento
  dataPrevisao: string
  calculadoPorAgente: boolean
  beneficiarioId?: string
  detalhamento?: {
    valorBase: number
    indiceCorrecao: string
    percentualCorrecao: number
    valorCorrecao: number
  }
  // Novos campos regulatórios
  numeroIdentificador?: string
  dataEntrada?: string
  pagamentoTotalFinal?: boolean
  corrigirAtePagamento?: boolean
  justificativaCorrecao?: string
  pagarMulta?: boolean
  valorMulta?: number
  pagarMora?: boolean
  dataInicioMora?: string
  valorMora?: number
  motivoBloqueio?: string // Para cenário B
  coberturaRelacionada?: string
  favorecido?: string
}

export type StatusDocumento = 'analisado' | 'pendente' | 'solicitado' | 'rejeitado' | 'entregue'

export interface Documento {
  id: string
  nome: string
  tipo: string
  dataUpload: string
  status: StatusDocumento
  analisadoPorAgente: boolean
  extraido: boolean
  dadosExtraidos?: Record<string, string>
  urlPreview?: string
  // Novos campos para solicitação
  dataSolicitacao?: string
  prazoSugerido?: string
  dataEntrega?: string
  suspendeSLA?: boolean
}

export type TipoEvento = 'agent' | 'humano'

export interface EventoAcompanhamento {
  id: string
  data: string
  tipo: TipoEvento
  categoria: string
  descricao: string
  autor: string
  detalhes?: string
  cadeiaRaciocinio?: PassoRaciocinio[]
}

// Evento de negócio para Log Formal
export type TipoEventoFormal = 
  | 'aviso-aberto'
  | 'inicio-regulacao'
  | 'beneficiario-cadastrado'
  | 'pagamento-gerado'
  | 'encerramento-formal'
  | 'reserva-alterada'
  | 'documento-solicitado'
  | 'documento-entregue'
  | 'sla-suspenso'
  | 'sla-retomado'
  | 'pericia-enviada'
  | 'pericia-retornou'
  | 'processo-judicial-registrado'

export interface EventoFormal {
  id: string
  data: string
  ator: 'Agente' | 'Sistema' | string // nome do usuário
  evento: TipoEventoFormal
  descricao: string
  observacao?: string
}

export interface PassoRaciocinio {
  id: string
  tipo: 'raciocinio' | 'ferramenta' | 'resultado'
  timestamp: string
  conteudo: string
  ferramenta?: string
  parametros?: Record<string, unknown>
}

export type StatusEtapaFluxo = 'concluida' | 'em-andamento' | 'pendente'

export interface EtapaFluxo {
  id: string
  numero: number
  nome: string
  status: StatusEtapaFluxo
  executadoPorAgente: boolean
  aguardandoValidacao: boolean
  dataInicio?: string
  dataConclusao?: string
}

export interface Especialista {
  id: string
  nome: string
  especialidade: string
  email: string
  telefone: string
  cargaAtual: number
  capacidadeMaxima: number
  disponivel: boolean
  taxaAprovacao: number
  tempoMedioAnalise: number // em horas
  sinistrosAtribuidos: number
  sinistrosConcluidos: number
  foto?: string
}

export type StatusSolicitacao = 'pendente' | 'atendido' | 'vencido'

export interface SolicitacaoDocumento {
  id: string
  sinistroId: string
  documento: string
  justificativa: string
  prazo: string
  solicitadoPor: string
  dataSolicitacao: string
  status: StatusSolicitacao
  dataRecebimento?: string
}

export type TipoParecer = 'aprovar' | 'reprovar' | 'solicitar-documentos'

export interface ParecerTecnico {
  id: string
  sinistroId: string
  tipo: TipoParecer
  especialistaId: string
  especialistaNome: string
  parecer: string
  data: string
  documentosSolicitados?: string[]
}

// Tipos do Stepper - Atualizado para incluir Step 0
export type EtapaStepper = 0 | 1 | 2 | 3 | 4

export interface EstadoStepper {
  etapaAtual: EtapaStepper
  etapasCompletas: EtapaStepper[]
  etapasBloqueadas: EtapaStepper[]
}

export const ETAPAS_STEPPER = [
  { numero: 0 as EtapaStepper, nome: 'Abertura do Aviso', chave: 'abertura' },
  { numero: 1 as EtapaStepper, nome: 'Dados do Segurado', chave: 'dados' },
  { numero: 2 as EtapaStepper, nome: 'Coberturas da Apólice', chave: 'coberturas' },
  { numero: 3 as EtapaStepper, nome: 'Beneficiários', chave: 'beneficiarios' },
  { numero: 4 as EtapaStepper, nome: 'Pagamentos', chave: 'pagamentos' },
] as const
