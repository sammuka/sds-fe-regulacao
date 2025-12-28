import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    return date
  }
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function calcularDiasRestantes(dataInicio: Date, diasTotal: number, diasConsumidos: number): number {
  return Math.max(0, diasTotal - diasConsumidos)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Em Análise': 'bg-blue-100 text-blue-700',
    'Aguardando Perícia': 'bg-yellow-100 text-yellow-700',
    'Em Regulação': 'bg-purple-100 text-purple-700',
    'Aguardando Documentos': 'bg-orange-100 text-orange-700',
    'Aprovado': 'bg-green-100 text-green-700',
    'Negado': 'bg-red-100 text-red-700',
    'Encerrado': 'bg-gray-100 text-gray-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

export function getSLAColor(diasRestantes: number, slaTotal: number): string {
  const percentual = (diasRestantes / slaTotal) * 100
  if (percentual <= 20) return 'text-red-600'
  if (percentual <= 50) return 'text-yellow-600'
  return 'text-green-600'
}

