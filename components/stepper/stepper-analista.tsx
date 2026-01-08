'use client'

import { Users, FileText, DollarSign, Check, Lock, ClipboardList, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EtapaStepper, ETAPAS_STEPPER } from '@/types'
import { useSinistro } from '@/providers/sinistro-context'

const iconMap: Record<EtapaStepper, typeof Users> = {
  0: ClipboardList, // Abertura do Aviso
  1: Users,         // Dados do Segurado
  2: Shield,        // Coberturas da Apólice
  3: Users,         // Beneficiários
  4: DollarSign,    // Pagamentos
}

interface StepperAnalistaProps {
  className?: string
}

export function StepperAnalista({ className }: StepperAnalistaProps) {
  const { estadoStepper, setEtapaStepper, podeAvancar } = useSinistro()

  return (
    <div className={cn('bg-[var(--cinza-50)] overflow-hidden', className)}>
      <div className="flex items-stretch overflow-x-auto">
        {ETAPAS_STEPPER.map((etapa, index) => {
          const Icon = iconMap[etapa.numero]
          const isCompleted = estadoStepper.etapasCompletas.includes(etapa.numero)
          const isCurrent = etapa.numero === estadoStepper.etapaAtual
          const isBlocked = estadoStepper.etapasBloqueadas.includes(etapa.numero)
          const canNavigate = !isBlocked || podeAvancar(etapa.numero)
          const isFirst = index === 0
          const isLast = index === ETAPAS_STEPPER.length - 1

          return (
            <button
              key={etapa.numero}
              onClick={() => canNavigate && setEtapaStepper(etapa.numero)}
              disabled={isBlocked && !canNavigate}
              className={cn(
                'flex-1 min-w-[140px] py-4 flex items-center gap-3 transition-colors border-r border-[var(--cinza-200)] last:border-r-0',
                isFirst ? 'pl-6 pr-4' : isLast ? 'pl-4 pr-6' : 'px-4',
                isCurrent && 'bg-[var(--azul-principal-50)] border-b-2 border-[var(--azul-principal-500)]',
                isCompleted && !isCurrent && 'bg-[var(--verde-50)]',
                !isCurrent && !isCompleted && !isBlocked && 'hover:bg-[var(--cinza-50)]',
                isBlocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  isCompleted && 'bg-[var(--verde-500)] text-white',
                  isCurrent && !isCompleted && 'bg-[var(--azul-principal-500)] text-white',
                  !isCurrent && !isCompleted && !isBlocked && 'bg-[var(--cinza-200)] text-[var(--cinza-600)]',
                  isBlocked && 'bg-[var(--cinza-100)] text-[var(--cinza-400)]'
                )}
              >
                {isBlocked ? (
                  <Lock className="w-4 h-4" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="text-left">
                <div
                  className={cn(
                    'text-sm',
                    isCurrent && 'text-[var(--azul-principal-500)]',
                    isBlocked && 'text-[var(--cinza-400)]',
                    !isCurrent && !isBlocked && 'text-[var(--cinza-600)]'
                  )}
                >
                  Etapa {etapa.numero + 1}
                </div>
                <div
                  className={cn(
                    'text-sm font-medium',
                    isCurrent && 'text-[var(--cinza-900)]',
                    isBlocked && 'text-[var(--cinza-400)]',
                    !isCurrent && !isBlocked && 'text-[var(--cinza-700)]'
                  )}
                >
                  {etapa.nome}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface StepperProgressProps {
  etapaAtual: EtapaStepper
  etapasCompletas: EtapaStepper[]
}

export function StepperProgress({ etapaAtual, etapasCompletas }: StepperProgressProps) {
  const totalEtapas = ETAPAS_STEPPER.length
  const progresso = ((etapasCompletas.length + (etapaAtual > 0 ? 0.5 : 0)) / totalEtapas) * 100

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--cinza-600)]">
          Etapa {etapaAtual + 1} de {totalEtapas}
        </span>
        <span className="text-sm text-[var(--cinza-600)]">
          {Math.round(progresso)}% concluído
        </span>
      </div>
      <div className="h-2 bg-[var(--cinza-200)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--azul-principal-500)] rounded-full transition-all duration-300"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  )
}
