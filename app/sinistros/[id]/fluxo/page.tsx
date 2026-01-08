'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { HeaderApolice } from '@/components/layout/header-apolice'
import { useSinistro } from '@/providers/sinistro-context'
import { FlowchartView, TimelineView } from '@/components/fluxo-visual'
import { getFluxoVisualPorSinistro, todosFluxos } from '@/data/mocks/fluxos-visuais'
import { TipoVisualizacao, FluxoVisual } from '@/types/fluxo-visual'
import { 
  GitBranch, 
  Clock, 
  Cpu,
  User,
  CheckCircle,
  Pause,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function FluxoJornadaPage() {
  const params = useParams()
  const { sinistroAtual, selecionarSinistro } = useSinistro()
  
  const [visualizacao, setVisualizacao] = useState<TipoVisualizacao>('flowchart')
  const [fluxoAtual, setFluxoAtual] = useState<FluxoVisual | null>(null)
  const [cenarioSelecionado, setCenarioSelecionado] = useState<string>('')

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      selecionarSinistro(params.id)
      const fluxo = getFluxoVisualPorSinistro(params.id)
      setFluxoAtual(fluxo)
      setCenarioSelecionado(fluxo.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleCenarioChange = (cenarioId: string) => {
    const fluxo = todosFluxos.find(f => f.id === cenarioId)
    if (fluxo) {
      setFluxoAtual(fluxo)
      setCenarioSelecionado(cenarioId)
    }
  }

  if (!sinistroAtual) {
    return (
      <div className="min-h-screen bg-[var(--cinza-50)] flex items-center justify-center">
        <div className="text-[var(--cinza-500)] font-['Poppins'] text-[11px]">Carregando...</div>
      </div>
    )
  }

  const apolice = {
    numero: sinistroAtual.apolice,
    produto: sinistroAtual.produto,
    ramo: sinistroAtual.ramo,
    segurado: sinistroAtual.segurado,
    dataEmissao: sinistroAtual.dataEmissao,
    inicioVigencia: sinistroAtual.inicioVigencia,
    terminoVigencia: sinistroAtual.terminoVigencia,
  }

  const estatisticas = fluxoAtual ? {
    total: fluxoAtual.nos.length,
    concluidos: fluxoAtual.nos.filter(n => n.status === 'concluido').length,
    emAndamento: fluxoAtual.nos.filter(n => n.status === 'em-andamento').length,
    suspensos: fluxoAtual.nos.filter(n => n.status === 'suspenso').length,
    porAgente: fluxoAtual.nos.filter(n => n.executor === 'agent').length,
    porHumano: fluxoAtual.nos.filter(n => n.executor === 'humano').length,
  } : null

  return (
    <div className="min-h-screen bg-[var(--cinza-50)] font-['Poppins']">
      <TopBar sinistroNumero={sinistroAtual.id} />
      <HeaderApolice apolice={apolice} sla={sinistroAtual.sla} />

      <main className="pt-[176px] px-4 pb-4">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Card principal */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--cinza-200)]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--cinza-100)]">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Título e estatísticas */}
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="text-[var(--cinza-900)] text-xs font-semibold flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-[var(--azul-principal-500)]" />
                    Fluxo Visual
                  </h2>
                  
                  {estatisticas && (
                    <div className="flex items-center gap-2 text-[9px]">
                      <span className="text-[var(--cinza-600)]">{estatisticas.total} etapas</span>
                      <span className="text-[#10b981] flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> {estatisticas.concluidos}
                      </span>
                      <span className="text-[#239dc5] flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {estatisticas.emAndamento}
                      </span>
                      {estatisticas.suspensos > 0 && (
                        <span className="text-[#f59e0b] flex items-center gap-0.5">
                          <Pause className="w-3 h-3" /> {estatisticas.suspensos}
                        </span>
                      )}
                      <span className="text-[#239dc5] flex items-center gap-0.5">
                        <Cpu className="w-3 h-3" /> {estatisticas.porAgente}
                      </span>
                      <span className="text-[#c3363d] flex items-center gap-0.5">
                        <User className="w-3 h-3" /> {estatisticas.porHumano}
                      </span>
                    </div>
                  )}
                </div>

                {/* Controles */}
                <div className="flex items-center gap-2">
                  <Select value={cenarioSelecionado} onValueChange={handleCenarioChange}>
                    <SelectTrigger className="w-[140px] h-7 text-[9px] bg-white">
                      <SelectValue placeholder="Cenário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fluxo-simples" className="text-[9px]">Simples</SelectItem>
                      <SelectItem value="fluxo-multiplos-comunicados" className="text-[9px]">Múltiplos Com.</SelectItem>
                      <SelectItem value="fluxo-com-pericia" className="text-[9px]">Com Perícia</SelectItem>
                      <SelectItem value="fluxo-com-pendencia-docs" className="text-[9px]">Pendência Docs</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center bg-white rounded p-0.5 shadow-sm">
                    <Button
                      variant={visualizacao === 'flowchart' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setVisualizacao('flowchart')}
                      className={cn(
                        'gap-1 h-6 text-[9px] px-2',
                        visualizacao === 'flowchart' 
                          ? 'bg-[var(--azul-principal-500)] text-white hover:bg-[var(--azul-principal-600)]'
                          : 'text-[var(--cinza-600)]'
                      )}
                    >
                      <GitBranch className="w-3 h-3" />
                      Flowchart
                    </Button>
                    <Button
                      variant={visualizacao === 'timeline' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setVisualizacao('timeline')}
                      className={cn(
                        'gap-1 h-6 text-[9px] px-2',
                        visualizacao === 'timeline' 
                          ? 'bg-[var(--azul-principal-500)] text-white hover:bg-[var(--azul-principal-600)]'
                          : 'text-[var(--cinza-600)]'
                      )}
                    >
                      <Clock className="w-3 h-3" />
                      Timeline
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Área de visualização */}
            <div className="p-3 bg-[var(--cinza-50)] rounded-lg m-3">
              {fluxoAtual && (
                <>
                  {visualizacao === 'flowchart' ? (
                    <FlowchartView fluxo={fluxoAtual} className="h-[380px]" />
                  ) : (
                    <TimelineView fluxo={fluxoAtual} className="h-[380px]" />
                  )}
                </>
              )}
            </div>

            {/* Legenda compacta inline */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-4 text-[8px] text-[var(--cinza-600)] flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Concluído</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#239dc5]" />
                  <span>Em andamento</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#c4c4c4]" />
                  <span>Pendente</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>Suspenso</span>
                </div>
                <span className="text-[var(--cinza-400)]">|</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 bg-[#239dc5]" />
                  <span>Principal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 bg-[#f59e0b]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f59e0b 0, #f59e0b 2px, transparent 2px, transparent 4px)' }} />
                  <span>Desvio</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 bg-[#10b981]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #10b981 0, #10b981 1px, transparent 1px, transparent 3px)' }} />
                  <span>Retorno</span>
                </div>
                <span className="text-[var(--cinza-400)]">|</span>
                <span>Scroll p/ zoom • Arraste p/ mover • Clique p/ detalhes</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
