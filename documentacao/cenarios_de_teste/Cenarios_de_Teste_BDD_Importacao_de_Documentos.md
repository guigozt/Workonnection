# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

---

# Documentação dos cenários de teste utilizando a técnica BDD

Gere o roteiro de teste para o projeto interdisciplinar. Selecione a função que será submetida a teste, especifique os casos de teste utilizando a técnica de caixa-preta (PRESSMAN, 2021) definindo os cenários de teste utilizando BDD (SMART, 2015). Os cenários BDD são escritos em linguagem natural (Gherkin: "Dado que... Quando... Então...") focando na experiência do usuário e regras de negócio. Os cenários de teste são independentes do código, quem escreve o cenário não precisa saber como o software foi desenvolvido.

---

## Projeto: Workonnection
**Funcionalidade:** Importação de Documentos Comprobatórios no Perfil

- **Como um** usuário autenticado da plataforma Workonnection
- **Eu quero** enviar, visualizar e substituir os documentos comprobatórios solicitados para a minha categoria de usuário
- **Para que** eu possa comprovar minhas qualificações, manter meu cadastro regularizado e associar os documentos ao meu perfil

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Envio de documento comprobatório com sucesso (Caminho Feliz)

- **Dado que** o usuário está autenticado na plataforma e acessa a seção **"Documentos Comprobatórios"** em seu perfil
- **E** seleciona um tipo de documento exigido para sua categoria (ex.: `"COMPROVANTE_MATRICULA"`)
- **Quando** o usuário anexa um arquivo válido `"comprovante_2026.pdf"` com tamanho de 2,5 MB e clica em **"Enviar"**
- **Então** o sistema realiza o upload do documento com sucesso, armazena o arquivo associando-o ao perfil do usuário, atualiza a listagem exibindo o nome original do arquivo e seu tamanho formatado, e incrementa o contador de documentos enviados.

---

### Cenário 2: Validação de arquivo inválido para envio (Sem Sucesso)

- **Dado que** o usuário está autenticado e tenta enviar um arquivo para um tipo de documento disponível
- **Quando** anexa um arquivo com `<Arquivo Informado>` e aciona o envio
- **Então** o sistema rejeita o upload e exibe a mensagem de validação `<Mensagem Esperada>`

| Tipo de Arquivo / Caso de Teste | Arquivo Informado | Tamanho | Mensagem Esperada |
| :--- | :--- | :--- | :--- |
| Extensão não permitida | `documento.docx` | 1.2 MB | Selecione um arquivo válido (PDF, PNG, JPG ou JPEG). |
| Extensão executável inválida | `instalador.exe` | 500 KB | Selecione um arquivo válido (PDF, PNG, JPG ou JPEG). |
| Tamanho acima do limite permitido | `digitalizacao_alta_resolucao.pdf` | 14.5 MB | O arquivo não pode exceder 10MB. |
| Arquivo vazio / sem conteúdo | `arquivo_zerado.pdf` | 0 KB | Nenhum arquivo enviado ou o arquivo está vazio |

---

### Cenário 3: Substituição de documento já enviado (Caminho Feliz)

- **Dado que** o usuário autenticado já possui um arquivo associado ao tipo `"COMPROVANTE_MATRICULA"`
- **Quando** seleciona a opção **"Substituir"** e faz o upload de um novo arquivo válido `"matricula_atualizada.pdf"`
- **Então** o sistema substitui a versão anterior pelo novo arquivo, atualiza a data e os metadados do documento e mantém apenas a versão mais recente na listagem do perfil.

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.