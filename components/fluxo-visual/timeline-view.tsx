'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { FluxoVisual, NoFluxo, StatusNoFluxo, TipoNoFluxo, ExecutorNo } from '@/types/fluxo-visual'
import { 
  MessageSquare, 
  FileText, 
  Wallet, 
  FileSearch, 
  Shield, 
  Users, 
  Calculator, 
  CreditCard, 
  CheckCircle2,
  FilePlus,
  Stethoscope,
  ShieldAlert,
  MessageCircle,
  FileCheck,
  Cpu,
  User,
  Settings,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Move,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface TimelineViewProps {
  fluxo: FluxoVisual
  className?: string
}

const IconesPorTipo: Record<TipoNoFluxo, React.ElementType> = {
  'comunicado': MessageSquare,
  'aviso': FileText,
  'reserva': Wallet,
  'analise-documental': FileSearch,
  'validacao-cobertura': Shield,
  'beneficiarios': Users,
  'calculo': Calculator,
  'pagamento': CreditCard,
  'encerramento': CheckCircle2,
  'solicitacao-docs': FilePlus,
  'pericia': Stethoscope,
  'validacao-seguranca': ShieldAlert,
  'recurso': MessageCircle,
  'retorno-pericia': FileCheck,
}

const IconesExecutor: Record<ExecutorNo, React.ElementType> = {
  'agent': Cpu,
  'humano': User,
  'sistema': Settings,
  'externo': ExternalLink,
}

const LabelExecutor: Record<ExecutorNo, string> = {
  'agent': 'Agente',
  'humano': 'Humano',
  'sistema': 'Sistema',
  'externo': 'Externo',
}

const CoresPorStatus: Record<StatusNoFluxo, { bg: string; border: string; dot: string; line: string; text: string }> = {
  'concluido': { 
    bg: 'bg-[#ecfdf5]', 
    border: 'border-[#10b981]', 
    dot: 'bg-[#10b981]',
    line: 'bg-[#10b981]',
    text: 'text-[#065f46]',
  },
  'em-andamento': { 
    bg: 'bg-[#e9f5f9]', 
    border: 'border-[#239dc5]', 
    dot: 'bg-[#239dc5]',
    line: 'bg-[#239dc5]',
    text: 'text-[#0f4253]',
  },
  'pendente': { 
    bg: 'bg-[#f5f5f5]', 
    border: 'border-[#c4c4c4]', 
    dot: 'bg-[#c4c4c4]',
    line: 'bg-[#c4c4c4]',
    text: 'text-[#707070]',
  },
  'suspenso': { 
    bg: 'bg-[#fffbeb]', 
    border: 'border-[#f59e0b]', 
    dot: 'bg-[#f59e0b]',
    line: 'bg-[#f59e0b]',
    text: 'text-[#92400e]',
  },
  'erro': { 
    bg: 'bg-[#fef2f2]', 
    border: 'border-[#c3363d]', 
    dot: 'bg-[#c3363d]',
    line: 'bg-[#c3363d]',
    text: 'text-[#991b1b]',
  },
}

interface FaseTimeline {
  id: string
  nome: string
  nos: NoFluxo[]
  status: StatusNoFluxo
}

function agruparNosPorFase(nos: NoFluxo[]): FaseTimeline[] {
  const fases: FaseTimeline[] = []
  
  const nosAbertura = nos.filter(n => ['comunicado', 'aviso'].includes(n.tipo))
  if (nosAbertura.length > 0) {
    fases.push({
      id: 'abertura',
      nome: 'Abertura',
      nos: nosAbertura,
      status: nosAbertura.every(n => n.status === 'concluido') ? 'concluido' : 
              nosAbertura.some(n => n.status === 'em-andamento') ? 'em-andamento' : 'pendente',
    })
  }

  const nosReserva = nos.filter(n => n.tipo === 'reserva')
  if (nosReserva.length > 0) {
    fases.push({
      id: 'constituicao',
      nome: 'Constituição',
      nos: nosReserva,
      status: nosReserva[0].status,
    })
  }

  const nosAnalise = nos.filter(n => ['analise-documental', 'validacao-cobertura', 'validacao-seguranca'].includes(n.tipo))
  if (nosAnalise.length > 0) {
    fases.push({
      id: 'analise',
      nome: 'Análise',
      nos: nosAnalise,
      status: nosAnalise.every(n => n.status === 'concluido') ? 'concluido' : 
              nosAnalise.some(n => n.status === 'em-andamento') ? 'em-andamento' : 
              nosAnalise.some(n => n.status === 'suspenso') ? 'suspenso' : 'pendente',
    })
  }

  const nosDesvios = nos.filter(n => ['solicitacao-docs', 'pericia', 'retorno-pericia', 'recurso'].includes(n.tipo))
  if (nosDesvios.length > 0) {
    fases.push({
      id: 'desvios',
      nome: 'Desvios',
      nos: nosDesvios,
      status: nosDesvios.every(n => n.status === 'concluido') ? 'concluido' : 
              nosDesvios.some(n => n.status === 'em-andamento') ? 'em-andamento' : 
              nosDesvios.some(n => n.status === 'suspenso') ? 'suspenso' : 'pendente',
    })
  }

  const nosRegulacao = nos.filter(n => ['beneficiarios', 'calculo'].includes(n.tipo))
  if (nosRegulacao.length > 0) {
    fases.push({
      id: 'regulacao',
      nome: 'Regulação',
      nos: nosRegulacao,
      status: nosRegulacao.every(n => n.status === 'concluido') ? 'concluido' : 
              nosRegulacao.some(n => n.status === 'em-andamento') ? 'em-andamento' : 
              nosRegulacao.some(n => n.status === 'suspenso') ? 'suspenso' : 'pendente',
    })
  }

  const nosConclusao = nos.filter(n => ['pagamento', 'encerramento'].includes(n.tipo))
  if (nosConclusao.length > 0) {
    fases.push({
      id: 'conclusao',
      nome: 'Conclusão',
      nos: nosConclusao,
      status: nosConclusao.every(n => n.status === 'concluido') ? 'concluido' : 
              nosConclusao.some(n => n.status === 'em-andamento') ? 'em-andamento' : 'pendente',
    })
  }

  return fases
}

function TimelineItem({ node, isLast }: { node: NoFluxo; isLast: boolean }) {
  const Icone = IconesPorTipo[node.tipo]
  const IconeExec = IconesExecutor[node.executor]
  const cores = CoresPorStatus[node.status]

  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col items-center shrink-0">
        <div className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center border z-10 bg-white',
          cores.border,
          node.status === 'em-andamento' && 'animate-pulse shadow-sm'
        )}>
          <Icone className={cn('w-3 h-3', cores.text)} />
        </div>
        {!isLast && (
          <div className={cn('w-0.5 flex-1 min-h-[20px]', cores.line, 'opacity-30')} />
        )}
      </div>

      <div className="flex-1 pb-2 min-w-0">
        <div 
          className={cn(
            'w-full text-left rounded-md border p-2 font-[Poppins]',
            cores.bg,
            cores.border,
          )}
        >
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                <h4 className={cn('font-semibold text-[10px]', cores.text)}>{node.titulo}</h4>
                <span className={cn(
                  'text-[8px] px-1 py-0.5 rounded-full flex items-center gap-0.5 shrink-0',
                  node.executor === 'agent' && 'bg-[#d3ebf3] text-[#0f4253]',
                  node.executor === 'humano' && 'bg-[#fee2e2] text-[#991b1b]',
                  node.executor === 'sistema' && 'bg-[#e5e5e5] text-[#707070]',
                  node.executor === 'externo' && 'bg-[#ede9fe] text-[#7c3aed]',
                )}>
                  <IconeExec className="w-2 h-2" />
                  <span>{LabelExecutor[node.executor]}</span>
                </span>
              </div>
              {node.descricao && (
                <p className="text-[9px] text-[#707070] truncate">{node.descricao}</p>
              )}
              <div className="flex items-center gap-2 mt-1 text-[8px] text-[#909090]">
                {node.dataInicio && <span>Início: {node.dataInicio.split(' ')[0]}</span>}
                {node.dataConclusao && <span className="text-[#10b981]">Fim: {node.dataConclusao.split(' ')[0]}</span>}
              </div>
            </div>
            <span className={cn(
              'px-1.5 py-0.5 text-[8px] rounded-full font-medium shrink-0',
              node.status === 'concluido' && 'bg-[#10b981] text-white',
              node.status === 'em-andamento' && 'bg-[#239dc5] text-white',
              node.status === 'pendente' && 'bg-[#909090] text-white',
              node.status === 'suspenso' && 'bg-[#f59e0b] text-white',
              node.status === 'erro' && 'bg-[#c3363d] text-white',
            )}>
              {node.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaseCard({ fase, isLast }: { fase: FaseTimeline; isLast: boolean }) {
  const cores = CoresPorStatus[fase.status]

  return (
    <div className="relative flex-shrink-0 font-['Poppins']">
      {!isLast && (
        <div className="absolute top-5 left-full w-6 h-0.5 z-0">
          <div className={cn(
            'w-full h-full rounded',
            cores.line,
            fase.status === 'concluido' ? 'opacity-100' : 'opacity-30'
          )} />
          <div className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0',
            'border-t-[3px] border-t-transparent',
            'border-b-[3px] border-b-transparent',
            'border-l-[5px]',
            fase.status === 'concluido' ? 'border-l-[#10b981]' : 'border-l-[#c4c4c4]'
          )} />
        </div>
      )}

      <div className={cn(
        'rounded-lg border overflow-hidden w-[200px]',
        cores.border,
        cores.bg
      )}>
        <div className="p-2 flex items-center gap-2 border-b border-inherit">
          <div className={cn(
            'w-5 h-5 rounded-full flex items-center justify-center',
            cores.dot,
            'text-white'
          )}>
            {fase.status === 'concluido' ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <span className="text-[9px] font-bold">{fase.nos.length}</span>
            )}
          </div>
          <div className="text-left">
            <h3 className={cn('font-semibold text-[11px]', cores.text)}>{fase.nome}</h3>
            <p className="text-[9px] text-[#909090]">{fase.nos.length} etapa(s)</p>
          </div>
        </div>

        <div className="px-2 py-2">
          {fase.nos.map((no, idx) => (
            <TimelineItem 
              key={no.id} 
              node={no} 
              isLast={idx === fase.nos.length - 1} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TimelineView({ fluxo, className }: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  
  const fases = useMemo(() => agruparNosPorFase(fluxo.nos), [fluxo.nos])

  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(z + 0.1, 1.5))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(z - 0.1, 0.5))
  }, [])

  const handleResetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 20, y: 20 })
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -0.08 : 0.08
    setZoom(z => Math.max(0.5, Math.min(1.5, z + delta)))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      setIsDragging(true)
    }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setDragStart(null)
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragStart(null)
      setIsDragging(false)
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  const timelineContent = (centered: boolean = false) => (
    <div 
      className={cn(
        "flex items-start gap-8 p-4 transition-transform duration-75",
        centered && "min-h-full min-w-full justify-center items-center"
      )}
      style={{ 
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: centered ? 'center center' : '0 0',
      }}
    >
      {fases.map((fase, idx) => (
        <FaseCard 
          key={fase.id} 
          fase={fase} 
          isLast={idx === fases.length - 1}
        />
      ))}
    </div>
  )

  return (
    <div className={cn('relative font-[Poppins]', className)}>
      {/* Controles */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-0.5 bg-white rounded shadow-sm p-0.5">
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-5 w-5" title="Zoom +">
          <ZoomIn className="h-3 w-3" />
        </Button>
        <span className="text-[8px] text-[var(--cinza-600)] font-medium w-7 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-5 w-5" title="Zoom -">
          <ZoomOut className="h-3 w-3" />
        </Button>
        <div className="w-px h-3 bg-[var(--cinza-200)]" />
        <Button variant="ghost" size="icon" onClick={handleResetView} className="h-5 w-5" title="Reset">
          <RotateCcw className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setModalAberto(true)} className="h-5 w-5" title="Expandir">
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Indicador arrastar */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-white/90 rounded shadow-sm px-1.5 py-0.5 text-[8px] text-[var(--cinza-600)]">
        <Move className="h-2.5 w-2.5" />
        <span>Arraste</span>
      </div>

      {/* Container com pan e zoom */}
      <div 
        ref={containerRef}
        className={cn(
          'bg-[var(--cinza-50)] rounded-lg h-full overflow-hidden',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {timelineContent(false)}
      </div>

      {/* Modal expandido */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="!max-w-[1200px] w-[1200px] h-[90vh] p-0 !rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">Timeline Expandida</DialogTitle>
          <div className="relative w-full h-full bg-[var(--cinza-50)] rounded-2xl">
            <div className="absolute top-3 left-3 z-20 flex items-center gap-0.5 bg-white rounded-lg shadow-md p-1 font-['Poppins']">
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-6 w-6">
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[9px] text-[var(--cinza-600)] font-medium w-8 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-6 w-6">
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <div className="w-px h-4 bg-[var(--cinza-200)]" />
              <Button variant="ghost" size="icon" onClick={handleResetView} className="h-6 w-6">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div 
              className={cn(
                'w-full h-full overflow-hidden flex items-center justify-center',
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              )}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {timelineContent(true)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
