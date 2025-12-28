'use client'

import Link from 'next/link'
import { TopBar } from '@/components/layout/top-bar'
import { useUsuario } from '@/providers/usuario-context'
import { useSinistro } from '@/providers/sinistro-context'
import { FileText, DollarSign, Calendar, ChevronRight, Clock, AlertCircle, Scale, Stethoscope } from 'lucide-react'
import { formatCurrency, getStatusColor, getSLAColor } from '@/lib/utils'

export default function FilaSinistrosPage() {
  const { perfil } = useUsuario()
  const { sinistros, selecionarSinistro } = useSinistro()

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

  // Identificador de cenário para teste
  const getCenarioLabel = (id: string) => {
    if (id === 'SIN-2024-001001') return { label: 'Cenário A', desc: 'Fluxo padrão', color: 'bg-green-100 text-green-700' }
    if (id === 'SIN-2024-001002') return { label: 'Cenário B', desc: 'Perícia + Judicial', color: 'bg-purple-100 text-purple-700' }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      <main className="bg-[#f5f5f5] flex justify-center px-4 py-8">
        <div className="w-full max-w-[1156px]">
          <div className="mb-6">
            <h1 className="font-['Poppins'] text-[#424242] text-[28px] mb-2">
              {getTituloFila()}
            </h1>
            <p className="font-['Poppins'] text-[#707070]">
              {sinistros.length} sinistro{sinistros.length !== 1 ? 's' : ''} em sua fila
            </p>
          </div>

          {/* Legenda dos cenários de teste */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800 font-medium mb-2">Cenários de Teste</div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Cenário A</span>
                <span className="text-gray-600">Fluxo padrão (sem perícia, sem judicial)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Cenário B</span>
                <span className="text-gray-600">Perícia + Pendência de docs + Judicial</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {sinistros.map((sinistro) => {
              const cenario = getCenarioLabel(sinistro.id)
              const temJudicial = sinistro.dadosJudicial?.possuiProcesso
              const temPericia = sinistro.cicloPericia?.status && sinistro.cicloPericia.status !== 'nao-iniciada'
              
              return (
                <Link
                  key={sinistro.id}
                  href={`/sinistros/${sinistro.id}`}
                  onClick={() => selecionarSinistro(sinistro.id)}
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-gray-900 font-medium">{sinistro.numero}</div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(sinistro.status)}`}>
                        {sinistro.status}
                      </span>
                      {cenario && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${cenario.color}`}>
                          {cenario.label}
                        </span>
                      )}
                      {sinistro.sla?.slaSuspenso && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          <AlertCircle className="w-3 h-3" />
                          SLA Suspenso
                        </span>
                      )}
                      {temJudicial && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          <Scale className="w-3 h-3" />
                          Judicial
                        </span>
                      )}
                      {temPericia && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          <Stethoscope className="w-3 h-3" />
                          Em Perícia
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Prazo Regulatório</div>
                      <div className={`flex items-center gap-1 ${sinistro.sla ? getSLAColor(sinistro.sla.diasRestantes, sinistro.sla.slaTotal) : 'text-gray-900'}`}>
                        <Clock className="w-4 h-4" />
                        {sinistro.prazoRegulatorio} dias <span className="text-sm text-gray-500">restantes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-900 mb-1">{sinistro.segurado}</div>
                    <div className="text-sm text-gray-600">
                      Comunicado: {sinistro.comunicadoId}
                      {cenario && <span className="ml-2 text-gray-400">• {cenario.desc}</span>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-500">Tipo</div>
                        <div className="text-sm text-gray-900">{sinistro.tipo}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-500">Valor</div>
                        <div className="text-sm text-gray-900">
                          {formatCurrency(sinistro.valor)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-500">Apólice</div>
                        <div className="text-sm text-gray-900">{sinistro.apolice}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-500">Fase</div>
                        <div className="text-sm text-gray-900">{sinistro.fase}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end text-[#1CB5C8] gap-2">
                    <span className="text-sm">Ver detalhes</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
