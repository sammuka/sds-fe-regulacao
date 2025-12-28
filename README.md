# SDS Regulação - Frontend

Portal técnico para regulação de sinistros, seguindo o conceito **Agent-First**.

## 📋 Visão Geral

O SDS Regulação é o portal utilizado por analistas e peritos para:
- Acompanhar sinistros em regulação
- Aprovar/ajustar análises realizadas por agentes (IA)
- Solicitar documentos adicionais
- Emitir pareceres técnicos
- Autorizar pagamentos

## 🚀 Stack Tecnológica

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
sds-fe-regulacao/
├── app/                      # App Router (páginas e rotas)
│   ├── sinistros/            # Rotas de sinistros
│   │   ├── page.tsx          # Fila de sinistros
│   │   └── [id]/             # Detalhe do sinistro
│   │       ├── page.tsx      # Stepper do analista
│   │       ├── documentos/   # Documentos
│   │       ├── acompanhamento/ # Timeline
│   │       ├── fluxo/        # Fluxo visual
│   │       └── pericia/      # Avaliação técnica
│   ├── globals.css           # Estilos globais
│   └── layout.tsx            # Layout raiz
├── components/               # Componentes React
│   ├── agent/                # Indicadores agent-first
│   ├── layout/               # TopBar, Header
│   ├── sinistro/             # Etapas do stepper
│   └── stepper/              # Componente stepper
├── providers/                # Contextos React
├── types/                    # Tipos TypeScript
├── lib/                      # Utilitários
├── data/mocks/               # Dados mock
└── docs/                     # Documentação
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

## 🎯 Funcionalidades Principais

### Fila de Sinistros
- Lista de sinistros por responsabilidade
- Filtros por status, SLA, tipo
- Indicadores de prazo regulatório

### Stepper do Analista
1. **Dados do Segurado** - Validação de dados pessoais
2. **Coberturas** - Análise de cobertura aplicável
3. **Beneficiários** - Gestão de beneficiários
4. **Pagamentos** - Cálculo e aprovação

### Telas Transversais
- **Documentos** - Upload e análise de documentos
- **Acompanhamento** - Timeline de ações (agent + humano)
- **Fluxo Visual** - Visualização dinâmica do processo
- **Perícia** - Avaliação técnica do especialista

## 🤖 Conceito Agent-First

O sistema reflete que agentes (IA) executam análises e o humano:
- **Aprova** decisões do agente
- **Ajusta** valores ou dados
- **Refaz** análises quando necessário
- **Solicita** documentos adicionais

Indicadores visuais mostram claramente o que foi "Analisado pelo agente" ou "Calculado pelo agente".

## ⏱️ SLA Regulatório

- Prazo legal de **30 dias corridos**
- **Suspensão** ao solicitar documentos
- **Retomada** ao receber documentos
- Indicadores visuais de prazo na UI

## 📚 Documentação

- [Arquitetura](./docs/001-arquitetura.md)
- [Regras de Negócio](./docs/002-regras-de-negocio.md)

## 🔗 Alinhamento com Comunicado

Este projeto mantém:
- Mesma identidade visual do Comunicado
- Mesmos tokens CSS (cores, tipografia)
- Mesmos componentes base (Radix UI)
- Mesmos ícones (Lucide React)
