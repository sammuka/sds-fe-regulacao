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
    <div className="fixed top-[72px] left-0 right-0 z-40 px-4 pt-3 bg-gradient-to-b from-[var(--cinza-100)] via-[var(--cinza-100)] to-transparent pb-3">
      <div className="bg-gradient-to-r from-[#6ec8e5] to-[#1c7b99] flex items-center justify-between px-4 py-2.5 max-w-[1200px] mx-auto rounded-xl shadow-md overflow-hidden">
        {/* Informações da Apólice */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* Linha 1: Apólice e Segurado */}
          <div className="flex items-center gap-4 text-white text-xs font-['Poppins']">
            <span className="shrink-0">
              Apólice: <span className="font-semibold">{apolice.numero}</span>
            </span>
            <span className="shrink-0">
              Segurado: <span className="font-semibold truncate max-w-[200px] inline-block align-bottom">{apolice.segurado}</span>
            </span>
            <span className="shrink-0 hidden md:inline">
              Vigência: <span className="font-medium">{apolice.inicioVigencia} a {apolice.terminoVigencia}</span>
            </span>
          </div>

          {/* Linha 2: Ramo e Produto */}
          <div className="flex items-center gap-4 text-white text-xs font-['Poppins']">
            <span className="shrink-0">
              Ramo: <span className="font-semibold">{apolice.ramo}</span>
            </span>
            <span className="shrink-0">
              Produto: <span className="font-semibold">{apolice.produto}</span>
            </span>
            <span className="shrink-0 hidden lg:inline">
              Emissão: <span className="font-medium">{apolice.dataEmissao}</span>
            </span>
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
