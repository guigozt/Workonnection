# Fatec – Análise e Desenvolvimento de Sistemas
## Disciplina – Laboratório de Desenvolvimento Web
### Prof. Edson Saraiva de Almeida

---

# Documentação dos cenários de teste utilizando a técnica BDD

Gere o roteiro de teste para o projeto interdisciplinar. Selecione a função que será submetida a teste, especifique os casos de teste utilizando a técnica de caixa-preta (PRESSMAN, 2008) definindo os cenários de teste utilizando BDD (SMART, 2015). Os cenários BDD são escritos em linguagem natural (Gherkin: "Dado que... Quando... Então...") focando na experiência do usuário e regras de negócio. Os cenários de teste são independentes do código, quem escreve o cenário não precisa saber como o software foi desenvolvido.

---

## Projeto: Workonnection
**Funcionalidade:** Central de Notificações da Plataforma

- **Como um** usuário cadastrado na plataforma Workonnection
- **Eu quero** receber, visualizar e gerenciar as notificações de eventos (mensagens, propostas, candidaturas e avisos)
- **Para que** eu acompanhe atividades relevantes em tempo real e mantenha minha caixa de notificações organizada

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Visualização da lista de notificações (Caminho Feliz)

- **Dado que** o usuário possui notificações recebidas em sua conta
- **Quando** o usuário clica no ícone de notificações na barra superior ou navega até a página de notificações
- **Então** o sistema apresenta a lista ordenada da notificação mais recente para a mais antiga (com limite máximo de até 50 notificações), destacando visualmente as notificações não lidas e exibindo o horário relativo de emissão de cada evento.

---

### Cenário 2 – Marcar notificação individual como lida

- **Dado que** existe uma notificação com status não lida na lista do usuário
- **Quando** o usuário clica no cartão da notificação ou no botão de marcar como lida
- **Então** o sistema altera o status da notificação para "lida", remove o destaque visual de não lida e decrementa em 1 a contagem de notificações pendentes no cabeçalho da aplicação.

---

### Cenário 3 – Marcar todas as notificações como lidas

- **Dado que** o usuário possui `<Qtd Não Lidas>` notificações pendentes no sistema
- **Quando** aciona o botão `"Marcar todas como lidas"`
- **Então** o sistema atualiza todas as notificações para o status de lida e atualiza o badge do contador para `<Contador Final>`

| Qtd Não Lidas | Estado Inicial da Lista | Ação Realizada | Contador Final |
| :--- | :--- | :--- | :--- |
| `8` | 8 notificações destacadas | Clicar em "Marcar todas como lidas" | `0` (badge oculto) |
| `1` | 1 notificação destacada | Clicar em "Marcar todas como lidas" | `0` (badge oculto) |
| `0` | Nenhuma notificação pendente | Botão desabilitado ou sem ação | `0` (badge inativo) |

---

### Cenário 4 – Exclusão individual de notificação

- **Dado que** uma notificação específica está visível na lista do usuário
- **Quando** o usuário aciona o botão de exclusão (ícone de lixeira) da notificação
- **Então** o sistema remove definitivamente a notificação da lista do usuário, recalcula os contadores e atualiza a interface instantaneamente.

---

### Cenário 5 – Limpeza completa da caixa de notificações

- **Dado que** a caixa de notificações do usuário contém um ou mais registros
- **Quando** o usuário seleciona a opção `"Limpar todas"` e confirma a ação
- **Então** o sistema remove todas as notificações armazenadas para aquele usuário e renderiza o estado vazio exibindo a mensagem `"Você não possui notificações no momento"`.

---

## Referências

SMART, John Ferguson. **BDD in Action: Behavior-driven development for the whole software lifecycle**. Simon and Schuster, New York: Manning Publications Co., 2015.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional**. 9. ed. McGraw Hill Brasil, 2021.
