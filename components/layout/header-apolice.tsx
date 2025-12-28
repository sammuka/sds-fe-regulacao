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
    <div className="fixed top-[72px] left-0 right-0 z-40 px-4 pt-3">
      <div className="bg-gradient-to-r from-[#6ec8e5] to-[#1c7b99] flex items-center justify-between px-4 py-3 max-w-[1200px] mx-auto rounded-xl shadow-md overflow-hidden">
        {/* Informações da Apólice */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Número da Apólice e Produto */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-['Poppins'] font-semibold text-sm text-white whitespace-nowrap">
              Apólice {apolice.numero}
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white font-['Poppins'] whitespace-nowrap">
              {apolice.produto}
            </span>
          </div>

          {/* Dados do Segurado */}
          <div className="flex items-center gap-4 text-white/90 min-w-0">
            <div className="shrink-0">
              <p className="text-[10px] font-['Poppins'] opacity-80">Segurado</p>
              <p className="font-['Poppins'] font-medium text-xs truncate max-w-[120px]">{apolice.segurado}</p>
            </div>
            <div className="shrink-0">
              <p className="text-[10px] font-['Poppins'] opacity-80">Ramo</p>
              <p className="font-['Poppins'] font-medium text-xs">{apolice.ramo}</p>
            </div>
            <div className="shrink-0 hidden md:block">
              <p className="text-[10px] font-['Poppins'] opacity-80">Vigência</p>
              <p className="font-['Poppins'] font-medium text-xs whitespace-nowrap">
                {apolice.inicioVigencia} a {apolice.terminoVigencia}
              </p>
            </div>
            <div className="shrink-0 hidden lg:block">
              <p className="text-[10px] font-['Poppins'] opacity-80">Data Emissão</p>
              <p className="font-['Poppins'] font-medium text-xs">{apolice.dataEmissao}</p>
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
