'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { HeaderApolice } from '@/components/layout/header-apolice'
import { useSinistro } from '@/providers/sinistro-context'
import { AgentBadge, HumanBadge } from '@/components/agent/agent-indicator'
import { 
  ChevronLeft, 
  User, 
  Cpu, 
  ChevronRight, 
  X, 
  Wrench, 
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Scale,
  Pause,
  Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TipoEventoFormal } from '@/types'

// Ícones para cada tipo de evento formal
const iconeEventoFormal: Record<TipoEventoFormal, typeof FileText> = {
  'aviso-aberto': FileText,
  'inicio-regulacao': Play,
  'beneficiario-cadastrado': User,
  'pagamento-gerado': CheckCircle2,
  'encerramento-formal': CheckCircle2,
  'reserva-alterada': AlertTriangle,
  'documento-solicitado': FileText,
  'documento-entregue': FileText,
  'sla-suspenso': Pause,
  'sla-retomado': Play,
  'pericia-enviada': User,
  'pericia-retornou': CheckCircle2,
  'processo-judicial-registrado': Scale,
}

// Labels para os tipos de evento
const labelEventoFormal: Record<TipoEventoFormal, string> = {
  'aviso-aberto': 'Aviso Aberto',
  'inicio-regulacao': 'Início Regulação',
  'beneficiario-cadastrado': 'Beneficiário Cadastrado',
  'pagamento-gerado': 'Pagamento Gerado',
  'encerramento-formal': 'Encerramento Formal',
  'reserva-alterada': 'Reserva Alterada',
  'documento-solicitado': 'Documento Solicitado',
  'documento-entregue': 'Documento Entregue',
  'sla-suspenso': 'SLA Suspenso',
  'sla-retomado': 'SLA Retomado',
  'pericia-enviada': 'Perícia Enviada',
  'pericia-retornou': 'Perícia Retornou',
  'processo-judicial-registrado': 'Processo Judicial',
}

export default function AcompanhamentoPage() {
  const params = useParams()
  const router = useRouter()
  const { sinistroAtual, selecionarSinistro, eventos, logFormal } = useSinistro()
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null)
  const [visualizacao, setVisualizacao] = useState<'timeline' | 'log-formal'>('timeline')

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

  const eventoAtual = eventos.find((e) => e.id === eventoSelecionado)

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[var(--cinza-900)] text-xl mb-1">Acompanhamento do Sinistro</h2>
                <p className="text-[var(--cinza-600)]">Historico completo das acoes e eventos</p>
              </div>

              {/* Tabs de visualizacao */}
              <div className="flex bg-[var(--cinza-100)] rounded-lg p-1">
                <button
                  onClick={() => setVisualizacao('timeline')}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    visualizacao === 'timeline'
                      ? 'bg-white text-[var(--cinza-900)] shadow-sm'
                      : 'text-[var(--cinza-600)] hover:text-[var(--cinza-900)]'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timeline
                  </span>
                </button>
                <button
                  onClick={() => setVisualizacao('log-formal')}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    visualizacao === 'log-formal'
                      ? 'bg-white text-[var(--cinza-900)] shadow-sm'
                      : 'text-[var(--cinza-600)] hover:text-[var(--cinza-900)]'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Log Formal
                  </span>
                </button>
              </div>
            </div>

            {/* Timeline View */}
            {visualizacao === 'timeline' && (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--cinza-200)]" />

                <div className="space-y-6">
                  {eventos.map((evento) => (
                    <div key={evento.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            evento.tipo === 'agent'
                              ? 'bg-[var(--azul-principal-500)]'
                              : evento.categoria === 'Pendente'
                              ? 'bg-[var(--cinza-300)]'
                              : 'bg-[var(--vermelho-400)]'
                          }`}
                        >
                          {evento.tipo === 'agent' ? (
                            <Cpu className="w-5 h-5 text-white" />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Event content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-white border border-[var(--cinza-200)] rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm text-[var(--cinza-500)]">{evento.data}</span>
                                <span className="text-sm text-[var(--cinza-400)]">-</span>
                                <span className="text-sm text-[var(--cinza-700)]">{evento.categoria}</span>
                                {evento.tipo === 'agent' && <AgentBadge />}
                              </div>
                              <div className="text-[var(--cinza-900)]">{evento.descricao}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-[var(--cinza-500)]">
                            {evento.tipo === 'agent' ? (
                              <span className="flex items-center gap-1">
                                <Cpu className="w-3 h-3" />
                                Executado automaticamente
                              </span>
                            ) : (
                              <HumanBadge autor={evento.autor} />
                            )}
                          </div>

                          {evento.tipo === 'agent' && evento.cadeiaRaciocinio && (
                            <div className="mt-3">
                              <button
                                onClick={() => setEventoSelecionado(evento.id)}
                                className="flex items-center gap-2 text-[var(--azul-principal-600)] hover:text-[var(--azul-principal-700)] text-sm"
                              >
                                <Cpu className="w-4 h-4" />
                                Ver cadeia de raciocínio do agente
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Log Formal View */}
            {visualizacao === 'log-formal' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--cinza-200)]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--cinza-600)]">Data/Hora</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--cinza-600)]">Ator</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--cinza-600)]">Evento</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--cinza-600)]">Descricao</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--cinza-600)]">Observacao</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logFormal.map((log) => {
                      const Icone = iconeEventoFormal[log.evento]
                      const isSystemEvent = log.ator === 'Sistema' || log.ator === 'Agente'
                      const isSLAEvent = log.evento === 'sla-suspenso' || log.evento === 'sla-retomado'
                      const isJudicialEvent = log.evento === 'processo-judicial-registrado'
                      
                      return (
                        <tr
                          key={log.id}
                          className={cn(
                            'border-b border-[var(--cinza-100)] hover:bg-[var(--cinza-50)]',
                            isSLAEvent && 'bg-[var(--amarelo-50)]',
                            isJudicialEvent && 'bg-[var(--vermelho-50)]'
                          )}
                        >
                          <td className="py-3 px-4 text-sm text-[var(--cinza-600)]">{log.data}</td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2 py-1 rounded text-xs',
                              isSystemEvent ? 'bg-[var(--azul-principal-100)] text-[var(--azul-principal-700)]' : 'bg-[var(--cinza-100)] text-[var(--cinza-700)]'
                            )}>
                              {isSystemEvent ? <Cpu className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {log.ator}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2 py-1 rounded text-xs',
                              isSLAEvent && log.evento === 'sla-suspenso' && 'bg-[var(--amarelo-200)] text-[var(--amarelo-800)]',
                              isSLAEvent && log.evento === 'sla-retomado' && 'bg-[var(--verde-200)] text-[var(--verde-800)]',
                              isJudicialEvent && 'bg-[var(--vermelho-200)] text-[var(--vermelho-800)]',
                              !isSLAEvent && !isJudicialEvent && 'bg-[var(--cinza-200)] text-[var(--cinza-800)]'
                            )}>
                              <Icone className="w-3 h-3" />
                              {labelEventoFormal[log.evento]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[var(--cinza-900)]">{log.descricao}</td>
                          <td className="py-3 px-4 text-sm text-[var(--cinza-500)]">{log.observacao || '-'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal - Cadeia de Raciocinio */}
      {eventoSelecionado && eventoAtual?.cadeiaRaciocinio && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--cinza-200)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--azul-principal-500)] rounded-full flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[var(--cinza-800)] text-lg">Cadeia de Raciocinio do Agente</h3>
                  <p className="text-sm text-[var(--cinza-500)]">
                    {eventoAtual.descricao} - {eventoAtual.data}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEventoSelecionado(null)}
                className="p-2 hover:bg-[var(--cinza-100)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--cinza-600)]" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="bg-[var(--azul-principal-50)] border border-[var(--azul-principal-300)] rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--azul-principal-600)] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[var(--cinza-800)] mb-1">Acao Executada</div>
                    <div className="text-[var(--azul-principal-600)]">{eventoAtual.descricao}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {eventoAtual.cadeiaRaciocinio.map((passo, index) => (
                  <div key={passo.id} className="border-l-2 border-[var(--azul-principal-200)] pl-4">
                    <div className="flex items-start gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          passo.tipo === 'raciocinio'
                            ? 'bg-[var(--cinza-600)]'
                            : passo.tipo === 'ferramenta'
                            ? 'bg-[var(--azul-principal-500)]'
                            : 'bg-[var(--verde-500)]'
                        }`}
                      >
                        {passo.tipo === 'raciocinio' ? (
                          <span className="text-white text-xs">{index + 1}</span>
                        ) : passo.tipo === 'ferramenta' ? (
                          <Wrench className="w-3 h-3 text-white" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-[var(--cinza-800)] mb-1 capitalize">{passo.tipo}</div>
                        <div className="text-sm text-[var(--cinza-500)] mb-2">{passo.timestamp}</div>

                        {passo.tipo === 'ferramenta' && passo.ferramenta ? (
                          <div className="bg-[var(--cinza-50)] rounded p-3 font-mono text-xs">
                            <div className="text-[var(--azul-principal-600)] mb-1">{passo.ferramenta}</div>
                            <div className="text-[var(--cinza-600)]">
                              {JSON.stringify(passo.parametros, null, 2)}
                            </div>
                          </div>
                        ) : passo.tipo === 'resultado' ? (
                          <div className="bg-[var(--verde-50)] border border-[var(--verde-200)] rounded p-3 text-sm">
                            <div className="text-[var(--cinza-800)]">{passo.conteudo}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-[var(--cinza-600)]">{passo.conteudo}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
