'use client'

import { useMemo } from 'react'
import { ConexaoFluxo, NoFluxo, NODE_WIDTH, NODE_HEIGHT, TipoConexao } from '@/types/fluxo-visual'

interface FlowConnectionsProps {
  conexoes: ConexaoFluxo[]
  nos: NoFluxo[]
}

// Cores por tipo de conexão
const CoresPorTipoConexao: Record<TipoConexao, { stroke: string; dash?: string }> = {
  'principal': { stroke: '#239dc5' },
  'desvio': { stroke: '#f59e0b', dash: '6,3' },
  'retorno': { stroke: '#10b981', dash: '4,4' },
  'paralelo': { stroke: '#8b5cf6', dash: '2,2' },
}

export function FlowConnections({ conexoes, nos }: FlowConnectionsProps) {
  const mapaNodes = useMemo(() => {
    const mapa = new Map<string, NoFluxo>()
    nos.forEach(no => mapa.set(no.id, no))
    return mapa
  }, [nos])

  // Calcula centro inferior do nó (saída)
  const getCentroInferior = (no: NoFluxo) => ({
    x: no.posicao.x + NODE_WIDTH / 2,
    y: no.posicao.y + NODE_HEIGHT,
  })

  // Calcula centro superior do nó (entrada)
  const getCentroSuperior = (no: NoFluxo) => ({
    x: no.posicao.x + NODE_WIDTH / 2,
    y: no.posicao.y,
  })

  // Calcula lateral direita do nó
  const getLateralDireita = (no: NoFluxo) => ({
    x: no.posicao.x + NODE_WIDTH,
    y: no.posicao.y + NODE_HEIGHT / 2,
  })

  // Calcula lateral esquerda do nó
  const getLateralEsquerda = (no: NoFluxo) => ({
    x: no.posicao.x,
    y: no.posicao.y + NODE_HEIGHT / 2,
  })

  // Gera o path SVG para uma conexão
  const gerarPath = (conexao: ConexaoFluxo): string | null => {
    const noOrigem = mapaNodes.get(conexao.origem)
    const noDestino = mapaNodes.get(conexao.destino)

    if (!noOrigem || !noDestino) return null

    const origemX = noOrigem.posicao.x
    const destinoX = noDestino.posicao.x

    // Conexão para a direita (desvio)
    if (conexao.tipo === 'desvio' && destinoX > origemX) {
      const p1 = getLateralDireita(noOrigem)
      const p2 = getLateralEsquerda(noDestino)
      const midX = (p1.x + p2.x) / 2
      return `M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`
    }

    // Conexão de retorno (da direita para esquerda ou diagonal)
    if (conexao.tipo === 'retorno') {
      const p1 = getCentroInferior(noOrigem)
      
      // Se o destino está à esquerda
      if (destinoX < origemX) {
        const p2 = getLateralDireita(noDestino)
        return `M ${p1.x} ${p1.y} L ${p1.x} ${p1.y + 25} L ${p2.x + 25} ${p1.y + 25} L ${p2.x + 25} ${p2.y} L ${p2.x} ${p2.y}`
      }
      
      // Retorno para baixo
      const p2 = getCentroSuperior(noDestino)
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
    }

    // Conexão principal (vertical)
    const p1 = getCentroInferior(noOrigem)
    const p2 = getCentroSuperior(noDestino)

    // Se está alinhado ou quase
    if (Math.abs(p1.x - p2.x) < 40) {
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
    }

    // Curva para conectar nós desalinhados
    const midY = (p1.y + p2.y) / 2
    return `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`
  }

  // Posição do label
  const getPosicaoLabel = (conexao: ConexaoFluxo): { x: number; y: number } | null => {
    const noOrigem = mapaNodes.get(conexao.origem)
    const noDestino = mapaNodes.get(conexao.destino)
    if (!noOrigem || !noDestino) return null

    if (conexao.tipo === 'desvio') {
      const p1 = getLateralDireita(noOrigem)
      const p2 = getLateralEsquerda(noDestino)
      return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 - 10 }
    }

    if (conexao.tipo === 'retorno' && noDestino.posicao.x < noOrigem.posicao.x) {
      const p1 = getCentroInferior(noOrigem)
      const p2 = getLateralDireita(noDestino)
      return { x: p2.x + 35, y: (p1.y + p2.y) / 2 }
    }

    const p1 = getCentroInferior(noOrigem)
    const p2 = getCentroSuperior(noDestino)
    return { x: (p1.x + p2.x) / 2 + 12, y: (p1.y + p2.y) / 2 }
  }

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker id="arrow-principal" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#239dc5" />
        </marker>
        <marker id="arrow-desvio" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
        </marker>
        <marker id="arrow-retorno" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
        </marker>
        <marker id="arrow-paralelo" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" />
        </marker>
      </defs>

      {conexoes.map((conexao) => {
        const path = gerarPath(conexao)
        const cores = CoresPorTipoConexao[conexao.tipo]
        const posLabel = conexao.label ? getPosicaoLabel(conexao) : null

        if (!path) return null

        return (
          <g key={conexao.id}>
            <path
              d={path}
              fill="none"
              stroke={cores.stroke}
              strokeWidth="2"
              strokeDasharray={cores.dash}
              markerEnd={`url(#arrow-${conexao.tipo})`}
            />
            {conexao.label && posLabel && (
              <g>
                <rect
                  x={posLabel.x - 40}
                  y={posLabel.y - 7}
                  width="80"
                  height="14"
                  rx="3"
                  fill="white"
                  stroke={cores.stroke}
                  strokeWidth="1"
                />
                <text
                  x={posLabel.x}
                  y={posLabel.y + 3}
                  textAnchor="middle"
                  fontSize="9"
                  fill={cores.stroke}
                  fontFamily="Poppins, sans-serif"
                >
                  {conexao.label}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
