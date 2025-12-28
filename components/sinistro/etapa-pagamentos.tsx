'use client'

import { useState } from 'react'
import { Check, ChevronRight, ChevronDown, Lock, AlertTriangle, DollarSign } from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'
import { formatCurrency } from '@/lib/utils'

export function EtapaPagamentos() {
  const { pagamentos, sinistroAtual } = useSinistro()
  const [detalheAberto, setDetalheAberto] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 text-xl mb-1">Pagamentos</h2>
          <AgentIndicator type="calculated" />
        </div>
      </div>

      <div className="space-y-4">
        {pagamentos.map((pagamento) => {
          const isBloqueado = pagamento.status === 'bloqueado'
          
          return (
            <div
              key={pagamento.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                isBloqueado ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              {/* Header do Pagamento */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-gray-900 font-medium">
                    {pagamento.numeroIdentificador || 'Pagamento Principal'}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                      pagamento.status === 'aprovado'
                        ? 'bg-green-100 text-green-700'
                        : pagamento.status === 'pago'
                        ? 'bg-blue-100 text-blue-700'
                        : pagamento.status === 'bloqueado'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {isBloqueado && <Lock className="w-3 h-3" />}
                    {pagamento.status === 'pendente' ? 'Pendente Aprovação' :
                     pagamento.status === 'bloqueado' ? 'Bloqueado' : pagamento.status}
                  </span>
                  {pagamento.calculadoPorAgente && (
                    <span className="px-2 py-1 bg-green-500 text-white rounded text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Calculado pelo Agente
                    </span>
                  )}
                  {pagamento.pagamentoTotalFinal && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      Total e Final
                    </span>
                  )}
                </div>

                {/* Favorecido e Cobertura */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {pagamento.favorecido && (
                    <div>
                      <span className="text-gray-600">Favorecido: </span>
                      <span className="text-gray-900">{pagamento.favorecido}</span>
                    </div>
                  )}
                  {pagamento.coberturaRelacionada && (
                    <div>
                      <span className="text-gray-600">Cobertura: </span>
                      <span className="text-gray-900">{pagamento.coberturaRelacionada}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Motivo do Bloqueio */}
              {isBloqueado && pagamento.motivoBloqueio && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-red-800">Pagamento Bloqueado</div>
                    <div className="text-sm text-red-700">{pagamento.motivoBloqueio}</div>
                  </div>
                </div>
              )}

              {/* Valores principais */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Valor Base</div>
                  <div className="text-gray-900 font-medium">
                    {formatCurrency(pagamento.valor)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">
                    Correção ({pagamento.periodoMeses} meses)
                  </div>
                  <div className="text-gray-900 font-medium">
                    {formatCurrency(pagamento.correcao)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Valor Total</div>
                  <div className="text-gray-900 font-medium text-lg">
                    {formatCurrency(pagamento.valorTotal)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Previsão de Pagamento</div>
                  <div className="text-gray-900">{pagamento.dataPrevisao}</div>
                </div>
              </div>

              {/* Toggle para detalhes */}
              <button
                onClick={() =>
                  setDetalheAberto(detalheAberto === pagamento.id ? null : pagamento.id)
                }
                className="flex items-center gap-2 text-[#1CB5C8] hover:text-[#17a2b3] text-sm"
              >
                {detalheAberto === pagamento.id ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                Ver detalhes completos
              </button>

              {/* Detalhamento expandido */}
              {detalheAberto === pagamento.id && (
                <div className="mt-4 space-y-4">
                  {/* Informações do Pagamento */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-gray-900 mb-3 font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Informações do Pagamento
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Número/Identificador</div>
                        <div className="text-gray-900">{pagamento.numeroIdentificador || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Data de Entrada</div>
                        <div className="text-gray-900">{pagamento.dataEntrada || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Data Prevista</div>
                        <div className="text-gray-900">{pagamento.dataPrevisao}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Pagamento Total e Final</div>
                        <div className="flex items-center gap-1">
                          {pagamento.pagamentoTotalFinal ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-green-700">Sim</span>
                            </>
                          ) : (
                            <span className="text-gray-700">Não</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Corrigir até Pagamento</div>
                        <div className="flex items-center gap-1">
                          {pagamento.corrigirAtePagamento ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-green-700">Sim</span>
                            </>
                          ) : (
                            <span className="text-gray-700">Não</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {pagamento.justificativaCorrecao && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="text-gray-600 text-sm mb-1">Justificativa para Correção</div>
                        <div className="text-gray-900 text-sm">{pagamento.justificativaCorrecao}</div>
                      </div>
                    )}
                  </div>

                  {/* Multa e Mora */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-gray-900 mb-3 font-medium">Multa e Mora</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Pagar Multa?</div>
                        <div className={pagamento.pagarMulta ? 'text-red-700' : 'text-gray-700'}>
                          {pagamento.pagarMulta ? 'Sim' : 'Não'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Valor da Multa</div>
                        <div className="text-gray-900">{formatCurrency(pagamento.valorMulta || 0)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Pagar Mora?</div>
                        <div className={pagamento.pagarMora ? 'text-red-700' : 'text-gray-700'}>
                          {pagamento.pagarMora ? 'Sim' : 'Não'}
                        </div>
                      </div>
                      {pagamento.pagarMora && (
                        <>
                          <div>
                            <div className="text-gray-600">Data Início Mora</div>
                            <div className="text-gray-900">{pagamento.dataInicioMora || '-'}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Valor da Mora</div>
                            <div className="text-gray-900">{formatCurrency(pagamento.valorMora || 0)}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Detalhamento do Cálculo */}
                  {pagamento.detalhamento && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-gray-900 mb-3 font-medium">Detalhamento do Cálculo</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor da cobertura ({pagamento.coberturaRelacionada})</span>
                          <span className="text-gray-900">
                            {formatCurrency(pagamento.detalhamento.valorBase)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Período coberto</span>
                          <span className="text-gray-900">{pagamento.periodoMeses} meses</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Índice de correção ({pagamento.detalhamento.indiceCorrecao})
                          </span>
                          <span className="text-gray-900">
                            {pagamento.detalhamento.percentualCorrecao}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor da correção</span>
                          <span className="text-gray-900">
                            {formatCurrency(pagamento.detalhamento.valorCorrecao)}
                          </span>
                        </div>
                        <div className="border-t border-green-300 pt-2 mt-2 flex justify-between font-medium">
                          <span className="text-gray-900">Valor Total a Pagar</span>
                          <span className="text-gray-900">{formatCurrency(pagamento.valorTotal)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Ações */}
      <div className="mt-6 flex items-center gap-4">
        {pagamentos.some(p => p.status === 'bloqueado') ? (
          <div className="flex items-center gap-2 text-red-600">
            <Lock className="w-4 h-4" />
            <span className="text-sm">
              Aprovação bloqueada - Resolva as pendências para liberar o pagamento
            </span>
          </div>
        ) : (
          <>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Aprovar Pagamento
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Solicitar Perícia
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Ajustar Valores
            </button>
          </>
        )}
      </div>
    </div>
  )
}
