'use client'

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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NoFluxo, TipoNoFluxo, StatusNoFluxo, ExecutorNo, NODE_WIDTH, NODE_HEIGHT } from '@/types/fluxo-visual'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FlowNodeProps {
  node: NoFluxo
  onClick?: (node: NoFluxo) => void
  isSelected?: boolean
}

// Mapeamento de ícones por tipo de nó
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

// Labels dos tipos
const LabelTipo: Record<TipoNoFluxo, string> = {
  'comunicado': 'Comunicado de Sinistro',
  'aviso': 'Aviso de Sinistro',
  'reserva': 'Constituição de Reserva',
  'analise-documental': 'Análise Documental',
  'validacao-cobertura': 'Validação de Cobertura',
  'beneficiarios': 'Cadastro de Beneficiários',
  'calculo': 'Cálculo de Indenização',
  'pagamento': 'Autorização de Pagamento',
  'encerramento': 'Encerramento do Sinistro',
  'solicitacao-docs': 'Solicitação de Documentos',
  'pericia': 'Perícia / Especialista',
  'validacao-seguranca': 'Validação de Segurança',
  'recurso': 'Recurso / Contestação',
  'retorno-pericia': 'Retorno da Perícia',
}

// Cores por status
const CoresPorStatus: Record<StatusNoFluxo, { bg: string; border: string; icon: string; text: string }> = {
  'concluido': { 
    bg: 'bg-[#ecfdf5]', 
    border: 'border-[#10b981]', 
    icon: 'text-[#10b981]',
    text: 'text-[#065f46]'
  },
  'em-andamento': { 
    bg: 'bg-[#e9f5f9]', 
    border: 'border-[#239dc5]', 
    icon: 'text-[#239dc5]',
    text: 'text-[#0f4253]'
  },
  'pendente': { 
    bg: 'bg-[#f5f5f5]', 
    border: 'border-[#c4c4c4]', 
    icon: 'text-[#909090]',
    text: 'text-[#707070]'
  },
  'suspenso': { 
    bg: 'bg-[#fffbeb]', 
    border: 'border-[#f59e0b]', 
    icon: 'text-[#f59e0b]',
    text: 'text-[#92400e]'
  },
  'erro': { 
    bg: 'bg-[#fef2f2]', 
    border: 'border-[#c3363d]', 
    icon: 'text-[#c3363d]',
    text: 'text-[#991b1b]'
  },
}

// Labels de status
const LabelStatus: Record<StatusNoFluxo, string> = {
  'concluido': 'Concluído',
  'em-andamento': 'Em Andamento',
  'pendente': 'Pendente',
  'suspenso': 'Suspenso',
  'erro': 'Erro',
}

// Ícones de executor
const IconeExecutor: Record<ExecutorNo, React.ElementType> = {
  'agent': Cpu,
  'humano': User,
  'sistema': Settings,
  'externo': ExternalLink,
}

// Labels de executor
const LabelExecutor: Record<ExecutorNo, string> = {
  'agent': 'Agente IA',
  'humano': 'Humano',
  'sistema': 'Sistema',
  'externo': 'Externo',
}

export function FlowNode({ node, onClick, isSelected }: FlowNodeProps) {
  const Icone = IconesPorTipo[node.tipo]
  const cores = CoresPorStatus[node.status]
  const IconeExec = IconeExecutor[node.executor]

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(node)
  }

  // Conteúdo do tooltip
  const tooltipContent = (
    <div className="space-y-1.5 max-w-[220px] font-['Poppins']">
      <div>
        <p className="font-semibold text-[11px]">{node.titulo}</p>
        <p className="text-[10px] text-gray-400">{LabelTipo[node.tipo]}</p>
      </div>
      {node.descricao && (
        <p className="text-[10px]">{node.descricao}</p>
      )}
      <div className="flex items-center gap-2 text-[10px]">
        <span className={cn(
          'px-1 py-0.5 rounded text-[9px]',
          node.status === 'concluido' && 'bg-green-900/50 text-green-300',
          node.status === 'em-andamento' && 'bg-blue-900/50 text-blue-300',
          node.status === 'pendente' && 'bg-gray-700 text-gray-300',
          node.status === 'suspenso' && 'bg-yellow-900/50 text-yellow-300',
          node.status === 'erro' && 'bg-red-900/50 text-red-300',
        )}>
          {LabelStatus[node.status]}
        </span>
        <span className="flex items-center gap-0.5">
          <IconeExec className="w-2.5 h-2.5" />
          <span className="text-[9px]">{LabelExecutor[node.executor]}</span>
        </span>
      </div>
      {node.dataInicio && (
        <div className="text-[9px] text-gray-400">
          <span>Início: {node.dataInicio}</span>
          {node.dataConclusao && <span> → Fim: {node.dataConclusao}</span>}
        </div>
      )}
      {node.metadata?.motivoSuspensao && (
        <p className="text-[9px] text-yellow-400">⚠️ {node.metadata.motivoSuspensao}</p>
      )}
      <p className="text-[9px] text-gray-500 italic">Clique para detalhes</p>
    </div>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={handleClick}
          className={cn(
            'absolute rounded-md border-2 cursor-pointer transition-all duration-200 bg-white font-[Poppins]',
            'hover:shadow-md hover:scale-[1.02]',
            cores.border,
            isSelected && 'ring-2 ring-[#239dc5] ring-offset-1',
            node.status === 'em-andamento' && 'shadow-sm'
          )}
          style={{
            left: node.posicao.x,
            top: node.posicao.y,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
          }}
        >
          {/* Indicador de status animado */}
          {node.status === 'em-andamento' && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#239dc5] animate-ping" />
          )}

          <div className={cn('p-1.5 h-full flex flex-col rounded-sm', cores.bg)}>
            {/* Header */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className={cn('p-1 rounded bg-white/60')}>
                <Icone className={cn('w-3 h-3', cores.icon)} />
              </div>
              <h4 className={cn('text-[10px] font-semibold leading-tight flex-1 truncate', cores.text)}>
                {node.titulo}
              </h4>
              <div className={cn(
                'flex items-center p-0.5 rounded-full',
                node.executor === 'agent' ? 'bg-[#d3ebf3] text-[#0f4253]' :
                node.executor === 'humano' ? 'bg-[#fee2e2] text-[#991b1b]' :
                node.executor === 'externo' ? 'bg-[#ede9fe] text-[#7c3aed]' :
                'bg-[#e5e5e5] text-[#707070]'
              )}>
                <IconeExec className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Descrição */}
            {node.descricao && (
              <p className="text-[9px] text-[#707070] truncate leading-tight">
                {node.descricao}
              </p>
            )}

            {/* Datas */}
            <div className="mt-auto flex items-center justify-between text-[8px] text-[#909090]">
              <span>{node.dataInicio ? node.dataInicio.split(' ')[0] : '-'}</span>
              {node.dataConclusao && (
                <span className="text-[#10b981]">✓</span>
              )}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-[#1a1a2e] border-[#2a2a4e] text-white">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  )
}

// Versão mini para o minimap
export function FlowNodeMini({ node }: { node: NoFluxo }) {
  const cores = CoresPorStatus[node.status]
  
  return (
    <div
      className={cn('absolute rounded-sm', cores.bg)}
      style={{
        left: node.posicao.x * 0.1,
        top: node.posicao.y * 0.1,
        width: NODE_WIDTH * 0.1,
        height: NODE_HEIGHT * 0.1,
      }}
    />
  )
}
