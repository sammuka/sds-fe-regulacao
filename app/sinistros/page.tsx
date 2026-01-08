'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TopBar } from '@/components/layout/top-bar'
import { useUsuario } from '@/providers/usuario-context'
import { useSinistro } from '@/providers/sinistro-context'
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Scale, 
  Stethoscope,
  Filter,
  Search
} from 'lucide-react'
import { formatCurrency, getStatusColor, getSLAColor, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type FiltroStatus = 'todos' | 'Em Análise' | 'Aguardando Documentos' | 'Em Perícia' | 'Judicial'
type FiltroSLA = 'todos' | 'urgente' | 'normal' | 'suspenso'

export default function FilaSinistrosPage() {
  const { perfil } = useUsuario()
  const { sinistros, selecionarSinistro } = useSinistro()
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos')
  const [filtroSLA, setFiltroSLA] = useState<FiltroSLA>('todos')
  const [busca, setBusca] = useState('')

  const getTituloFila = () => {
    switch (perfil) {
      case 'analista-admin':
        return 'Todos os Sinistros'
      case 'perito':
        return 'Sinistros Atribuídos - Perícia'
      default:
        return 'Meus Sinistros'
    }
  }

  const getCenarioLabel = (id: string) => {
    if (id === 'SIN-2024-001001') return { label: 'Cenário A', desc: 'Fluxo padrão', color: 'bg-green-100 text-green-700' }
    if (id === 'SIN-2024-001002') return { label: 'Cenário B', desc: 'Perícia + Judicial', color: 'bg-purple-100 text-purple-700' }
    return null
  }

  // Filtrar sinistros
  const sinistrosFiltrados = sinistros
    .filter(s => {
      // Filtro por status
      if (filtroStatus === 'Judicial') {
        return s.dadosJudicial?.possuiProcesso
      }
      if (filtroStatus !== 'todos' && s.status !== filtroStatus) {
        return false
      }
      
      // Filtro por SLA
      if (filtroSLA === 'urgente' && (s.sla?.diasRestantes ?? 30) > 5) return false
      if (filtroSLA === 'suspenso' && !s.sla?.slaSuspenso) return false
      if (filtroSLA === 'normal' && (s.sla?.slaSuspenso || (s.sla?.diasRestantes ?? 30) <= 5)) return false
      
      // Busca por texto
      if (busca) {
        const termo = busca.toLowerCase()
        return (
          s.numero.toLowerCase().includes(termo) ||
          s.segurado.toLowerCase().includes(termo) ||
          s.apolice.toLowerCase().includes(termo)
        )
      }
      
      return true
    })
    // Ordenar por urgência (SLA baixo primeiro)
    .sort((a, b) => {
      // Urgentes primeiro
      const diasA = a.sla?.diasRestantes ?? 30
      const diasB = b.sla?.diasRestantes ?? 30
      return diasA - diasB
    })

  return (
    <div className="min-h-screen bg-[var(--cinza-50)]">
      <TopBar />
      
      <main className="flex justify-center px-4 py-6">
        <div className="w-full max-w-[1200px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 text-2xl font-semibold mb-1">
                {getTituloFila()}
              </h1>
              <p className="text-gray-600 text-sm">
                {sinistrosFiltrados.length} de {sinistros.length} sinistro{sinistros.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Busca */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número, segurado..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-3 mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Filter className="w-4 h-4" />
              <span>Filtros:</span>
            </div>
            
            {/* Filtro por Status */}
            <div className="flex items-center gap-1">
              {(['todos', 'Em Análise', 'Aguardando Documentos', 'Em Perícia', 'Judicial'] as FiltroStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                    filtroStatus === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {status === 'todos' ? 'Todos' : status}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200" />

            {/* Filtro por SLA */}
            <div className="flex items-center gap-1">
              {(['todos', 'urgente', 'normal', 'suspenso'] as FiltroSLA[]).map((sla) => (
                <button
                  key={sla}
                  onClick={() => setFiltroSLA(sla)}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                    filtroSLA === sla
                      ? sla === 'urgente' ? 'bg-red-500 text-white' :
                        sla === 'suspenso' ? 'bg-yellow-500 text-white' :
                        'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {sla === 'todos' ? 'Todos SLA' : 
                   sla === 'urgente' ? '⚠️ Urgente' :
                   sla === 'suspenso' ? '⏸️ Suspenso' :
                   '✅ Normal'}
                </button>
              ))}
            </div>
          </div>

          {/* Legenda dos cenários de teste */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <span className="text-blue-800 font-medium">Cenários de Teste:</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">A</span>
                  <span className="text-gray-600">Fluxo padrão</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">B</span>
                  <span className="text-gray-600">Perícia + Docs + Judicial</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de Sinistros */}
          <div className="space-y-3">
            {sinistrosFiltrados.map((sinistro) => {
              const cenario = getCenarioLabel(sinistro.id)
              const temJudicial = sinistro.dadosJudicial?.possuiProcesso
              const temPericia = sinistro.cicloPericia?.status && sinistro.cicloPericia.status !== 'nao-iniciada'
              const isUrgente = (sinistro.sla?.diasRestantes ?? 30) <= 5 && !sinistro.sla?.slaSuspenso
              
              return (
                <Link
                  key={sinistro.id}
                  href={`/sinistros/${sinistro.id}`}
                  onClick={() => selecionarSinistro(sinistro.id)}
                  className={cn(
                    'block bg-white rounded-lg p-4 hover:shadow-md transition-all',
                    isUrgente && 'border-l-4 border-l-red-500 bg-red-50/30',
                    temJudicial && !isUrgente && 'border-l-4 border-l-orange-500',
                    !isUrgente && !temJudicial && 'border border-gray-200'
                  )}
                >
                  <div className="flex items-start justify-between">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{sinistro.numero}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(sinistro.status)}`}>
                          {sinistro.status}
                        </span>
                        {cenario && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${cenario.color}`}>
                            {cenario.label}
                          </span>
                        )}
                        {isUrgente && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded text-xs font-medium animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            URGENTE
                          </span>
                        )}
                        {sinistro.sla?.slaSuspenso && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                            <AlertCircle className="w-3 h-3" />
                            SLA Suspenso
                          </span>
                        )}
                        {temJudicial && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                            <Scale className="w-3 h-3" />
                            Judicial
                          </span>
                        )}
                        {temPericia && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            <Stethoscope className="w-3 h-3" />
                            Perícia
                          </span>
                        )}
                      </div>

                      <div className="text-gray-900 mb-1">{sinistro.segurado}</div>
                      
                      {/* Grid de informações compacto */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {sinistro.tipo}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {formatCurrency(sinistro.valor)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {sinistro.apolice}
                        </span>
                        <span>{sinistro.fase}</span>
                      </div>
                    </div>

                    {/* SLA */}
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium',
                        sinistro.sla?.slaSuspenso 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : isUrgente 
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-700'
                      )}>
                        <Clock className="w-4 h-4" />
                        <span className="text-lg">{sinistro.prazoRegulatorio}</span>
                        <span className="text-xs">dias</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-500 text-sm">
                        Ver detalhes
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}

            {sinistrosFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum sinistro encontrado com os filtros selecionados</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
