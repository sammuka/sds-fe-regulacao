'use client'

import Link from 'next/link'
import { useUsuario } from '@/providers/usuario-context'
import { FileText, Clock, Activity, Bell, User, Users, Stethoscope, ChevronDown, Check } from 'lucide-react'
import svgPaths from '@/components/assets/svg-paths'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PerfilUsuario } from '@/types'

// Componentes SVG do logo SDS (letras)
function LogoLetras() {
  return (
    <svg className="w-[50px] h-[18px]" fill="none" preserveAspectRatio="none" viewBox="0 0 60 21">
      <g>
        <path d={svgPaths.p275b5200} fill="url(#paint0_linear_header)" />
        <path d={svgPaths.p48b6580} fill="url(#paint1_linear_header)" />
        <path d={svgPaths.p2c715bf0} fill="url(#paint2_linear_header)" />
      </g>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_header" x1="11.3354" x2="2.00515" y1="22.9546" y2="3.95208">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_header" x1="33.7498" x2="25.9938" y1="22.5412" y2="2.78155">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_header" x1="53.6666" x2="44.3363" y1="22.9546" y2="3.95208">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Escudo SDS (copiado do Comunicado)
function LogoEscudo() {
  return (
    <svg className="w-[28px] h-[34px]" fill="none" viewBox="0 0 37 44">
      <g>
        <path d={svgPaths.pfc75000} fill="url(#paint_escudo_0)" />
        <path d={svgPaths.pbc8f180} fill="url(#paint_escudo_1)" />
        <path d={svgPaths.p146d3a00} fill="url(#paint_escudo_2)" />
        <path d={svgPaths.pac4d100} fill="#196F8C" />
        <path d={svgPaths.p2b105300} fill="#196F8C" />
        <path d={svgPaths.pa89ba80} fill="url(#paint_escudo_3)" />
        <path d={svgPaths.p3b2c0700} fill="url(#paint_escudo_4)" />
        <path d={svgPaths.p175dde00} fill="url(#paint_escudo_5)" />
        <path d={svgPaths.p21138f00} fill="url(#paint_escudo_6)" />
      </g>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint_escudo_0" x1="24.4499" x2="17.3218" y1="44.5333" y2="18.3096">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint_escudo_1" x1="15.5303" x2="10.8261" y1="34.1132" y2="19.0251">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint_escudo_2" x1="20.0604" x2="13.5463" y1="34.494" y2="18.2036">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint_escudo_3" x1="11.4614" x2="8.98848" y1="10.127" y2="3.86251">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint_escudo_4" x1="12.7926" x2="11.0457" y1="15.8087" y2="11.3832">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint_escudo_5" x1="15.5275" x2="14.5623" y1="2.75082" y2="0.305636">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint_escudo_6" x1="26.6861" x2="17.6397" y1="23.8629" y2="5.13003">
          <stop stopColor="#BBE1ED" />
          <stop offset="0.81" stopColor="#E9F5F9" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function LogoSds() {
  return (
    <div className="flex items-center gap-1.5">
      <LogoEscudo />
      <LogoLetras />
    </div>
  )
}

interface TopBarProps {
  sinistroNumero?: string
}

const perfilConfig: Record<PerfilUsuario, { label: string; icon: typeof User; color: string }> = {
  'analista': { label: 'Analista', icon: User, color: 'bg-blue-500' },
  'analista-admin': { label: 'Admin', icon: Users, color: 'bg-orange-500' },
  'perito': { label: 'Perito', icon: Stethoscope, color: 'bg-purple-500' },
}

export function TopBar({ sinistroNumero }: TopBarProps) {
  const { usuario, perfil, setPerfil } = useUsuario()

  const currentPerfil = perfilConfig[perfil]
  const PerfilIcon = currentPerfil.icon

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-3 bg-[var(--cinza-100)]">
      <div className="bg-[#239dc5] flex items-center gap-4 px-4 py-2.5 max-w-[1200px] mx-auto rounded-xl shadow-lg">
        <Link href="/sinistros" className="shrink-0">
          <LogoSds />
        </Link>
        
        <div className="flex-1 flex items-center gap-3">
          {/* Pill do módulo */}
          <div className="bg-[#e9f5f9] border border-[#4fb1d1] px-3 py-1.5 rounded-full shrink-0">
            <p className="font-['Poppins'] font-medium text-xs text-[#208fb3]">
              Regulação
            </p>
          </div>
          
          {/* Número do Sinistro */}
          {sinistroNumero && (
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full shrink-0">
              <FileText className="w-3.5 h-3.5 text-white" />
              <span className="font-['Poppins'] text-xs text-white">
                Sinistro: <span className="font-semibold">{sinistroNumero}</span>
              </span>
            </div>
          )}
        </div>

        {/* Navegação */}
        {sinistroNumero && (
          <nav className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href={`/sinistros/${sinistroNumero}`}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors font-['Poppins']"
            >
              <FileText className="w-3.5 h-3.5" />
              Regulação
            </Link>
            <Link
              href={`/sinistros/${sinistroNumero}/documentos`}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors font-['Poppins']"
            >
              <FileText className="w-3.5 h-3.5" />
              Documentos
            </Link>
            <Link
              href={`/sinistros/${sinistroNumero}/acompanhamento`}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors font-['Poppins']"
            >
              <Clock className="w-3.5 h-3.5" />
              Acompanhamento
            </Link>
            <Link
              href={`/sinistros/${sinistroNumero}/fluxo`}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors font-['Poppins']"
            >
              <Activity className="w-3.5 h-3.5" />
              Fluxo
            </Link>
          </nav>
        )}

        {/* Ações do Usuário */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Seletor de Perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors text-white text-xs">
                <PerfilIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">{currentPerfil.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-gray-500">Alternar Perfil</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(perfilConfig) as PerfilUsuario[]).map((key) => {
                const config = perfilConfig[key]
                const Icon = config.icon
                const isActive = perfil === key
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setPerfil(key)}
                    className="cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-full ${config.color} flex items-center justify-center mr-2`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="flex-1">{config.label}</span>
                    {isActive && <Check className="w-4 h-4 text-green-500" />}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Bell className="w-5 h-5 text-white cursor-pointer hover:text-white/80 transition-colors" />
          <div className={`${currentPerfil.color} w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}>
            <p className="font-['Poppins'] font-medium text-xs text-white">
              {usuario?.nome?.charAt(0) || 'C'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
