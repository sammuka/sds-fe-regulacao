'use client'

import React, { useState } from 'react'
import { 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  AlertTriangle, 
  DollarSign,
  CheckCircle2,
  Edit2,
  Wallet
} from 'lucide-react'
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
  TableFooter,
} from '@/components/ui/table'

export function EtapaPagamentos() {
  const { pagamentos, estadoStepper, aprovarPagamento } = useSinistro()
  const [detalheAberto, setDetalheAberto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAjusteOpen, setDialogAjusteOpen] = useState(false)
  const [selectedPagamento, setSelectedPagamento] = useState<string | null>(null)

  const pagamentosAprovados = estadoStepper.etapasCompletas.includes(4)
  const etapaBloqueada = estadoStepper.etapasBloqueadas.includes(4)

  const temPagamentoBloqueado = pagamentos.some(p => p.status === 'bloqueado')
  const totalGeral = pagamentos.reduce((acc, p) => acc + p.valorTotal, 0)

  const handleAprovar = async () => {
    if (!selectedPagamento) return
    
    setLoading(true)
    try {
      await aprovarPagamento(selectedPagamento)
      feedback.success('Pagamento aprovado', 'O pagamento foi autorizado para processamento')
      setDialogOpen(false)
      setSelectedPagamento(null)
    } catch {
      feedback.error('Erro ao aprovar', 'Tente novamente')
    } finally {
      setLoading(false)
    }
  }

  const handleAjustarValores = (parecer?: string) => {
    feedback.info('Ajuste solicitado', parecer || 'Os valores serão recalculados')
    setDialogAjusteOpen(false)
    setSelectedPagamento(null)
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
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
            <Wallet className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">PAGAMENTOS</h2>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
            {pagamentos.length} parcela(s)
          </span>
        </div>
        <AgentIndicator type="calculated" label="Calculado" />
      </div>

      {/* Banner de bloqueio */}
      {temPagamentoBloqueado && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700 font-medium">
            Pagamento bloqueado - Resolva as pendências para liberar
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Tabela de pagamentos */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">ID</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase">Favorecido</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-right">Valor Base</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-right">Correção</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-right">Total</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.map((pagamento) => {
                const isBloqueado = pagamento.status === 'bloqueado'
                const isAprovado = pagamento.status === 'aprovado'
                
                return (
                  <React.Fragment key={pagamento.id}>
                    <TableRow 
                      className={isBloqueado ? 'bg-red-50' : ''}
                    >
                      <TableCell className="font-mono text-xs text-gray-600">
                        {pagamento.numeroIdentificador || pagamento.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {pagamento.favorecido || 'Beneficiário Principal'}
                          </span>
                          {pagamento.calculadoPorAgente && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{pagamento.coberturaRelacionada}</div>
                      </TableCell>
                      <TableCell className="text-right text-gray-700">
                        {formatCurrency(pagamento.valor)}
                      </TableCell>
                      <TableCell className="text-right text-gray-700">
                        <div>{formatCurrency(pagamento.correcao)}</div>
                        <div className="text-xs text-gray-400">{pagamento.periodoMeses}m</div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gray-900">
                        {formatCurrency(pagamento.valorTotal)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                            isAprovado
                              ? 'bg-green-100 text-green-700'
                              : pagamento.status === 'pago'
                              ? 'bg-blue-100 text-blue-700'
                              : isBloqueado
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {isBloqueado && <Lock className="w-3 h-3" />}
                          {isAprovado && <Check className="w-3 h-3" />}
                          {pagamento.status === 'pendente' ? 'Pendente' : pagamento.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDetalheAberto(detalheAberto === pagamento.id ? null : pagamento.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Ver detalhes"
                          >
                            {detalheAberto === pagamento.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          {!isAprovado && !isBloqueado && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedPagamento(pagamento.id)
                                  setDialogAjusteOpen(true)
                                }}
                                className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
                                title="Ajustar valores"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPagamento(pagamento.id)
                                  setDialogOpen(true)
                                }}
                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Aprovar"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Linha de motivo bloqueio */}
                    {isBloqueado && pagamento.motivoBloqueio && (
                      <TableRow className="bg-red-50">
                        <TableCell colSpan={7} className="py-2">
                          <div className="flex items-center gap-2 text-sm text-red-700">
                            <AlertTriangle className="w-4 h-4" />
                            <strong>Bloqueio:</strong> {pagamento.motivoBloqueio}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Linha de detalhes expandidos */}
                    {detalheAberto === pagamento.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-50 p-0">
                          <div className="p-4 space-y-3">
                            {/* Grid de informações */}
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Data Entrada:</span>
                                <span className="ml-2 text-gray-900">{pagamento.dataEntrada || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Previsão:</span>
                                <span className="ml-2 text-gray-900">{pagamento.dataPrevisao}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total Final:</span>
                                <span className="ml-2 text-gray-900">
                                  {pagamento.pagamentoTotalFinal ? 'Sim' : 'Não'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Corrigir até pag.:</span>
                                <span className="ml-2 text-gray-900">
                                  {pagamento.corrigirAtePagamento ? 'Sim' : 'Não'}
                                </span>
                              </div>
                            </div>

                            {/* Detalhamento do cálculo */}
                            {pagamento.detalhamento && (
                              <div className="bg-blue-50 rounded p-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                  <DollarSign className="w-4 h-4" />
                                  Detalhamento do Cálculo
                                </div>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Valor base:</span>
                                    <span className="ml-2 text-gray-900">
                                      {formatCurrency(pagamento.detalhamento.valorBase)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Índice:</span>
                                    <span className="ml-2 text-gray-900">
                                      {pagamento.detalhamento.indiceCorrecao}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">% Correção:</span>
                                    <span className="ml-2 text-gray-900">
                                      {pagamento.detalhamento.percentualCorrecao}%
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Valor correção:</span>
                                    <span className="ml-2 text-gray-900">
                                      {formatCurrency(pagamento.detalhamento.valorCorrecao)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Multa e mora */}
                            {(pagamento.pagarMulta || pagamento.pagarMora) && (
                              <div className="bg-yellow-50 rounded p-3">
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  {pagamento.pagarMulta && (
                                    <div>
                                      <span className="text-gray-500">Multa:</span>
                                      <span className="ml-2 text-red-600 font-medium">
                                        {formatCurrency(pagamento.valorMulta || 0)}
                                      </span>
                                    </div>
                                  )}
                                  {pagamento.pagarMora && (
                                    <>
                                      <div>
                                        <span className="text-gray-500">Mora:</span>
                                        <span className="ml-2 text-red-600 font-medium">
                                          {formatCurrency(pagamento.valorMora || 0)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Início mora:</span>
                                        <span className="ml-2 text-gray-900">
                                          {pagamento.dataInicioMora || '-'}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium text-gray-700">
                  TOTAL GERAL:
                </TableCell>
                <TableCell className="text-right font-bold text-lg text-gray-900">
                  {formatCurrency(totalGeral)}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* Ações globais */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {pagamentos.filter(p => p.status === 'aprovado').length} de {pagamentos.length} pagamento(s) aprovado(s)
          </div>

          <div className="flex items-center gap-2">
            {pagamentosAprovados ? (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Todos Pagamentos Aprovados
              </span>
            ) : (
              !temPagamentoBloqueado && (
                <Button
                  size="sm"
                  onClick={() => {
                    const pendente = pagamentos.find(p => p.status === 'pendente')
                    if (pendente) {
                      setSelectedPagamento(pendente.id)
                      setDialogOpen(true)
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={!pagamentos.some(p => p.status === 'pendente')}
                >
                  <Check className="w-3.5 h-3.5" />
                  Aprovar Próximo Pagamento
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmação de aprovação */}
      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Aprovar Pagamento"
        description="Confirma a aprovação deste pagamento? O valor será encaminhado para processamento bancário."
        confirmText="Aprovar"
        variant="default"
        onConfirm={handleAprovar}
        loading={loading}
      />

      {/* Dialog de ajuste */}
      <ConfirmDialog
        open={dialogAjusteOpen}
        onOpenChange={setDialogAjusteOpen}
        title="Ajustar Valores do Pagamento"
        description="Informe o motivo do ajuste e as alterações necessárias nos valores."
        confirmText="Solicitar Ajuste"
        variant="warning"
        onConfirm={handleAjustarValores}
        requireParecer
        parecerLabel="Motivo do Ajuste"
        parecerPlaceholder="Descreva quais valores devem ser alterados e porquê..."
      />
    </div>
  )
}
