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
    <div className="fixed top-[67px] left-0 right-0 z-40 px-4 py-1.5 bg-[var(--cinza-100)]">
      <div className="bg-gradient-to-r from-[#6ec8e5] to-[#1c7b99] px-4 py-2.5 max-w-[1200px] mx-auto rounded-xl shadow-md flex items-center justify-between gap-4">
        <div className="text-white font-['Poppins'] text-[11px] leading-relaxed flex-1">
          <div className="grid grid-cols-3 gap-x-8 gap-y-2">
            {/* Linha 1 */}
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] whitespace-nowrap">Apólice</span>
              <span className="font-semibold whitespace-nowrap">{apolice.numero}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] whitespace-nowrap">Segurado</span>
              <span className="font-semibold whitespace-nowrap truncate">{apolice.segurado}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] whitespace-nowrap">Vigência</span>
              <span className="font-medium whitespace-nowrap">{apolice.inicioVigencia} a {apolice.terminoVigencia}</span>
            </div>
            {/* Linha 2 */}
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] whitespace-nowrap">Ramo</span>
              <span className="font-semibold whitespace-nowrap">{apolice.ramo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] whitespace-nowrap">Produto</span>
              <span className="font-semibold whitespace-nowrap truncate">{apolice.produto}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] whitespace-nowrap">Emissão</span>
              <span className="font-medium whitespace-nowrap">{apolice.dataEmissao}</span>
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
