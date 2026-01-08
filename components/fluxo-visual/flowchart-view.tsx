'use client'

import { useState } from 'react'
import { FlowCanvas } from './flow-canvas'
import { FlowNode } from './flow-node'
import { FlowConnections } from './flow-connections'
import { FluxoVisual, NoFluxo, NODE_WIDTH, NODE_HEIGHT } from '@/types/fluxo-visual'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Cpu, 
  User, 
  Settings, 
  ExternalLink, 
  FileText, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Pause,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FlowchartViewProps {
  fluxo: FluxoVisual
  className?: string
}

// Ícones de status
const IconesStatus = {
  'concluido': CheckCircle,
  'em-andamento': Clock,
  'pendente': Clock,
  'suspenso': Pause,
  'erro': XCircle,
}

// Ícones de executor
const IconesExecutor = {
  'agent': Cpu,
  'humano': User,
  'sistema': Settings,
  'externo': ExternalLink,
}

export function FlowchartView({ fluxo, className }: FlowchartViewProps) {
  const [noSelecionado, setNoSelecionado] = useState<NoFluxo | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  // Calcula as dimensões do canvas baseado nos nós
  const calcularDimensoesCanvas = () => {
    let maxX = 0
    let maxY = 0
    
    fluxo.nos.forEach(no => {
      const rightEdge = no.posicao.x + NODE_WIDTH + 40
      const bottomEdge = no.posicao.y + NODE_HEIGHT + 40
      if (rightEdge > maxX) maxX = rightEdge
      if (bottomEdge > maxY) maxY = bottomEdge
    })
    
    return {
      width: Math.max(400, maxX + 60),
      height: Math.max(600, maxY + 60),
    }
  }

  const dimensoes = calcularDimensoesCanvas()

  const handleNodeClick = (node: NoFluxo) => {
    setNoSelecionado(node)
    setDialogAberto(true)
  }

  const handleCloseDialog = () => {
    setDialogAberto(false)
    setTimeout(() => setNoSelecionado(null), 200)
  }

  const IconeStatus = noSelecionado ? IconesStatus[noSelecionado.status] : Clock
  const IconeExec = noSelecionado ? IconesExecutor[noSelecionado.executor] : User

  return (
    <>
      <FlowCanvas
        className={className}
        canvasWidth={dimensoes.width}
        canvasHeight={dimensoes.height}
        initialZoom={0.85}
        showMinimap={true}
      >
        {/* Conexões (atrás dos nós) */}
        <FlowConnections conexoes={fluxo.conexoes} nos={fluxo.nos} />
        
        {/* Nós */}
        {fluxo.nos.map((no) => (
          <FlowNode
            key={no.id}
            node={no}
            onClick={handleNodeClick}
            isSelected={noSelecionado?.id === no.id}
          />
        ))}
      </FlowCanvas>

      {/* Dialog de detalhes do nó */}
      <Dialog open={dialogAberto} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-sm font-['Poppins']">
          {noSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={cn(
                    'p-1.5 rounded-md',
                    noSelecionado.status === 'concluido' && 'bg-[#ecfdf5]',
                    noSelecionado.status === 'em-andamento' && 'bg-[#e9f5f9]',
                    noSelecionado.status === 'pendente' && 'bg-[#f5f5f5]',
                    noSelecionado.status === 'suspenso' && 'bg-[#fffbeb]',
                    noSelecionado.status === 'erro' && 'bg-[#fef2f2]',
                  )}>
                    <IconeStatus className={cn(
                      'w-4 h-4',
                      noSelecionado.status === 'concluido' && 'text-[#10b981]',
                      noSelecionado.status === 'em-andamento' && 'text-[#239dc5]',
                      noSelecionado.status === 'pendente' && 'text-[#909090]',
                      noSelecionado.status === 'suspenso' && 'text-[#f59e0b]',
                      noSelecionado.status === 'erro' && 'text-[#c3363d]',
                    )} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--cinza-900)]">
                      {noSelecionado.titulo}
                    </h3>
                    <p className="text-[10px] text-[var(--cinza-500)] font-normal">
                      {noSelecionado.tipo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 mt-3">
                {/* Status e Executor */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px]',
                    noSelecionado.status === 'concluido' && 'bg-[#ecfdf5] text-[#065f46]',
                    noSelecionado.status === 'em-andamento' && 'bg-[#e9f5f9] text-[#0f4253]',
                    noSelecionado.status === 'pendente' && 'bg-[#f5f5f5] text-[#707070]',
                    noSelecionado.status === 'suspenso' && 'bg-[#fffbeb] text-[#92400e]',
                    noSelecionado.status === 'erro' && 'bg-[#fef2f2] text-[#991b1b]',
                  )}>
                    <IconeStatus className="w-3 h-3" />
                    {noSelecionado.status.charAt(0).toUpperCase() + noSelecionado.status.slice(1).replace('-', ' ')}
                  </div>
                  
                  <div className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px]',
                    noSelecionado.executor === 'agent' && 'bg-[#e9f5f9] text-[#0f4253]',
                    noSelecionado.executor === 'humano' && 'bg-[#fef2f2] text-[#991b1b]',
                    noSelecionado.executor === 'sistema' && 'bg-[#f5f5f5] text-[#707070]',
                    noSelecionado.executor === 'externo' && 'bg-[#f5f3ff] text-[#7c3aed]',
                  )}>
                    <IconeExec className="w-3 h-3" />
                    {noSelecionado.executor.charAt(0).toUpperCase() + noSelecionado.executor.slice(1)}
                  </div>
                </div>

                {/* Descrição */}
                {noSelecionado.descricao && (
                  <div className="bg-[var(--cinza-50)] rounded-md p-2">
                    <p className="text-[11px] text-[var(--cinza-700)]">
                      {noSelecionado.descricao}
                    </p>
                  </div>
                )}

                {/* Datas */}
                <div className="grid grid-cols-2 gap-2">
                  {noSelecionado.dataInicio && (
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Calendar className="w-3 h-3 text-[var(--cinza-500)]" />
                      <div>
                        <p className="text-[var(--cinza-500)] text-[9px]">Início</p>
                        <p className="text-[var(--cinza-700)]">{noSelecionado.dataInicio}</p>
                      </div>
                    </div>
                  )}
                  {noSelecionado.dataConclusao && (
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <CheckCircle className="w-3 h-3 text-[#10b981]" />
                      <div>
                        <p className="text-[var(--cinza-500)] text-[9px]">Conclusão</p>
                        <p className="text-[#065f46]">{noSelecionado.dataConclusao}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documentos relacionados */}
                {noSelecionado.documentosRelacionados && noSelecionado.documentosRelacionados.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-medium text-[var(--cinza-700)] mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Documentos Relacionados
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {noSelecionado.documentosRelacionados.map((doc) => (
                        <span
                          key={doc}
                          className="px-1.5 py-0.5 bg-[#e9f5f9] text-[#0f4253] text-[9px] rounded"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadados */}
                {noSelecionado.metadata && (
                  <div className="border-t border-[var(--cinza-200)] pt-3 space-y-2">
                    {noSelecionado.metadata.valorReserva && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[var(--cinza-600)]">Valor da Reserva</span>
                        <span className="font-semibold text-[var(--cinza-900)]">
                          {noSelecionado.metadata.valorReserva.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    )}
                    
                    {noSelecionado.metadata.especialista && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[var(--cinza-600)]">Especialista</span>
                        <span className="font-medium text-[var(--cinza-900)]">
                          {noSelecionado.metadata.especialista}
                        </span>
                      </div>
                    )}
                    
                    {noSelecionado.metadata.confiancaAgente && (
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-[var(--cinza-600)]">Confiança do Agente</span>
                          <span className="font-medium text-[var(--azul-principal-600)]">
                            {noSelecionado.metadata.confiancaAgente}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-[var(--cinza-200)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--azul-principal-500)] rounded-full transition-all"
                            style={{ width: `${noSelecionado.metadata.confiancaAgente}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {noSelecionado.metadata.motivoSuspensao && (
                      <div className="bg-[#fffbeb] border border-[#f59e0b] rounded-md p-2">
                        <div className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-[#f59e0b] mt-0.5" />
                          <div>
                            <p className="text-[10px] font-medium text-[#92400e]">Motivo da Suspensão</p>
                            <p className="text-[10px] text-[#b45309]">{noSelecionado.metadata.motivoSuspensao}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {noSelecionado.metadata.documentosSolicitados && noSelecionado.metadata.documentosSolicitados.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-medium text-[var(--cinza-700)] mb-1">
                          Documentos Solicitados
                        </h4>
                        <ul className="space-y-0.5">
                          {noSelecionado.metadata.documentosSolicitados.map((doc, idx) => (
                            <li key={idx} className="text-[10px] text-[var(--cinza-600)] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[var(--amarelo-500)]" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {noSelecionado.metadata.parecer && (
                      <div className="bg-[#f5f5f5] rounded-md p-2">
                        <p className="text-[10px] font-medium text-[var(--cinza-700)] mb-0.5">Parecer</p>
                        <p className="text-[10px] text-[var(--cinza-600)] italic">
                          "{noSelecionado.metadata.parecer}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
