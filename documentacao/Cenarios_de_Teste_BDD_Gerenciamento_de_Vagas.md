# Documentação dos Cenários de Teste utilizando a técnica BDD

## Projeto: Workonnection

**Funcionalidade:** Gerenciamento de vagas

- **Como um** usuário autenticado com permissão para publicar vagas
- **Eu quero** criar, consultar, editar e excluir minhas publicações de vagas
- **Para que** eu possa divulgar oportunidades e manter as informações atualizadas na plataforma Workonnection

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Publicação de vaga com sucesso

- **Dado que** estou autenticado como um usuário autorizado a publicar vagas
- **E** informo os dados obrigatórios em formatos válidos:
  - **Empresa:** Workonnection
  - **Cargo:** Desenvolvedor Front-end
  - **Modalidade:** Remoto
  - **Horário inicial:** 09:00
  - **Horário final:** 17:00
  - **Localização:** São Paulo, SP
  - **Salário:** R$ 3.000,00
  - **Data de expiração:** uma data igual ou posterior à data atual
  - **E-mail de contato:** vagas@workonnection.com
  - **Descrição:** Desenvolvimento de interfaces web responsivas
  - **Requisitos:** Conhecimento em React e TypeScript
  - **Benefícios:** Vale-refeição
  - **Tipos de usuário:** Prestador de Serviço
- **Quando** preencho o formulário e seleciono **Salvar Vaga**
- **Então** o sistema envia os dados para criação da vaga
- **E** a vaga é salva e aparece na lista de minhas publicações.

---

### Cenário 2: Tentativa de publicação com campos obrigatórios vazios

- **Dado que** estou autenticado como um usuário autorizado a publicar vagas
- **Quando** tento salvar uma vaga sem preencher um ou mais dos campos obrigatórios abaixo
- **Então** o formulário não é enviado
- **E** o sistema apresenta a indicação **Obrigatório** nos campos vazios correspondentes.

| Campo | Valor de entrada | Resultado esperado |
| :--- | :--- | :--- |
| Empresa | *(vazio)* | Exibir "Obrigatório" |
| Cargo | *(vazio)* | Exibir "Obrigatório" |
| Modalidade | *(vazio)* | Exibir "Obrigatório" |
| Localização | *(vazio)* | Exibir "Obrigatório" |
| Salário | *(vazio)* | Exibir "Obrigatório" |
| Benefícios | *(vazio)* | Exibir "Obrigatório" |
| Data de expiração | *(vazio)* | Exibir "Obrigatório" |

---

### Cenário 3: Publicação com descrição ou requisitos abaixo do tamanho mínimo

- **Dado que** estou preenchendo o formulário de criação de vaga
- **Quando** informo uma descrição com menos de 10 caracteres ou requisitos com menos de 5 caracteres
- **E** tento salvar a vaga
- **Então** o sistema impede o envio do formulário
- **E** apresenta a mensagem correspondente ao campo inválido.

| Campo | Valor de entrada | Resultado esperado |
| :--- | :--- | :--- |
| Descrição | "Vaga" | Exibir "Mínimo 10 caracteres" |
| Requisitos | "JS" | Exibir "Mínimo 5 caracteres" |

---

### Cenário 4: Publicação com e-mail de contato inválido

- **Dado que** estou preenchendo os dados de uma vaga
- **Quando** informo um e-mail de contato que não corresponde ao formato esperado, como `vagas-workonnection.com`
- **E** tento salvar a vaga
- **Então** o sistema impede o envio do formulário
- **E** apresenta a mensagem "E-mail inválido".

---

### Cenário 5: Publicação com data de expiração inválida ou no passado

- **Dado que** estou preenchendo o formulário de uma vaga
- **Quando** informo uma data de expiração anterior à data atual ou uma data em formato inválido na requisição
- **Então** a interface impede o envio quando a data está no passado
- **E**, se uma data inválida ou passada chegar ao backend, a API rejeita a operação com erro de requisição.

| Entrada | Resultado esperado |
| :--- | :--- |
| Data de expiração vazia no formulário | Exibir "Obrigatório" |
| Data anterior à data atual no formulário | Exibir "Data no passado não é permitida" |
| Data em formato inválido enviada à API | A API rejeita a requisição com erro HTTP 400 |
| Data anterior à data atual enviada à API | A API rejeita a requisição com erro HTTP 400 |

---

### Cenário 6: Tentativa de publicação por usuário estudante

- **Dado que** estou autenticado com uma conta cujo tipo de usuário é Estudante ou Aluno
- **Quando** tento publicar uma vaga
- **Então** o backend rejeita a operação com erro HTTP 403
- **E** informa que estudantes não têm permissão para publicar vagas.

---

### Cenário 7: Edição de vaga própria com sucesso

- **Dado que** estou autenticado e existe uma vaga publicada por mim
- **Quando** abro a edição dessa vaga, altero informações válidas e seleciono **Salvar Vaga**
- **Então** o sistema envia uma atualização para a vaga correspondente
- **E** a publicação passa a apresentar os dados atualizados.

---

### Cenário 8: Tentativa de editar ou excluir vaga de outro usuário

- **Dado que** estou autenticado e existe uma vaga publicada por outro usuário
- **Quando** tento editar ou excluir essa vaga
- **Então** o backend rejeita a operação com erro HTTP 403
- **E** a vaga permanece sem ser alterada ou excluída por essa operação.

---

### Cenário 9: Exclusão de vaga própria após confirmação

- **Dado que** estou na página de minhas vagas e existe uma vaga publicada por mim
- **Quando** seleciono a opção de excluir a vaga e confirmo a pergunta de confirmação
- **Então** o sistema solicita a exclusão ao backend
- **E** remove a vaga da lista exibida após a resposta de sucesso.

---

### Cenário 10: Cancelamento da exclusão de vaga

- **Dado que** estou na página de minhas vagas e existe uma vaga publicada por mim
- **Quando** seleciono a opção de excluir a vaga e cancelo a pergunta de confirmação
- **Então** o sistema não envia a solicitação de exclusão
- **E** a vaga continua aparecendo na lista.

---

### Cenário 11: Consulta das próprias vagas sem publicações

- **Dado que** estou autenticado e ainda não publiquei nenhuma vaga
- **Quando** acesso a página de minhas vagas
- **Então** o sistema apresenta o estado vazio com a mensagem de que não há vagas publicadas
- **E** disponibiliza a opção para criar a primeira vaga, quando o tipo de usuário permite publicar.

---

### Cenário 12: Consulta e filtragem das vagas

- **Dado que** existem vagas cadastradas na plataforma
- **Quando** acesso à listagem e informo um termo de busca, um tipo de usuário ou uma modalidade
- **Então** o sistema apresenta as vagas que correspondem aos filtros informados
- **E** quando a busca não encontra correspondências, não apresenta vagas que não atendam ao filtro.

---

### Cenário 13: Tentativa de operar sem autenticação

- **Dado que** não estou autenticado
- **Quando** tento criar, consultar minhas vagas, editar ou excluir uma publicação usando os endpoints protegidos
- **Então** a API rejeita a operação com erro HTTP 401
- **E** não realiza a alteração solicitada.

---

### Cenário 14: Tentativa de editar ou excluir uma vaga inexistente

- **Dado que** estou autenticado
- **E** informo um identificador de vaga que não existe
- **Quando** tento editar ou excluir a vaga
- **Então** o backend informa que a vaga não foi encontrada e rejeita a operação com erro HTTP 404.

---