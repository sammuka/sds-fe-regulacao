# SDS Regulação - Regras de Negócio

## 1. SLA Regulatório (30 dias)

### Regras de Contagem

- **Prazo total**: 30 dias corridos a partir da abertura do sinistro
- **Suspensão**: Ao solicitar documento, o prazo é suspenso
- **Retomada**: Ao receber documento, o prazo retoma a contagem
- **Exibição**: UI deve mostrar dias restantes e status do SLA

### Campos do SLA

```typescript
interface SLASinistro {
  slaTotal: number;           // 30 dias
  slaConsumido: number;       // Dias já utilizados
  slaSuspenso: boolean;       // Se está suspenso
  dataSuspensao?: Date;       // Quando foi suspenso
  motivoSuspensao?: string;   // "Aguardando documento X"
  historicoSuspensoes: SuspensaoSLA[];
}
```

## 2. Fluxo do Analista (Stepper)

### Etapa 1: Dados do Segurado

- Campos vindos do Comunicado de Sinistro
- Agente valida e extrai dados dos documentos
- Analista pode editar campos manualmente
- Ação: **Confirmar dados**

### Etapa 2: Coberturas da Apólice

- Agente identifica cobertura aplicável com base no tipo de sinistro
- Validação automática de:
  - Vigência da apólice
  - Carência cumprida
  - Prêmios em dia
- Analista confirma ou ajusta cobertura
- Ação: **Aprovar cobertura**

### Etapa 3: Beneficiários

- Agente sugere beneficiários com base em:
  - Declaração do segurado
  - Documentos enviados
  - Registros anteriores
- Analista pode:
  - Aprovar sugestão
  - Adicionar beneficiário
  - Remover beneficiário
  - Ajustar percentuais
- Validação: Soma dos percentuais = 100%
- Ação: **Confirmar beneficiários**

### Etapa 4: Pagamentos

- Agente calcula:
  - Valor base da cobertura
  - Correção monetária (IPCA/SELIC)
  - Valor total por beneficiário
- Analista pode:
  - Ver detalhamento do cálculo
  - Ajustar valores (com justificativa)
  - Aprovar pagamento
- Ação: **Aprovar pagamento** ou **Solicitar perícia**

## 3. Fluxo do Perito/Especialista

### Acesso Apartado

O perito acessa via rota `/sinistros/[id]/pericia` e pode:

1. **Corroborar com o agente**: Concorda com análise e recomendação
2. **Divergir**: Emite parecer negativo com justificativa
3. **Solicitar documentos**: Pede informações adicionais

### Parecer Técnico

```typescript
interface ParecerTecnico {
  tipo: 'aprovar' | 'reprovar' | 'solicitar-documentos';
  especialistaId: string;
  parecer: string;           // Fundamentação técnica
  data: Date;
  documentosSolicitados?: string[];
}
```

## 4. Documentos do Sinistro

### Estados de Documento

| Estado | Descrição |
|--------|-----------|
| `analisado` | Documento validado pelo agente |
| `pendente` | Aguardando análise |
| `solicitado` | Solicitado mas não enviado |
| `rejeitado` | Documento inválido/ilegível |

### Análise pelo Agente

- OCR e extração de dados
- Classificação automática do tipo
- Validação de autenticidade
- Cross-check com dados do sinistro

### Solicitação de Documentos

```typescript
interface SolicitacaoDocumento {
  id: string;
  documento: string;         // Tipo do documento
  justificativa: string;     // Motivo da solicitação
  prazo: string;             // Data limite
  solicitadoPor: string;     // Analista ou Perito
  status: 'pendente' | 'atendido' | 'vencido';
}
```

## 5. Timeline de Acompanhamento

### Tipos de Evento

| Tipo | Descrição | Ícone |
|------|-----------|-------|
| `agent` | Ação executada pelo agente | CPU |
| `humano` | Ação executada por pessoa | User |

### Categorias

- Abertura
- Validação
- Documentação
- Análise
- Regulação
- Pagamento
- Encerramento

### Cadeia de Raciocínio (Agent)

Para eventos `agent`, mostrar:
- Timestamp de cada passo
- Raciocínio do agente
- Ferramentas chamadas
- Resultados obtidos

## 6. Fluxo Visual Dinâmico

### Etapas do Fluxo

1. Atendimento Inicial
2. Cadastro do Cliente
3. Análise Jurídica
4. Distribuição da Demanda
5. Execução
6. Acompanhamento
7. Encerramento

### Estados das Etapas

- `concluida`: Verde, com check
- `em-andamento`: Azul, animação
- `pendente`: Cinza

### Indicadores Agent-First

Cada etapa mostra:
- Se foi executada por agente ou humano
- Se aguarda validação humana
- Timestamps de início e conclusão

## 7. Perfis de Usuário

### Analista

- Acesso à fila pessoal
- Stepper completo
- Aprovação de etapas
- Solicitação de documentos

### Analista Admin

- Acesso a todos os sinistros
- Redistribuição de casos
- Relatórios gerenciais

### Perito/Especialista

- Acesso apenas a casos atribuídos
- Fluxo de parecer técnico
- Sem acesso ao stepper de pagamento

## 8. Validações de Negócio

### Beneficiários

- Percentual total = 100%
- CPF válido e único
- Parentesco declarado
- Dados bancários (para pagamento)

### Pagamentos

- Valor ≤ Valor da cobertura
- Correção monetária oficial
- Todos beneficiários com dados bancários
- Sem pendências documentais

### Perícia

- Parecer obrigatório para divergência
- Documentos solicitados com prazo
- Histórico de pareceres anteriores

