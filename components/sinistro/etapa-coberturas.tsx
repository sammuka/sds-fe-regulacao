'use client'

import { Check, AlertCircle } from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'
import { formatCurrency } from '@/lib/utils'

export function EtapaCoberturas() {
  const { coberturas } = useSinistro()

  const cobertura = coberturas[0] // Cobertura principal

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="font-['Poppins'] text-[#424242] text-[24px] mb-2">
          Cobertura Aplicável
        </h2>
        <p className="font-['Poppins'] text-[#707070]">
          Com base na natureza/causa do sinistro, identificamos a cobertura atuarial aplicável
        </p>
      </div>

      {cobertura && (
        <div className="bg-[#e9f5f9] border-2 border-[#239dc5] rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="font-['Poppins'] text-[#424242] text-[18px]">
                  {cobertura.nome}
                </div>
                <span className="px-3 py-1 bg-[#239dc5] text-white rounded-full text-sm font-['Poppins']">
                  Cobertura Aplicável
                </span>
                {cobertura.validadaAgente && (
                  <AgentIndicator type="validated" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-['Poppins'] text-[#707070] mb-1">
                    Valor Segurado
                  </div>
                  <div className="font-['Poppins'] text-[#424242] text-[20px]">
                    {formatCurrency(cobertura.valorSegurado)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-['Poppins'] text-[#707070] mb-1">
                    Franquia
                  </div>
                  <div className="font-['Poppins'] text-[#424242] text-[20px]">
                    {formatCurrency(cobertura.franquia)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Análise de Vigência */}
          <div className="mt-4 pt-4 border-t border-[#239dc5]/30">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#208fb3] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-['Poppins'] text-[#424242] mb-1">
                  Análise de Vigência
                </div>
                <div className="text-sm font-['Poppins'] text-[#575757]">
                  A apólice estava vigente na data do sinistro (28/10/2025). 
                  Período de carência cumprido. Não há restrições aplicáveis.
                </div>
              </div>
            </div>
          </div>

          {/* Correspondência */}
          <div className="mt-4 pt-4 border-t border-[#239dc5]/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#208fb3] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-['Poppins'] text-[#424242] mb-1">
                  Correspondência Identificada pelo Agente
                </div>
                <div className="text-sm font-['Poppins'] text-[#575757]">
                  Natureza do Sinistro: <span className="font-medium">Morte Natural</span> → 
                  Cobertura: <span className="font-medium">{cobertura.nome}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botões de ação */}
      <div className="mt-6 flex items-center gap-4">
        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Aprovar Cobertura
        </button>
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Solicitar Reanálise
        </button>
      </div>
    </div>
  )
}

