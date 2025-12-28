# CHECKLIST DE VALIDAÇÃO - SDS Regulação

Este documento descreve os passos para validar os dois cenários implementados no protótipo.

---

## 🎯 Pré-requisitos

1. Iniciar o servidor de desenvolvimento:
   ```bash
   cd Regulacao/sds-fe-regulacao
   npm run dev
   ```

2. Acessar: `http://localhost:3000`

---

## ✅ Cenário A - Fluxo Padrão (sem judicialização e sem perícia)

**Sinistro:** `SIN-2024-001001` - João Silva Santos  
**Descrição:** Fluxo padrão com morte natural, sem perícia, sem processo judicial.

### Passos de Validação

#### 1. Fila de Sinistros
- [ ] Abrir `http://localhost:3000/sinistros`
- [ ] Verificar que o sinistro `SIN-2024-001001` aparece com tag **"Cenário A"** (verde)
- [ ] Verificar que **NÃO** possui badges "Judicial" ou "Em Perícia"
- [ ] Verificar status do SLA: **Não suspenso**

#### 2. Step "Abertura do Aviso" (Etapa 0)
- [ ] Clicar no sinistro para abrir o detalhe
- [ ] Verificar que a **Etapa 0 - Abertura do Aviso** está selecionada
- [ ] Verificar seção **"Resumo do Comunicado"**:
  - Comunicante: Maria Silva Santos
  - Email e telefone preenchidos
  - Relato do evento presente
  - Documentos enviados listados
- [ ] Verificar seção **"Dados Formais do Aviso"**:
  - Número do aviso: AVI-2024-001001
  - Datas de ocorrência, aviso e registro
  - Natureza: Morte, Causa: Natural
  - "Abertura automática via Comunicado: Sim"
- [ ] Verificar **Prazo Regulatório (SLA)**:
  - SLA Total: 30 dias
  - Status: **Em andamento** (NÃO suspenso)
  - Sem períodos de suspensão
- [ ] Verificar **"Ações do Agente na Abertura"**:
  - Lista de 4 ações executadas
- [ ] Botão "Aprovar Abertura" disponível

#### 3. Navegação pelo Stepper
- [ ] Clicar em "Próxima" para ir para Etapa 1 (Dados do Segurado)
- [ ] Verificar dados do segurado João Silva Santos
- [ ] Avançar para Etapa 2 (Coberturas da Apólice)
- [ ] Verificar cobertura "Morte Natural" - R$ 100.000,00
- [ ] Avançar para Etapa 3 (Beneficiários)
- [ ] Verificar 3 beneficiários listados (Maria 50%, Pedro 25%, Ana 25%)
- [ ] Avançar para Etapa 4 (Pagamentos)

#### 4. Pagamentos (com atributos regulatórios)
- [ ] Verificar pagamento OP-2024-001001
- [ ] Status: **Pendente Aprovação** (não bloqueado)
- [ ] Tag "Total e Final" presente
- [ ] Clicar em "Ver detalhes completos"
- [ ] Verificar **"Informações do Pagamento"**:
  - Pagamento Total e Final: Sim
  - Corrigir até Pagamento: Sim
  - Justificativa de correção preenchida
- [ ] Verificar **"Multa e Mora"**:
  - Pagar Multa: Não
  - Pagar Mora: Não
- [ ] Verificar **"Detalhamento do Cálculo"**:
  - Índice: IPCA, Percentual: 2.35%
  - Valor total: R$ 102.345,67

#### 5. Acompanhamento (Timeline + Log Formal)
- [ ] Acessar `/sinistros/SIN-2024-001001/acompanhamento`
- [ ] Verificar aba **Timeline**:
  - Eventos agenticos e humanos na linha do tempo
  - Badges de "Agent" e botões de cadeia de raciocínio
- [ ] Clicar na aba **"Log Formal"**
- [ ] Verificar tabela com eventos de negócio:
  - "Aviso Aberto"
  - "Início Regulação"
  - "Beneficiário Cadastrado"
  - "Pagamento Gerado"
  - "Reserva Alterada"
- [ ] Verificar que **NÃO** existem eventos de SLA suspenso, perícia ou judicial

#### 6. Documentos
- [ ] Acessar `/sinistros/SIN-2024-001001/documentos`
- [ ] Verificar 4 documentos com status "Analisado"
- [ ] **NÃO** deve haver banner de "SLA Suspenso"
- [ ] **NÃO** deve haver documentos com status "Solicitado"

---

## ✅ Cenário B - Fluxo com Perícia + Pendência + Judicial

**Sinistro:** `SIN-2024-001002` - Maria Oliveira Costa  
**Descrição:** Invalidez permanente com perícia médica, pendência documental e processo judicial.

### Passos de Validação

#### 1. Fila de Sinistros
- [ ] Abrir `http://localhost:3000/sinistros`
- [ ] Verificar que o sinistro `SIN-2024-001002` aparece com tag **"Cenário B"** (roxo)
- [ ] Verificar badges:
  - **"SLA Suspenso"** (amarelo)
  - **"Judicial"** (vermelho)
  - **"Em Perícia"** (roxo)

#### 2. Step "Abertura do Aviso" (Etapa 0)
- [ ] Clicar no sinistro para abrir o detalhe
- [ ] Verificar seção **"Resumo do Comunicado"**:
  - Comunicante: Carlos Oliveira Costa
  - Relato sobre acidente e invalidez
- [ ] Verificar **Prazo Regulatório (SLA)**:
  - Status: **SUSPENSO** (badge amarelo)
  - Motivo: "Aguardando laudo médico pericial"
  - **Períodos de Suspensão** listados:
    - 08/11/2025 → 12/11/2025: Aguardando documentação
    - 15/11/2025 → Em andamento: Aguardando laudo pericial
- [ ] Verificar **"Ações do Agente na Abertura"**:
  - Inclui "Identificou necessidade de perícia médica"
  - Inclui "Gerou pendência documental"

#### 3. Documentos (com pendências)
- [ ] Acessar `/sinistros/SIN-2024-001002/documentos`
- [ ] Verificar **banner de SLA Suspenso** no topo
- [ ] Verificar documentos:
  - 4 documentos com status "Analisado"
  - 1 documento com status **"Entregue"** (Laudo Médico Detalhado)
    - Data de solicitação e data de entrega visíveis
  - 1 documento com status **"Solicitado"** (Laudo Perícia Médica)
    - Badge laranja
    - Data de solicitação e prazo sugerido visíveis
    - Indicação "Este documento suspende o SLA"

#### 4. Perícia/Avaliação Técnica (ciclo formal)
- [ ] Acessar `/sinistros/SIN-2024-001002/pericia`
- [ ] Verificar seção **"Ciclo da Perícia"**:
  - Status: **Aguardando Retorno**
  - Data de Envio: 15/11/2025
  - Previsão de Retorno: 30/11/2025
  - Especialista: Dra. Marina Costa - Medicina Traumatológica
  - Parecer Prévio do Agente com texto e confiança (78%)
- [ ] Verificar seção **"Dimensão Judicial"** (borda vermelha):
  - Número do Processo: 1234567-89.2025.8.26.0100
  - Vara: 5ª Vara Cível
  - Juízo: Foro Central Cível - São Paulo
  - Status: Aguardando perícia judicial
  - Probabilidade de Perda: 35%
  - Data de Entrada: 20/11/2025
  - Observações preenchidas
- [ ] Verificar opções de decisão do especialista:
  - "Concorda com o Agente"
  - "Diverge do Agente"
  - "Solicitar Documentos Adicionais"

#### 5. Pagamentos (bloqueado)
- [ ] Voltar ao detalhe do sinistro
- [ ] Navegar até Etapa 4 (Pagamentos)
- [ ] Verificar pagamento OP-2024-001002
- [ ] Status: **BLOQUEADO** (vermelho)
- [ ] Verificar **banner de bloqueio** com motivo:
  - "Aguardando conclusão de perícia médica e resolução do processo judicial"
- [ ] Verificar que botão "Aprovar Pagamento" está desabilitado
- [ ] Mensagem de bloqueio visível

#### 6. Acompanhamento (Log Formal completo)
- [ ] Acessar `/sinistros/SIN-2024-001002/acompanhamento`
- [ ] Clicar na aba **"Log Formal"**
- [ ] Verificar eventos específicos do cenário B:
  - "Documento Solicitado"
  - **"SLA Suspenso"** (fundo amarelo)
  - "Documento Entregue"
  - **"SLA Retomado"** (fundo verde)
  - "Perícia Enviada"
  - "Beneficiário Cadastrado"
  - **"Processo Judicial"** (fundo vermelho)
  - "Reserva Alterada"

---

## 📊 Resumo de Diferenças entre Cenários

| Aspecto | Cenário A | Cenário B |
|---------|-----------|-----------|
| SLA | Normal | Suspenso |
| Perícia | Não | Sim (aguardando) |
| Judicial | Não | Sim |
| Pagamento | Pendente aprovação | Bloqueado |
| Documentos pendentes | Não | Sim (1 solicitado) |
| Eventos no Log | 5 eventos | 11 eventos |
| Reserva | R$ 102.345,67 | R$ 225.000,00 |

---

## 🔄 Funcionalidades Transversais

- [ ] Stepper com gating funcionando (etapas bloqueadas até completar anteriores)
- [ ] Indicadores Agent-First presentes em todas as telas
- [ ] Navegação entre telas (Detalhe, Documentos, Acompanhamento, Fluxo, Perícia)
- [ ] TopBar e HeaderApolice exibindo informações corretas
- [ ] Responsividade básica

---

## ✨ Validação Concluída

Data: ____/____/____  
Validador: ________________  
Observações: ________________

