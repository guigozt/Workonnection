# Documentação dos Cenários de Teste utilizando a técnica BDD

## Projeto: Workonnection

**Funcionalidade:** Importação de documentos comprobatórios no perfil

- **Como um** usuário autenticado da plataforma Workonnection
- **Eu quero** enviar, visualizar e substituir os documentos comprobatórios solicitados para minha categoria de usuário
- **Para que** eu possa manter os documentos necessários associados ao meu perfil

---

## Especificação dos cenários de uso utilizando BDD

### Cenário 1: Envio de documento válido com sucesso

- **Dado que** estou autenticado na plataforma e acesso a seção **Documentos Comprobatórios** do meu perfil
- **E** existe um tipo de documento disponível para a minha categoria de usuário
- **E** seleciono um arquivo PDF com tamanho inferior ou igual a 10 MB
- **Quando** seleciono a opção **Enviar** para o tipo de documento escolhido
- **Então** o sistema envia o arquivo para o backend
- **E** o documento é armazenado e associado ao meu perfil
- **E** a seção apresenta o nome original do arquivo e seu tamanho.

---

### Cenário 2: Envio de documento em formato PNG, JPG ou JPEG

- **Dado que** estou autenticado e selecionei um tipo de documento disponível no meu perfil
- **Quando** seleciono um arquivo de imagem PNG, JPG ou JPEG com tamanho de até 10 MB
- **Então** o frontend permite o envio do arquivo
- **E** o backend armazena o documento e retorna os metadados associados ao perfil.

---

### Cenário 3: Tentativa de envio de arquivo com formato não permitido

- **Dado que** estou na seção **Documentos Comprobatórios** do meu perfil
- **Quando** seleciono um arquivo em formato diferente de PDF, PNG, JPG ou JPEG
- **Então** o sistema não realiza o envio
- **E** apresenta o alerta: `Selecione um arquivo válido (PDF, PNG, JPG ou JPEG).`

---

### Cenário 4: Tentativa de envio de arquivo maior que 10 MB

- **Dado que** estou na seção **Documentos Comprobatórios** do meu perfil
- **Quando** seleciono um arquivo com tamanho superior a 10 MB
- **Então** o sistema não realiza o envio
- **E** apresenta o alerta: `O arquivo não pode exceder 10MB.`

---

### Cenário 5: Tentativa de envio sem selecionar um arquivo

- **Dado que** estou na seção **Documentos Comprobatórios** do meu perfil
- **Quando** abro o seletor de arquivos e cancelo a seleção sem escolher um arquivo
- **Então** o sistema não envia uma requisição de upload
- **E** o perfil permanece sem alteração para aquele tipo de documento.

---

### Cenário 6: Tentativa de enviar um arquivo vazio diretamente à API

- **Dado que** estou autenticado e envio uma requisição de upload de documento com um arquivo vazio
- **Quando** a API processa a requisição
- **Então** o backend rejeita o arquivo com erro HTTP 400
- **E** informa que nenhum arquivo foi enviado ou que o arquivo está vazio.

---

### Cenário 7: Tentativa de enviar documento acima do limite diretamente à API

- **Dado que** estou autenticado e envio um arquivo com tamanho superior a 10 MB para o endpoint de documentos
- **Quando** o backend valida o arquivo recebido
- **Então** a API rejeita a requisição com erro HTTP 400
- **E** informa que o tamanho máximo permitido foi excedido.

---

### Cenário 8: Tentativa de enviar arquivo com extensão não permitida diretamente à API

- **Dado que** estou autenticado e envio um arquivo cuja extensão não seja PDF, PNG, JPG ou JPEG
- **Quando** o backend valida o arquivo
- **Então** a API rejeita a requisição com erro HTTP 400
- **E** informa que a extensão não é permitida.

---

### Cenário 9: Envio de tipo de documento não aplicável à categoria do usuário

- **Dado que** estou autenticado com uma conta de determinada categoria
- **E** tento enviar um tipo de documento não permitido para essa categoria
- **Quando** o backend valida o tipo do documento
- **Então** a API rejeita a operação com erro HTTP 400
- **E** informa que o documento não é aplicável ao tipo de usuário.

| Categoria do usuário | Tipo de documento não aplicável para o teste |
| :--- | :--- |
| Estudante | `CCMEI` |
| MEI | `COMPROVANTE_MATRICULA` |
| ME | `COMPROVANTE_MATRICULA` |
| Empresa | `COMPROVANTE_MATRICULA` |

---

### Cenário 10: Substituição de documento já enviado

- **Dado que** estou autenticado e já existe um documento enviado para determinado tipo de documento no meu perfil
- **Quando** seleciono **Substituir** e envio um novo arquivo válido para o mesmo tipo
- **Então** o sistema armazena o novo arquivo
- **E** atualiza os metadados do documento no perfil
- **E** mantém apenas a versão mais recente daquele tipo de documento na lista de documentos do perfil.

---

### Cenário 11: Visualização de documento enviado

- **Dado que** existe um documento associado ao meu perfil
- **Quando** seleciono a opção **Visualizar** correspondente ao documento
- **Então** o sistema abre a URL do arquivo em uma nova aba do navegador.

---

### Cenário 12: Exibição dos documentos exigidos para cada categoria

- **Dado que** estou autenticado e acesso a seção de documentos do meu perfil
- **Quando** o sistema identifica minha categoria de usuário
- **Então** apresenta os tipos de documentos configurados para essa categoria
- **E** identifica os documentos obrigatórios com a indicação **Obrigatório**
- **E** exibe a quantidade de documentos enviados em relação à quantidade configurada para a categoria.

---

### Cenário 13: Aviso de documentos obrigatórios pendentes

- **Dado que** minha categoria possui um ou mais documentos obrigatórios ainda não enviados
- **Quando** acesso a seção **Documentos Comprobatórios** do perfil
- **Então** o sistema exibe o aviso de que existem documentos obrigatórios pendentes de envio.

---

### Cenário 14: Tentativa de envio de documento sem autenticação

- **Dado que** não estou autenticado na plataforma
- **Quando** tento enviar um documento para o endpoint `/usuarios/perfil/documentos`
- **Então** o backend rejeita a operação com erro HTTP 401
- **E** não associa o documento a um perfil.

---

### Cenário 15: Falha durante o envio do documento

- **Dado que** estou autenticado e seleciono um arquivo permitido
- **Quando** ocorre um erro durante a tentativa de envio ou armazenamento do documento
- **Então** a interface apresenta o alerta `Erro ao enviar documento comprobatório.`
- **E** encerra o estado visual de envio, permitindo que eu tente novamente.

---

## Arquivos relacionados à funcionalidade

### Frontend

- `frontend/src/pages/Perfil/Perfil.tsx`
- `frontend/src/pages/Perfil/usePerfil.ts`
- `frontend/src/components/Perfil/DocumentosSection.tsx`
- `frontend/src/components/Perfil/DocumentosSection.module.css`
- `frontend/src/services/perfilService.ts`
- `frontend/src/utils/documentosPorCategoria.ts`
- `frontend/src/types/perfil.ts`

### Backend

- `backend/src/main/java/com/workonnection/backend/controller/UsuarioController.java`
- `backend/src/main/java/com/workonnection/backend/service/UsuarioService.java`
- `backend/src/main/java/com/workonnection/backend/service/FileStorageService.java`
- `backend/src/main/java/com/workonnection/backend/model/ArquivoMetadados.java`
- `backend/src/main/java/com/workonnection/backend/model/Usuario.java`

**Endpoint utilizado:** `POST /usuarios/perfil/documentos` (requisição `multipart/form-data`, com os campos `tipoDocumento` e `arquivo`).

---

**Observação:** os cenários descrevem comportamentos previstos a partir do código-fonte analisado. Eles não significam que os testes tenham sido executados. Mensagens, códigos HTTP e regras devem ser revalidados caso o código seja alterado.