'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { HeaderApolice } from '@/components/layout/header-apolice'
import { useSinistro } from '@/providers/sinistro-context'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { 
  ChevronLeft, 
  AlertCircle, 
  Check, 
  X, 
  FileText, 
  Send, 
  Clock, 
  User,
  Calendar,
  Scale,
  Cpu,
  Percent
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'

export default function AvaliacaoTecnicaPage() {
  const params = useParams()
  const router = useRouter()
  const { sinistroAtual, selecionarSinistro, coberturas } = useSinistro()
  const [decisao, setDecisao] = useState<'aprovar' | 'reprovar' | 'solicitar' | null>(null)
  const [parecer, setParecer] = useState('')
  const [documentosSolicitados, setDocumentosSolicitados] = useState<string[]>([])
  const [novoDocumento, setNovoDocumento] = useState('')

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

  const parecerAgente = {
    tipo: sinistroAtual.tipo,
    coberturaAplicavel: coberturas[0]?.nome || 'Morte Natural',
    valorIndenizacao: sinistroAtual.valor,
    analiseRisco: 'Baixo',
    recomendacao: 'Aprovação',
    observacoes:
      'Todos os documentos obrigatórios foram apresentados e validados. A carência foi cumprida e não há indícios de fraude. Recomenda-se aprovação da indenização.',
  }

  const { cicloPericia, dadosJudicial } = sinistroAtual

  const handleAdicionarDocumento = () => {
    if (novoDocumento.trim()) {
      setDocumentosSolicitados([...documentosSolicitados, novoDocumento.trim()])
      setNovoDocumento('')
    }
  }

  const handleRemoverDocumento = (index: number) => {
    setDocumentosSolicitados(documentosSolicitados.filter((_, i) => i !== index))
  }

  const statusPericiaConfig = {
    'nao-iniciada': { label: 'Não Iniciada', color: 'bg-gray-100 text-gray-700' },
    'enviada': { label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
    'aguardando-retorno': { label: 'Aguardando Retorno', color: 'bg-yellow-100 text-yellow-700' },
    'concluida': { label: 'Concluída', color: 'bg-green-100 text-green-700' },
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

          {/* Ciclo da Perícia (se existir) */}
          {cicloPericia && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-gray-900 text-xl">Ciclo da Perícia</h2>
                  <p className="text-sm text-gray-600">Acompanhamento do processo pericial</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <span className={cn(
                    'inline-flex px-2 py-1 rounded text-sm',
                    statusPericiaConfig[cicloPericia.status].color
                  )}>
                    {statusPericiaConfig[cicloPericia.status].label}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Data de Envio</div>
                  <div className="text-gray-900">{cicloPericia.dataEnvio || '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Previsão de Retorno</div>
                  <div className="text-gray-900">{cicloPericia.dataPrevistaRetorno || '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Data de Retorno</div>
                  <div className="text-gray-900">{cicloPericia.dataRetorno || 'Aguardando'}</div>
                </div>
              </div>

              {cicloPericia.especialistaAtribuido && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-900 font-medium">{cicloPericia.especialistaAtribuido.nome}</div>
                      <div className="text-sm text-blue-700">{cicloPericia.especialistaAtribuido.area}</div>
                    </div>
                  </div>
                </div>
              )}

              {cicloPericia.parecerAgente && (
                <div className="mt-4 p-4 bg-[#1CB5C8]/10 border border-[#1CB5C8] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-[#1CB5C8]" />
                    <span className="text-[#1CB5C8] font-medium">Parecer Prévio do Agente Especialista</span>
                    <span className="text-sm text-gray-500">
                      (Confiança: {cicloPericia.parecerAgente.confianca}%)
                    </span>
                  </div>
                  <p className="text-gray-700">{cicloPericia.parecerAgente.texto}</p>
                </div>
              )}
            </div>
          )}

          {/* Seção Judicial (se existir) */}
          {dadosJudicial?.possuiProcesso && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-gray-900 text-xl">Dimensão Judicial</h2>
                  <p className="text-sm text-red-600">Este sinistro possui processo judicial vinculado</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Número do Processo</div>
                  <div className="text-gray-900 font-mono text-sm">{dadosJudicial.numeroProcesso}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Vara</div>
                  <div className="text-gray-900">{dadosJudicial.vara}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Juízo</div>
                  <div className="text-gray-900">{dadosJudicial.juizo}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Status Judicial</div>
                  <div className="text-gray-900">{dadosJudicial.statusJudicial}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Probabilidade de Perda</div>
                  <div className={cn(
                    'font-medium flex items-center gap-1',
                    (dadosJudicial.probabilidadePerda || 0) > 50 ? 'text-red-600' : 'text-yellow-600'
                  )}>
                    <Percent className="w-4 h-4" />
                    {dadosJudicial.probabilidadePerda}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Data de Entrada</div>
                  <div className="text-gray-900">{dadosJudicial.dataEntrada}</div>
                </div>
              </div>

              {dadosJudicial.observacoes && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-xs text-red-600 mb-1">Observações</div>
                  <div className="text-gray-700">{dadosJudicial.observacoes}</div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Parecer do Agente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#1CB5C8]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#1CB5C8]" />
                </div>
                <div>
                  <h2 className="text-gray-900">Parecer Prévio do Agente</h2>
                  <AgentIndicator type="validated" label="Análise automática concluída" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Tipo de Sinistro</div>
                  <div className="text-gray-900">{parecerAgente.tipo}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Cobertura Aplicável</div>
                  <div className="text-gray-900">{parecerAgente.coberturaAplicavel}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Valor da Indenização</div>
                  <div className="text-gray-900">{formatCurrency(parecerAgente.valorIndenizacao)}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Análise de Risco</div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    <Check className="w-3 h-3" />
                    {parecerAgente.analiseRisco}
                  </span>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Recomendação do Agente</div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded">
                    <Check className="w-4 h-4" />
                    {parecerAgente.recomendacao}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Observações</div>
                  <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                    {parecerAgente.observacoes}
                  </div>
                </div>
              </div>
            </div>

            {/* Decisão do Perito */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h2 className="text-gray-900">Sua Decisão Técnica</h2>
                  <div className="text-sm text-gray-600">Avaliação do especialista</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-3">Decisão</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setDecisao('aprovar')}
                      className={`w-full px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                        decisao === 'aprovar'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          decisao === 'aprovar' ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-gray-900">Concorda com o Agente</div>
                        <div className="text-xs text-gray-600">
                          Concordo com a análise e recomendação
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setDecisao('reprovar')}
                      className={`w-full px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                        decisao === 'reprovar'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          decisao === 'reprovar' ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                      >
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-gray-900">Diverge do Agente</div>
                        <div className="text-xs text-gray-600">Emitir parecer divergente</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setDecisao('solicitar')}
                      className={`w-full px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                        decisao === 'solicitar'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-yellow-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          decisao === 'solicitar' ? 'bg-yellow-500' : 'bg-gray-200'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-gray-900">Solicitar Documentos Adicionais</div>
                        <div className="text-xs text-gray-600">Mais informações necessárias</div>
                      </div>
                    </button>
                  </div>
                </div>

                {decisao && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        {decisao === 'solicitar' ? 'Documentos Solicitados' : 'Observações do Especialista'}
                      </label>
                      {decisao === 'solicitar' ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={novoDocumento}
                              onChange={(e) => setNovoDocumento(e.target.value)}
                              placeholder="Digite o documento e clique em adicionar"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarDocumento()}
                            />
                            <button
                              onClick={handleAdicionarDocumento}
                              className="px-4 py-2 bg-[#1CB5C8] text-white rounded-lg hover:bg-[#17a2b3]"
                            >
                              Adicionar
                            </button>
                          </div>
                          {documentosSolicitados.length > 0 && (
                            <div className="space-y-1">
                              {documentosSolicitados.map((doc, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <span className="text-sm text-gray-700">{doc}</span>
                                  <button
                                    onClick={() => handleRemoverDocumento(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <textarea
                          value={parecer}
                          onChange={(e) => setParecer(e.target.value)}
                          placeholder="Descreva sua análise técnica e fundamentação..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                          rows={6}
                        />
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        className={`w-full px-4 py-3 rounded-lg text-white flex items-center justify-center gap-2 ${
                          decisao === 'aprovar'
                            ? 'bg-green-500 hover:bg-green-600'
                            : decisao === 'reprovar'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        {decisao === 'aprovar'
                          ? 'Confirmar Parecer'
                          : decisao === 'reprovar'
                          ? 'Enviar Parecer Divergente'
                          : 'Solicitar Documentos'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-900 mb-4">Histórico de Avaliações</h3>
            <div className="text-sm text-gray-500">
              Nenhuma avaliação técnica anterior para este sinistro.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
