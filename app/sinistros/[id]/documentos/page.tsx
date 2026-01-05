'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { HeaderApolice } from '@/components/layout/header-apolice'
import { useSinistro } from '@/providers/sinistro-context'
import { AgentBadge } from '@/components/agent/agent-indicator'
import { 
  ChevronLeft, 
  FileText, 
  Check, 
  Clock, 
  ExternalLink, 
  Upload, 
  AlertTriangle,
  Pause,
  Send,
  Eye,
  ChevronDown,
  ChevronRight,
  FolderOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { feedback } from '@/lib/feedback'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function DocumentosPage() {
  const params = useParams()
  const router = useRouter()
  const { sinistroAtual, selecionarSinistro, documentos } = useSinistro()
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

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

  const documentosPendentes = documentos.filter(d => d.status === 'solicitado')
  const temPendenciaSLA = documentosPendentes.some(d => d.suspendeSLA)

  const statusConfig = {
    analisado: { bg: 'bg-green-100', text: 'text-green-700', icon: Check, label: 'Analisado' },
    pendente: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pendente' },
    solicitado: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Send, label: 'Solicitado' },
    entregue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Check, label: 'Entregue' },
    rejeitado: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertTriangle, label: 'Rejeitado' },
  }

  const handleSolicitar = () => {
    feedback.info('Documento solicitado', 'O SLA será suspenso até a entrega')
  }

  const handleUpload = () => {
    feedback.success('Upload realizado', 'O documento será analisado pelo agente')
  }

  return (
    <div className="min-h-screen bg-[var(--cinza-100)]">
      <TopBar sinistroNumero={sinistroAtual.id} />
      <HeaderApolice apolice={apolice} sla={sinistroAtual.sla} />

      <main className="pt-[176px] px-4 pb-8">
        <div className="w-full max-w-[1200px] mx-auto">
          <button
            onClick={() => router.push(`/sinistros/${sinistroAtual.id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 my-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header compacto */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">DOCUMENTOS DO SINISTRO</h2>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                  {documentos.length} documentos
                </span>
              </div>
              <Button size="sm" onClick={handleUpload}>
                <Upload className="w-3.5 h-3.5" />
                Upload
              </Button>
            </div>

            {/* Banner de SLA Suspenso */}
            {temPendenciaSLA && (
              <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200 flex items-center gap-2">
                <Pause className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700 font-medium">
                  SLA Suspenso - Aguardando {documentosPendentes.length} documento(s)
                </span>
              </div>
            )}

            <div className="p-4">
              {/* Tabela de documentos */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase">Documento</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase">Tipo</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase">Data</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">SLA</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentos.map((doc) => {
                      const config = statusConfig[doc.status]
                      const StatusIcon = config.icon
                      const isExpanded = expandedDoc === doc.id
                      const isSolicitado = doc.status === 'solicitado'

                      return (
                        <>
                          <TableRow 
                            key={doc.id}
                            className={cn(isSolicitado && 'bg-orange-50')}
                          >
                            <TableCell className="w-10">
                              {doc.dadosExtraidos && Object.keys(doc.dadosExtraidos).length > 0 && (
                                <button
                                  onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-900">{doc.nome}</span>
                                {doc.analisadoPorAgente && doc.status === 'analisado' && (
                                  <AgentBadge />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {doc.tipo}
                            </TableCell>
                            <TableCell className="text-sm">
                              {doc.dataUpload && (
                                <div className="text-gray-700">{doc.dataUpload}</div>
                              )}
                              {doc.dataSolicitacao && (
                                <div className="text-orange-600">{doc.dataSolicitacao}</div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {doc.suspendeSLA && isSolicitado ? (
                                <span className="inline-flex items-center gap-1 text-yellow-600">
                                  <Pause className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
                                config.bg,
                                config.text
                              )}>
                                <StatusIcon className="w-3 h-3" />
                                {config.label}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {!isSolicitado && doc.dataUpload && (
                                  <button
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    title="Visualizar"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {isSolicitado && (
                                  <button
                                    onClick={handleUpload}
                                    className="p-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded"
                                    title="Upload"
                                  >
                                    <Upload className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                                  title="Abrir"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* Linha expandida com dados extraídos */}
                          {isExpanded && doc.dadosExtraidos && (
                            <TableRow>
                              <TableCell colSpan={7} className="bg-green-50 p-0">
                                <div className="p-3">
                                  <div className="text-xs font-medium text-green-700 mb-2">
                                    Dados extraídos pelo Agente:
                                  </div>
                                  <div className="grid grid-cols-4 gap-3 text-sm">
                                    {Object.entries(doc.dadosExtraidos).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="text-gray-500 capitalize">
                                          {key.replace(/([A-Z])/g, ' $1')}:
                                        </span>
                                        <span className="ml-1 text-gray-900">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Recomendações do agente */}
              {sinistroAtual.id === 'SIN-2024-001001' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <AgentBadge />
                      <div>
                        <div className="text-sm font-medium text-blue-800">Documentos Recomendados</div>
                        <div className="text-sm text-blue-700 mt-1">
                          Comprovante bancário dos beneficiários • Declaração de inexistência de outros beneficiários
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleSolicitar}>
                      <Send className="w-3.5 h-3.5" />
                      Solicitar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
