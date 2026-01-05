# SDS — Jornada de Regulação Agêntica (Agent-First)
> Documento de referência para o repositório **sds-fe-regulacao**  
> Finalidade: alinhar entendimento do time sobre **propósito**, **escopo**, **perfis de acesso** e **fluxo** desta interface de Regulação.

---

## 1. Propósito desta interface
Este front-end representa a **jornada de Regulação de Sinistro** da SDS, construída sob o princípio **Agent-First**.

### O que “Agent-First” significa aqui
- Os **agentes executam** a maior parte do trabalho operacional e analítico do sinistro:
  - interpretação e classificação de documentos
  - extração de dados relevantes (quando aplicável)
  - validações de elegibilidade e consistência
  - identificação de pendências (documentos faltantes)
  - pré-cálculo e preparação de pagamento (quando aplicável)
  - geração de pareceres preliminares (especialistas)
- A interface humana existe para:
  - **acompanhar** o que os agentes fizeram
  - **aprovar / ajustar / refazer** análises e decisões
  - **solicitar novos documentos**
  - **emitir decisões finais** (especialmente em fluxos técnicos e/ou divergentes)

Em resumo: o sistema prioriza automação e consistência por agentes, e mantém humanos como **validador final** e **tratamento de exceções**.

---

## 2. Relação com a Jornada do Comunicado (etapa anterior)
A Regulação é a **segunda etapa** de uma jornada maior.

### Etapa 1 — Comunicado de Sinistro (usuário final)
O usuário final (segurado, beneficiário, parente ou representante) realiza:
- abertura do comunicado
- entrada de informações iniciais
- upload de documentos
- validações iniciais no front (quando aplicável)

Após o envio:
- ocorre a **avaliação inicial de elegibilidade e consistência pelos agentes**
- os documentos passam por classificação/triagem e preparação de dados
- o comunicado **culmina na abertura formal do Aviso do Sinistro**

### Etapa 2 — Regulação de Sinistro (técnico)
A Regulação inicia quando:
- o sinistro/aviso já existe no domínio interno
- os agentes já produziram evidências, pendências e análises preliminares
- o sinistro entra em uma **fila de trabalho** atribuída automaticamente aos perfis técnicos

Esta interface (Regulação) é, portanto, uma continuação direta do Comunicado, mas voltada ao **corpo técnico**.

---

## 3. Perfis de acesso e responsabilidades
A aplicação atende múltiplos perfis, cada um com visão e responsabilidades específicas.

### 3.1 Analista de Regulação
Responsável por conduzir o sinistro no fluxo principal de regulação, incluindo:
- validação dos dados do segurado
- validação de coberturas
- cadastro/ajuste de beneficiários
- condução de solicitações de documentos
- validação e aprovação de pagamentos
- acompanhamento e encerramento do sinistro
- solicitação de documentos adicionais

O analista atua sobre o **Stepper sequencial** (fluxo principal).

### 3.2 Perito / Especialista Técnico (ex.: médico)
Responsável por avaliar aspectos técnicos específicos, incluindo:
- revisão de documentos e evidências relacionadas à sua especialidade
- validação ou divergência do parecer do agente especialista
- solicitação de documentos adicionais
- emissão de parecer técnico

O especialista não percorre o stepper do analista; ele possui **fluxo apartado**, acionado quando necessário.

### 3.3 Analista Administrador (adm)
Perfil com visão ampliada da operação:
- visualiza fila completa (não apenas itens atribuídos)
- acompanha o andamento e pode intervir conforme regras internas
- pode redirecionar o sinistro da fila a outro analista

---

## 4. Conceitos centrais da Regulação
### 4.1 Fila de Sinistros (ponto de entrada)
Todos os perfis iniciam pela **Fila de Sinistros**, que lista:
- sinistros atribuídos automaticamente ao usuário logado
- status, prioridade e dados resumidos
- acesso ao detalhe do sinistro

Perfis “adm” podem visualizar uma fila mais ampla.

### 4.2 Sinistro como entidade auditável
A Regulação exige rastreabilidade. Por isso, o sinistro deve manter:
- histórico de ações agenticas (o que o agente fez)
- histórico de ações humanas (o que foi aprovado/alterado/decidido)
- eventos formais de negócio (ex.: abertura do aviso, alteração de reserva, solicitações, pagamentos, encerramento)

### 4.3 Prazo legal (SLA) e suspensão por documentos
A regulação segue um prazo legal (ex.: 30 dias corridos) e deve refletir:
- quando o prazo está contando normalmente
- quando o prazo está suspenso por solicitação de documento
- quando o prazo retoma após entrega do documento

A interface deve permitir acompanhar esse estado como informação operacional.

---

## 5. Fluxo do Analista (Stepper sequencial)
O fluxo principal do analista é implementado como **Stepper obrigatório e sequencial**, pois existem dependências naturais entre etapas.

### 5.1 Abertura do Aviso (marco inicial)
- consolida o resumo do comunicado (dados e documentos)
- registra dados formais do aviso (datas, natureza/causa/tipo)
- evidencia a ação inicial dos agentes e as pendências iniciais

### 5.2 Dados do Segurado
- validação/ajuste dos dados cadastrais relevantes

### 5.3 Coberturas
- validação da cobertura aplicável ao evento
- correspondência com cobertura atuarial/eligibilidade detectada pelos agentes

### 5.4 Beneficiários
- cadastro, validação e ajustes de beneficiários/favorecidos
- etapa necessária antes de pagamento

### 5.5 Pagamentos
- avaliação de pagamentos propostos/preparados pelos agentes
- suporte a múltiplos pagamentos (ex.: períodos mensais)
- acesso ao detalhe individual de cada pagamento
- aprovação, correção e justificativas (quando aplicável)

> Dependências: sem coberturas não há pagamentos; sem beneficiários não há pagamento.

---

## 6. Telas transversais (comuns e acessíveis a qualquer momento)
Existem telas que não pertencem ao stepper, mas são acessíveis de forma transversal:

### 6.1 Documentos do Sinistro (comum a Analista e Perito)
Centraliza:
- documentos enviados (com status de análise)
- documentos pendentes/solicitados
- upload e solicitações de novos documentos
- evidência do impacto no SLA (quando aplicável)

Esta tela é um ponto crítico, pois tanto analistas quanto especialistas podem solicitar documentos.

### 6.2 Acompanhamento do Sinistro
Exibe:
- timeline de ações (agente e humanas)
- eventos operacionais e decisões
- rastreabilidade do que mudou e quando

### 6.3 Fluxo Visual Dinâmico da Jornada (Conceito de Workflow Visual)
Exibe uma visão macro do fluxo do sinistro:
- etapas da jornada do caso específico
- status: concluído / atual / futuro
- evidências do que foi feito pelo agente e o que aguarda validação humana

---

## 7. Fluxo do Perito/Especialista (apartado)
O especialista acessa o sinistro via fila e executa um fluxo próprio:
- revisa documentos e evidências do caso
- avalia parecer do agente especialista
- decide:
  - concordar com o agente
  - divergir e emitir novo parecer
- pode solicitar documentos adicionais pela tela de Documentos

A decisão do especialista:
- deve ser registrada como ação humana
- deve atualizar o estado do sinistro (quando aplicável)

---

## 8. O que este protótipo representa (e o que não representa)
### Representa
- validação de jornada
- pontos de controle humano
- navegação e estados visuais
- consistência com identidade do Comunicado
- funcionamento com mocks/dados simulados enquanto integrações não existirem

### Não representa
- regras completas de negócio do backend
- integração final com sistemas legados
- processamento real de documentos/pagamentos
- fluxos finais de produção (auditoria e compliance completos)

---

## 9. Princípio de consistência com o Comunicado
Mesmo sendo uma interface técnica, esta aplicação deve:
- manter o mesmo framework e padrões do front do Comunicado
- reaproveitar design tokens e componentes já existentes
- evitar introduzir novos padrões visuais, ícones ou bibliotecas não previstas

---

## 10. Resumo
A Regulação SDS é a **etapa técnica** posterior ao Comunicado do usuário final.  
Ela parte de um sinistro já iniciado e analisado pelos agentes, e fornece à seguradora uma interface para:
- validar e completar o caso
- solicitar pendências
- conduzir pagamentos
- coletar pareceres técnicos
- manter rastreabilidade total (ações agenticas e humanas)

O produto é **agent-first**: agentes executam e humanos controlam/validam.

---
