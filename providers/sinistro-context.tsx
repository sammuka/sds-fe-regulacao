'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'
import {
  Sinistro,
  Cobertura,
  Beneficiario,
  Pagamento,
  Documento,
  EventoAcompanhamento,
  EventoFormal,
  EtapaFluxo,
  EtapaStepper,
  EstadoStepper,
} from '@/types'
import {
  mockSinistros,
  mockEtapasFluxo,
  getDadosCenario,
} from '@/data/mocks'

// Tipos para ações
type TipoEventoFormal = EventoFormal['tipo']

interface NovoEventoFormal {
  tipo: TipoEventoFormal
  descricao: string
  detalhes?: string
  usuario?: string
}

interface SinistroContextType {
  // Dados
  sinistros: Sinistro[]
  sinistroAtual: Sinistro | null
  coberturas: Cobertura[]
  beneficiarios: Beneficiario[]
  pagamentos: Pagamento[]
  documentos: Documento[]
  eventos: EventoAcompanhamento[]
  logFormal: EventoFormal[]
  etapasFluxo: EtapaFluxo[]
  
  // Stepper
  estadoStepper: EstadoStepper
  setEtapaStepper: (etapa: EtapaStepper) => void
  completarEtapa: (etapa: EtapaStepper) => void
  podeAvancar: (etapa: EtapaStepper) => boolean
  
  // Ações principais
  selecionarSinistro: (id: string) => void
  limparSinistro: () => void
  
  // Ações de aprovação
  aprovarAbertura: (parecer?: string) => Promise<void>
  aprovarDadosSegurado: (parecer?: string) => Promise<void>
  aprovarCobertura: (parecer?: string) => Promise<void>
  aprovarBeneficiarios: (parecer?: string) => Promise<void>
  aprovarPagamento: (pagamentoId: string, parecer?: string) => Promise<void>
  
  // Ações auxiliares
  registrarEventoFormal: (evento: NovoEventoFormal) => void
  atualizarStatusSinistro: (novoStatus: Sinistro['status']) => void
}

const SinistroContext = createContext<SinistroContextType | undefined>(undefined)

// Regras de gating do stepper - Atualizado para 5 etapas (0-4)
const REGRAS_GATING: Record<EtapaStepper, EtapaStepper[]> = {
  0: [], // Abertura do Aviso - sempre acessível
  1: [0], // Dados do Segurado - precisa de abertura aprovada
  2: [0, 1], // Coberturas - precisa de dados
  3: [0, 1, 2], // Beneficiários - precisa de cobertura
  4: [0, 1, 2, 3], // Pagamentos - precisa de beneficiários
}

export function SinistroProvider({ children }: { children: ReactNode }) {
  const [sinistros] = useState<Sinistro[]>(mockSinistros)
  const [sinistroAtual, setSinistroAtual] = useState<Sinistro | null>(null)
  const [coberturas, setCoberturas] = useState<Cobertura[]>([])
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [eventos, setEventos] = useState<EventoAcompanhamento[]>([])
  const [logFormal, setLogFormal] = useState<EventoFormal[]>([])
  const [etapasFluxo] = useState<EtapaFluxo[]>(mockEtapasFluxo)
  
  const [estadoStepper, setEstadoStepper] = useState<EstadoStepper>({
    etapaAtual: 0,
    etapasCompletas: [],
    etapasBloqueadas: [1, 2, 3, 4], // Inicialmente bloqueadas (exceto 0)
  })

  const selecionarSinistro = useCallback((id: string) => {
    const sinistro = sinistros.find(s => s.id === id)
    if (sinistro) {
      // Carrega os dados do cenário correto
      const dados = getDadosCenario(id)
      
      setSinistroAtual(dados.sinistro)
      setCoberturas(dados.coberturas)
      setBeneficiarios(dados.beneficiarios)
      setPagamentos(dados.pagamentos)
      setDocumentos(dados.documentos)
      setEventos(dados.eventos)
      setLogFormal(dados.logFormal)
      
      // Reset do stepper ao selecionar novo sinistro
      setEstadoStepper({
        etapaAtual: 0,
        etapasCompletas: [],
        etapasBloqueadas: [1, 2, 3, 4],
      })
    }
  }, [sinistros])

  const limparSinistro = useCallback(() => {
    setSinistroAtual(null)
    setCoberturas([])
    setBeneficiarios([])
    setPagamentos([])
    setDocumentos([])
    setEventos([])
    setLogFormal([])
    setEstadoStepper({
      etapaAtual: 0,
      etapasCompletas: [],
      etapasBloqueadas: [1, 2, 3, 4],
    })
  }, [])

  const setEtapaStepper = useCallback((etapa: EtapaStepper) => {
    setEstadoStepper(prev => {
      if (prev.etapasBloqueadas.includes(etapa)) {
        return prev
      }
      return { ...prev, etapaAtual: etapa }
    })
  }, [])

  const completarEtapa = useCallback((etapa: EtapaStepper) => {
    setEstadoStepper(prev => {
      const novasCompletas = [...new Set([...prev.etapasCompletas, etapa])]
      
      // Desbloqueia a próxima etapa
      let novasBloqueadas = [...prev.etapasBloqueadas]
      const proximaEtapa = (etapa + 1) as EtapaStepper
      if (proximaEtapa <= 4) {
        novasBloqueadas = novasBloqueadas.filter(e => e !== proximaEtapa)
      }
      
      return {
        ...prev,
        etapasCompletas: novasCompletas,
        etapasBloqueadas: novasBloqueadas,
      }
    })
  }, [])

  const podeAvancar = useCallback((etapa: EtapaStepper): boolean => {
    const prerequisitos = REGRAS_GATING[etapa]
    return prerequisitos.every(p => estadoStepper.etapasCompletas.includes(p))
  }, [estadoStepper])

  // Função para registrar eventos no log formal
  const registrarEventoFormal = useCallback((evento: NovoEventoFormal) => {
    const novoEvento: EventoFormal = {
      id: `EVT-${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tipo: evento.tipo,
      descricao: evento.descricao,
      detalhes: evento.detalhes,
      usuario: evento.usuario || 'Ana Silva',
    }
    setLogFormal(prev => [novoEvento, ...prev])
  }, [])

  // Função para atualizar o status do sinistro
  const atualizarStatusSinistro = useCallback((novoStatus: Sinistro['status']) => {
    setSinistroAtual(prev => prev ? { ...prev, status: novoStatus } : null)
  }, [])

  // Aprovar abertura do aviso (Etapa 0)
  const aprovarAbertura = useCallback(async (parecer?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    registrarEventoFormal({
      tipo: 'abertura_aviso',
      descricao: 'Abertura do aviso aprovada pelo analista',
      detalhes: parecer || 'Aprovado conforme análise do agente',
    })
    
    completarEtapa(0)
    atualizarStatusSinistro('Em Análise')
  }, [registrarEventoFormal, completarEtapa, atualizarStatusSinistro])

  // Aprovar dados do segurado (Etapa 1)
  const aprovarDadosSegurado = useCallback(async (parecer?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    registrarEventoFormal({
      tipo: 'validacao_dados',
      descricao: 'Dados do segurado validados',
      detalhes: parecer || 'Dados confirmados pelo analista',
    })
    
    completarEtapa(1)
  }, [registrarEventoFormal, completarEtapa])

  // Aprovar cobertura (Etapa 2)
  const aprovarCobertura = useCallback(async (parecer?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    registrarEventoFormal({
      tipo: 'analise_cobertura',
      descricao: 'Cobertura aplicável confirmada',
      detalhes: parecer || 'Cobertura validada conforme análise',
    })
    
    completarEtapa(2)
  }, [registrarEventoFormal, completarEtapa])

  // Aprovar beneficiários (Etapa 3)
  const aprovarBeneficiarios = useCallback(async (parecer?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    registrarEventoFormal({
      tipo: 'validacao_dados',
      descricao: 'Beneficiários validados',
      detalhes: parecer || 'Dados dos beneficiários confirmados',
    })
    
    completarEtapa(3)
  }, [registrarEventoFormal, completarEtapa])

  // Aprovar pagamento (Etapa 4)
  const aprovarPagamento = useCallback(async (pagamentoId: string, parecer?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setPagamentos(prev => prev.map(p => 
      p.id === pagamentoId ? { ...p, status: 'aprovado' as const } : p
    ))
    
    registrarEventoFormal({
      tipo: 'pagamento',
      descricao: `Pagamento ${pagamentoId} aprovado`,
      detalhes: parecer || 'Pagamento autorizado pelo analista',
    })
    
    // Verifica se todos os pagamentos estão aprovados
    const todosPagamentosAprovados = pagamentos.every(p => 
      p.id === pagamentoId ? true : p.status === 'aprovado'
    )
    
    if (todosPagamentosAprovados) {
      completarEtapa(4)
      atualizarStatusSinistro('Aprovado')
    }
  }, [pagamentos, registrarEventoFormal, completarEtapa, atualizarStatusSinistro])

  const value = useMemo<SinistroContextType>(() => ({
    sinistros,
    sinistroAtual,
    coberturas,
    beneficiarios,
    pagamentos,
    documentos,
    eventos,
    logFormal,
    etapasFluxo,
    estadoStepper,
    setEtapaStepper,
    completarEtapa,
    podeAvancar,
    selecionarSinistro,
    limparSinistro,
    aprovarAbertura,
    aprovarDadosSegurado,
    aprovarCobertura,
    aprovarBeneficiarios,
    aprovarPagamento,
    registrarEventoFormal,
    atualizarStatusSinistro,
  }), [
    sinistros,
    sinistroAtual,
    coberturas,
    beneficiarios,
    pagamentos,
    documentos,
    eventos,
    logFormal,
    etapasFluxo,
    estadoStepper,
    setEtapaStepper,
    completarEtapa,
    podeAvancar,
    selecionarSinistro,
    limparSinistro,
    aprovarAbertura,
    aprovarDadosSegurado,
    aprovarCobertura,
    aprovarBeneficiarios,
    aprovarPagamento,
    registrarEventoFormal,
    atualizarStatusSinistro,
  ])

  return (
    <SinistroContext.Provider value={value}>
      {children}
    </SinistroContext.Provider>
  )
}

export function useSinistro() {
  const context = useContext(SinistroContext)
  if (context === undefined) {
    throw new Error('useSinistro deve ser usado dentro de um SinistroProvider')
  }
  return context
}
