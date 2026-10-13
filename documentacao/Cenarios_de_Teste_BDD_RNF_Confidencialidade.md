# Documentação dos Cenários de Teste utilizando a técnica BDD

## Projeto: Workonnection

**Tipo de requisito:** Requisito não funcional  
**Característica ISO/IEC 25010:** Segurança — Confidencialidade  
**Requisito de origem:** RF02 do documento de requisitos não funcionais  
**Funcionalidade avaliada:** Exposição de dados pessoais na listagem de colaboradores  
**Endpoint sob teste:** `GET /usuarios`

- **Como um** visitante sem autenticação
- **Eu quero** consultar somente as informações profissionais que foram destinadas à divulgação pública
- **Para que** dados pessoais, credenciais e outras informações restritas não sejam expostos indevidamente

---

## Objetivo do teste

Verificar se a listagem pública de colaboradores retorna apenas os campos necessários para apresentar os perfis profissionais e se omite dados pessoais, credenciais, configurações privadas e documentos restritos. A validação deve considerar o corpo JSON completo, inclusive objetos e listas aninhados no perfil, e não somente os campos do nível superior.

## Preparação e dados de teste

Executar em ambiente local ou de teste, nunca com dados pessoais reais. Preparar na base de teste ao menos um usuário fictício com valores rastreáveis, por exemplo:

| Dado fictício | Valor para detectar eventual exposição |
| :--- | :--- |
| Nome | Usuário Teste RNF |
| E-mail privado | `rnf.email.privado@example.invalid` |
| CPF de teste | `00000000191` |
| Data de nascimento de teste | `01/01/1990` |
| Telefone privado | `(11) 90000-0001` |
| Marcador de configuração privada | `MARCADOR_CONFIG_RNF_01` |

Os valores são exemplos sintéticos; devem ser ajustados ao formato aceito pelo ambiente e não correspondem a dados de uma pessoa real. O registro deve conter também algumas informações profissionais públicas, como tipo de usuário, habilidades e resumo do perfil, para verificar que a resposta continua útil para a tela de colaboradores.

Antes da chamada, limpar cookies, tokens e cabeçalhos de autenticação do cliente HTTP. Confirmar que a resposta contém o usuário fictício para que a ausência de dados sensíveis não seja aprovada apenas porque a listagem veio vazia.

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Consulta da listagem pública sem autenticação

- **Dado que** existe ao menos um colaborador fictício cadastrado no ambiente de teste
- **E** não estou autenticado e não envio cookies ou tokens de sessão
- **Quando** envio uma requisição `GET` para `/usuarios`
- **Então** a API responde com HTTP `200`
- **E** retorna uma lista JSON contendo o colaborador fictício
- **E** a resposta contém informações necessárias à apresentação pública do perfil
- **E** a resposta não contém dados pessoais ou restritos, conforme os cenários seguintes.

### Cenário 2: Omissão de dados pessoais e credenciais na resposta

- **Dado que** o usuário fictício contém e-mail privado, CPF, data de nascimento, telefone e configurações privadas
- **E** estou consultando a listagem sem autenticação
- **Quando** a API retorna o corpo de `GET /usuarios`
- **Então** nenhum colaborador retornado contém os campos `email`, `cpf`, `dataNascimento`, `telefone`, `senha`, `password`, `passwordHash` ou `configuracoes`
- **E** o corpo completo da resposta não contém os valores marcadores usados para esses dados fictícios
- **E** nenhum documento ou credencial do usuário é incluído na resposta.

### Cenário 3: Verificação de dados restritos em campos aninhados

- **Dado que** o perfil fictício possui informações em objetos e listas aninhados
- **E** esses dados incluem valores classificados como privados ou restritos pela política de divulgação do produto
- **Quando** a listagem pública é consultada
- **Então** a resposta não inclui esses valores em nenhum nível do JSON
- **E** a verificação percorre recursivamente todos os objetos e listas retornados, incluindo `perfil`, formações, experiências, cursos e perfis específicos por categoria
- **E** a resposta não expõe arquivos, metadados de documentos privados, tokens de sessão ou segredos de integração.

### Cenário 4: Preservação das informações profissionais autorizadas

- **Dado que** o perfil fictício possui informações profissionais marcadas como públicas
- **Quando** consulto `GET /usuarios` sem autenticação
- **Então** a resposta mantém os campos públicos necessários, como identificador, nome, tipo de usuário e informações profissionais liberadas
- **E** a omissão de dados privados não impede a exibição dos colaboradores na interface.

### Cenário 5: Listagem sem colaboradores cadastrados

- **Dado que** não há colaboradores cadastrados no ambiente de teste
- **E** não estou autenticado
- **Quando** envio uma requisição `GET` para `/usuarios`
- **Então** a API responde com HTTP `200`
- **E** retorna uma lista vazia
- **E** não inclui dados de outros usuários nem informações sensíveis na resposta.

---

## Matriz de verificação da resposta

| Campo ou categoria de informação | Resultado esperado | Verificação |
| :--- | :--- | :--- |
| `id`, `nome` e `tipoUsuario` | Permitidos para identificar e apresentar o colaborador | Confirmar presença quando aplicável |
| Informações profissionais autorizadas, como resumo, habilidades e foto de perfil | Permitidas conforme a política de divulgação | Confirmar que continuam disponíveis |
| `email` pessoal, `cpf`, `dataNascimento` e `telefone` pessoal | Não permitidos na listagem pública | Confirmar ausência das chaves e dos valores marcadores |
| Senha, hash de senha, tokens e credenciais | Nunca permitidos | Confirmar ausência em toda a resposta |
| Configurações e dados privados da conta | Não permitidos | Confirmar ausência das chaves e dos valores marcadores |
| Documentos privados e respectivos dados/metadados | Não permitidos | Confirmar ausência em campos aninhados |
| Campos de perfil cuja classificação de privacidade não esteja definida | Não aprovar automaticamente como públicos | Registrar para decisão do responsável pelo produto antes do aceite |

Campos de perfis específicos — por exemplo, matrícula estudantil, chave Pix, CNPJ e contatos de RH — devem ser avaliados conforme a finalidade e a política de divulgação aprovada pelo produto. O teste deve usar valores fictícios nesses campos e verificar que qualquer informação classificada como restrita não aparece na resposta pública.

---

## Critérios de aprovação

O cenário é aprovado somente quando:

1. O endpoint responde de acordo com o resultado esperado para uma consulta sem autenticação.
2. O usuário fictício preparado aparece na listagem, quando a base de teste contém esse registro.
3. Nenhuma chave proibida nem valor marcador sensível aparece no corpo da resposta, inclusive dentro de objetos e listas aninhados.
4. Os campos profissionais aprovados para divulgação continuam presentes.
5. A resposta de uma base sem colaboradores é uma lista vazia, sem dados de outros usuários.

**Falha:** qualquer dado classificado como privado aparecer na resposta, mesmo que esteja dentro de um campo aninhado, ou a lista omitir informações profissionais necessárias devido à sanitização.

---

## Resultado da análise estática do código

**Status estimado: falha provável; cenários ainda não executados.**

Na implementação consultada, `GET /usuarios` chama `listarColaboradores()`, que transforma os registros em `UsuarioResponseDTO`. Esse DTO declara `email`, `cpf`, `dataNascimento`, `telefone`, `perfil` e `configuracoes`, entre outros campos. A regra de segurança permite acesso a `/usuarios` sem autenticação. Assim, a implementação aparenta expor dados que o RF02 determina proteger.

Além disso, o DTO de resposta contém o objeto `perfil`; por isso, é necessário validar também os campos aninhados. A presença de um campo no modelo não determina, por si só, se ele é público: a classificação dos dados específicos de cada categoria precisa ser confirmada pela política do produto.

Esta conclusão veio da inspeção do código-fonte. Nenhuma chamada real à API nem teste automatizado foi executado para confirmar o comportamento em runtime.

## Arquivos relacionados à análise

- Requisito de origem: `documentacao/Atividade_Requisitos_Nao_Funcionais_ISO25010.docx`
- Modelos BDD consultados:
  - `documentacao/Cenarios_de_Teste_BDD_Importacao_de_Documentos.md`
  - `documentacao/Cenarios_de_Teste_BDD_Gerenciamento_de_Vagas.md`
- Implementação consultada:
  - `backend/src/main/java/com/workonnection/backend/controller/UsuarioController.java`
  - `backend/src/main/java/com/workonnection/backend/service/UsuarioService.java`
  - `backend/src/main/java/com/workonnection/backend/dto/UsuarioResponseDTO.java`
  - `backend/src/main/java/com/workonnection/backend/config/SecurityConfig.java`

---

**Observação:** este documento especifica comportamentos esperados e critérios de teste; não é evidência de que os cenários tenham sido executados. Use somente dados fictícios ou anonimizados em qualquer validação.
#final corrigido