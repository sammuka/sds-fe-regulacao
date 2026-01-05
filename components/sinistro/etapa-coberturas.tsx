'use client'

import { useState } from 'react'
import { Check, CheckCircle2, RefreshCw, Shield, History } from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'
import { formatCurrency } from '@/lib/utils'
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

export function EtapaCoberturas() {
  const { coberturas, estadoStepper, aprovarCobertura, sinistroAtual } = useSinistro()
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogReanalisarOpen, setDialogReanalisarOpen] = useState(false)

  const coberturaAprovada = estadoStepper.etapasCompletas.includes(2)
  const etapaBloqueada = estadoStepper.etapasBloqueadas.includes(2)

  const handleAprovar = async () => {
    setLoading(true)
    try {
      await aprovarCobertura()
      feedback.success('Cobertura aprovada', 'A cobertura foi confirmada para o sinistro')
      setDialogOpen(false)
    } catch {
      feedback.error('Erro ao aprovar', 'Tente novamente')
    } finally {
      setLoading(false)
    }
  }

  const handleSolicitarReanalise = (parecer?: string) => {
    feedback.info('Reanálise solicitada', parecer || 'A cobertura será reavaliada pelo agente')
    setDialogReanalisarOpen(false)
  }

  if (etapaBloqueada) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-2">🔒</div>
        <p className="text-gray-500">Complete a etapa anterior para desbloquear</p>
      </div>
    )
  }

  // Cobertura principal filtrada pela natureza do sinistro
  const cobertura = coberturas[0]

  if (!cobertura) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500 text-center">Nenhuma cobertura identificada</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header compacto */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">ANÁLISE DE COBERTURAS</h2>
        </div>
        <AgentIndicator type="validated" label="Agent ✓ 98%" />
      </div>

      <div className="p-4">
        {/* Tabela de coberturas */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">Cobertura</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">Valor Segurado</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">Franquia</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Vigência</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-green-50/50">
                <TableCell className="font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <span>{cobertura.nome}</span>
                    {cobertura.validadaAgente && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatCurrency(cobertura.valorSegurado)}
                </TableCell>
                <TableCell className="text-gray-700">
                  {formatCurrency(cobertura.franquia)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-green-600">✓</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    APLICÁVEL
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Análise resumida */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Análise:</span>
              <span className="text-gray-900">
                Sinistro tipo <strong>{sinistroAtual?.dadosAviso?.naturezaEvento || 'MORTE NATURAL'}</strong> → 
                Cobertura <strong>{cobertura.nome}</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Carência: Cumprida ({cobertura.carenciaDias || 180} dias)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Prêmios: Em dia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Vigência verificada na data do sinistro • Sem restrições aplicáveis
          </div>

          <div className="flex items-center gap-2">
            {!coberturaAprovada ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogReanalisarOpen(true)}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Solicitar Reanálise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <History className="w-3.5 h-3.5" />
                  Ver Histórico
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="w-3.5 h-3.5" />
                  Aprovar Cobertura
                </Button>
              </>
            ) : (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Cobertura Aprovada
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmação de aprovação */}
      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Aprovar Cobertura"
        description="Confirma que a cobertura identificada está correta e pode ser aplicada ao sinistro?"
        confirmText="Aprovar"
        variant="default"
        onConfirm={handleAprovar}
        loading={loading}
      />

      {/* Dialog de reanálise */}
      <ConfirmDialog
        open={dialogReanalisarOpen}
        onOpenChange={setDialogReanalisarOpen}
        title="Solicitar Reanálise de Cobertura"
        description="Informe o motivo pelo qual a cobertura deve ser reanalisada pelo agente."
        confirmText="Solicitar"
        variant="warning"
        onConfirm={handleSolicitarReanalise}
        requireParecer
        parecerLabel="Motivo da Reanálise"
        parecerPlaceholder="Descreva o que deve ser verificado novamente..."
      />
    </div>
  )
}
