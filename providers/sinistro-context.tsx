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
  mockEspecialistas,
  getDadosCenario,
} from '@/data/mocks'

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
  
  // Ações
  selecionarSinistro: (id: string) => void
  limparSinistro: () => void
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
