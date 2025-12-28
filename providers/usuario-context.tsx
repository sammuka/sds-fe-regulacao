'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { PerfilUsuario } from '@/types'

interface Usuario {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
}

interface UsuarioContextType {
  usuario: Usuario | null
  perfil: PerfilUsuario
  setPerfil: (perfil: PerfilUsuario) => void
  isAnalista: boolean
  isAnalistaAdmin: boolean
  isPerito: boolean
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined)

// Mock de usuário para desenvolvimento
const mockUsuario: Usuario = {
  id: 'USR-001',
  nome: 'Carlos Silva',
  email: 'carlos.silva@sds.com.br',
  perfil: 'analista',
}

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario] = useState<Usuario | null>(mockUsuario)
  const [perfil, setPerfil] = useState<PerfilUsuario>('analista')

  const value: UsuarioContextType = {
    usuario,
    perfil,
    setPerfil,
    isAnalista: perfil === 'analista',
    isAnalistaAdmin: perfil === 'analista-admin',
    isPerito: perfil === 'perito',
  }

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  )
}

export function useUsuario() {
  const context = useContext(UsuarioContext)
  if (context === undefined) {
    throw new Error('useUsuario deve ser usado dentro de um UsuarioProvider')
  }
  return context
}

