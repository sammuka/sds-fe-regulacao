'use client'

import { useState } from 'react'
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Check, 
  Pause,
  Play,
  Mail,
  Phone,
  Cpu,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'

export function EtapaAberturaAviso() {
  const { sinistroAtual } = useSinistro()
  const [aberturaAprovada, setAberturaAprovada] = useState(false)

  if (!sinistroAtual) return null

  const { dadosComunicado, dadosAviso, sla, acoesAgenteAbertura, status } = sinistroAtual

  return (
    <div className="space-y-6">
      {/* Resumo do Comunicado */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1CB5C8]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#1CB5C8]" />
            </div>
            <div>
              <h2 className="text-gray-900 text-xl">Resumo do Comunicado</h2>
              <p className="text-sm text-gray-600">Informações coletadas no Portal de Comunicado</p>
            </div>
          </div>
          <AgentIndicator type="processed" label="Processado pelo Agente" />
        </div>

        {dadosComunicado && (
          <div className="space-y-4">
            {/* Comunicante e Data/Hora */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <User className="w-4 h-4" />
                    <span>Comunicante</span>
                  </div>
                  <div className="text-gray-900 font-medium">{dadosComunicado.comunicante.nome}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Data do Comunicado</span>
                  </div>
                  <div className="text-gray-900 font-medium">{dadosComunicado.dataHoraComunicado}</div>
                </div>
                {dadosComunicado.comunicante.email && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Mail className="w-4 h-4" />
                      <span>E-mail</span>
                    </div>
                    <div className="text-gray-900">{dadosComunicado.comunicante.email}</div>
                  </div>
                )}
                {dadosComunicado.comunicante.telefone && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Phone className="w-4 h-4" />
                      <span>Telefone</span>
                    </div>
                    <div className="text-gray-900">{dadosComunicado.comunicante.telefone}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Relato */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-2">Relato do Evento</div>
              <p className="text-gray-900 text-sm leading-relaxed">{dadosComunicado.relato}</p>
            </div>

            {/* Documentos Enviados */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-2">Documentos Enviados no Comunicado</div>
              <div className="flex flex-wrap gap-2">
                {dadosComunicado.documentosEnviados.map((doc, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dados Formais do Aviso */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900 text-xl">Dados Formais do Aviso</h2>
              <p className="text-sm text-gray-600">Marco de abertura do sinistro</p>
            </div>
          </div>
        </div>

        {dadosAviso && (
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Número do Aviso</div>
                  <div className="text-gray-900 font-semibold">{dadosAviso.numeroAviso}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Data da Ocorrência</div>
                  <div className="text-gray-900 font-medium">{dadosAviso.dataOcorrencia}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Data do Aviso</div>
                  <div className="text-gray-900 font-medium">{dadosAviso.dataAviso}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Data de Registro</div>
                  <div className="text-gray-900 font-medium">{dadosAviso.dataRegistro}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Natureza do Evento</div>
                  <div className="text-gray-900 font-medium">{dadosAviso.naturezaEvento}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Causa</div>
                  <div className="text-gray-900 font-medium">{dadosAviso.causa}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Tipo de Evento</div>
                  <div className="text-gray-900 font-medium">{dadosAviso.tipoEvento}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Abertura Automática</div>
                  <div className="flex items-center gap-1">
                    {dadosAviso.aberturaAutomatica ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-700 font-medium">Sim</span>
                      </>
                    ) : (
                      <span className="text-gray-700 font-medium">Não</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prazo Regulatório / SLA */}
        {sla && (
          <div className={`rounded-lg p-4 mb-6 ${sla.slaSuspenso ? 'bg-yellow-50 border border-yellow-300' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Prazo Regulatório (SLA)
              </h3>
              {sla.slaSuspenso && (
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm flex items-center gap-1">
                  <Pause className="w-3 h-3" />
                  Suspenso
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600 mb-1">SLA Total</div>
                <div className="text-gray-900 font-semibold">{sla.slaTotal} dias</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Dias Consumidos</div>
                <div className="text-gray-900 font-medium">{sla.slaConsumido} dias</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Dias Restantes</div>
                <div className={`font-semibold ${sla.diasRestantes <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                  {sla.diasRestantes} dias
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Status</div>
                <div className="flex items-center gap-1">
                  {sla.slaSuspenso ? (
                    <>
                      <Pause className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-700 font-medium">Suspenso</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">Em andamento</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {sla.slaSuspenso && sla.motivoSuspensao && (
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <div className="text-xs text-yellow-700 mb-1">Motivo da Suspensão</div>
                <div className="text-yellow-800">{sla.motivoSuspensao}</div>
              </div>
            )}

            {sla.periodosSuspensao && sla.periodosSuspensao.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Períodos de Suspensão</div>
                <div className="space-y-2">
                  {sla.periodosSuspensao.map((periodo, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600">
                        {periodo.dataInicio} {periodo.dataFim ? `→ ${periodo.dataFim}` : '→ Em andamento'}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-700">{periodo.motivo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status e Ações do Agente */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1CB5C8] rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900 text-xl">Status e Ações do Agente</h2>
              <p className="text-sm text-gray-600">Análise automática na abertura</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Status do Sinistro */}
          <div>
            <h3 className="text-gray-700 font-medium mb-3">Status do Sinistro</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              status === 'Encerrado' ? 'bg-gray-100 text-gray-700' :
              status === 'Aprovado' ? 'bg-green-100 text-green-700' :
              status === 'Negado' ? 'bg-red-100 text-red-700' :
              status === 'Em Perícia' ? 'bg-purple-100 text-purple-700' :
              status === 'Aguardando Documentos' ? 'bg-yellow-100 text-yellow-700' :
              status === 'Judicial' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {status === 'Em Perícia' && <AlertTriangle className="w-4 h-4" />}
              {status === 'Judicial' && <AlertTriangle className="w-4 h-4" />}
              {status}
            </div>
          </div>

          {/* Ações executadas */}
          <div>
            <h3 className="text-gray-700 font-medium mb-3">Ações do Agente na Abertura</h3>
            {acoesAgenteAbertura && acoesAgenteAbertura.length > 0 ? (
              <div className="space-y-2">
                {acoesAgenteAbertura.map((acao, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{acao}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma ação registrada</p>
            )}
          </div>
        </div>

        {/* Controles Humanos */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Controles do Analista</h3>
          <div className="flex items-center gap-4">
            {!aberturaAprovada ? (
              <button
                onClick={() => setAberturaAprovada(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Aprovar Abertura
              </button>
            ) : (
              <span className="px-6 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Abertura Aprovada
              </span>
            )}
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Reabrir/Ajustar Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

