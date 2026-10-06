# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

---

# Documentação dos cenários de teste utilizando a técnica BDD

Gere o roteiro de teste para o projeto interdisciplinar. Selecione a função que será submetida a teste, especifique os casos de teste utilizando a técnica de caixa-preta (PRESSMAN, 2008) definindo os cenários de teste utilizando BDD (SMART, 2015). Os cenários BDD são escritos em linguagem natural (Gherkin: "Dado que... Quando... Então...") focando na experiência do usuário e regras de negócio. Os cenários de teste são independentes do código, quem escreve o cenário não precisa saber como o software foi desenvolvido.

---

## Projeto: Workonnection
**Funcionalidade:** Cadastro de Usuário na Plataforma (Autônomo, MEI, Estudante e Contratante)

- **Como um** profissional autônomo, microempreendedor (MEI), estudante ou contratante
- **Eu quero** cadastrar uma nova conta na plataforma Workonnection informando meus dados pessoais e credenciais de acesso
- **Para que** eu possa acessar o sistema com segurança, divulgar meus serviços, candidatar-me a vagas ou recrutar talentos

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Cadastro com sucesso (Caminho Feliz)

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

---

### Cenário 2 – Cadastro de usuário com CPF inválido

- **Dado que** o `<CPF>` informado está inválido ou incorreto
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | 8330167704 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (tamanho menor que 11 dígitos) |
| Carlos Silva | *(vazio)* | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (vazio) |
| Carlos Silva | 11111111111 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (dígitos verificadores repetidos) |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | CPF inválido (já cadastrado/duplicado) |

---

### Cenário 3 – Cadastro de usuário com Nome inválido

- **Dado que** o `<Nome>` informado não atende aos requisitos mínimos
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *(vazio)* | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Nome inválido (vazio) |
| `"   "` | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Nome inválido (em branco) |
| Al | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Mínimo 3 caracteres |

---

### Cenário 4 – Cadastro de usuário com Data de Nascimento / Idade inválida

- **Dado que** a `<Data Nasc.>` está vazia, em formato incorreto ou indica idade inferior ao requisito legal da plataforma (mínimo de 16 anos)
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | 83301677045 | *(vazio)* | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Data obrigatória |
| Carlos Silva | 83301677045 | 10/10/2015 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Mínimo 16 anos |
| Carlos Silva | 83301677045 | 01/01/1850 | (11) 98765-4321 | carlos@email.com | Senha@123 | Senha@123 | Autônomo | Data inválida |

---

### Cenário 5 – Cadastro de usuário com Senha ou Confirmação inválida

- **Dado que** a `<Senha>` possui menos de 6 caracteres ou não coincide com `<Confirmação>`
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | 12345 | 12345 | Autônomo | Mínimo 6 caracteres |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | 123456 | 654321 | Autônomo | Senhas não coincidem |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlos@email.com | *(vazio)* | *(vazio)* | Autônomo | Mínimo 6 caracteres |

---

### Cenário 6 – Cadastro de usuário com E-mail inválido ou já cadastrado

- **Dado que** o `<E-mail>` está em formato incorreto ou já existente na base de dados
- **Quando** confirmo o cadastro do usuário
- **Então** o sistema rejeita o cadastro informando a `<Mensagem>`

| Nome | CPF | Data Nasc. | Telefone | E-mail | Senha | Confirmação | Tipo Usuário | Mensagem |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | carlosemail.com | Senha@123 | Senha@123 | Autônomo | Email inválido |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | *(vazio)* | Senha@123 | Senha@123 | Autônomo | Email inválido |
| Carlos Silva | 83301677045 | 15/05/1998 | (11) 98765-4321 | jaexiste@email.com | Senha@123 | Senha@123 | Autônomo | Email já cadastrado |

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015 (Cap01 página 29).

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.
