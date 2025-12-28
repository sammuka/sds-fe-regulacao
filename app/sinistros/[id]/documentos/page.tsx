'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { HeaderApolice } from '@/components/layout/header-apolice'
import { useSinistro } from '@/providers/sinistro-context'
import { AgentIndicator, AgentBadge } from '@/components/agent/agent-indicator'
import { 
  ChevronLeft, 
  FileText, 
  Check, 
  Clock, 
  ExternalLink, 
  Upload, 
  Cpu,
  AlertTriangle,
  Pause,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DocumentosPage() {
  const params = useParams()
  const router = useRouter()
  const { sinistroAtual, selecionarSinistro, documentos } = useSinistro()

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

  // Verifica se há documentos pendentes que suspendem o SLA
  const documentosPendentes = documentos.filter(d => d.status === 'solicitado')
  const temPendenciaSLA = documentosPendentes.some(d => d.suspendeSLA)

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
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-gray-900 text-xl mb-1">Documentos do Sinistro</h2>
                <p className="text-gray-600">{documentos.length} documentos no processo</p>
              </div>
              <button className="px-4 py-2 bg-[#1CB5C8] text-white rounded-lg hover:bg-[#17a2b3] flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload de Documento
              </button>
            </div>

            {/* Banner de SLA Suspenso */}
            {temPendenciaSLA && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-3">
                <Pause className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-yellow-800 font-medium">SLA Suspenso por Pendência Documental</div>
                  <p className="text-sm text-yellow-700 mt-1">
                    O prazo regulatório está suspenso aguardando a entrega de {documentosPendentes.length} documento(s) solicitado(s).
                    O SLA será retomado automaticamente após a entrega.
                  </p>
                </div>
              </div>
            )}

            {/* Lista de Documentos */}
            <div className="space-y-4">
              {documentos.map((doc) => {
                const statusConfig = {
                  analisado: { bg: 'bg-green-100', text: 'text-green-700', icon: Check, label: 'Analisado' },
                  pendente: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pendente' },
                  solicitado: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Send, label: 'Solicitado' },
                  entregue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Check, label: 'Entregue' },
                  rejeitado: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertTriangle, label: 'Rejeitado' },
                }
                const config = statusConfig[doc.status]
                const StatusIcon = config.icon

                return (
                  <div
                    key={doc.id}
                    className={cn(
                      'border rounded-lg p-4 hover:shadow-md transition-shadow',
                      doc.status === 'solicitado' && 'border-orange-300 bg-orange-50',
                      doc.status !== 'solicitado' && 'border-gray-200'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-gray-500" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-gray-900 font-medium">{doc.nome}</span>
                              <span className="text-sm text-gray-500">{doc.tipo}</span>
                            </div>
                          </div>
                          <span className={cn(
                            'px-2 py-1 rounded text-xs flex items-center gap-1',
                            config.bg,
                            config.text
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>

                        {/* Informações de data */}
                        <div className="text-sm text-gray-600 mb-2 space-y-1">
                          {doc.dataUpload && (
                            <div>Enviado em: {doc.dataUpload}</div>
                          )}
                          {doc.dataSolicitacao && (
                            <div className="text-orange-700">
                              Solicitado em: {doc.dataSolicitacao}
                              {doc.prazoSugerido && ` • Prazo: ${doc.prazoSugerido}`}
                            </div>
                          )}
                          {doc.dataEntrega && (
                            <div className="text-green-700">Entregue em: {doc.dataEntrega}</div>
                          )}
                          {doc.suspendeSLA && doc.status === 'solicitado' && (
                            <div className="flex items-center gap-1 text-yellow-700">
                              <Pause className="w-3 h-3" />
                              Este documento suspende o SLA
                            </div>
                          )}
                        </div>

                        {doc.analisadoPorAgente && doc.status === 'analisado' && (
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <AgentBadge />
                            <span className="text-gray-500">Analisado pelo agente</span>
                          </div>
                        )}

                        {/* Dados extraídos */}
                        {doc.extraido && doc.dadosExtraidos && Object.keys(doc.dadosExtraidos).length > 0 && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-sm text-green-700 mb-2">Informações extraídas pelo agente:</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(doc.dadosExtraidos).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                  <span className="text-gray-900">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Ação de visualizar */}
                        {doc.status !== 'solicitado' && doc.dataUpload && (
                          <button className="mt-3 px-4 py-2 bg-[#1CB5C8] text-white rounded-lg text-sm hover:bg-[#17a2b3] flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Visualizar documento
                          </button>
                        )}

                        {/* Ação de upload para documento solicitado */}
                        {doc.status === 'solicitado' && (
                          <button className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Fazer upload deste documento
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recomendações do agente */}
            {sinistroAtual.id === 'SIN-2024-001001' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-blue-800 font-medium">Documentos Recomendados</div>
                    <p className="text-sm text-blue-700 mt-1">
                      O agente recomenda solicitar os seguintes documentos adicionais:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                      <li>Comprovante de conta bancária dos beneficiários</li>
                      <li>Declaração de inexistência de outros beneficiários</li>
                    </ul>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Solicitar Documentos
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
