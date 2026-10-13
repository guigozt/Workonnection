import os
import subprocess
import markdown

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Workonnection - Cenários de Teste BDD</title>
    <style>
        @page {
            size: A4;
            margin: 20mm 18mm 20mm 18mm;
            @bottom-left {
                content: "Workonnection – Cenários de Teste BDD";
                font-size: 8.5pt;
                color: #718096;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            @bottom-right {
                content: "Página " counter(page);
                font-size: 8.5pt;
                color: #718096;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
        }

        @page :first {
            margin: 25mm 20mm 20mm 20mm;
            @bottom-left { content: none; }
            @bottom-right { content: none; }
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #2d3748;
            line-height: 1.5;
            font-size: 10pt;
            margin: 0;
            padding: 0;
        }

        /* Capa */
        .capa {
            page-break-after: always;
            height: 94vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            box-sizing: border-box;
            padding: 20px 0;
        }

        .capa-instituicao {
            font-size: 11pt;
            color: #4a5568;
            line-height: 1.6;
        }

        .capa-instituicao strong {
            color: #1a202c;
        }

        .capa-titulo-box {
            margin: 60px 0 40px 0;
        }

        .capa-titulo {
            font-size: 28pt;
            font-weight: 700;
            color: #1b365d;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }

        .capa-subtitulo {
            font-size: 13pt;
            color: #4a5568;
            font-weight: 500;
            line-height: 1.4;
        }

        .capa-integrantes {
            margin: 30px 0;
        }

        .capa-integrantes h3 {
            font-size: 12pt;
            color: #1b365d;
            margin-bottom: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .capa-integrantes p {
            font-size: 10.5pt;
            color: #2d3748;
            margin: 4px 0;
            font-weight: 500;
        }

        .capa-sumario {
            margin-top: 30px;
            text-align: center;
        }

        .capa-sumario h3 {
            font-size: 12pt;
            color: #1b365d;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .capa-sumario ol {
            display: inline-block;
            text-align: left;
            margin: 0 auto;
            font-size: 10.5pt;
            line-height: 1.9;
            color: #2d3748;
            padding-left: 20px;
        }

        /* Seções e cabeçalhos */
        .secao {
            page-break-before: always;
            padding-top: 6px;
        }

        .secao-header {
            border-bottom: 2px solid #1b365d;
            padding-bottom: 8px;
            margin-bottom: 14px;
        }

        .secao-header h2 {
            font-size: 15pt;
            color: #1b365d;
            margin: 0 0 4px 0;
            font-weight: 700;
        }

        .secao-header .meta-info {
            font-size: 10pt;
            color: #4a5568;
            margin: 2px 0;
        }

        .user-story-card {
            background-color: #f7fafc;
            border-left: 4px solid #1b365d;
            border-radius: 4px;
            padding: 10px 14px;
            margin: 12px 0 16px 0;
            font-size: 9.5pt;
            line-height: 1.5;
        }

        .user-story-card p {
            margin: 4px 0;
        }

        .titulo-especificacao {
            font-size: 11pt;
            font-weight: 700;
            color: #2b6cb0;
            margin: 16px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Cenários */
        .cenario-card {
            margin-bottom: 16px;
            page-break-inside: avoid;
        }

        .cenario-titulo {
            font-size: 10.5pt;
            font-weight: 700;
            color: #1b365d;
            margin: 12px 0 6px 0;
            padding-bottom: 3px;
            border-bottom: 1px solid #e2e8f0;
        }

        .subcenario-titulo {
            font-size: 10pt;
            font-weight: 600;
            color: #2c5282;
            margin: 8px 0 4px 0;
        }

        ul.passos {
            list-style-type: none;
            padding-left: 0;
            margin: 6px 0 10px 0;
        }

        ul.passos li {
            position: relative;
            padding-left: 18px;
            margin-bottom: 5px;
            line-height: 1.45;
            font-size: 9.5pt;
        }

        ul.passos li::before {
            content: "•";
            position: absolute;
            left: 2px;
            color: #1b365d;
            font-weight: bold;
            font-size: 12pt;
            line-height: 1;
        }

        ul.passos li strong {
            color: #1a202c;
        }

        ul.subpassos {
            list-style-type: disc;
            padding-left: 24px;
            margin: 4px 0 6px 0;
            font-size: 9pt;
        }

        ul.subpassos li {
            margin-bottom: 3px;
        }

        /* Tabelas */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0 14px 0;
            font-size: 8.5pt;
            page-break-inside: avoid;
        }

        th {
            background-color: #1b365d;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 6px 8px;
            border: 1px solid #1b365d;
            font-size: 8.5pt;
        }

        td {
            padding: 5px 8px;
            border: 1px solid #e2e8f0;
            vertical-align: middle;
            color: #2d3748;
        }

        tr:nth-child(even) td {
            background-color: #f8fafc;
        }

        code {
            background-color: #edf2f7;
            padding: 1px 4px;
            border-radius: 3px;
            font-family: 'Consolas', monospace;
            font-size: 8.5pt;
            color: #c53030;
        }

        /* Referências */
        .referencias {
            page-break-before: always;
            padding-top: 10px;
        }

        .referencias h2 {
            font-size: 15pt;
            color: #1b365d;
            border-bottom: 2px solid #1b365d;
            padding-bottom: 8px;
            margin-bottom: 16px;
        }

        .referencias p {
            font-size: 9.5pt;
            line-height: 1.6;
            margin-bottom: 12px;
            color: #2d3748;
        }
    </style>
</head>
<body>

    <!-- CAPA -->
    <div class="capa">
        <div class="capa-instituicao">
            <p><strong>Fatec – Análise e Desenvolvimento de Sistemas</strong><br>
            Disciplina – Laboratório de Desenvolvimento Web<br>
            Prof. Edson Saraiva de Almeida</p>
        </div>

        <div class="capa-titulo-box">
            <div class="capa-titulo">Workonnection</div>
            <div class="capa-subtitulo">Documentação dos Cenários de Teste utilizando a técnica BDD</div>
        </div>

        <div class="capa-integrantes">
            <h3>Integrantes do projeto</h3>
            <p>Hugo Aparecido</p>
            <p>Paulo Roberto</p>
            <p>Caroline Mendes</p>
            <p>Priscila Mendes</p>
            <p>Gabriel Gutierres</p>
            <p>Guilherme Gomes</p>
        </div>

        <div class="capa-sumario">
            <h3>Sumário</h3>
            <ol>
                <li>Cadastro de Usuário</li>
                <li>Importação de Documentos</li>
                <li>Gerenciamento de Vagas</li>
                <li>Chat e Mensagens</li>
                <li>Central de Notificações</li>
            </ol>
        </div>
    </div>

    <!-- 1. CADASTRO DE USUÁRIO -->
    <div class="secao">
        <div class="secao-header">
            <h2>Projeto: Workonnection</h2>
            <div class="meta-info"><strong>Funcionalidade:</strong> Cadastro de Usuário na Plataforma (Autônomo, MEI, Estudante e Contratante)</div>
        </div>

        <div class="user-story-card">
            <p>• <strong>Como um</strong> profissional autônomo, microempreendedor (MEI), estudante ou contratante</p>
            <p>• <strong>Eu quero</strong> cadastrar uma nova conta na plataforma Workonnection informando meus dados pessoais e credenciais de acesso</p>
            <p>• <strong>Para que</strong> eu possa acessar o sistema com segurança, divulgar meus serviços, candidatar-me a vagas ou recrutar talentos</p>
        </div>

        <div class="titulo-especificacao">Especificação dos cenários de uso utilizando BDD</div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 1: Cadastro com sucesso (Caminho Feliz)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> não existe um usuário previamente cadastrado com o CPF "83301677045" nem com o e-mail "carlos.silva@email.com"</li>
                <li><strong>Quando</strong> o usuário preenche e confirma a operação com as seguintes informações de cadastro:
                    <ul class="subpassos">
                        <li><strong>Nome:</strong> Carlos da Silva</li>
                        <li><strong>CPF:</strong> 83301677045</li>
                        <li><strong>Data de Nascimento:</strong> 15/05/1998</li>
                        <li><strong>Telefone:</strong> (11) 98765-4321</li>
                        <li><strong>E-mail:</strong> carlos.silva@email.com</li>
                        <li><strong>Senha:</strong> Senha@123</li>
                        <li><strong>Confirmação de Senha:</strong> Senha@123</li>
                        <li><strong>Tipo de Usuário:</strong> Autônomo</li>
                    </ul>
                </li>
                <li><strong>Então</strong> o sistema realiza a criptografia da senha, persiste os dados no banco de dados, exibe a notificação de confirmação <code>Cadastro realizado com sucesso!</code> e redireciona o usuário para a tela de login com o perfil habilitado para autenticação.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 2: Cadastro de usuário com CPF inválido (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o &lt;CPF&gt; informado está inválido ou incorreto</li>
                <li><strong>Quando</strong> confirmo o cadastro do usuário</li>
                <li><strong>Então</strong> o sistema rejeita o cadastro informando a &lt;Mensagem&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th><th>CPF</th><th>Data Nasc.</th><th>Telefone</th><th>E-mail</th><th>Senha</th><th>Confirmação</th><th>Tipo Usuário</th><th>Mensagem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Carlos Silva</td><td>8330167704</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>CPF inválido (tamanho menor que 11 dígitos)</td></tr>
                    <tr><td>Carlos Silva</td><td><em>(vazio)</em></td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>CPF inválido (vazio)</td></tr>
                    <tr><td>Carlos Silva</td><td>11111111111</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>CPF inválido (dígitos verificadores repetidos)</td></tr>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>CPF inválido (já cadastrado/duplicado)</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 3: Cadastro de usuário com Nome inválido (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o &lt;Nome&gt; informado não atende aos requisitos mínimos</li>
                <li><strong>Quando</strong> confirmo o cadastro do usuário</li>
                <li><strong>Então</strong> o sistema rejeita o cadastro informando a &lt;Mensagem&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th><th>CPF</th><th>Data Nasc.</th><th>Telefone</th><th>E-mail</th><th>Senha</th><th>Confirmação</th><th>Tipo Usuário</th><th>Mensagem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><em>(vazio)</em></td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Nome inválido (vazio)</td></tr>
                    <tr><td>" "</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Nome inválido (em branco)</td></tr>
                    <tr><td>Al</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Mínimo 3 caracteres</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 4: Cadastro de usuário com Data de Nascimento / Idade inválida (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> a &lt;Data Nasc.&gt; está vazia, em formato incorreto ou indica idade inferior ao requisito legal da plataforma (mínimo de 16 anos)</li>
                <li><strong>Quando</strong> confirmo o cadastro do usuário</li>
                <li><strong>Então</strong> o sistema rejeita o cadastro informando a &lt;Mensagem&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th><th>CPF</th><th>Data Nasc.</th><th>Telefone</th><th>E-mail</th><th>Senha</th><th>Confirmação</th><th>Tipo Usuário</th><th>Mensagem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td><em>(vazio)</em></td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Data obrigatória</td></tr>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>10/10/2015</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Mínimo 16 anos</td></tr>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>01/01/1850</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Data inválida</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 5: Cadastro de usuário com Senha ou Confirmação inválida (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> a &lt;Senha&gt; possui menos de 6 caracteres ou não coincide com &lt;Confirmação&gt;</li>
                <li><strong>Quando</strong> confirmo o cadastro do usuário</li>
                <li><strong>Então</strong> o sistema rejeita o cadastro informando a &lt;Mensagem&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th><th>CPF</th><th>Data Nasc.</th><th>Telefone</th><th>E-mail</th><th>Senha</th><th>Confirmação</th><th>Tipo Usuário</th><th>Mensagem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>12345</td><td>12345</td><td>Autônomo</td><td>Mínimo 6 caracteres</td></tr>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td>123456</td><td>654321</td><td>Autônomo</td><td>Senhas não coincidem</td></tr>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlos@email.com</td><td><em>(vazio)</em></td><td><em>(vazio)</em></td><td>Autônomo</td><td>Mínimo 6 caracteres</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 6: Cadastro de usuário com E-mail inválido ou já cadastrado (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o &lt;E-mail&gt; está em formato incorreto ou já existente na base de dados</li>
                <li><strong>Quando</strong> confirmo o cadastro do usuário</li>
                <li><strong>Então</strong> o sistema rejeita o cadastro informando a &lt;Mensagem&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th><th>CPF</th><th>Data Nasc.</th><th>Telefone</th><th>E-mail</th><th>Senha</th><th>Confirmação</th><th>Tipo Usuário</th><th>Mensagem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>carlosemail.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Email inválido</td></tr>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td><em>(vazio)</em></td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Email inválido</td></tr>
                    <tr><td>Carlos Silva</td><td>83301677045</td><td>15/05/1998</td><td>(11) 98765-4321</td><td>jaexiste@email.com</td><td>Senha@123</td><td>Senha@123</td><td>Autônomo</td><td>Email já cadastrado</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 2. IMPORTAÇÃO DE DOCUMENTOS -->
    <div class="secao">
        <div class="secao-header">
            <h2>Projeto: Workonnection</h2>
            <div class="meta-info"><strong>Funcionalidade:</strong> Importação de Documentos Comprobatórios no Perfil</div>
        </div>

        <div class="user-story-card">
            <p>• <strong>Como um</strong> usuário autenticado da plataforma Workonnection</p>
            <p>• <strong>Eu quero</strong> enviar, visualizar e substituir os documentos comprobatórios solicitados para a minha categoria de usuário</p>
            <p>• <strong>Para que</strong> eu possa comprovar minhas qualificações, manter meu cadastro regularizado e associar os documentos ao meu perfil</p>
        </div>

        <div class="titulo-especificacao">Especificação dos cenários de uso utilizando BDD</div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 1: Envio de documento comprobatório com sucesso (Caminho Feliz)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário está autenticado na plataforma e acessa a seção <strong>"Documentos Comprobatórios"</strong> em seu perfil</li>
                <li><strong>E</strong> seleciona um tipo de documento exigido para sua categoria (ex.: <code>COMPROVANTE_MATRICULA</code>)</li>
                <li><strong>Quando</strong> o usuário anexa um arquivo válido <code>comprovante_2026.pdf</code> com tamanho de 2,5 MB e clica em <strong>"Enviar"</strong></li>
                <li><strong>Então</strong> o sistema realiza o upload do documento com sucesso, armazena o arquivo associando-o ao perfil do usuário, atualiza a listagem exibindo o nome original do arquivo e seu tamanho formatado, e incrementa o contador de documentos enviados.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 2: Validação de arquivo inválido para envio (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário está autenticado e tenta enviar um arquivo para um tipo de documento disponível</li>
                <li><strong>Quando</strong> anexa um arquivo com &lt;Arquivo Informado&gt; e aciona o envio</li>
                <li><strong>Então</strong> o sistema rejeita o upload e exibe a mensagem de validação &lt;Mensagem Esperada&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Tipo de Arquivo / Caso de Teste</th><th>Arquivo Informado</th><th>Tamanho</th><th>Mensagem Esperada</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Extensão não permitida</td><td><code>documento.docx</code></td><td>1.2 MB</td><td>Selecione um arquivo válido (PDF, PNG, JPG ou JPEG).</td></tr>
                    <tr><td>Extensão executável inválida</td><td><code>instalador.exe</code></td><td>500 KB</td><td>Selecione um arquivo válido (PDF, PNG, JPG ou JPEG).</td></tr>
                    <tr><td>Tamanho acima do limite permitido</td><td><code>digitalizacao_alta_resolucao.pdf</code></td><td>14.5 MB</td><td>O arquivo não pode exceder 10MB.</td></tr>
                    <tr><td>Arquivo vazio / sem conteúdo</td><td><code>arquivo_zerado.pdf</code></td><td>0 KB</td><td>Nenhum arquivo enviado ou o arquivo está vazio</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 3: Validação de documento incompatível com a categoria do usuário (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário está autenticado com uma conta da categoria &lt;Categoria&gt;</li>
                <li><strong>Quando</strong> tenta submeter uma requisição de upload informando o tipo de documento &lt;Tipo Documento&gt;</li>
                <li><strong>Então</strong> o sistema rejeita a operação e retorna a mensagem &lt;Mensagem de Erro&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Categoria</th><th>Tipo Documento</th><th>Mensagem de Erro</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Estudante</td><td><code>CCMEI</code></td><td>Documento 'CCMEI' não é aplicável ao tipo de usuário: ESTUDANTE</td></tr>
                    <tr><td>MEI</td><td><code>COMPROVANTE_MATRICULA</code></td><td>Documento 'COMPROVANTE_MATRICULA' não é aplicável ao tipo de usuário: MEI</td></tr>
                    <tr><td>ME</td><td><code>COMPROVANTE_MATRICULA</code></td><td>Documento 'COMPROVANTE_MATRICULA' não é aplicável ao tipo de usuário: ME</td></tr>
                    <tr><td>Empresa</td><td><code>COMPROVANTE_MATRICULA</code></td><td>Documento 'COMPROVANTE_MATRICULA' não é aplicável ao tipo de usuário: EMPRESA</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 4: Substituição de documento já enviado (Caminho Feliz)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário autenticado já possui um arquivo associado ao tipo <code>COMPROVANTE_MATRICULA</code></li>
                <li><strong>Quando</strong> seleciona a opção <strong>"Substituir"</strong> e faz o upload de um novo arquivo válido <code>matricula_atualizada.pdf</code></li>
                <li><strong>Então</strong> o sistema substitui a versão anterior pelo novo arquivo, atualiza a data e os metadados do documento e mantém apenas a versão mais recente na listagem do perfil.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 5: Visualização de documento e controle de pendências obrigatórias</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário acessa a seção de documentos comprobatórios no seu perfil</li>
                <li><strong>Quando</strong> o sistema carrega os requisitos da sua categoria de usuário</li>
                <li><strong>Então</strong> o sistema exibe os tipos de documentos configurados para aquela categoria com a indicação dos itens obrigatórios</li>
                <li><strong>E</strong> caso existam documentos obrigatórios não enviados, exibe o alerta: <code>Atenção: Você possui documentos obrigatórios pendentes de envio.</code></li>
                <li><strong>E</strong> para os documentos já enviados com sucesso, disponibiliza a opção <strong>"Visualizar"</strong>, abrindo o arquivo correspondente em uma nova aba do navegador.</li>
            </ul>
        </div>
    </div>

    <!-- 3. GERENCIAMENTO DE VAGAS -->
    <div class="secao">
        <div class="secao-header">
            <h2>Projeto: Workonnection</h2>
            <div class="meta-info"><strong>Funcionalidade:</strong> Gerenciamento de Vagas (Criação, Edição, Exclusão e Consulta)</div>
        </div>

        <div class="user-story-card">
            <p>• <strong>Como um</strong> usuário cadastrado e autenticado na plataforma (Autônomo, MEI ou Contratante)</p>
            <p>• <strong>Eu quero</strong> criar, consultar, filtrar, editar e excluir oportunidades de trabalho</p>
            <p>• <strong>Para que</strong> eu possa divulgar demandas de projetos, atrair profissionais qualificados e gerenciar o ciclo de vida das minhas publicações</p>
        </div>

        <div class="titulo-especificacao">Especificação dos cenários de uso utilizando BDD</div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 1: Publicação de vaga com sucesso (Caminho Feliz)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário está autenticado com um perfil autorizado a publicar vagas (ex.: Autônomo ou MEI)</li>
                <li><strong>Quando</strong> o usuário abre o formulário de cadastro de vaga e informa os seguintes dados:
                    <ul class="subpassos">
                        <li><strong>Empresa:</strong> Tech Soluções</li>
                        <li><strong>Cargo:</strong> Desenvolvedor Full Stack</li>
                        <li><strong>Modalidade:</strong> Remoto</li>
                        <li><strong>Horário Inicial / Final:</strong> 09:00 às 18:00</li>
                        <li><strong>Localização:</strong> São Paulo, SP</li>
                        <li><strong>Salário:</strong> R$ 5.500,00</li>
                        <li><strong>Benefícios:</strong> Vale Refeição, Auxílio Home Office</li>
                        <li><strong>Data Limite:</strong> Data futura válida (ex.: 30 dias após hoje)</li>
                        <li><strong>E-mail de Contato:</strong> recrutamento@techsolucoes.com</li>
                        <li><strong>Descrição:</strong> Atuação no desenvolvimento e manutenção de sistemas web em React e Spring Boot.</li>
                        <li><strong>Requisitos:</strong> Experiência com TypeScript, Java e bancos de dados relacionais ou NoSQL.</li>
                        <li><strong>Público-alvo:</strong> Prestador de Serviço</li>
                    </ul>
                </li>
                <li><strong>E</strong> aciona a ação <strong>"Salvar Vaga"</strong></li>
                <li><strong>Então</strong> o sistema valida todas as informações, cadastra a nova oportunidade na base de dados, exibe a notificação de confirmação e inclui a publicação na lista de vagas ativas da plataforma.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 2: Validação de formulário na criação ou edição de vaga (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário está na tela de cadastro ou edição de vaga</li>
                <li><strong>Quando</strong> tenta submeter o formulário informando a &lt;Condição de Entrada&gt;</li>
                <li><strong>Então</strong> o sistema impede a gravação da vaga e exibe a &lt;Mensagem de Validação&gt; correspondente</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Campo Sob Validação</th><th>Condição de Entrada</th><th>Mensagem de Validação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Empresa</td><td><em>(vazio)</em></td><td>Obrigatório</td></tr>
                    <tr><td>Cargo</td><td><em>(vazio)</em></td><td>Obrigatório</td></tr>
                    <tr><td>Modalidade</td><td><em>(não selecionada)</em></td><td>Obrigatório</td></tr>
                    <tr><td>Localização</td><td><em>(vazio)</em></td><td>Obrigatório</td></tr>
                    <tr><td>Salário</td><td><em>(vazio)</em></td><td>Obrigatório</td></tr>
                    <tr><td>Benefícios</td><td><em>(vazio)</em></td><td>Obrigatório</td></tr>
                    <tr><td>Data Limite</td><td><em>(vazio)</em></td><td>Obrigatório</td></tr>
                    <tr><td>Data Limite no passado</td><td>Data anterior à data de hoje (ex.: <code>01/01/2020</code>)</td><td>Data no passado não é permitida</td></tr>
                    <tr><td>Descrição insuficiente</td><td><code>"Vaga dev"</code> (menos de 10 caracteres)</td><td>Mínimo 10 caracteres</td></tr>
                    <tr><td>Requisitos insuficientes</td><td><code>"Java"</code> (menos de 5 caracteres)</td><td>Mínimo 5 caracteres</td></tr>
                    <tr><td>E-mail de contato inválido</td><td><code>"recrutamento.techsolucoes.com"</code> (sem formato válido)</td><td>E-mail inválido</td></tr>
                    <tr><td>Intervalo de horário inválido</td><td>Início <code>18:00</code> e Fim <code>08:00</code> (fim anterior ao início)</td><td>Hora final deve ser maior que a inicial</td></tr>
                    <tr><td>Público-alvo</td><td>Nenhum tipo selecionado</td><td>Selecione ao menos um tipo</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 3: Tentativa de publicação de vaga por perfil não autorizado (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário está autenticado na plataforma com perfil de <strong>"Estudante"</strong></li>
                <li><strong>Quando</strong> tenta acessar o recurso de publicação de vaga</li>
                <li><strong>Então</strong> o sistema bloqueia a criação e exibe a mensagem de restrição de permissão: <code>Estudantes não têm permissão para publicar vagas</code>.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 4: Edição de vaga publicada</div>
            <div class="subcenario-titulo">4.1 – Edição de vaga própria com sucesso (Caminho Feliz):</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário possui uma vaga de sua autoria já publicada na plataforma</li>
                <li><strong>Quando</strong> abre a edição dessa vaga, altera o salário para <code>R$ 6.000,00</code> e a descrição para <code>Atuação em novos projetos web responsivos com React.</code> e salva</li>
                <li><strong>Então</strong> o sistema valida as alterações, persiste a nova versão e exibe os dados atualizados na listagem.</li>
            </ul>

            <div class="subcenario-titulo">4.2 – Tentativa de edição de vaga pertencente a outro usuário (Sem Sucesso):</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário está autenticado, mas visualiza uma vaga publicada por outro usuário</li>
                <li><strong>Quando</strong> tenta submeter uma alteração nessa publicação</li>
                <li><strong>Então</strong> o sistema rejeita a operação e exibe a mensagem de permissão negada: <code>Sem permissão para editar esta vaga</code>.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 5: Exclusão de vaga publicada</div>
            <div class="subcenario-titulo">5.1 – Exclusão de vaga própria confirmada (Caminho Feliz):</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o autor da vaga acessa sua listagem em <strong>"Minhas Vagas"</strong></li>
                <li><strong>Quando</strong> seleciona a ação de excluir na vaga desejada e confirma o diálogo de exclusão</li>
                <li><strong>Então</strong> o sistema remove definitivamente a vaga da plataforma e atualiza a listagem sem a vaga excluída.</li>
            </ul>

            <div class="subcenario-titulo">5.2 – Tentativa de exclusão de vaga de outro usuário (Sem Sucesso):</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário tenta acionar a exclusão de uma vaga cujo proprietário seja outro usuário</li>
                <li><strong>Quando</strong> o pedido de remoção é processado</li>
                <li><strong>Então</strong> o sistema bloqueia a exclusão e exibe a mensagem: <code>Sem permissão para excluir esta vaga</code>.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 6: Consulta e filtragem de vagas na plataforma</div>
            <ul class="passos">
                <li><strong>Dado que</strong> existem vagas cadastradas com diferentes modalidades e perfis</li>
                <li><strong>Quando</strong> o usuário aplica o &lt;Critério de Filtro&gt; na tela de vagas</li>
                <li><strong>Então</strong> o sistema apresenta o &lt;Resultado Esperado&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Tipo de Filtro</th><th>Critério de Filtro</th><th>Resultado Esperado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Busca textual por cargo/requisito</td><td>Digitar <code>"React"</code></td><td>Listar apenas vagas cujo cargo, descrição ou requisitos contenham o termo "React"</td></tr>
                    <tr><td>Filtro por modalidade</td><td>Selecionar <code>"Remoto"</code></td><td>Listar exclusivamente oportunidades com modalidade remota</td></tr>
                    <tr><td>Filtro combinado sem correspondência</td><td>Digitar termo inexistente <code>"XptoInexistente999"</code></td><td>Exibir mensagem informando que não foram encontradas vagas para os filtros informados</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 4. CHAT E MENSAGENS -->
    <div class="secao">
        <div class="secao-header">
            <h2>Projeto: Workonnection</h2>
            <div class="meta-info"><strong>Funcionalidade:</strong> Sistema de Chat e Mensagens em Tempo Real</div>
        </div>

        <div class="user-story-card">
            <p>• <strong>Como um</strong> usuário cadastrado e autenticado na plataforma (profissional autônomo, MEI, estudante ou contratante)</p>
            <p>• <strong>Eu quero</strong> trocar mensagens de texto em tempo real com outros contatos e gerenciar o histórico de conversas</p>
            <p>• <strong>Para que</strong> eu possa tirar dúvidas sobre vagas, negociar orçamentos, alinhar serviços e manter comunicação profissional direta</p>
        </div>

        <div class="titulo-especificacao">Especificação dos cenários de uso utilizando BDD</div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 1: Envio de mensagem de texto com sucesso (Caminho Feliz)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário "Carlos Silva" está autenticado e com a conversa aberta com o contato "Mariana Souza"</li>
                <li><strong>Quando</strong> o usuário digita no campo de texto <code>Olá Mariana, tudo bem? Gostaria de saber mais informações sobre a oportunidade.</code> e clica no botão de enviar</li>
                <li><strong>Então</strong> o sistema realiza o envio da mensagem, transmite a notificação em tempo real para o destinatário, inclui o balão no histórico de mensagens com a indicação de status entregue e limpa o campo de digitação.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 2: Validação de conteúdo da mensagem ao enviar (Sem Sucesso)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o remetente está com uma conversa ativa selecionada</li>
                <li><strong>Quando</strong> tenta submeter uma mensagem com o &lt;Conteúdo&gt;</li>
                <li><strong>Então</strong> o sistema valida o envio apresentando a &lt;Mensagem/Comportamento&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Remetente</th><th>Destinatário</th><th>Conteúdo</th><th>Botão Enviar</th><th>Mensagem/Comportamento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Carlos Silva</td><td>Mariana Souza</td><td><em>(vazio)</em></td><td>Desabilitado</td><td>Envio impedido</td></tr>
                    <tr><td>Carlos Silva</td><td>Mariana Souza</td><td>" "</td><td>Desabilitado</td><td>Envio impedido (apenas espaços)</td></tr>
                    <tr><td>Carlos Silva</td><td>Mariana Souza</td><td>"Bom dia! Segue proposta: R$ 500,00."</td><td>Habilitado</td><td>Mensagem enviada com sucesso</td></tr>
                    <tr><td>Carlos Silva</td><td>Mariana Souza</td><td><em>(texto superior a 2000 caracteres)</em></td><td>Habilitado</td><td>Erro: Tamanho máximo excedido</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 3: Edição de mensagem já enviada</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário "Carlos Silva" enviou anteriormente uma mensagem no chat</li>
                <li><strong>Quando</strong> o usuário clica na ação de editar mensagem, informa o novo conteúdo &lt;Novo Conteúdo&gt; e confirma a alteração</li>
                <li><strong>Então</strong> o sistema valida a alteração aplicando o &lt;Resultado&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Usuário Solicitante</th><th>Conteúdo Original</th><th>Novo Conteúdo</th><th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Carlos Silva (autor)</td><td>"Boa tarde Marianna"</td><td>"Boa tarde Mariana"</td><td>Mensagem atualizada com rótulo "(editada)"</td></tr>
                    <tr><td>Carlos Silva (autor)</td><td>"Texto inicial"</td><td>"" (vazio)</td><td>Rejeitado: Conteúdo não pode ser vazio</td></tr>
                    <tr><td>Mariana Souza (não autor)</td><td>"Texto de Carlos"</td><td>"Tentativa de edição"</td><td>Rejeitado: Apenas o remetente pode editar</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 4: Exclusão de mensagem do histórico</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário visualiza uma mensagem em seu histórico de mensagens</li>
                <li><strong>Quando</strong> seleciona a opção "Excluir para mim" e confirma a caixa de confirmação</li>
                <li><strong>Então</strong> o sistema oculta a mensagem da visualização do usuário solicitante, mantendo o histórico inalterado para o outro participante da conversa.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 5: Atualização automática de status de leitura</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o contato "Mariana Souza" possui mensagens não lidas enviadas por "Carlos Silva"</li>
                <li><strong>Quando</strong> "Mariana Souza" acessa o chat e clica na conversa com "Carlos Silva"</li>
                <li><strong>Então</strong> o sistema atualiza o status das mensagens pendentes para lidas, preenche o carimbo de data/hora de leitura e remove o badge de mensagens não lidas no menu de conversas.</li>
            </ul>
        </div>
    </div>

    <!-- 5. CENTRAL DE NOTIFICAÇÕES -->
    <div class="secao">
        <div class="secao-header">
            <h2>Projeto: Workonnection</h2>
            <div class="meta-info"><strong>Funcionalidade:</strong> Central de Notificações da Plataforma</div>
        </div>

        <div class="user-story-card">
            <p>• <strong>Como um</strong> usuário cadastrado na plataforma Workonnection</p>
            <p>• <strong>Eu quero</strong> receber, visualizar e gerenciar as notificações de eventos (mensagens, propostas, candidaturas e avisos)</p>
            <p>• <strong>Para que</strong> eu acompanhe atividades relevantes em tempo real e mantenha minha caixa de notificações organizada</p>
        </div>

        <div class="titulo-especificacao">Especificação dos cenários de uso utilizando BDD</div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 1: Visualização da lista de notificações (Caminho Feliz)</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário possui notificações recebidas em sua conta</li>
                <li><strong>Quando</strong> o usuário clica no ícone de notificações na barra superior ou navega até a página de notificações</li>
                <li><strong>Então</strong> o sistema apresenta a lista ordenada da notificação mais recente para a mais antiga (com limite máximo de até 50 notificações), destacando visualmente as notificações não lidas e exibindo o horário relativo de emissão de cada evento.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 2: Marcar notificação individual como lida</div>
            <ul class="passos">
                <li><strong>Dado que</strong> existe uma notificação com status não lida na lista do usuário</li>
                <li><strong>Quando</strong> o usuário clica no cartão da notificação ou no botão de marcar como lida</li>
                <li><strong>Então</strong> o sistema altera o status da notificação para "lida", remove o destaque visual de não lida e decrementa em 1 a contagem de notificações pendentes no cabeçalho da aplicação.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 3: Marcar todas as notificações como lidas</div>
            <ul class="passos">
                <li><strong>Dado que</strong> o usuário possui &lt;Qtd Não Lidas&gt; notificações pendentes no sistema</li>
                <li><strong>Quando</strong> aciona o botão "Marcar todas como lidas"</li>
                <li><strong>Então</strong> o sistema atualiza todas as notificações para o status de lida e atualiza o badge do contador para &lt;Contador Final&gt;</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>Qtd Não Lidas</th><th>Estado Inicial da Lista</th><th>Ação Realizada</th><th>Contador Final</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>8</td><td>8 notificações destacadas</td><td>Clicar em "Marcar todas como lidas"</td><td>0 (badge oculto)</td></tr>
                    <tr><td>1</td><td>1 notificação destacada</td><td>Clicar em "Marcar todas como lidas"</td><td>0 (badge oculto)</td></tr>
                    <tr><td>0</td><td>Nenhuma notificação pendente</td><td>Botão desabilitado ou sem ação</td><td>0 (badge inativo)</td></tr>
                </tbody>
            </table>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 4: Exclusão individual de notificação</div>
            <ul class="passos">
                <li><strong>Dado que</strong> uma notificação específica está visível na lista do usuário</li>
                <li><strong>Quando</strong> o usuário aciona o botão de exclusão (ícone de lixeira) da notificação</li>
                <li><strong>Então</strong> o sistema remove definitivamente a notificação da lista do usuário, recalcula os contadores e atualiza a interface instantaneamente.</li>
            </ul>
        </div>

        <div class="cenario-card">
            <div class="cenario-titulo">Cenário 5: Limpeza completa da caixa de notificações</div>
            <ul class="passos">
                <li><strong>Dado que</strong> a caixa de notificações do usuário contém um ou mais registros</li>
                <li><strong>Quando</strong> o usuário seleciona a opção "Limpar todas" e confirma a ação</li>
                <li><strong>Então</strong> o sistema remove todas as notificações armazenadas para aquele usuário e renderiza o estado vazio exibindo a mensagem <code>Você não possui notificações no momento</code>.</li>
            </ul>
        </div>
    </div>

    <!-- REFERÊNCIAS -->
    <div class="referencias">
        <h2>Referências</h2>
        <p>SMART, John Ferguson. <strong>BDD in Action: Behavior-driven development for the whole software lifecycle</strong>. Simon and Schuster, New York: Manning Publications Co., 2015.</p>
        <p>PRESSMAN, Roger S.; MAXIM, Bruce R. <strong>Engenharia de software: uma abordagem profissional</strong>. 9. ed. McGraw Hill Brasil, 2021.</p>
    </div>

</body>
</html>
"""

def gerar_pdf():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(base_dir, "documento_impressao.html")
    pdf_path = os.path.join(base_dir, "Workonnection_Cenarios_de_Teste_BDD.pdf")

    print("Escrevendo HTML temporário...")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(HTML_TEMPLATE)

    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    ]

    executable = None
    for p in edge_paths:
        if os.path.exists(p):
            executable = p
            break

    if not executable:
        raise FileNotFoundError("Navegador Chromium (Edge ou Chrome) não encontrado para renderização.")

    print(f"Gerando PDF com {executable}...")
    cmd = [
        executable,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("Erro ao gerar PDF:", result.stderr)
    else:
        print(f"PDF gerado com sucesso em: {pdf_path}")
        print(f"Tamanho do arquivo: {os.path.getsize(pdf_path)} bytes")

    if os.path.exists(html_path):
        os.remove(html_path)

if __name__ == "__main__":
    gerar_pdf()
