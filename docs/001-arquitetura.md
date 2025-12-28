# SDS Regulação - Arquitetura do Front-end

## 1. Visão Geral

O **SDS Regulação** é o portal técnico para análise e regulação de sinistros, seguindo o conceito **agent-first**:
- Agentes (IA) executam análises e decisões preliminares
- Humanos (analistas e peritos) acompanham, aprovam, ajustam ou refazem análises

## 2. Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15.x | Framework React com App Router |
| React | 19.x | Biblioteca UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Estilização |
| Radix UI | - | Componentes acessíveis |
| Lucide React | - | Ícones (mesmo do Comunicado) |

## 3. Estrutura de Diretórios

```
sds-fe-regulacao/
├── app/                        # App Router (Next.js 15)
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Página inicial (redirect para /sinistros)
│   ├── globals.css             # Estilos globais + tokens
│   ├── sinistros/
│   │   ├── page.tsx            # Fila de sinistros
│   │   └── [id]/
│   │       ├── page.tsx        # Detalhe do sinistro + Stepper
│   │       ├── documentos/
│   │       │   └── page.tsx    # Documentos do sinistro
│   │       ├── acompanhamento/
│   │       │   └── page.tsx    # Timeline de ações
│   │       ├── fluxo/
│   │       │   └── page.tsx    # Fluxo visual dinâmico
│   │       └── pericia/
│   │           └── page.tsx    # Avaliação técnica (perito)
├── components/
│   ├── layout/                 # Header, TopBar, etc.
│   ├── sinistro/               # Componentes do sinistro
│   ├── stepper/                # Stepper do analista
│   ├── agent/                  # Indicadores agent-first
│   └── ui/                     # Componentes base (Radix)
├── lib/
│   ├── constants/              # Constantes do domínio
│   ├── services/               # Clients API
│   └── utils.ts                # Utilitários
├── providers/
│   ├── sinistro-context.tsx    # Estado do sinistro
│   └── usuario-context.tsx     # Perfil do usuário
├── types/
│   └── index.ts                # Tipos TypeScript
├── data/
│   └── mocks/                  # Dados mock para dev
└── docs/                       # Documentação
```

## 4. Rotas

| Rota | Descrição | Perfis |
|------|-----------|--------|
| `/sinistros` | Fila de sinistros | Todos |
| `/sinistros/[id]` | Detalhe + Stepper | Analista |
| `/sinistros/[id]/documentos` | Documentos | Todos |
| `/sinistros/[id]/acompanhamento` | Timeline | Todos |
| `/sinistros/[id]/fluxo` | Fluxo visual | Todos |
| `/sinistros/[id]/pericia` | Avaliação técnica | Perito |

## 5. Stepper do Analista

O stepper é **sequencial e obrigatório**:

1. **Dados do Segurado** → Sempre acessível
2. **Coberturas da Apólice** → Após validar dados
3. **Beneficiários** → Após definir cobertura
4. **Pagamentos** → Após definir beneficiários

### Regras de Gating

- Sem cobertura definida → Beneficiários bloqueado
- Sem beneficiários → Pagamento bloqueado
- Cada etapa mostra indicadores "Analisado pelo agente"

## 6. Conceito Agent-First

Todas as telas devem exibir claramente:

- **Indicadores visuais**: "Analisado pelo agente", "Calculado pelo agente"
- **Ações humanas**: Aprovar, Ajustar, Refazer análise, Solicitar documentos
- **Rastreabilidade**: Timeline com ações agenticas e humanas separadas
- **Cadeia de raciocínio**: Modal com logs de decisão do agente

## 7. Tokens Visuais (Comunicado)

Manter exatamente os mesmos tokens:

```css
:root {
  --primary: #030213;
  --background: #fff;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --destructive: #d4183d;
  --border: #0000001a;
  --input-background: #f3f3f5;
}
```

Cores específicas do SDS:
- Teal/Cyan: `#1CB5C8` - Ações primárias
- Rosa: `#e91e63` / `pink-500` - Ações humanas
- Verde: `green-500/600` - Confirmações/Agent validado
- Amarelo: `yellow-500/600` - Alertas/Pendências

## 8. Integração com Backend

### Endpoints Esperados (fase futura)

- `GET /sinistros` - Lista de sinistros
- `GET /sinistros/:id` - Detalhe do sinistro
- `GET /sinistros/:id/documentos` - Documentos
- `GET /sinistros/:id/timeline` - Acompanhamento
- `POST /sinistros/:id/aprovar` - Aprovar etapa
- `POST /sinistros/:id/solicitar-documento` - Solicitar doc

### Mock-first Development

Durante o desenvolvimento, usar mocks realistas em `/data/mocks/`.

