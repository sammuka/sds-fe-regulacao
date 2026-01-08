// Tipos para o Fluxo Visual da Jornada de Regulação

// Tipo de nó no fluxo
export type TipoNoFluxo =
  | 'comunicado'
  | 'aviso'
  | 'reserva'
  | 'analise-documental'
  | 'validacao-cobertura'
  | 'beneficiarios'
  | 'calculo'
  | 'pagamento'
  | 'encerramento'
  | 'solicitacao-docs'
  | 'pericia'
  | 'validacao-seguranca'
  | 'recurso'
  | 'retorno-pericia'

// Status do nó
export type StatusNoFluxo = 'concluido' | 'em-andamento' | 'pendente' | 'suspenso' | 'erro'

// Executor do nó
export type ExecutorNo = 'agent' | 'humano' | 'sistema' | 'externo'

// Nó do fluxo
export interface NoFluxo {
  id: string
  tipo: TipoNoFluxo
  titulo: string
  descricao?: string
  status: StatusNoFluxo
  executor: ExecutorNo
  dataInicio?: string
  dataConclusao?: string
  documentosRelacionados?: string[]
  posicao: { x: number; y: number }
  metadata?: {
    comunicadoId?: string
    valorReserva?: number
    especialista?: string
    motivoSuspensao?: string
    documentosSolicitados?: string[]
    confiancaAgente?: number
    parecer?: string
  }
}

// Conexão entre nós
export type TipoConexao = 'principal' | 'desvio' | 'retorno' | 'paralelo'

export interface ConexaoFluxo {
  id: string
  origem: string
  destino: string
  tipo: TipoConexao
  label?: string
  condicao?: string
}

// Fluxo completo
export interface FluxoVisual {
  id: string
  sinistroId: string
  nos: NoFluxo[]
  conexoes: ConexaoFluxo[]
  tipoFluxo: 'simples' | 'multiplos-comunicados' | 'com-pericia' | 'com-pendencia-docs'
  dataAtualizacao: string
}

// Estado do canvas
export interface EstadoCanvas {
  zoom: number
  pan: { x: number; y: number }
  noSelecionado: string | null
}

// Tipo de visualização
export type TipoVisualizacao = 'flowchart' | 'timeline'

// Constantes de layout - nós compactos para caber na tela
export const NODE_WIDTH = 140
export const NODE_HEIGHT = 64
export const NODE_SPACING_Y = 70
export const NODE_SPACING_X = 180
