# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

# Workonnection
## Documentação dos Cenários de Teste utilizando a técnica BDD

**Integrantes do projeto:**
- Hugo Aparecido
- Paulo Roberto
- Caroline Mendes
- Priscila Mendes
- Gabriel Gutierres
- Guilherme Gomes

---

## Sumário
1. [Cadastro de Usuário](#1-cadastro-de-usuário)
2. [Importação de Documentos](#2-importação-de-documentos)
3. [Gerenciamento de Vagas](#3-gerenciamento-de-vagas)
4. [Chat e Mensagens](#4-chat-e-mensagens)
5. [Central de Notificações](#5-central-de-notificações)
6. [Referências](#referências)

---

## 1. Cadastro de Usuário

**Projeto:** Workonnection  
**Funcionalidade:** Cadastro de Usuário na Plataforma (Autônomo, MEI, Estudante e Contratante)

- **Como um** profissional autônomo, microempreendedor (MEI), estudante ou contratante
- **Eu quero** cadastrar uma nova conta na plataforma Workonnection informando meus dados pessoais e credenciais de acesso
- **Para que** eu possa acessar o sistema com segurança, divulgar meus serviços, candidatar-me a vagas ou recrutar talentos

### Especificação dos cenários de uso utilizando BDD

#### Cenário 1: Cadastro com sucesso (Caminho Feliz)

- **Dado que** não existe um usuário previamente cadastrado com o CPF `"83301677045"` nem com o e-mail `"carlos.silva@email.com"`
- **Quando** o usuário preenche e confirma a operação com as seguintes informações de cadastro:
  - **Nome:** Carlos da Silva
  - **CPF:** 83301677045
  - **Data de Nascimento:** 15/05/1998
  - **Telefone:** (11) 98765-4321
  - **E-mail:** carlos.silva@email.com
  - **Senha:** Senha@123
  - **Confirmação de Senha:** Senha@123
  - **Tipo de Usuário:** Autônomo
- **Então** o sistema realiza a criptografia da senha, persiste os dados no banco de dados, exibe a notificação de confirmação `"Cadastro realizado com sucesso!"` e redireciona o usuário para a tela de login com o perfil habilitado para autenticação.

#### Cenário 2: Cadastro de usuário com CPF inválido (Sem Sucesso)

- **Dado que** o `<CPF>` informado está inválido ou incorreto
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | 8330167704 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (tamanho menor que 11 dígitos) |
| Carlos Silva | *(vazio)* | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (vazio) |
| Carlos Silva | 11111111111 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (dígitos verificadores repetidos) |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (já cadastrado/duplicado) |

#### Cenário 3: Cadastro de usuário com Nome inválido (Sem Sucesso)

- **Dado que** o `<Nome>` informado não atende aos requisitos mínimos
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *(vazio)* | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Nome inválido (vazio) |
| `"   "` | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Nome inválido (em branco) |
| Al | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Mínimo 3 caracteres |

#### Cenário 4: Cadastro de usuário com Data de Nascimento / Idade inválida (Sem Sucesso)

- **Dado que** a `<Data Nasc.>` está vazia, em formato incorreto ou indica idade inferior a 16 anos ou superior a 100 anos
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | 83301677045 | *(vazio)* | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Data obrigatória |
| Carlos Silva | 83301677045 | 10/10/2015 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Mínimo 16 anos |
| Carlos Silva | 83301677045 | 01/01/1850 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Data inválida |

---

## 2. Importação de Documentos

**Projeto:** Workonnection  
**Funcionalidade:** Importação de Documentos Comprobatórios no Perfil

- **Como um** usuário autenticado da plataforma Workonnection
- **Eu quero** enviar, visualizar e substituir os documentos comprobatórios solicitados para a minha categoria de usuário
- **Para que** eu possa comprovar minhas qualificações, manter meu cadastro regularizado e associar os documentos ao meu perfil

### Especificação dos cenários de uso utilizando BDD

#### Cenário 1: Envio de documento comprobatório com sucesso (Caminho Feliz)

- **Dado que** o usuário está autenticado na plataforma e acessa a seção **"Documentos Comprobatórios"** em seu perfil
- **E** seleciona um tipo de documento exigido para sua categoria (ex.: `"COMPROVANTE_MATRICULA"`)
- **Quando** o usuário anexa um arquivo válido `"comprovante_2026.pdf"` com tamanho de 2,5 MB e clica em **"Enviar"**
- **Então** o sistema realiza o upload do documento com sucesso, armazena o arquivo associando-o ao perfil do usuário, atualiza a listagem exibindo o nome original do arquivo e seu tamanho formatado, e incrementa o contador de documentos enviados.

#### Cenário 2: Validação de arquivo inválido para envio (Sem Sucesso)

- **Dado que** o usuário está autenticado e tenta enviar um arquivo para um tipo de documento disponível
- **Quando** anexa um arquivo com `<Arquivo Informado>` e aciona o envio
- **Então** o sistema rejeita o upload e exibe a mensagem de validação `<Mensagem Esperada>`

| Tipo de Arquivo / Caso de Teste | Arquivo Informado | Tamanho | Mensagem Esperada |
| :--- | :--- | :--- | :--- |
| Extensão não permitida | `documento.docx` | 1.2 MB | Selecione um arquivo válido (PDF, PNG, JPG ou JPEG). |
| Extensão executável inválida | `instalador.exe` | 500 KB | Selecione um arquivo válido (PDF, PNG, JPG ou JPEG). |
| Tamanho acima do limite permitido | `digitalizacao_alta_resolucao.pdf` | 14.5 MB | O arquivo não pode exceder 10MB. |
| Arquivo vazio / sem conteúdo | `arquivo_zerado.pdf` | 0 KB | Nenhum arquivo enviado ou o arquivo está vazio |

#### Cenário 3: Substituição de documento já enviado (Caminho Feliz)

- **Dado que** o usuário autenticado já possui um arquivo associado ao tipo `"COMPROVANTE_MATRICULA"`
- **Quando** seleciona a opção **"Substituir"** e faz o upload de um novo arquivo válido `"matricula_atualizada.pdf"`
- **Então** o sistema substitui a versão anterior pelo novo arquivo, atualiza a data e os metadados do documento e mantém apenas a versão mais recente na listagem do perfil.

---

## 3. Gerenciamento de Vagas

**Projeto:** Workonnection  
**Funcionalidade:** Gerenciamento de Vagas (Criação, Edição, Exclusão e Consulta)

- **Como um** usuário cadastrado e autenticado na plataforma (Autônomo, MEI ou Contratante)
- **Eu quero** criar, consultar, filtrar, editar e excluir oportunidades de trabalho
- **Para que** eu possa divulgar demandas de projetos, atrair profissionais qualificados e gerenciar o ciclo de vida das minhas publicações

### Especificação dos cenários de uso utilizando BDD

#### Cenário 1: Publicação de vaga com sucesso (Caminho Feliz)

- **Dado que** o usuário está autenticado com um perfil autorizado a publicar vagas (ex.: Autônomo ou MEI)
- **Quando** o usuário abre o formulário de cadastro de vaga e informa os seguintes dados:
  - **Empresa:** Tech Soluções
  - **Cargo:** Desenvolvedor Full Stack
  - **Modalidade:** Remoto
  - **Horário Inicial / Final:** 09:00 às 18:00
  - **Localização:** São Paulo, SP
  - **Salário:** R$ 5.500,00
  - **Benefícios:** Vale Refeição, Auxílio Home Office
  - **Data Limite:** Data futura válida (ex.: 30 dias após hoje)
  - **E-mail de Contato:** recrutamento@techsolucoes.com
  - **Descrição:** Atuação no desenvolvimento e manutenção de sistemas web em React e Spring Boot.
  - **Requisitos:** Experiência com TypeScript, Java e bancos de dados relacionais ou NoSQL.
  - **Público-alvo:** Prestador de Serviço
- **E** aciona a ação **"Salvar Vaga"**
- **Então** o sistema valida todas as informações, cadastra a nova oportunidade na base de dados, exibe a notificação de confirmação e inclui a publicação na lista de vagas ativas da plataforma.

#### Cenário 2: Validação de formulário na criação ou edição de vaga (Sem Sucesso)

- **Dado que** o usuário está na tela de cadastro ou edição de vaga
- **Quando** tenta submeter o formulário informando a `<Condição de Entrada>`
- **Então** o sistema impede a gravação da vaga e exibe a `<Mensagem de Validação>` correspondente

| Campo Sob Validação | Condição de Entrada | Mensagem de Validação |
| :--- | :--- | :--- |
| Empresa | *(vazio)* | Obrigatório |
| Cargo | *(vazio)* | Obrigatório |
| Modalidade | *(não selecionada)* | Obrigatório |
| Localização | *(vazio)* | Obrigatório |
| Salário | *(vazio)* | Obrigatório |
| Benefícios | *(vazio)* | Obrigatório |
| Data Limite | *(vazio)* | Obrigatório |
| Data Limite no passado | Data anterior à data de hoje (ex.: `01/01/2020`) | Data no passado não é permitida |
| Descrição insuficiente | `"Vaga dev"` (menos de 10 caracteres) | Mínimo 10 caracteres |
| Requisitos insuficientes | `"Java"` (menos de 5 caracteres) | Mínimo 5 caracteres |
| E-mail de contato inválido | `"recrutamento.techsolucoes.com"` (sem formato válido) | E-mail inválido |
| Intervalo de horário inválido | Início `18:00` e Fim `08:00` (fim anterior ao início) | Hora final deve ser maior que a inicial |
| Público-alvo | Nenhum tipo selecionado | Selecione ao menos um tipo |

#### Cenário 3: Edição de vaga publicada

**3.1 – Edição de vaga própria com sucesso (Caminho Feliz):**
- **Dado que** o usuário possui uma vaga de sua autoria já publicada na plataforma
- **Quando** abre a edição dessa vaga, altera o salário para `"R$ 6.000,00"` e a descrição para `"Atuação em novos projetos web responsivos com React."` e salva
- **Então** o sistema valida as alterações, persiste a nova versão e exibe os dados atualizados na listagem.

**3.2 – Tentativa de edição de vaga pertencente a outro usuário (Sem Sucesso):**
- **Dado que** o usuário está autenticado, mas visualiza uma vaga publicada por outro usuário
- **Quando** tenta submeter uma alteração nessa publicação
- **Então** o sistema rejeita a operação e exibe a mensagem de permissão negada: `"Sem permissão para editar esta vaga"`.

#### Cenário 4: Exclusão de vaga publicada (Caminho Feliz)

- **Dado que** o autor da vaga acessa sua listagem em **"Minhas Vagas"**
- **Quando** seleciona a ação de excluir na vaga desejada e confirma o diálogo de exclusão
- **Então** o sistema remove definitivamente a vaga da plataforma e atualiza a listagem sem a vaga excluída.

#### Cenário 5: Consulta e filtragem de vagas na plataforma

- **Dado que** existem vagas cadastradas com diferentes modalidades e perfis
- **Quando** o usuário aplica o `<Critério de Filtro>` na tela de vagas
- **Então** o sistema apresenta o `<Resultado Esperado>`

| Tipo de Filtro | Critério de Filtro | Resultado Esperado |
| :--- | :--- | :--- |
| Busca textual por cargo/requisito | Digitar `"React"` | Listar apenas vagas cujo cargo, descrição ou requisitos contenham o termo "React" |
| Filtro por modalidade | Selecionar `"Remoto"` | Listar exclusivamente oportunidades com modalidade remota |
| Filtro combinado sem correspondência | Digitar termo inexistente `"XptoInexistente999"` | Exibir mensagem informando que não foram encontradas vagas para os filtros informados |

---

## 4. Chat e Mensagens

**Projeto:** Workonnection  
**Funcionalidade:** Sistema de Chat e Mensagens em Tempo Real

- **Como um** usuário cadastrado e autenticado na plataforma (profissional autônomo, MEI, estudante ou contratante)
- **Eu quero** trocar mensagens de texto em tempo real com outros contatos e gerenciar o histórico de conversas
- **Para que** eu possa tirar dúvidas sobre vagas, negociar orçamentos, alinhar serviços e manter comunicação profissional direta

### Especificação dos cenários de uso utilizando BDD

#### Cenário 1: Envio de mensagem de texto com sucesso (Caminho Feliz)

- **Dado que** o usuário `"Carlos Silva"` está autenticado e com a conversa aberta com o contato `"Mariana Souza"`
- **Quando** o usuário digita no campo de texto `"Olá Mariana, tudo bem? Gostaria de saber mais informações sobre a oportunidade."` e clica no botão de enviar
- **Então** o sistema realiza o envio da mensagem, transmite a notificação em tempo real para o destinatário, inclui o balão no histórico de mensagens com a indicação de status entregue e limpa o campo de digitação.

#### Cenário 2: Validação de conteúdo da mensagem ao enviar (Sem Sucesso)

- **Dado que** o remetente está com uma conversa ativa selecionada
- **Quando** tenta submeter uma mensagem com o `<Conteúdo>`
- **Então** o sistema valida o envio apresentando a `<Mensagem/Comportamento>`

| Remetente | Destinatário | Conteúdo | Botão Enviar | Mensagem/Comportamento |
| :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | Mariana Souza | *(vazio)* | Desabilitado | Envio impedido |
| Carlos Silva | Mariana Souza | `"   "` | Desabilitado | Envio impedido (apenas espaços) |
| Carlos Silva | Mariana Souza | `"Bom dia! Segue proposta: R$ 500,00."` | Habilitado | Mensagem enviada com sucesso |
| Carlos Silva | Mariana Souza | *(texto superior a 2000 caracteres)* | Habilitado | Erro: Tamanho máximo excedido |

#### Cenário 3: Edição de mensagem já enviada

- **Dado que** o usuário `"Carlos Silva"` enviou anteriormente uma mensagem no chat
- **Quando** o usuário clica na ação de editar mensagem, informa o novo conteúdo `<Novo Conteúdo>` e confirma a alteração
- **Então** o sistema valida a alteração aplicando o `<Resultado>`

| Usuário Solicitante | Conteúdo Original | Novo Conteúdo | Resultado |
| :--- | :--- | :--- | :--- |
| Carlos Silva (autor) | `"Boa tarde Marianna"` | `"Boa tarde Mariana"` | Mensagem atualizada com rótulo "(editada)" |
| Carlos Silva (autor) | `"Texto inicial"` | `""` (vazio) | Rejeitado: Conteúdo não pode ser vazio |
| Mariana Souza (não autor) | `"Texto de Carlos"` | `"Tentativa de edição"` | Rejeitado: Apenas o remetente pode editar |

#### Cenário 4: Exclusão de mensagem do histórico

- **Dado que** o usuário visualiza uma mensagem em seu histórico de mensagens
- **Quando** seleciona a opção `"Excluir para mim"` e confirma a caixa de confirmação
- **Então** o sistema oculta a mensagem da visualização do usuário solicitante, mantendo o histórico inalterado para o outro participante da conversa.

#### Cenário 5: Atualização automática de status de leitura

- **Dado que** o contato `"Mariana Souza"` possui mensagens não lidas enviadas por `"Carlos Silva"`
- **Quando** `"Mariana Souza"` acessa o chat e clica na conversa com `"Carlos Silva"`
- **Então** o sistema atualiza o status das mensagens pendentes para lidas, preenche o carimbo de data/hora de leitura e remove o badge de mensagens não lidas no menu de conversas.

---

## 5. Central de Notificações

**Projeto:** Workonnection  
**Funcionalidade:** Central de Notificações da Plataforma

- **Como um** usuário cadastrado na plataforma Workonnection
- **Eu quero** receber, visualizar e gerenciar as notificações de eventos (mensagens, propostas, candidaturas e avisos)
- **Para que** eu acompanhe atividades relevantes em tempo real e mantenha minha caixa de notificações organizada

### Especificação dos cenários de uso utilizando BDD

#### Cenário 1: Visualização da lista de notificações (Caminho Feliz)

- **Dado que** o usuário possui notificações recebidas em sua conta
- **Quando** o usuário clica no ícone de notificações na barra superior ou navega até a página de notificações
- **Então** o sistema apresenta a lista ordenada da notificação mais recente para a mais antiga (com limite máximo de até 50 notificações), destacando visualmente as notificações não lidas e exibindo o horário relativo de emissão de cada evento.

#### Cenário 2: Marcar notificação individual como lida

- **Dado que** existe uma notificação com status não lida na lista do usuário
- **Quando** o usuário clica no cartão da notificação ou no botão de marcar como lida
- **Então** o sistema altera o status da notificação para "lida", remove o destaque visual de não lida e decrementa em 1 a contagem de notificações pendentes no cabeçalho da aplicação.

#### Cenário 3: Marcar todas as notificações como lidas

- **Dado que** o usuário possui `<Qtd Não Lidas>` notificações pendentes no sistema
- **Quando** aciona o botão `"Marcar todas como lidas"`
- **Então** o sistema atualiza todas as notificações para o status de lida e atualiza o badge do contador para `<Contador Final>`

| Qtd Não Lidas | Estado Inicial da Lista | Ação Realizada | Contador Final |
| :--- | :--- | :--- | :--- |
| `8` | 8 notificações destacadas | Clicar em "Marcar todas como lidas" | `0` (badge oculto) |
| `1` | 1 notificação destacada | Clicar em "Marcar todas como lidas" | `0` (badge oculto) |
| `0` | Nenhuma notificação pendente | Botão desabilitado ou sem ação | `0` (badge inativo) |

#### Cenário 4: Exclusão individual de notificação

- **Dado que** uma notificação específica está visível na lista do usuário
- **Quando** o usuário aciona o botão de exclusão (ícone de lixeira) da notificação
- **Então** o sistema remove definitivamente a notificação da lista do usuário, recalcula os contadores e atualiza a interface instantaneamente.

#### Cenário 5: Limpeza completa da caixa de notificações

- **Dado que** a caixa de notificações do usuário contém um ou mais registros
- **Quando** o usuário seleciona a opção `"Limpar todas"` e confirma a ação
- **Então** o sistema remove todas as notificações armazenadas para aquele usuário e renderiza o estado vazio exibindo a mensagem `"Você não possui notificações no momento"`.

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.
