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
    'nao-iniciada': { label: 'Nao Iniciada', color: 'bg-[var(--cinza-100)] text-[var(--cinza-700)]' },
    'enviada': { label: 'Enviada', color: 'bg-[var(--azul-principal-100)] text-[var(--azul-principal-700)]' },
    'aguardando-retorno': { label: 'Aguardando Retorno', color: 'bg-[var(--amarelo-100)] text-[var(--amarelo-700)]' },
    'concluida': { label: 'Concluida', color: 'bg-[var(--verde-100)] text-[var(--verde-700)]' },
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

          {/* Ciclo da Pericia (se existir) */}
          {cicloPericia && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[var(--cinza-100)] rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--cinza-600)]" />
                </div>
                <div>
                  <h2 className="text-[var(--cinza-900)] text-xl">Ciclo da Pericia</h2>
                  <p className="text-sm text-[var(--cinza-600)]">Acompanhamento do processo pericial</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Status</div>
                  <span className={cn(
                    'inline-flex px-2 py-1 rounded text-sm',
                    statusPericiaConfig[cicloPericia.status].color
                  )}>
                    {statusPericiaConfig[cicloPericia.status].label}
                  </span>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Data de Envio</div>
                  <div className="text-[var(--cinza-900)]">{cicloPericia.dataEnvio || '-'}</div>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Previsao de Retorno</div>
                  <div className="text-[var(--cinza-900)]">{cicloPericia.dataPrevistaRetorno || '-'}</div>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Data de Retorno</div>
                  <div className="text-[var(--cinza-900)]">{cicloPericia.dataRetorno || 'Aguardando'}</div>
                </div>
              </div>

              {cicloPericia.especialistaAtribuido && (
                <div className="p-4 bg-[var(--azul-principal-50)] border border-[var(--azul-principal-200)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--azul-principal-500)] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[var(--cinza-900)] font-medium">{cicloPericia.especialistaAtribuido.nome}</div>
                      <div className="text-sm text-[var(--azul-principal-700)]">{cicloPericia.especialistaAtribuido.area}</div>
                    </div>
                  </div>
                </div>
              )}

              {cicloPericia.parecerAgente && (
                <div className="mt-4 p-4 bg-[var(--azul-principal-50)] border border-[var(--azul-principal-300)] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-[var(--azul-principal-500)]" />
                    <span className="text-[var(--azul-principal-600)] font-medium">Parecer Previo do Agente Especialista</span>
                    <span className="text-sm text-[var(--cinza-500)]">
                      (Confianca: {cicloPericia.parecerAgente.confianca}%)
                    </span>
                  </div>
                  <p className="text-[var(--cinza-700)]">{cicloPericia.parecerAgente.texto}</p>
                </div>
              )}
            </div>
          )}

          {/* Secao Judicial (se existir) */}
          {dadosJudicial?.possuiProcesso && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-[var(--vermelho-500)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[var(--vermelho-100)] rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[var(--vermelho-600)]" />
                </div>
                <div>
                  <h2 className="text-[var(--cinza-900)] text-xl">Dimensao Judicial</h2>
                  <p className="text-sm text-[var(--vermelho-600)]">Este sinistro possui processo judicial vinculado</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Numero do Processo</div>
                  <div className="text-[var(--cinza-900)] font-mono text-sm">{dadosJudicial.numeroProcesso}</div>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Vara</div>
                  <div className="text-[var(--cinza-900)]">{dadosJudicial.vara}</div>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Juizo</div>
                  <div className="text-[var(--cinza-900)]">{dadosJudicial.juizo}</div>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Status Judicial</div>
                  <div className="text-[var(--cinza-900)]">{dadosJudicial.statusJudicial}</div>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Probabilidade de Perda</div>
                  <div className={cn(
                    'font-medium flex items-center gap-1',
                    (dadosJudicial.probabilidadePerda || 0) > 50 ? 'text-[var(--vermelho-600)]' : 'text-[var(--amarelo-600)]'
                  )}>
                    <Percent className="w-4 h-4" />
                    {dadosJudicial.probabilidadePerda}%
                  </div>
                </div>
                <div className="bg-[var(--cinza-50)] rounded-lg p-4">
                  <div className="text-xs text-[var(--cinza-500)] mb-1">Data de Entrada</div>
                  <div className="text-[var(--cinza-900)]">{dadosJudicial.dataEntrada}</div>
                </div>
              </div>

              {dadosJudicial.observacoes && (
                <div className="p-4 bg-[var(--vermelho-50)] border border-[var(--vermelho-200)] rounded-lg">
                  <div className="text-xs text-[var(--vermelho-600)] mb-1">Observacoes</div>
                  <div className="text-[var(--cinza-700)]">{dadosJudicial.observacoes}</div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Parecer do Agente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[var(--azul-principal-50)] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--azul-principal-500)]" />
                </div>
                <div>
                  <h2 className="text-[var(--cinza-900)]">Parecer Previo do Agente</h2>
                  <AgentIndicator type="validated" label="Analise automatica concluida" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[var(--cinza-600)] mb-1">Tipo de Sinistro</div>
                  <div className="text-[var(--cinza-900)]">{parecerAgente.tipo}</div>
                </div>

                <div>
                  <div className="text-sm text-[var(--cinza-600)] mb-1">Cobertura Aplicavel</div>
                  <div className="text-[var(--cinza-900)]">{parecerAgente.coberturaAplicavel}</div>
                </div>

                <div>
                  <div className="text-sm text-[var(--cinza-600)] mb-1">Valor da Indenizacao</div>
                  <div className="text-[var(--cinza-900)]">{formatCurrency(parecerAgente.valorIndenizacao)}</div>
                </div>

                <div>
                  <div className="text-sm text-[var(--cinza-600)] mb-1">Analise de Risco</div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--verde-100)] text-[var(--verde-700)] rounded text-sm">
                    <Check className="w-3 h-3" />
                    {parecerAgente.analiseRisco}
                  </span>
                </div>

                <div>
                  <div className="text-sm text-[var(--cinza-600)] mb-1">Recomendacao do Agente</div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--verde-500)] text-white rounded">
                    <Check className="w-4 h-4" />
                    {parecerAgente.recomendacao}
                  </span>
                </div>

                <div className="pt-4 border-t border-[var(--cinza-200)]">
                  <div className="text-sm text-[var(--cinza-600)] mb-2">Observacoes</div>
                  <div className="text-sm text-[var(--cinza-700)] p-3 bg-[var(--cinza-50)] rounded-lg">
                    {parecerAgente.observacoes}
                  </div>
                </div>
              </div>
            </div>

            {/* Decisao do Perito */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[var(--vermelho-50)] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--vermelho-400)]" />
                </div>
                <div>
                  <h2 className="text-[var(--cinza-900)]">Sua Decisao Tecnica</h2>
                  <div className="text-sm text-[var(--cinza-600)]">Avaliacao do especialista</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--cinza-600)] mb-3">Decisao</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setDecisao('aprovar')}
                      className={`w-full px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                        decisao === 'aprovar'
                          ? 'border-[var(--verde-500)] bg-[var(--verde-50)]'
                          : 'border-[var(--cinza-200)] hover:border-[var(--verde-300)]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          decisao === 'aprovar' ? 'bg-[var(--verde-500)]' : 'bg-[var(--cinza-200)]'
                        }`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-[var(--cinza-900)]">Concorda com o Agente</div>
                        <div className="text-xs text-[var(--cinza-600)]">
                          Concordo com a analise e recomendacao
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setDecisao('reprovar')}
                      className={`w-full px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                        decisao === 'reprovar'
                          ? 'border-[var(--vermelho-500)] bg-[var(--vermelho-50)]'
                          : 'border-[var(--cinza-200)] hover:border-[var(--vermelho-300)]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          decisao === 'reprovar' ? 'bg-[var(--vermelho-500)]' : 'bg-[var(--cinza-200)]'
                        }`}
                      >
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-[var(--cinza-900)]">Diverge do Agente</div>
                        <div className="text-xs text-[var(--cinza-600)]">Emitir parecer divergente</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setDecisao('solicitar')}
                      className={`w-full px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                        decisao === 'solicitar'
                          ? 'border-[var(--amarelo-500)] bg-[var(--amarelo-50)]'
                          : 'border-[var(--cinza-200)] hover:border-[var(--amarelo-300)]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          decisao === 'solicitar' ? 'bg-[var(--amarelo-500)]' : 'bg-[var(--cinza-200)]'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-[var(--cinza-900)]">Solicitar Documentos Adicionais</div>
                        <div className="text-xs text-[var(--cinza-600)]">Mais informacoes necessarias</div>
                      </div>
                    </button>
                  </div>
                </div>

                {decisao && (
                  <>
                    <div>
                      <label className="block text-sm text-[var(--cinza-600)] mb-2">
                        {decisao === 'solicitar' ? 'Documentos Solicitados' : 'Observacoes do Especialista'}
                      </label>
                      {decisao === 'solicitar' ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={novoDocumento}
                              onChange={(e) => setNovoDocumento(e.target.value)}
                              placeholder="Digite o documento e clique em adicionar"
                              className="flex-1 px-4 py-2 border border-[var(--cinza-300)] rounded-lg"
                              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarDocumento()}
                            />
                            <button
                              onClick={handleAdicionarDocumento}
                              className="sds-btn-primary"
                            >
                              Adicionar
                            </button>
                          </div>
                          {documentosSolicitados.length > 0 && (
                            <div className="space-y-1">
                              {documentosSolicitados.map((doc, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-[var(--cinza-50)] rounded"
                                >
                                  <span className="text-sm text-[var(--cinza-700)]">{doc}</span>
                                  <button
                                    onClick={() => handleRemoverDocumento(index)}
                                    className="text-[var(--vermelho-500)] hover:text-[var(--vermelho-700)]"
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
                          placeholder="Descreva sua analise tecnica e fundamentacao..."
                          className="w-full px-4 py-3 border border-[var(--cinza-300)] rounded-lg resize-none"
                          rows={6}
                        />
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--cinza-200)]">
                      <button
                        className={`w-full px-4 py-3 rounded-lg text-white flex items-center justify-center gap-2 ${
                          decisao === 'aprovar'
                            ? 'bg-[var(--verde-500)] hover:bg-[var(--verde-600)]'
                            : decisao === 'reprovar'
                            ? 'bg-[var(--vermelho-500)] hover:bg-[var(--vermelho-600)]'
                            : 'bg-[var(--amarelo-500)] hover:bg-[var(--amarelo-600)]'
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

          {/* Historico */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-[var(--cinza-900)] mb-4">Historico de Avaliacoes</h3>
            <div className="text-sm text-[var(--cinza-500)]">
              Nenhuma avaliacao tecnica anterior para este sinistro.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
