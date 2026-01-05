'use client'

import * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ConfirmDialogVariant = 'default' | 'destructive' | 'warning'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmDialogVariant
  onConfirm: (parecer?: string) => void
  onCancel?: () => void
  requireParecer?: boolean
  parecerLabel?: string
  parecerPlaceholder?: string
  loading?: boolean
}

const variantStyles: Record<ConfirmDialogVariant, string> = {
  default: 'bg-[var(--azul-principal-500)] hover:bg-[var(--azul-principal-600)] text-white',
  destructive: 'bg-[var(--vermelho-600)] hover:bg-[var(--vermelho-700)] text-white',
  warning: 'bg-[var(--amarelo-500)] hover:bg-[var(--amarelo-600)] text-white',
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
  requireParecer = false,
  parecerLabel = 'Parecer',
  parecerPlaceholder = 'Informe sua justificativa...',
  loading = false,
}: ConfirmDialogProps) {
  const [parecer, setParecer] = React.useState('')
  const [error, setError] = React.useState('')

  const handleConfirm = () => {
    if (requireParecer && !parecer.trim()) {
      setError('O parecer é obrigatório')
      return
    }
    setError('')
    onConfirm(requireParecer ? parecer : undefined)
    setParecer('')
  }

  const handleCancel = () => {
    setParecer('')
    setError('')
    onCancel?.()
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setParecer('')
      setError('')
    }
    onOpenChange(newOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-['Poppins']">{title}</AlertDialogTitle>
          <AlertDialogDescription className="font-['Poppins']">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requireParecer && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cinza-700)] font-['Poppins']">
              {parecerLabel} <span className="text-[var(--vermelho-600)]">*</span>
            </label>
            <Textarea
              value={parecer}
              onChange={(e) => {
                setParecer(e.target.value)
                if (error) setError('')
              }}
              placeholder={parecerPlaceholder}
              className={cn(
                "min-h-[100px] font-['Poppins']",
                error && 'border-[var(--vermelho-600)] focus:ring-[var(--vermelho-600)]'
              )}
            />
            {error && (
              <p className="text-sm text-[var(--vermelho-600)] font-['Poppins']">{error}</p>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={loading}
            className="font-['Poppins']"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "font-['Poppins']",
              variantStyles[variant],
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processando...
              </span>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Hook para facilitar o uso do ConfirmDialog
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean
    title: string
    description: string
    variant: ConfirmDialogVariant
    confirmText: string
    requireParecer: boolean
    parecerLabel: string
    onConfirm: (parecer?: string) => void
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
    confirmText: 'Confirmar',
    requireParecer: false,
    parecerLabel: 'Parecer',
    onConfirm: () => {},
  })

  const confirm = React.useCallback(
    (options: {
      title: string
      description: string
      variant?: ConfirmDialogVariant
      confirmText?: string
      requireParecer?: boolean
      parecerLabel?: string
    }): Promise<string | boolean> => {
      return new Promise((resolve) => {
        setDialogState({
          open: true,
          title: options.title,
          description: options.description,
          variant: options.variant || 'default',
          confirmText: options.confirmText || 'Confirmar',
          requireParecer: options.requireParecer || false,
          parecerLabel: options.parecerLabel || 'Parecer',
          onConfirm: (parecer) => {
            setDialogState((prev) => ({ ...prev, open: false }))
            resolve(options.requireParecer ? parecer || '' : true)
          },
        })
      })
    },
    []
  )

  const cancel = React.useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }))
  }, [])

  const DialogComponent = React.useMemo(
    () => (
      <ConfirmDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        title={dialogState.title}
        description={dialogState.description}
        variant={dialogState.variant}
        confirmText={dialogState.confirmText}
        requireParecer={dialogState.requireParecer}
        parecerLabel={dialogState.parecerLabel}
        onConfirm={dialogState.onConfirm}
        onCancel={cancel}
      />
    ),
    [dialogState, cancel]
  )

  return { confirm, cancel, DialogComponent }
}

