'use client'

import { Apolice } from '@/types'
import { Clock, AlertCircle } from 'lucide-react'

interface HeaderApoliceProps {
  apolice: Apolice
  sla?: {
    diasRestantes: number
    slaSuspenso: boolean
    motivoSuspensao?: string
  }
}

export function HeaderApolice({ apolice, sla }: HeaderApoliceProps) {
  const getSLAColor = () => {
    if (!sla) return 'text-[#707070]'
    if (sla.slaSuspenso) return 'text-[#f59e0b]'
    if (sla.diasRestantes <= 5) return 'text-[#c3363d]'
    if (sla.diasRestantes <= 10) return 'text-[#f59e0b]'
    return 'text-[#10b981]'
  }

  const getSLABgColor = () => {
    if (!sla) return 'bg-[#f5f5f5]'
    if (sla.slaSuspenso) return 'bg-[#fffbeb]'
    if (sla.diasRestantes <= 5) return 'bg-[#fef2f2]'
    if (sla.diasRestantes <= 10) return 'bg-[#fffbeb]'
    return 'bg-[#ecfdf5]'
  }

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 px-4 pt-3 pb-3 bg-[#e1e1e1]">
      <div className="bg-gradient-to-r from-[#6ec8e5] to-[#1c7b99] flex items-center justify-between px-4 py-3 max-w-[1200px] mx-auto rounded-xl shadow-md">
        {/* Informações da Apólice */}
        <div className="flex-1 min-w-0 mr-4">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 text-white font-['Poppins']">
            <div className="min-w-0">
              <div className="text-[10px] text-white/80 mb-0.5 whitespace-nowrap">Apólice</div>
              <div className="text-sm font-semibold whitespace-nowrap">{apolice.numero}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-white/80 mb-0.5 whitespace-nowrap">Segurado</div>
              <div className="text-sm font-semibold truncate">{apolice.segurado}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-white/80 mb-0.5 whitespace-nowrap">Vigência</div>
              <div className="text-sm font-medium whitespace-nowrap">{apolice.inicioVigencia} a {apolice.terminoVigencia}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-white/80 mb-0.5 whitespace-nowrap">Ramo</div>
              <div className="text-sm font-semibold whitespace-nowrap">{apolice.ramo}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-white/80 mb-0.5 whitespace-nowrap">Produto</div>
              <div className="text-sm font-semibold truncate">{apolice.produto}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-white/80 mb-0.5 whitespace-nowrap">Emissão</div>
              <div className="text-sm font-medium whitespace-nowrap">{apolice.dataEmissao}</div>
            </div>
          </div>
        </div>

        {/* SLA */}
        {sla && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shrink-0 ${getSLABgColor()}`}>
            <Clock className={`w-4 h-4 ${getSLAColor()}`} />
            <div>
              <p className="text-[10px] font-['Poppins'] text-[#707070]">Prazo Regulatório</p>
              <p className={`font-['Poppins'] font-bold text-base leading-tight ${getSLAColor()}`}>
                {sla.slaSuspenso ? 'Suspenso' : `${sla.diasRestantes} dias`}
              </p>
            </div>
            {sla.slaSuspenso && sla.motivoSuspensao && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-[#f59e0b]" />
                <span className="text-[10px] text-[#707070] font-['Poppins'] max-w-[80px] truncate">
                  {sla.motivoSuspensao}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
