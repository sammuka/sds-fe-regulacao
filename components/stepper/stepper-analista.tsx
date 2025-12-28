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
    <div className={cn('bg-white rounded-lg shadow-sm', className)}>
      <div className="flex items-center border-b border-gray-200 overflow-x-auto">
        {ETAPAS_STEPPER.map((etapa) => {
          const Icon = iconMap[etapa.numero]
          const isCompleted = estadoStepper.etapasCompletas.includes(etapa.numero)
          const isCurrent = etapa.numero === estadoStepper.etapaAtual
          const isBlocked = estadoStepper.etapasBloqueadas.includes(etapa.numero)
          const canNavigate = !isBlocked || podeAvancar(etapa.numero)

          return (
            <div key={etapa.numero} className="flex-1 min-w-[140px]">
              <button
                onClick={() => canNavigate && setEtapaStepper(etapa.numero)}
                disabled={isBlocked && !canNavigate}
                className={cn(
                  'w-full px-4 py-4 flex items-center gap-3 transition-colors',
                  isCurrent && 'bg-[#1CB5C8]/10 border-b-2 border-[#1CB5C8]',
                  isCompleted && !isCurrent && 'bg-green-50',
                  !isCurrent && !isCompleted && !isBlocked && 'hover:bg-gray-50',
                  isBlocked && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && !isCompleted && 'bg-[#1CB5C8] text-white',
                    !isCurrent && !isCompleted && !isBlocked && 'bg-gray-200 text-gray-600',
                    isBlocked && 'bg-gray-100 text-gray-400'
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
                      isCurrent && 'text-[#1CB5C8]',
                      isBlocked && 'text-gray-400',
                      !isCurrent && !isBlocked && 'text-gray-600'
                    )}
                  >
                    Etapa {etapa.numero}
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      isCurrent && 'text-gray-900',
                      isBlocked && 'text-gray-400',
                      !isCurrent && !isBlocked && 'text-gray-700'
                    )}
                  >
                    {etapa.nome}
                  </div>
                </div>
              </button>
            </div>
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
        <span className="text-sm text-gray-600">
          Etapa {etapaAtual} de {totalEtapas - 1}
        </span>
        <span className="text-sm text-gray-600">
          {Math.round(progresso)}% concluído
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1CB5C8] to-[#5c6bc0] rounded-full transition-all duration-300"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  )
}
