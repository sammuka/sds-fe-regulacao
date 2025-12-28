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
  }, [params.id, selecionarSinistro])

  if (!sinistroAtual) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
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
        return 'bg-green-500 text-white border-green-500'
      case 'em-andamento':
        return 'bg-blue-500 text-white border-blue-500 animate-pulse'
      default:
        return 'bg-gray-100 text-gray-400 border-gray-300'
    }
  }

  const getLineColor = (status: string, nextStatus: string) => {
    if (status === 'concluida') return 'bg-green-500'
    if (status === 'em-andamento') return 'bg-gradient-to-b from-blue-500 to-gray-300'
    return 'bg-gray-300'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar sinistroNumero={sinistroAtual.id} />
      <HeaderApolice apolice={apolice} sla={sinistroAtual.sla} />

      <main className="pt-[168px] px-4 pb-8">
        <div className="w-full max-w-[1200px] mx-auto">
          <button
            onClick={() => router.push(`/sinistros/${sinistroAtual.id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 my-4 font-['Poppins']"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-8">
              <h2 className="text-gray-900 text-xl mb-1">Fluxo Visual da Jornada</h2>
              <p className="text-gray-600">
                Visualização dinâmica das etapas do processo de regulação
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
                      etapa.status === 'concluida' && 'border-green-500 bg-green-50',
                      etapa.status === 'em-andamento' && 'border-blue-500 bg-blue-50 shadow-lg',
                      etapa.status === 'pendente' && 'border-gray-300 bg-gray-50'
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

                      {/* Informações */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900 font-medium">{etapa.nome}</span>
                          {etapa.executadoPorAgente && (
                            <span className="px-2 py-0.5 bg-[#1CB5C8] text-white rounded text-xs flex items-center gap-1">
                              <Cpu className="w-3 h-3" />
                              Agent
                            </span>
                          )}
                          {etapa.aguardandoValidacao && (
                            <span className="px-2 py-0.5 bg-yellow-500 text-white rounded text-xs">
                              Aguardando Validação
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {etapa.dataInicio && (
                            <span>Início: {etapa.dataInicio}</span>
                          )}
                          {etapa.dataConclusao && (
                            <span className="text-green-600">
                              Conclusão: {etapa.dataConclusao}
                            </span>
                          )}
                        </div>

                        {/* Indicador de executor */}
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {etapa.executadoPorAgente ? (
                            <span className="flex items-center gap-1 text-[#1CB5C8]">
                              <Cpu className="w-3 h-3" />
                              Executado automaticamente pelo agente
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-pink-500">
                              <User className="w-3 h-3" />
                              Ação humana necessária
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Número da etapa */}
                      <div className="text-2xl font-bold text-gray-200">{etapa.numero}</div>
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
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-gray-700 font-medium mb-3">Legenda</h3>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Concluída</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm text-gray-600">Em andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                  <span className="text-sm text-gray-600">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#1CB5C8]" />
                  <span className="text-sm text-gray-600">Executado pelo Agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" />
                  <span className="text-sm text-gray-600">Ação humana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

