# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

---

# Documentação dos cenários de teste utilizando a técnica BDD

Gere o roteiro de teste para o projeto interdisciplinar. Selecione a função que será submetida a teste, especifique os casos de teste utilizando a técnica de caixa-preta (PRESSMAN, 2008) definindo os cenários de teste utilizando BDD (SMART, 2015). Os cenários BDD são escritos em linguagem natural (Gherkin: "Dado que... Quando... Então...") focando na experiência do usuário e regras de negócio. Os cenários de teste são independentes do código, quem escreve o cenário não precisa saber como o software foi desenvolvido.

---

## Projeto: Workonnection
**Funcionalidade:** Sistema de Chat e Mensagens em Tempo Real

- **Como um** usuário cadastrado e autenticado na plataforma (profissional autônomo, MEI, estudante ou contratante)
- **Eu quero** trocar mensagens de texto em tempo real com outros contatos e gerenciar o histórico de conversas
- **Para que** eu possa tirar dúvidas sobre vagas, negociar orçamentos, alinhar serviços e manter comunicação profissional direta

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Envio de mensagem de texto com sucesso (Caminho Feliz)

- **Dado que** o usuário `"Carlos Silva"` está autenticado e com a conversa aberta com o contato `"Mariana Souza"`
- **Quando** o usuário digita no campo de texto `"Olá Mariana, tudo bem? Gostaria de saber mais informações sobre a oportunidade."` e clica no botão de enviar
- **Então** o sistema realiza o envio da mensagem, transmite a notificação em tempo real para o destinatário, inclui o balão no histórico de mensagens com a indicação de status entregue e limpa o campo de digitação.

---

### Cenário 2 – Validação de conteúdo da mensagem ao enviar

- **Dado que** o remetente está com uma conversa ativa selecionada
- **Quando** tenta submeter uma mensagem com o `<Conteúdo>`
- **Então** o sistema valida o envio apresentando a `<Mensagem/Comportamento>`

| Remetente | Destinatário | Conteúdo | Botão Enviar | Mensagem/Comportamento |
| :--- | :--- | :--- | :--- | :--- |
| Carlos Silva | Mariana Souza | *(vazio)* | Desabilitado | Envio impedido |
| Carlos Silva | Mariana Souza | `"   "` | Desabilitado | Envio impedido (apenas espaços) |
| Carlos Silva | Mariana Souza | `"Bom dia! Segue proposta: R$ 500,00."` | Habilitado | Mensagem enviada com sucesso |
| Carlos Silva | Mariana Souza | *(texto superior a 2000 caracteres)* | Habilitado | Erro: Tamanho máximo excedido |

---

### Cenário 3 – Edição de mensagem já enviada

- **Dado que** o usuário `"Carlos Silva"` enviou anteriormente uma mensagem no chat
- **Quando** o usuário clica na ação de editar mensagem, informa o novo conteúdo `<Novo Conteúdo>` e confirma a alteração
- **Então** o sistema valida a alteração aplicando o `<Resultado>`

| Usuário Solicitante | Conteúdo Original | Novo Conteúdo | Resultado |
| :--- | :--- | :--- | :--- |
| Carlos Silva (autor) | `"Boa tarde Marianna"` | `"Boa tarde Mariana"` | Mensagem atualizada com rótulo "(editada)" |
| Carlos Silva (autor) | `"Texto inicial"` | `""` (vazio) | Rejeitado: Conteúdo não pode ser vazio |
| Mariana Souza (não autor) | `"Texto de Carlos"` | `"Tentativa de edição"` | Rejeitado: Apenas o remetente pode editar |

---

### Cenário 4 – Exclusão de mensagem do histórico

- **Dado que** o usuário visualiza uma mensagem em seu histórico de mensagens
- **Quando** seleciona a opção `"Excluir para mim"` e confirma a caixa de confirmação
- **Então** o sistema oculta a mensagem da visualização do usuário solicitante, mantendo o histórico inalterado para o outro participante da conversa.

---

### Cenário 5 – Atualização automática de status de leitura

- **Dado que** o contato `"Mariana Souza"` possui mensagens não lidas enviadas por `"Carlos Silva"`
- **Quando** `"Mariana Souza"` acessa o chat e clica na conversa com `"Carlos Silva"`
- **Então** o sistema atualiza o status das mensagens pendentes para lidas, preenche o carimbo de data/hora de leitura e remove o badge de mensagens não lidas no menu de conversas.

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.
