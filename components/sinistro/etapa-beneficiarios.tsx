'use client'

import { useState } from 'react'
import { 
  AlertCircle, 
  Edit2, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Users,
  Building,
  X
} from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { feedback } from '@/lib/feedback'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function EtapaBeneficiarios() {
  const { beneficiarios, estadoStepper, aprovarBeneficiarios } = useSinistro()
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAddOpen, setDialogAddOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<string | null>(null)

  const beneficiariosAprovados = estadoStepper.etapasCompletas.includes(3)
  const etapaBloqueada = estadoStepper.etapasBloqueadas.includes(3)

  const totalPercentual = beneficiarios.reduce((acc, b) => acc + b.percentual, 0)
  const temDadosBancariosPendentes = beneficiarios.some(b => !b.dadosBancarios)
  const percentualValido = totalPercentual === 100

  const handleAprovar = async () => {
    setLoading(true)
    try {
      await aprovarBeneficiarios()
      feedback.success('Beneficiários aprovados', 'Os dados dos beneficiários foram confirmados')
      setDialogOpen(false)
    } catch {
      feedback.error('Erro ao aprovar', 'Tente novamente')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBeneficiario = () => {
    feedback.success('Beneficiário adicionado', 'O novo beneficiário foi incluído')
    setDialogAddOpen(false)
  }

  const handleEditBeneficiario = () => {
    feedback.success('Beneficiário atualizado', 'Os dados foram salvos')
    setDialogEditOpen(false)
    setSelectedBeneficiario(null)
  }

  const handleDeleteBeneficiario = () => {
    feedback.success('Beneficiário removido', 'O beneficiário foi excluído')
    setDialogDeleteOpen(false)
    setSelectedBeneficiario(null)
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
          <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">BENEFICIÁRIOS</h2>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
            {beneficiarios.length} cadastrados
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AgentIndicator type="suggested" label="Sugerido" />
          {!beneficiariosAprovados && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogAddOpen(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Tabela de beneficiários */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">Nome</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">CPF</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">Parentesco</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">%</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Banco</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Status</TableHead>
                {!beneficiariosAprovados && (
                  <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Ações</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {beneficiarios.map((beneficiario) => (
                <TableRow key={beneficiario.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{beneficiario.nome}</span>
                      {beneficiario.sugeridoPorAgente && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                          Agente
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 font-mono text-xs">
                    {beneficiario.cpf}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {beneficiario.parentesco}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-gray-900">
                    {beneficiario.percentual}%
                  </TableCell>
                  <TableCell className="text-center">
                    {beneficiario.dadosBancarios ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                        <Building className="w-3 h-3" />
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-600 text-xs">
                        <Building className="w-3 h-3" />
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {beneficiario.dadosBancarios ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                        Completo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                        Pendente
                      </span>
                    )}
                  </TableCell>
                  {!beneficiariosAprovados && (
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedBeneficiario(beneficiario.id)
                            setDialogEditOpen(true)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBeneficiario(beneficiario.id)
                            setDialogDeleteOpen(true)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totalizador + Alertas */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Total:</span>
              <span className={`text-lg font-semibold ${percentualValido ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentual}%
              </span>
              {!percentualValido && (
                <span className="text-xs text-red-500">(deve somar 100%)</span>
              )}
            </div>

            {temDadosBancariosPendentes && (
              <div className="flex items-center gap-1.5 text-yellow-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Dados bancários pendentes</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!beneficiariosAprovados ? (
              <Button
                size="sm"
                onClick={() => setDialogOpen(true)}
                disabled={!percentualValido}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Check className="w-3.5 h-3.5" />
                Aprovar Beneficiários
              </Button>
            ) : (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Beneficiários Aprovados
              </span>
            )}
          </div>
        </div>

        {/* Alerta expandido se necessário */}
        {temDadosBancariosPendentes && !beneficiariosAprovados && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-yellow-800">
                <strong>Atenção:</strong> Alguns beneficiários não possuem dados bancários completos. 
                O pagamento só poderá ser realizado após o preenchimento.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog de confirmação de aprovação */}
      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Aprovar Beneficiários"
        description={`Confirma que os ${beneficiarios.length} beneficiário(s) listados estão corretos e totalizando ${totalPercentual}%?`}
        confirmText="Aprovar"
        variant="default"
        onConfirm={handleAprovar}
        loading={loading}
      />

      {/* Dialog de adicionar */}
      <ConfirmDialog
        open={dialogAddOpen}
        onOpenChange={setDialogAddOpen}
        title="Adicionar Beneficiário"
        description="Informe os dados do novo beneficiário a ser incluído."
        confirmText="Adicionar"
        variant="default"
        onConfirm={handleAddBeneficiario}
        requireParecer
        parecerLabel="Nome do Beneficiário"
        parecerPlaceholder="Nome completo..."
      />

      {/* Dialog de editar */}
      <ConfirmDialog
        open={dialogEditOpen}
        onOpenChange={setDialogEditOpen}
        title="Editar Beneficiário"
        description="Altere os dados do beneficiário selecionado."
        confirmText="Salvar"
        variant="default"
        onConfirm={handleEditBeneficiario}
        requireParecer
        parecerLabel="Alterações"
        parecerPlaceholder="Descreva as alterações..."
      />

      {/* Dialog de excluir */}
      <ConfirmDialog
        open={dialogDeleteOpen}
        onOpenChange={setDialogDeleteOpen}
        title="Remover Beneficiário"
        description="Tem certeza que deseja remover este beneficiário? Esta ação não pode ser desfeita."
        confirmText="Remover"
        variant="destructive"
        onConfirm={handleDeleteBeneficiario}
        requireParecer
        parecerLabel="Motivo da Exclusão"
        parecerPlaceholder="Informe o motivo..."
      />
    </div>
  )
}
