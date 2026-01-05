import { toast } from 'sonner'

// Utilitário de feedback para ações do sistema
// Centraliza todas as notificações para manter consistência visual

export const feedback = {
  // Sucesso - ação concluída com êxito
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    })
  },

  // Erro - falha na operação
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    })
  },

  // Informação - mensagem neutra
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    })
  },

  // Alerta - atenção necessária
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    })
  },

  // Loading - ação em progresso (retorna função para dismiss)
  loading: (message: string) => {
    return toast.loading(message)
  },

  // Dismiss - remove toast específico
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },

  // Promise - para operações assíncronas
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, messages)
  },
}

// Mensagens pré-definidas para ações comuns
export const feedbackMessages = {
  // Aprovações
  aberturaAprovada: () => feedback.success('Abertura aprovada', 'O sinistro foi aprovado para regulação'),
  coberturaAprovada: () => feedback.success('Cobertura aprovada', 'A cobertura foi confirmada para o sinistro'),
  pagamentoAprovado: () => feedback.success('Pagamento aprovado', 'O pagamento foi autorizado'),
  periciaAprovada: () => feedback.success('Perícia concluída', 'O parecer do perito foi registrado'),

  // Ajustes
  dadosAtualizados: () => feedback.success('Dados atualizados', 'As alterações foram salvas'),
  documentoSolicitado: () => feedback.info('Documento solicitado', 'O SLA foi suspenso aguardando entrega'),
  
  // Erros
  erroGenerico: () => feedback.error('Erro ao processar', 'Tente novamente ou contate o suporte'),
  erroValidacao: (campo: string) => feedback.error('Dados inválidos', `Verifique o campo: ${campo}`),
  
  // SLA
  slaSuspenso: (motivo: string) => feedback.warning('SLA Suspenso', motivo),
  slaRetomado: () => feedback.success('SLA Retomado', 'O prazo regulatório voltou a contar'),
}

