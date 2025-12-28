import type { Metadata } from 'next'
import './globals.css'
import { SinistroProvider } from '@/providers/sinistro-context'
import { UsuarioProvider } from '@/providers/usuario-context'

export const metadata: Metadata = {
  title: 'SDS Regulação - Regulação de Sinistros',
  description: 'Sistema de Regulação de Sinistros - Agent-First',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <UsuarioProvider>
          <SinistroProvider>
            {children}
          </SinistroProvider>
        </UsuarioProvider>
      </body>
    </html>
  )
}

