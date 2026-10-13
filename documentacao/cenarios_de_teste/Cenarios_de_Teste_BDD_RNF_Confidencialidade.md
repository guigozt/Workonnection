# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

---

# Documentação dos Cenários de Teste utilizando a técnica BDD

Gere o roteiro de teste para o projeto interdisciplinar. Selecione a função que será submetida a teste, especifique os casos de teste utilizando a técnica de caixa-preta (PRESSMAN, 2021) definindo os cenários de teste utilizando BDD (SMART, 2015). Os cenários BDD são escritos em linguagem natural (Gherkin: "Dado que... Quando... Então...") focando na experiência do usuário e regras de negócio. Os cenários de teste são independentes do código, quem escreve o cenário não precisa saber como o software foi desenvolvido.

---

## Projeto: Workonnection
**Tipo de Requisito:** Requisito Não Funcional (RNF)  
**Norma ISO/IEC 25010:** Segurança — Confidencialidade  
**Funcionalidade Avaliada:** Exposição de Dados Pessoais na Consulta Pública de Colaboradores  
**Endpoint Sob Teste:** `GET /usuarios`

- **Como um** visitante ou cliente sem autenticação na plataforma
- **Eu quero** consultar exclusivamente as informações profissionais públicas dos colaboradores cadastrados
- **Para que** dados sensíveis, cadastrais privados e credenciais não sejam expostos indevidamente

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Consulta da listagem pública de colaboradores sem autenticação (Caminho Feliz)

- **Dado que** existem colaboradores cadastrados com perfis profissionais ativos na plataforma
- **E** a requisição é realizada sem credenciais ou cabeçalhos de autenticação
- **Quando** o visitante acessa a listagem pública de colaboradores (`GET /usuarios`)
- **Então** o sistema responde com sucesso (HTTP 200)
- **E** exibe os dados autorizados para divulgação pública (nome, tipo de usuário, foto de perfil, resumo e habilidades)
- **E** omite integralmente qualquer dado confidencial ou privado da conta.

---

### Cenário 2: Omissão de dados pessoais sensíveis e credenciais (Segurança e Confidencialidade)

- **Dado que** os colaboradores cadastrados possuem dados pessoais completos na base de dados
- **Quando** a resposta da consulta pública de colaboradores é processada
- **Então** o payload de retorno não deve conter chaves sensíveis nem valores privados de identificação

| Categoria do Dado | Campos Verificados | Resultado Esperado na Resposta Pública |
| :--- | :--- | :--- |
| Identificação Pessoal | CPF, RG, Data de Nascimento | Ausente / Omitido |
| Contato Privado | E-mail de cadastro, Telefone pessoal | Ausente / Omitido |
| Credenciais e Segurança | Senha, Hash de senha, Tokens de autenticação | Estritamente ausente |
| Documentos e Anexos | URLs e metadados de comprovantes privados | Omitidos |
| Configurações da Conta | Notificações privadas, configurações internas | Omitidos |

---

### Cenário 3: Consulta pública em base de dados sem colaboradores (Estado Vazio)

- **Dado que** não há colaboradores cadastrados no sistema
- **E** a consulta pública é realizada sem autenticação
- **Quando** a requisição é submetida
- **Então** o sistema responde com HTTP 200 e retorna uma lista vazia (`[]`), sem expor quaisquer mensagens internas ou dados de sistema.

---

## Critérios de Aceite e Aprovação

1. O endpoint deve retornar exclusivamente informações essenciais ao cartão público do colaborador.
2. Em nenhuma hipótese dados de autenticação (hashes, senhas), dados fiscais/pessoais (CPF) ou documentos comprobatórios devem trafegar na consulta desautenticada.
3. A ausência de dados privados não deve impactar negativamente a renderização visual do perfil profissional público.

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.