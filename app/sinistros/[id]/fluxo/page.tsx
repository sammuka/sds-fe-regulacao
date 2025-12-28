'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { HeaderApolice } from '@/components/layout/header-apolice'
import { useSinistro } from '@/providers/sinistro-context'
import { ChevronLeft, Check, Clock, Circle, Cpu, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FluxoJornadaPage() {
  const params = useParams()
  const router = useRouter()
  const { sinistroAtual, selecionarSinistro, etapasFluxo } = useSinistro()

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      selecionarSinistro(params.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  if (!sinistroAtual) {
    return (
      <div className="min-h-screen bg-[var(--cinza-50)] flex items-center justify-center">
        <div className="text-[var(--cinza-500)]">Carregando...</div>
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida':
        return <Check className="w-5 h-5" />
      case 'em-andamento':
        return <Clock className="w-5 h-5" />
      default:
        return <Circle className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-[var(--verde-500)] text-white border-[var(--verde-500)]'
      case 'em-andamento':
        return 'bg-[var(--azul-principal-500)] text-white border-[var(--azul-principal-500)] animate-pulse'
      default:
        return 'bg-[var(--cinza-100)] text-[var(--cinza-400)] border-[var(--cinza-300)]'
    }
  }

  const getLineColor = (status: string, nextStatus: string) => {
    if (status === 'concluida') return 'bg-[var(--verde-500)]'
    if (status === 'em-andamento') return 'bg-[var(--azul-principal-300)]'
    return 'bg-[var(--cinza-300)]'
  }

  return (
    <div className="min-h-screen bg-[var(--cinza-50)]">
      <TopBar sinistroNumero={sinistroAtual.id} />
      <HeaderApolice apolice={apolice} sla={sinistroAtual.sla} />

      <main className="pt-[168px] px-4 pb-8">
        <div className="w-full max-w-[1200px] mx-auto">
          <button
            onClick={() => router.push(`/sinistros/${sinistroAtual.id}`)}
            className="flex items-center gap-2 text-[var(--cinza-600)] hover:text-[var(--cinza-900)] my-4 font-['Poppins']"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-8">
              <h2 className="text-[var(--cinza-900)] text-xl mb-1">Fluxo Visual da Jornada</h2>
              <p className="text-[var(--cinza-600)]">
                Visualizacao dinamica das etapas do processo de regulacao
              </p>
            </div>

            {/* Fluxo Visual */}
            <div className="flex flex-col items-center">
              {etapasFluxo.map((etapa, index) => (
                <div key={etapa.id} className="flex flex-col items-center w-full max-w-md">
                  {/* Card da Etapa */}
                  <div
                    className={cn(
                      'w-full border-2 rounded-lg p-4 transition-all',
                      etapa.status === 'concluida' && 'border-[var(--verde-500)] bg-[var(--verde-50)]',
                      etapa.status === 'em-andamento' && 'border-[var(--azul-principal-500)] bg-[var(--azul-principal-50)] shadow-lg',
                      etapa.status === 'pendente' && 'border-[var(--cinza-300)] bg-[var(--cinza-50)]'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Ícone de status */}
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center border-2',
                          getStatusColor(etapa.status)
                        )}
                      >
                        {getStatusIcon(etapa.status)}
                      </div>

                      {/* Informacoes */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[var(--cinza-900)] font-medium">{etapa.nome}</span>
                          {etapa.executadoPorAgente && (
                            <span className="px-2 py-0.5 bg-[var(--azul-principal-500)] text-white rounded text-xs flex items-center gap-1">
                              <Cpu className="w-3 h-3" />
                              Agent
                            </span>
                          )}
                          {etapa.aguardandoValidacao && (
                            <span className="px-2 py-0.5 bg-[var(--amarelo-500)] text-white rounded text-xs">
                              Aguardando Validacao
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[var(--cinza-600)]">
                          {etapa.dataInicio && (
                            <span>Inicio: {etapa.dataInicio}</span>
                          )}
                          {etapa.dataConclusao && (
                            <span className="text-[var(--verde-600)]">
                              Conclusao: {etapa.dataConclusao}
                            </span>
                          )}
                        </div>

                        {/* Indicador de executor */}
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {etapa.executadoPorAgente ? (
                            <span className="flex items-center gap-1 text-[var(--azul-principal-500)]">
                              <Cpu className="w-3 h-3" />
                              Executado automaticamente pelo agente
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[var(--vermelho-400)]">
                              <User className="w-3 h-3" />
                              Acao humana necessaria
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Numero da etapa */}
                      <div className="text-2xl font-bold text-[var(--cinza-200)]">{etapa.numero}</div>
                    </div>
                  </div>

                  {/* Linha conectora */}
                  {index < etapasFluxo.length - 1 && (
                    <div
                      className={cn(
                        'w-1 h-8',
                        getLineColor(
                          etapa.status,
                          etapasFluxo[index + 1]?.status || 'pendente'
                        )
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Legenda */}
            <div className="mt-8 pt-6 border-t border-[var(--cinza-200)]">
              <h3 className="text-[var(--cinza-700)] font-medium mb-3">Legenda</h3>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[var(--verde-500)]" />
                  <span className="text-sm text-[var(--cinza-600)]">Concluida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[var(--azul-principal-500)] animate-pulse" />
                  <span className="text-sm text-[var(--cinza-600)]">Em andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[var(--cinza-300)]" />
                  <span className="text-sm text-[var(--cinza-600)]">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--azul-principal-500)]" />
                  <span className="text-sm text-[var(--cinza-600)]">Executado pelo Agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--vermelho-400)]" />
                  <span className="text-sm text-[var(--cinza-600)]">Acao humana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

