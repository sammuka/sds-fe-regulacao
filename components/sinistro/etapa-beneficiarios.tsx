'use client'

import { AlertCircle, Edit2, Plus } from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'

export function EtapaBeneficiarios() {
  const { beneficiarios } = useSinistro()

  const totalPercentual = beneficiarios.reduce((acc, b) => acc + b.percentual, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 text-xl mb-1">Beneficiários</h2>
          <div className="flex items-center gap-2">
            <AgentIndicator type="suggested" label="Beneficiários sugeridos pelo agente" />
          </div>
        </div>
        <button className="px-4 py-2 bg-[#1CB5C8] text-white rounded-lg hover:bg-[#17a2b3] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Beneficiário
        </button>
      </div>

      <div className="space-y-3">
        {beneficiarios.map((beneficiario) => (
          <div
            key={beneficiario.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-gray-900 font-medium">{beneficiario.nome}</div>
                  {beneficiario.sugeridoPorAgente && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      Sugerido pelo Agente
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">CPF: {beneficiario.cpf}</div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Parentesco</div>
                <div className="text-gray-900">{beneficiario.parentesco}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Percentual</div>
                <div className="text-gray-900 font-medium">{beneficiario.percentual}%</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Dados Bancários</div>
                <div className={beneficiario.dadosBancarios ? 'text-green-600' : 'text-yellow-600'}>
                  {beneficiario.dadosBancarios ? 'Completo' : 'Pendente'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total de percentuais
        </div>
        <div className={`text-lg font-medium ${totalPercentual === 100 ? 'text-green-600' : 'text-red-600'}`}>
          {totalPercentual}%
          {totalPercentual !== 100 && (
            <span className="text-sm font-normal text-red-500 ml-2">
              (deve somar 100%)
            </span>
          )}
        </div>
      </div>

      {/* Alerta se faltam dados bancários */}
      {beneficiarios.some(b => !b.dadosBancarios) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-gray-900 mb-1">Dados bancários pendentes</div>
              <div className="text-sm text-gray-600">
                Alguns beneficiários ainda não possuem dados bancários cadastrados. 
                Esses dados são necessários para a liberação do pagamento.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

