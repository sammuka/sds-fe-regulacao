'use client'

import { useState } from 'react'
import { 
  Check, 
  Edit2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard,
  CheckCircle2,
  X
} from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { feedback } from '@/lib/feedback'

export function EtapaDadosSegurado() {
  const { sinistroAtual, estadoStepper, aprovarDadosSegurado } = useSinistro()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [dados, setDados] = useState({
    nome: sinistroAtual?.segurado || '',
    cpf: sinistroAtual?.cpfSegurado || '123.456.789-00',
    dataNascimento: sinistroAtual?.dataNascimento || '15/05/1980',
    telefone: sinistroAtual?.telefone || '(11) 98765-4321',
    email: 'joao.silva@email.com',
    endereco: sinistroAtual?.endereco || 'Rua das Flores, 123 - São Paulo, SP',
  })

  if (!sinistroAtual) return null

  const dadosAprovados = estadoStepper.etapasCompletas.includes(1)
  const etapaBloqueada = estadoStepper.etapasBloqueadas.includes(1)

  const handleSave = () => {
    feedback.success('Dados salvos', 'As alterações foram aplicadas')
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDados({
      nome: sinistroAtual?.segurado || '',
      cpf: sinistroAtual?.cpfSegurado || '123.456.789-00',
      dataNascimento: sinistroAtual?.dataNascimento || '15/05/1980',
      telefone: sinistroAtual?.telefone || '(11) 98765-4321',
      email: 'joao.silva@email.com',
      endereco: sinistroAtual?.endereco || 'Rua das Flores, 123 - São Paulo, SP',
    })
    setIsEditing(false)
  }

  const handleAprovar = async () => {
    setLoading(true)
    try {
      await aprovarDadosSegurado()
      feedback.success('Dados aprovados', 'Os dados do segurado foram confirmados')
      setDialogOpen(false)
    } catch {
      feedback.error('Erro ao aprovar', 'Tente novamente')
    } finally {
      setLoading(false)
    }
  }

  if (etapaBloqueada) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-2">🔒</div>
        <p className="text-gray-500">Complete a etapa anterior para desbloquear</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header compacto */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">DADOS DO SEGURADO</h2>
        </div>
        <div className="flex items-center gap-2">
          <AgentIndicator type="validated" label="Validado 98%" />
          {!dadosAprovados && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </Button>
          )}
          {isEditing && (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-3.5 h-3.5" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                <Check className="w-3.5 h-3.5" />
                Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Grid de dados 3 colunas */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Nome */}
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <User className="w-3 h-3" />
              Nome Completo
            </div>
            {isEditing ? (
              <input
                type="text"
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900">{dados.nome}</div>
            )}
          </div>

          {/* CPF */}
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <CreditCard className="w-3 h-3" />
              CPF
            </div>
            {isEditing ? (
              <input
                type="text"
                value={dados.cpf}
                onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900">{dados.cpf}</div>
            )}
          </div>

          {/* Data Nascimento */}
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Calendar className="w-3 h-3" />
              Data de Nascimento
            </div>
            {isEditing ? (
              <input
                type="text"
                value={dados.dataNascimento}
                onChange={(e) => setDados({ ...dados, dataNascimento: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900">{dados.dataNascimento}</div>
            )}
          </div>

          {/* Telefone */}
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Phone className="w-3 h-3" />
              Telefone
            </div>
            {isEditing ? (
              <input
                type="text"
                value={dados.telefone}
                onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900">{dados.telefone}</div>
            )}
          </div>

          {/* Email */}
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Mail className="w-3 h-3" />
              E-mail
            </div>
            {isEditing ? (
              <input
                type="text"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900">{dados.email}</div>
            )}
          </div>

          {/* Endereço */}
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <MapPin className="w-3 h-3" />
              Endereço
            </div>
            {isEditing ? (
              <input
                type="text"
                value={dados.endereco}
                onChange={(e) => setDados({ ...dados, endereco: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900 truncate" title={dados.endereco}>
                {dados.endereco}
              </div>
            )}
          </div>
        </div>

        {/* Validação do Agente + Botões de ação */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Validado pelo Agente</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">Origem: Comunicado + Documentos</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">CPF validado na Receita Federal</span>
          </div>

          <div className="flex items-center gap-2">
            {!dadosAprovados ? (
              <Button
                size="sm"
                onClick={() => setDialogOpen(true)}
                disabled={isEditing}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Check className="w-3.5 h-3.5" />
                Aprovar Dados
              </Button>
            ) : (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Dados Aprovados
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmação */}
      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Aprovar Dados do Segurado"
        description="Confirma que os dados do segurado estão corretos e validados?"
        confirmText="Aprovar"
        variant="default"
        onConfirm={handleAprovar}
        loading={loading}
      />
    </div>
  )
}
