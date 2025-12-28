'use client'

import { Check, Cpu, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type IndicatorType = 'validated' | 'analyzing' | 'suggested' | 'calculated' | 'processed'

interface AgentIndicatorProps {
  type: IndicatorType
  label?: string
  className?: string
}

const indicatorConfig: Record<IndicatorType, { icon: typeof Check; label: string; className: string }> = {
  validated: {
    icon: Check,
    label: 'Validado pelo Agente',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  analyzing: {
    icon: Cpu,
    label: 'Analisando...',
    className: 'bg-blue-100 text-blue-700 border-blue-200 agent-indicator',
  },
  suggested: {
    icon: AlertCircle,
    label: 'Sugerido pelo Agente',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  calculated: {
    icon: Check,
    label: 'Calculado pelo Agente',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  processed: {
    icon: Check,
    label: 'Processado pelo Agente',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
}

export function AgentIndicator({ type, label, className }: AgentIndicatorProps) {
  const config = indicatorConfig[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label || config.label}
    </span>
  )
}

interface AgentBadgeProps {
  className?: string
}

export function AgentBadge({ className }: AgentBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 bg-[#1CB5C8] text-white rounded text-xs',
        className
      )}
    >
      <Cpu className="w-3 h-3" />
      Agent
    </span>
  )
}

interface HumanBadgeProps {
  autor: string
  className?: string
}

export function HumanBadge({ autor, className }: HumanBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs text-gray-600',
        className
      )}
    >
      <span className="w-2 h-2 bg-pink-500 rounded-full" />
      {autor}
    </span>
  )
}

