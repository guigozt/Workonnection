# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

---

# Documentação dos cenários de teste utilizando a técnica BDD

Gere o roteiro de teste para o projeto interdisciplinar. Selecione a função que será submetida a teste, especifique os casos de teste utilizando a técnica de caixa-preta (PRESSMAN, 2021) definindo os cenários de teste utilizando BDD (SMART, 2015). Os cenários BDD são escritos em linguagem natural (Gherkin: "Dado que... Quando... Então...") focando na experiência do usuário e regras de negócio. Os cenários de teste são independentes do código, quem escreve o cenário não precisa saber como o software foi desenvolvido.

---

## Projeto: Workonnection
**Funcionalidade:** Gerenciamento de Vagas (Criação, Edição, Exclusão e Consulta)

- **Como um** usuário cadastrado e autenticado na plataforma (Autônomo, MEI ou Contratante)
- **Eu quero** criar, consultar, filtrar, editar e excluir oportunidades de trabalho
- **Para que** eu possa divulgar demandas de projetos, atrair profissionais qualificados e gerenciar o ciclo de vida das minhas publicações

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Publicação de vaga com sucesso (Caminho Feliz)

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

---

### Cenário 2: Validação de formulário na criação ou edição de vaga (Sem Sucesso)

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

---

### Cenário 3: Tentativa de publicação de vaga por perfil não autorizado (Sem Sucesso)

- **Dado que** o usuário está autenticado na plataforma com perfil de **"Estudante"**
- **Quando** tenta acessar o recurso de publicação de vaga
- **Então** o sistema bloqueia a criação e exibe a mensagem de restrição de permissão: `"Estudantes não têm permissão para publicar vagas"`.

---

### Cenário 4: Edição de vaga publicada

#### 4.1 – Edição de vaga própria com sucesso (Caminho Feliz)
- **Dado que** o usuário possui uma vaga de sua autoria já publicada na plataforma
- **Quando** abre a edição dessa vaga, altera o salário para `"R$ 6.000,00"` e a descrição para `"Atuação em novos projetos web responsivos com React."` e salva
- **Então** o sistema valida as alterações, persiste a nova versão e exibe os dados atualizados na listagem.

#### 4.2 – Tentativa de edição de vaga pertencente a outro usuário (Sem Sucesso)
- **Dado que** o usuário está autenticado, mas visualiza uma vaga publicada por outro usuário
- **Quando** tenta submeter uma alteração nessa publicação
- **Então** o sistema rejeita a operação e exibe a mensagem de permissão negada: `"Sem permissão para editar esta vaga"`.

---

### Cenário 5: Exclusão de vaga publicada

#### 5.1 – Exclusão de vaga própria confirmada (Caminho Feliz)
- **Dado que** o autor da vaga acessa sua listagem em **"Minhas Vagas"**
- **Quando** seleciona a ação de excluir na vaga desejada e confirma o diálogo de exclusão
- **Então** o sistema remove definitivamente a vaga da plataforma e atualiza a listagem sem a vaga excluída.

#### 5.2 – Tentativa de exclusão de vaga de outro usuário (Sem Sucesso)
- **Dado que** o usuário tenta acionar a exclusão de uma vaga cujo proprietário seja outro usuário
- **Quando** o pedido de remoção é processado
- **Então** o sistema bloqueia a exclusão e exibe a mensagem: `"Sem permissão para excluir esta vaga"`.

---

### Cenário 6: Consulta e filtragem de vagas na plataforma

- **Dado que** existem vagas cadastradas com diferentes modalidades e perfis
- **Quando** o usuário aplica o `<Critério de Filtro>` na tela de vagas
- **Então** o sistema apresenta o `<Resultado Esperado>`

| Tipo de Filtro | Critério de Filtro | Resultado Esperado |
| :--- | :--- | :--- |
| Busca textual por cargo/requisito | Digitar `"React"` | Listar apenas vagas cujo cargo, descrição ou requisitos contenham o termo "React" |
| Filtro por modalidade | Selecionar `"Remoto"` | Listar exclusivamente oportunidades com modalidade remota |
| Filtro combinado sem correspondência | Digitar termo inexistente `"XptoInexistente999"` | Exibir mensagem informando que não foram encontradas vagas para os filtros informados |

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.