'use client'

import { useState } from 'react'
import { Check, Edit2 } from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { Sinistro } from '@/types'

interface EtapaDadosSeguradoProps {
  sinistro: Sinistro
}

export function EtapaDadosSegurado({ sinistro }: EtapaDadosSeguradoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [dados, setDados] = useState({
    nome: sinistro.segurado,
    cpf: sinistro.cpfSegurado || '123.456.789-00',
    dataNascimento: sinistro.dataNascimento || '15/05/1980',
    telefone: sinistro.telefone || '(11) 98765-4321',
    endereco: sinistro.endereco || 'Rua das Flores, 123 - São Paulo, SP',
  })

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 text-xl mb-1">Dados do Segurado</h2>
          <AgentIndicator type="validated" />
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4" />
              Salvar
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Editar
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Nome Completo</label>
          <input
            type="text"
            value={dados.nome}
            onChange={(e) => setDados({ ...dados, nome: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">CPF</label>
          <input
            type="text"
            value={dados.cpf}
            onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Data de Nascimento</label>
          <input
            type="text"
            value={dados.dataNascimento}
            onChange={(e) => setDados({ ...dados, dataNascimento: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Telefone</label>
          <input
            type="text"
            value={dados.telefone}
            onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Endereço</label>
          <input
            type="text"
            value={dados.endereco}
            onChange={(e) => setDados({ ...dados, endereco: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* Informações extraídas pelo agente */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Check className="w-5 h-5 text-green-600" />
          <h4 className="text-gray-900 font-medium">Dados validados pelo agente</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">Origem dos Dados</div>
            <div className="text-gray-900">Comunicado de Sinistro + Documentos</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Nível de Confiança</div>
            <div className="text-green-600 font-medium">98%</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-600 mb-1">Observação</div>
            <div className="text-gray-900">
              Todos os dados conferem com os documentos enviados. CPF validado na Receita Federal.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

