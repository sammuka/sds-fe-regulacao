'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { HeaderApolice } from '@/components/layout/header-apolice'
import { StepperAnalista, StepperProgress } from '@/components/stepper/stepper-analista'
import { EtapaAberturaAviso } from '@/components/sinistro/etapa-abertura-aviso'
import { EtapaDadosSegurado } from '@/components/sinistro/etapa-dados-segurado'
import { EtapaCoberturas } from '@/components/sinistro/etapa-coberturas'
import { EtapaBeneficiarios } from '@/components/sinistro/etapa-beneficiarios'
import { EtapaPagamentos } from '@/components/sinistro/etapa-pagamentos'
import { useSinistro } from '@/providers/sinistro-context'
import { ChevronLeft } from 'lucide-react'

export default function DetalheSinistroPage() {
  const params = useParams()
  const router = useRouter()
  const { sinistroAtual, selecionarSinistro, estadoStepper, setEtapaStepper, completarEtapa } = useSinistro()

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      selecionarSinistro(params.id)
    }
  }, [params.id, selecionarSinistro])

  if (!sinistroAtual) {
    return (
      <div className="min-h-screen bg-[var(--cinza-50)] flex items-center justify-center">
        <div className="text-[var(--cinza-500)]">Carregando sinistro...</div>
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

  const handleProximaEtapa = () => {
    completarEtapa(estadoStepper.etapaAtual)
    if (estadoStepper.etapaAtual < 4) {
      setEtapaStepper((estadoStepper.etapaAtual + 1) as 0 | 1 | 2 | 3 | 4)
    }
  }

  const handleEtapaAnterior = () => {
    if (estadoStepper.etapaAtual > 0) {
      setEtapaStepper((estadoStepper.etapaAtual - 1) as 0 | 1 | 2 | 3 | 4)
    }
  }

  const renderEtapa = () => {
    switch (estadoStepper.etapaAtual) {
      case 0:
        return <EtapaAberturaAviso />
      case 1:
        return <EtapaDadosSegurado sinistro={sinistroAtual} />
      case 2:
        return <EtapaCoberturas />
      case 3:
        return <EtapaBeneficiarios />
      case 4:
        return <EtapaPagamentos />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cinza-100)]">
      <TopBar sinistroNumero={sinistroAtual.id} />
      <HeaderApolice apolice={apolice} sla={sinistroAtual.sla} />

      {/* Espaçador para os headers fixos */}
      <main className="pt-[168px] px-4 pb-8">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Botão voltar */}
          <button
            onClick={() => router.push('/sinistros')}
            className="flex items-center gap-2 text-[var(--cinza-600)] hover:text-[var(--cinza-900)] my-4 font-['Poppins']"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar para a fila
          </button>

          {/* Progresso */}
          <StepperProgress
            etapaAtual={estadoStepper.etapaAtual}
            etapasCompletas={estadoStepper.etapasCompletas}
          />

          {/* Stepper */}
          <StepperAnalista className="mb-6" />

          {/* Conteúdo da etapa */}
          {renderEtapa()}

          {/* Navegação */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleEtapaAnterior}
              disabled={estadoStepper.etapaAtual === 0}
              className="sds-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <button
              onClick={handleProximaEtapa}
              disabled={estadoStepper.etapaAtual === 4}
              className="sds-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {estadoStepper.etapaAtual === 4 ? 'Concluir Regulação' : 'Próxima'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
