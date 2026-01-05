'use client'

import { useState } from 'react'
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Check, 
  Pause,
  Play,
  Mail,
  Phone,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit2,
  AlertCircle
} from 'lucide-react'
import { AgentIndicator } from '@/components/agent/agent-indicator'
import { useSinistro } from '@/providers/sinistro-context'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { feedback } from '@/lib/feedback'

export function EtapaAberturaAviso() {
  const { sinistroAtual, estadoStepper, aprovarAbertura } = useSinistro()
  const [relatoExpandido, setRelatoExpandido] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAjusteOpen, setDialogAjusteOpen] = useState(false)

  if (!sinistroAtual) return null

  const { dadosComunicado, dadosAviso, sla, acoesAgenteAbertura, status } = sinistroAtual
  const aberturaAprovada = estadoStepper.etapasCompletas.includes(0)

  const handleAprovarAbertura = async () => {
    setLoading(true)
    try {
      await aprovarAbertura()
      feedback.success('Abertura aprovada', 'O sinistro está pronto para análise')
      setDialogOpen(false)
    } catch {
      feedback.error('Erro ao aprovar', 'Tente novamente')
    } finally {
      setLoading(false)
    }
  }

  const handleAjustarDados = (parecer?: string) => {
    feedback.info('Ajuste solicitado', parecer || 'Os dados serão revisados')
    setDialogAjusteOpen(false)
  }

  // Limita o relato para exibição compacta
  const relatoResumido = dadosComunicado?.relato && dadosComunicado.relato.length > 150
    ? dadosComunicado.relato.substring(0, 150) + '...'
    : dadosComunicado?.relato

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header compacto */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--azul-principal-500)]/10 rounded flex items-center justify-center">
            <FileText className="w-4 h-4 text-[var(--azul-principal-500)]" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">ABERTURA DO AVISO</h2>
        </div>
        <AgentIndicator type="processed" label="Processado" />
      </div>

      <div className="p-4">
        {/* Grid 2 colunas: Comunicado | Dados Formais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Coluna 1: Resumo do Comunicado */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Comunicado</div>
            {dadosComunicado && (
              <div className="space-y-2">
                {/* Linha: Nome, Email, Telefone, Data */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-gray-900 font-medium">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {dadosComunicado.comunicante.nome}
                  </span>
                  {dadosComunicado.comunicante.email && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {dadosComunicado.comunicante.email}
                    </span>
                  )}
                  {dadosComunicado.comunicante.telefone && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {dadosComunicado.comunicante.telefone}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {dadosComunicado.dataHoraComunicado}
                </div>

                {/* Relato compacto */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Relato</div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {relatoExpandido ? dadosComunicado.relato : relatoResumido}
                  </p>
                  {dadosComunicado.relato && dadosComunicado.relato.length > 150 && (
                    <button 
                      onClick={() => setRelatoExpandido(!relatoExpandido)}
                      className="text-xs text-[var(--azul-principal-500)] hover:underline mt-1 flex items-center gap-1"
                    >
                      {relatoExpandido ? (
                        <>Recolher <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Ver mais <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Tags de documentos inline */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {dadosComunicado.documentosEnviados.map((doc, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5" />
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna 2: Dados Formais do Aviso */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Dados do Aviso</div>
            {dadosAviso && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Nº Aviso</div>
                  <div className="text-gray-900 font-semibold">{dadosAviso.numeroAviso}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Data Ocorrência</div>
                  <div className="text-gray-900">{dadosAviso.dataOcorrencia}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Natureza</div>
                  <div className="text-gray-900 font-medium">{dadosAviso.naturezaEvento}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Causa</div>
                  <div className="text-gray-900">{dadosAviso.causa}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tipo Evento</div>
                  <div className="text-gray-900">{dadosAviso.tipoEvento}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Abertura Auto</div>
                  <div className="flex items-center gap-1">
                    {dadosAviso.aberturaAutomatica ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-700">Sim</span>
                      </>
                    ) : (
                      <span className="text-gray-700">Não</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barra de SLA integrada */}
        {sla && (
          <div className={`rounded-lg p-3 mb-4 ${
            sla.slaSuspenso 
              ? 'bg-yellow-50 border border-yellow-200' 
              : sla.diasRestantes <= 5 
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">SLA</span>
                </div>
                
                {/* Barra de progresso */}
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        sla.slaSuspenso 
                          ? 'bg-yellow-500' 
                          : sla.diasRestantes <= 5 
                            ? 'bg-red-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((sla.slaConsumido / sla.slaTotal) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {sla.slaConsumido}/{sla.slaTotal} dias
                  </span>
                </div>

                <div className={`text-sm font-semibold ${
                  sla.slaSuspenso 
                    ? 'text-yellow-700' 
                    : sla.diasRestantes <= 5 
                      ? 'text-red-600'
                      : 'text-green-600'
                }`}>
                  {sla.diasRestantes} dias restantes
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sla.slaSuspenso ? (
                  <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs flex items-center gap-1">
                    <Pause className="w-3 h-3" />
                    Suspenso
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-500 text-white rounded text-xs flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Em andamento
                  </span>
                )}
              </div>
            </div>

            {sla.slaSuspenso && sla.motivoSuspensao && (
              <div className="mt-2 pt-2 border-t border-yellow-200 text-sm text-yellow-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Motivo:</strong> {sla.motivoSuspensao}</span>
              </div>
            )}
          </div>
        )}

        {/* Status + Ações do Agente em linha */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          {/* Status do sinistro */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                status === 'Encerrado' ? 'bg-gray-100 text-gray-700' :
                status === 'Aprovado' ? 'bg-green-100 text-green-700' :
                status === 'Negado' ? 'bg-red-100 text-red-700' :
                status === 'Em Perícia' ? 'bg-purple-100 text-purple-700' :
                status === 'Aguardando Documentos' ? 'bg-yellow-100 text-yellow-700' :
                status === 'Judicial' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {status}
              </span>
            </div>

            {/* Ações do agente como chips */}
            {acoesAgenteAbertura && acoesAgenteAbertura.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Agente:</span>
                {acoesAgenteAbertura.slice(0, 4).map((acao, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 bg-[var(--azul-principal-500)]/10 text-[var(--azul-principal-600)] rounded text-xs flex items-center gap-1"
                    title={acao}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {acao.length > 20 ? acao.substring(0, 20) + '...' : acao}
                  </span>
                ))}
                {acoesAgenteAbertura.length > 4 && (
                  <span className="text-xs text-gray-500">+{acoesAgenteAbertura.length - 4}</span>
                )}
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            {!aberturaAprovada ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogAjusteOpen(true)}
                  className="text-gray-600"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Ajustar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="w-3.5 h-3.5" />
                  Aprovar Abertura
                </Button>
              </>
            ) : (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Abertura Aprovada
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmação de aprovação */}
      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Aprovar Abertura do Aviso"
        description="Ao aprovar, você confirma que os dados do comunicado e aviso estão corretos e o sinistro pode seguir para análise."
        confirmText="Aprovar"
        variant="default"
        onConfirm={handleAprovarAbertura}
        loading={loading}
      />

      {/* Dialog de ajuste */}
      <ConfirmDialog
        open={dialogAjusteOpen}
        onOpenChange={setDialogAjusteOpen}
        title="Ajustar Dados da Abertura"
        description="Informe o motivo do ajuste e quais dados precisam ser corrigidos."
        confirmText="Solicitar Ajuste"
        variant="warning"
        onConfirm={handleAjustarDados}
        requireParecer
        parecerLabel="Motivo do Ajuste"
        parecerPlaceholder="Descreva quais dados precisam ser corrigidos..."
      />
    </div>
  )
}
