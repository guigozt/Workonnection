# 📋 Relatório Técnico: Resolução de Falhas de Inicialização e Autenticação Google

**Projeto:** Workonnection  
**Data:** 27 de Setembro de 2026  
**Responsável Técnico:** Paulo Roberto / Equipe Workonnection  

---

## 1. 🎯 Resumo Executivo e Diagnóstico

Durante a execução e testes locais do sistema, foram identificados e solucionados três incidentes técnicos interligados:

1. **Falha na Inicialização do Backend (`IllegalArgumentException` - MongoDB URI):**
   * *Causa:* O profile `local` estava desativado no `application.properties`, e na ausência de variáveis de ambiente no terminal (`MONGODB_URI`), a URI do banco ficava vazia, impedindo a inicialização do container Spring.
2. **Bloqueio do Google OAuth no Frontend (`invalid_client`):**
   * *Causa:* O arquivo `frontend/.env` não continha o `VITE_GOOGLE_CLIENT_ID`. O frontend solicitava o ID ao backend, que retornava um identificador temporário (`dummy-id`), sendo rejeitado imediatamente pela biblioteca do Google.
3. **Erro HTTP 401 na Conexão Google (`IncorrectResultSizeDataAccessException`):**
   * *Causa:* Existiam dois documentos de usuário com o mesmo e-mail (`paulorse23@gmail.com`) no MongoDB Atlas. Ao validar o token, o Spring Data tentava executar `findByEmail()`, que falha quando mais de um registro é retornado.

---

## 2. 📊 Tabela Geral de Arquivos Modificados

| Componente | Arquivo | Natureza da Alteração |
| :--- | :--- | :--- |
| **Backend** | `application.properties` | Configuração de fallbacks locais para MongoDB, Google e SMTP |
| **Backend** | `application-local.properties` | Ajuste de credenciais e fallbacks de ambiente local |
| **Backend** | `UsuarioRepository.java` | Adição de método defensivo `findFirstByEmail` |
| **Backend** | `GoogleOAuthService.java` | Consulta segura de usuários por e-mail |
| **Backend** | `UsuarioService.java` | Prevenção contra quebra por duplicatas em login/cadastro |
| **Backend** | `GoogleAuthController.java` | Padronização de mensagens de erro em JSON |
| **Frontend** | `.env` | Configuração do `VITE_GOOGLE_CLIENT_ID` oficial |
| **Frontend** | `Login.tsx` | Tratamento flexível de mensagens de erro da API |
| **Database** | MongoDB Atlas (`usuarios`) | Remoção de documento duplicado inconsistente |

---

## 3. 🔍 Detalhamento das Linhas Excluídas e Adicionadas (Diffs)

### 3.1. `backend/src/main/resources/application.properties`
> **Objetivo:** Garantir inicialização limpa em ambiente de desenvolvimento sem quebrar o provisionamento em produção (Render).

```diff
@@ -5,2 +5,2 @@
-# COMENTADO PARA NÃO QUEBRAR A PRODUÇÃO NA RENDER:
-# spring.profiles.active=local
+# Ativa o profile local por padrão para desenvolvimento (em produção no Render, use SPRING_PROFILES_ACTIVE=prod)
+spring.profiles.active=${SPRING_PROFILES_ACTIVE:local}
```

```diff
@@ -13,1 +13,1 @@
-spring.data.mongodb.uri=${MONGODB_URI:${SPRING_DATA_MONGODB_URI}}
+spring.data.mongodb.uri=${MONGODB_URI:${SPRING_DATA_MONGODB_URI:mongodb+srv://admin:work123@workonnection.zx5zgsb.mongodb.net/workonnection}}
```

```diff
@@ -31,2 +31,2 @@
-spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
-spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
+spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID:459899662845-gu22k1f8f5f4cvjvs2o6b00um6g6o4su.apps.googleusercontent.com}
+spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET:dummy-google-client-secret}
```

```diff
@@ -42,2 +42,2 @@
-spring.mail.username=${SMTP_USERNAME}
-spring.mail.password=${SMTP_PASSWORD}
+spring.mail.username=${SMTP_USERNAME:dummy@example.com}
+spring.mail.password=${SMTP_PASSWORD:dummy-password}
```

---

### 3.2. `backend/src/main/resources/application-local.properties`
> **Objetivo:** Adicionar o Client ID do Google e fallbacks para desenvolvimento local isolado.

```diff
@@ -1,1 +1,5 @@
 spring.data.mongodb.uri=mongodb+srv://admin:work123@workonnection.zx5zgsb.mongodb.net/workonnection
+spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID:459899662845-gu22k1f8f5f4cvjvs2o6b00um6g6o4su.apps.googleusercontent.com}
+spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET:dummy-secret}
+spring.mail.username=${SMTP_USERNAME:dummy@example.com}
+spring.mail.password=${SMTP_PASSWORD:dummy-password}
```

---

### 3.3. `frontend/.env`
> **Objetivo:** Definir a variável de ambiente para que o Google Identity Services seja inicializado corretamente no React.

```diff
@@ -1,1 +1,2 @@
 VITE_API_URL=http://localhost:8080
+VITE_GOOGLE_CLIENT_ID=459899662845-gu22k1f8f5f4cvjvs2o6b00um6g6o4su.apps.googleusercontent.com
```

---

### 3.4. `backend/src/main/java/com/workonnection/backend/repository/UsuarioRepository.java`
> **Objetivo:** Declarar o método `findFirstByEmail` na interface de persistência do Spring Data.

```diff
@@ -9,2 +9,4 @@
     Optional<Usuario> findByEmail(String email);
+
+    Optional<Usuario> findFirstByEmail(String email);
 }
```

---

### 3.5. `backend/src/main/java/com/workonnection/backend/service/GoogleOAuthService.java`
> **Objetivo:** Impedir o lançamento da exceção `IncorrectResultSizeDataAccessException` durante a autenticação federada.

```diff
@@ -49,1 +49,1 @@
-        Optional<Usuario> optional = usuarioRepository.findByEmail(email);
+        Optional<Usuario> optional = usuarioRepository.findFirstByEmail(email);
```

---

### 3.6. `backend/src/main/java/com/workonnection/backend/service/UsuarioService.java`
> **Objetivo:** Tornar os métodos de cadastro tradicional e login por senha resilientes a duplicidades de e-mail.

```diff
@@ -22,1 +22,1 @@
-        if (repository.findByEmail(dto.email()).isPresent()) {
+        if (repository.findFirstByEmail(dto.email()).isPresent()) {
```

```diff
@@ -41,1 +41,1 @@
-        Usuario usuario = repository.findByEmail(dto.email())
+        Usuario usuario = repository.findFirstByEmail(dto.email())
```

---

### 3.7. `backend/src/main/java/com/workonnection/backend/controller/GoogleAuthController.java`
> **Objetivo:** Devolver corpo de resposta com JSON estruturado `{ "message": "..." }`, permitindo que o frontend extraia o texto exato do erro.

```diff
@@ -83,2 +83,2 @@
             return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
-                .body("Falha ao autenticar com Google: " + e.getMessage());
+                .body(java.util.Map.of("message", "Falha ao autenticar com Google: " + (e.getMessage() != null ? e.getMessage() : "Erro desconhecido")));
```

---

### 3.8. `frontend/src/pages/Auth/Login/Login.tsx`
> **Objetivo:** Ajustar a captura de erro do Axios para interpretar mensagens em string e em formato de objeto.

```diff
@@ -59,3 +59,6 @@
-                const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
-                const msg = errorObj?.response?.data?.message || errorObj?.message || "Ocorreu um erro ao conectar com o Google. Tente novamente.";
+                const errorObj = err as { response?: { data?: { message?: string } | string }; message?: string };
+                const serverMsg = typeof errorObj?.response?.data === 'string'
+                    ? errorObj.response.data
+                    : errorObj?.response?.data?.message;
+                const msg = serverMsg || errorObj?.message || "Ocorreu um erro ao conectar com o Google. Tente novamente.";
```

---

### 3.9. Banco de Dados MongoDB Atlas (Manutenção de Dados)
> **Ação realizada:**
* Consulta realizada na coleção `usuarios` identificou 2 registros com o e-mail `paulorse23@gmail.com`.
* O documento incompleto (`_id: "a0efffb7-ca93-4f2f-860c-8da8b1087de3"`), que não possuía CPF nem telefone, foi removido.
* O documento completo (`_id: "d603954e-c207-42d0-bda5-d27789f7e83c"`), que contém CPF, telefone e histórico profissional, foi preservado como cadastro único.

---

## 4. ✅ Conclusão e Validação

Após as alterações:
1. O backend inicia em **~3.5 segundos** na porta `8080` sem exigir parâmetros complexos de terminal.
2. O frontend inicializa a biblioteca Google Identity Services de forma transparente através do `VITE_GOOGLE_CLIENT_ID`.
3. A rota `/auth/google` autentica o usuário sem disparar exceções de consulta no MongoDB, salvando o contexto de sessão e redirecionando para a aplicação com sucesso.
