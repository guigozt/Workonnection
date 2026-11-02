# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

---

# Documentação dos cenários de teste utilizando a técnica BDD

Gere o roteiro de teste para o projeto interdisciplinar. Selecione a função que será submetida a teste, especifique os casos de teste utilizando a técnica de caixa-preta (PRESSMAN, 2008) definindo os cenários de teste utilizando BDD (SMART, 2015). Os cenários BDD são escritos em linguagem natural (Gherkin: "Dado que... Quando... Então...") focando na experiência do usuário e regras de negócio. Os cenários de teste são independentes do código, quem escreve o cenário não precisa saber como o software foi desenvolvido.

---

## Projeto: Workonnection
**Funcionalidade:** Publicação e Criação de Oportunidades / Vagas de Trabalho

- **Como um** contratante, microempreendedor individual (MEI), empresa ou profissional autônomo autenticado na plataforma
- **Eu quero** criar e cadastrar uma nova oportunidade/vaga de trabalho informando os dados da empresa, requisitos, benefícios, horário e prazo limite de candidatura
- **Para que** profissionais e estudantes interessados possam visualizar os detalhes da vaga, avaliar os requisitos e se candidatar ou entrar em contato

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Criação de vaga com sucesso (Caminho Feliz)

- **Dado que** o usuário está autenticado no sistema com perfil habilitado para publicação (ex.: "Contratante" ou "MEI")
- **Quando** o usuário confirma o cadastro da vaga com as seguintes informações:
  - **Empresa:** Tech Solutions Ltda
  - **Cargo:** Desenvolvedor Full Stack Júnior
  - **Modalidade:** Híbrido
  - **Localização:** São Paulo - SP
  - **Salário:** R$ 3.500,00
  - **Data Limite:** 2026-11-30
  - **Horário:** 09:00 - 18:00
  - **E-mail de Contato:** recrutamento@techsolutions.com
  - **Descrição:** Vaga para atuar em desenvolvimento de soluções web com React e Spring Boot.
  - **Requisitos:** Conhecimento em Java, JavaScript, Git e Banco de Dados.
  - **Benefícios:** Vale Refeição, Vale Transporte, Plano de Saúde.
  - **Público-alvo:** Autônomo, Estudante
- **Então** o sistema valida todas as informações fornecidas E persiste a nova vaga na base de dados associando o usuário como proprietário E exibe a notificação de confirmação `"Vaga publicada com sucesso!"` E disponibiliza a oportunidade no feed de vagas da plataforma.

---

### Cenário 2 – Criação de vaga com Data Limite inválida ou retroativa

- **Dado que** a `<Data Limite>` informada para expiração da vaga está vazia, em formato incorreto ou é anterior à data atual
- **Quando** o usuário tenta cadastrar a oportunidade
- **Então** o sistema rejeita a operação informando a `<Mensagem>`

| Empresa | Cargo | Modalidade | Data Limite | Horário Início | Horário Fim | E-mail | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Tech Solutions | Dev Júnior | Remoto | *(vazio)* | 09:00 | 18:00 | rh@tech.com | Data obrigatória |
| Tech Solutions | Dev Júnior | Remoto | 2020-01-10 | 09:00 | 18:00 | rh@tech.com | Data limite não pode ser no passado |
| Tech Solutions | Dev Júnior | Remoto | 31/02/2026 | 09:00 | 18:00 | rh@tech.com | Data inválida |
| Tech Solutions | Dev Júnior | Remoto | ontem | 09:00 | 18:00 | rh@tech.com | Data inválida |

---

### Cenário 3 – Criação de vaga com Horário de Trabalho inconsistente

- **Dado que** o `<Horário>` de início e término da jornada está incompleto ou a hora de término é menor ou igual à hora de início
- **Quando** o usuário tenta cadastrar a oportunidade
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Empresa | Cargo | Modalidade | Data Limite | Horário Início | Horário Fim | E-mail | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Tech Solutions | Designer UI/UX | Remoto | 2026-12-01 | *(vazio)* | 18:00 | rh@tech.com | Horário obrigatório |
| Tech Solutions | Designer UI/UX | Remoto | 2026-12-01 | 09:00 | *(vazio)* | rh@tech.com | Horário obrigatório |
| Tech Solutions | Designer UI/UX | Remoto | 2026-12-01 | 18:00 | 09:00 | rh@tech.com | Hora final deve ser maior que a inicial |
| Tech Solutions | Designer UI/UX | Remoto | 2026-12-01 | 10:00 | 10:00 | rh@tech.com | Hora final deve ser maior que a inicial |

---

### Cenário 4 – Criação de vaga com E-mail de Contato inválido

- **Dado que** o `<E-mail>` informado para recebimento de currículos/contato está em formato inválido ou vazio
- **Quando** o usuário tenta cadastrar a oportunidade
- **Então** o sistema rejeita a operação informando a `<Mensagem>`

| Empresa | Cargo | Modalidade | Data Limite | Horário Início | Horário Fim | E-mail | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Tech Solutions | Analista QA | Presencial | 2026-12-01 | 08:00 | 17:00 | *(vazio)* | E-mail inválido |
| Tech Solutions | Analista QA | Presencial | 2026-12-01 | 08:00 | 17:00 | "   " | E-mail inválido |
| Tech Solutions | Analista QA | Presencial | 2026-12-01 | 08:00 | 17:00 | techsolutions.com | E-mail inválido |
| Tech Solutions | Analista QA | Presencial | 2026-12-01 | 08:00 | 17:00 | contato@tech | E-mail inválido |

---

### Cenário 5 – Criação de vaga com campos textuais obrigatórios ou de tamanho insuficiente

- **Dado que** campos fundamentais como `<Empresa>`, `<Cargo>`, `<Descrição>` (mínimo 10 caracteres) ou `<Requisitos>` (mínimo 5 caracteres) não atingem os requisitos mínimos
- **Quando** o usuário tenta cadastrar a oportunidade
- **Então** o sistema bloqueia o envio informando a `<Mensagem>`

| Empresa | Cargo | Descrição | Requisitos | Data Limite | E-mail | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *(vazio)* | Desenvolvedor | Vaga completa com descrição detalhada | Conhecimento Java | 2026-12-01 | rh@tech.com | Empresa é obrigatória |
| Tech Solutions | *(vazio)* | Vaga completa com descrição detalhada | Conhecimento Java | 2026-12-01 | rh@tech.com | Cargo é obrigatório |
| Tech Solutions | Desenvolvedor | Curta | Conhecimento Java | 2026-12-01 | rh@tech.com | Descrição: Mínimo 10 caracteres |
| Tech Solutions | Desenvolvedor | Vaga completa com descrição detalhada | Java | 2026-12-01 | rh@tech.com | Requisitos: Mínimo 5 caracteres |
| Tech Solutions | Desenvolvedor | *(vazio)* | *(vazio)* | 2026-12-01 | rh@tech.com | Descrição e Requisitos obrigatórios |

---

### Cenário 6 – Tentativa de criação de vaga por perfil não autorizado (Regra de Negócio de Permissão)

- **Dado que** o usuário autenticado na plataforma possui perfil do tipo `"Estudante"` ou `"Aluno"`
- **Quando** ele tenta submeter a criação de uma nova vaga de trabalho
- **Então** o sistema bloqueia a requisição retornando status de proibição E informa a mensagem `"Estudantes não têm permissão para publicar vagas"`.

| Perfil do Usuário | Tipo de Conta | Ação | Status Esperado | Mensagem |
| :--- | :--- | :--- | :--- | :--- |
| Aluno / Estudante | Estudante | Submeter nova vaga | 403 Forbidden | Estudantes não têm permissão para publicar vagas |
| Não Autenticado | Anônimo | Submeter nova vaga | 401 Unauthorized | Não autenticado |

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015 (Cap01 página 29).

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.
