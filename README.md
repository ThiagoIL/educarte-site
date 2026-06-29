# EDUCART - Espaço Educativo (Landing Page com Edição Visual)

Este é o repositório da **Landing Page do EDUCART (Espaço Educativo)**. A aplicação é totalmente dinâmica, permitindo que usuários administradores editem textos, CTAs e imagens diretamente pelo navegador em tempo real com facilidade!

---

## 🚀 Funcionalidades Principais

* **Visual Landing Page**: Layout moderno, acolhedor e responsivo, focado em reforço escolar de qualidade.
* **Modo de Edição Visual Integrado (Inline CMS)**: Ao fazer login como administrador, um banner superior é ativado possibilitando a edição direta dos textos e troca de imagens com um clique na própria página.
* **Arquitetura Resiliente Dual-Database**:
  * **Produção**: Conecta-se a um banco de dados **MySQL** robusto.
  * **Auto-Fallback**: Caso o banco de dados MySQL esteja inacessível ou ocorram erros de conexão (ex: `EAI_AGAIN`, offline), o sistema ativa de forma automática e transparente um banco de dados local armazenado em um arquivo JSON (`database/fallback_data.json`) sem derrubar a aplicação!
* **Sincronização de Imagens**: Permite fazer o upload de novas imagens para o hero, professoras e mais.

---

## ⚙️ Variáveis de Ambiente (.env) e Configurações de Deploy (Easypanel / Coolify)

Para garantir que o sistema rode de forma robusta e persistente, configure as seguintes variáveis no seu painel (ex: Easypanel, Coolify, ou arquivo `.env` local).

### 🔴 1. Variáveis ESSENCIAIS (Obrigatórias)
Sem estas variáveis configuradas, o sistema não funcionará corretamente ou apresentará erros de acesso e segurança:

* **`PORT`**: Porta do servidor da aplicação (padrão: `3000`. No Easypanel, geralmente fornecido pelo sistema ou configurado como `3002`/`3000`).
* **`JWT_SECRET`**: Chave secreta de segurança para criptografia dos tokens de sessão administrativa. Escolha uma string longa e complexa em produção.
* **`ADMIN_NAME`**: Nome de exibição do Administrador Master.
* **`ADMIN_EMAIL`**: E-mail usado para acessar o painel de administração (`/admin/login`).
* **`ADMIN_PASSWORD`**: Senha forte para o login do administrador master.
* **`NODE_ENV`**: Define o ambiente de execução (use `production` em produção e `development` em desenvolvimento).

---

### 🟡 2. Variáveis do Banco de Dados MySQL (Recomendado para Produção)
Se não configurado ou se a conexão falhar, o sistema ativa automaticamente o modo de **Auto-Fallback** usando o arquivo JSON local `database/fallback_data.json`. No entanto, para persistência definitiva em produção multi-instância, o MySQL é fortemente recomendado:

* **`DB_HOST`**: Endereço do servidor MySQL (no Easypanel, utilize o nome do serviço de banco de dados, ex: `5_db_educart` ou `db`).
* **`DB_PORT`**: Porta de conexão do banco (geralmente `3306`).
* **`DB_USER`**: Usuário do banco (geralmente `root`).
* **`DB_PASSWORD`**: Senha do banco de dados MySQL.
* **`DB_NAME`**: Nome do banco de dados (padrão: `educart`).

---

### 🟢 3. Variáveis do Supabase Storage (Altamente Recomendado para Imagens em Nuvem)
Como contêineres Docker (no Easypanel/Coolify) têm sistemas de arquivos **efêmeros** (tudo que é salvo localmente é apagado no próximo deploy ou reinicialização), você **deve** configurar o Supabase para armazenar os uploads de imagens. Caso contrário, as imagens serão salvas na pasta local `/uploads` e serão perdidas ao recriar o contêiner.

* **`NEXT_PUBLIC_SUPABASE_URL`**: URL do seu projeto Supabase (ex: `https://xxxx.supabase.co`).
* **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`**: Chave pública `anon` do Supabase.
* **`SUPABASE_SERVICE_ROLE_KEY`**: Chave privada `service_role` (usada pelo backend para fazer bypass de RLS com segurança e enviar as fotos).

---

### 📝 Exemplo Completo de Configuração (.env)

```env
# Essenciais
PORT=3000
JWT_SECRET="YmxhIDU2IDg5MDEyQCBkaHNkIHNzZGZ3ZSBmcjZzZGY2c2RmICA1NXNkZjY1c2FkIDcgOCA5OCAwIDkwOTkgIA=="
ADMIN_NAME="Administrador Master"
ADMIN_EMAIL="admin@educart.com.br"
ADMIN_PASSWORD="sua_senha_secreta_aqui"
NODE_ENV="production"
FRONTEND_URL="http://localhost:3000"

# Banco de Dados MySQL (Opcional, ativa Fallback se omitido)
DB_HOST="db_educart"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="sua_senha_do_banco"
DB_NAME="educart"

# Supabase Storage (Obrigatório para persistência permanente de imagens no Easypanel)
NEXT_PUBLIC_SUPABASE_URL="https://sua-url-supabase.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sua-chave-publica-anon"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-privada-service-role"
```

### 🪣 Configuração do Supabase Storage

Para armazenar as imagens do site diretamente na nuvem de forma segura e gratuita com o Supabase Storage:

1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Crie um novo projeto.
3. No painel lateral, acesse **Storage** e crie um novo bucket chamado `imagens-educarte`.
4. Defina o bucket como **Public** (Público) nas configurações de privacidade do bucket para que as imagens fiquem visíveis aos visitantes.
5. Acesse **Project Settings** > **API** e copie os valores de:
   - **Project URL**
   - **anon public key**
   - **service_role key** (chave privada que deve ser mantida segura no backend)
6. Insira estes valores no seu arquivo `.env` sob as variáveis `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
7. O backend utilizará automaticamente a chave `SUPABASE_SERVICE_ROLE_KEY` (Modo Admin) para enviar arquivos com segurança para o bucket `imagens-educarte` contornando restrições de escrita de RLS de forma controlada. O sistema capturará e retornará a URL pública de acesso para renderização via componente `<Image />`. Caso as variáveis não estejam preenchidas, o sistema continuará salvando os arquivos localmente de forma segura.

---

## 🏃 Como Rodar Localmente

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Configurar o arquivo `.env`
```bash
cp .env.example .env
```
Abra o arquivo `.env` e ajuste suas credenciais de administrador em `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

### Passo 3: Inicializar a Aplicação

#### Opção A: Modo Fallback Rápido (Recomendado para Testes)
Não necessita de banco MySQL instalado. O app iniciará automaticamente utilizando o banco JSON local `database/fallback_data.json`.
```bash
npm run dev
```

#### Opção B: Utilizando MySQL Local
1. Certifique-se de ter um banco MySQL ativo com o nome `educart` e credenciais mapeadas no seu `.env`.
2. Execute as migrações para estruturar as tabelas e semear o administrador master baseado no seu arquivo `.env`:
   ```bash
   npm run db:migrate
   ```
3. Inicie o app:
   ```bash
   npm run dev
   ```

---

## 🎨 Painel de Edição Visual e Instruções de Uso

### 1. Como fazer Login
1. Acesse `/admin/login` ou `/admin` no seu navegador.
2. Insira o e-mail e senha cadastrados no seu `.env` (`ADMIN_EMAIL` e `ADMIN_PASSWORD`).
3. Ao logar com sucesso, você retornará para a página inicial com o **Modo de Edição Visual Ativo**.

### 2. Editando Textos e Imagens
* **Editar Textos**: Passe o mouse sobre qualquer texto da página. Um ícone de lápis surgirá. Clique nele para transformar o texto em uma caixa de edição, faça a alteração e clique em "Salvar" (ícone verde) ou "Cancelar" (ícone vermelho).
* **Trocar Imagens**: Clique em cima de qualquer foto editável (ex: foto de uma professora). Uma janela suspensa aparecerá para você carregar uma imagem local (`.png`, `.jpg`, `.webp`) ou remover a atual para restaurar o padrão.
* **Confirmar Alterações no Banco**: Após fazer suas modificações, clique no botão verde **"Salvar Alterações"** na barra roxa fixada no topo da tela.

---

## 🚢 Deploy em Produção (Easypanel / Nixpacks)

Este projeto está totalmente pronto para deploy nativo com **Nixpacks** em plataformas como **Easypanel**, **Coolify** ou similares:

* **Detecção Automática**: O Nixpacks identifica a versão do Node.js (`v20` recomendada) e cria a imagem de contêiner de forma inteligente a partir do `package.json`.
* **Comandos Automatizados**:
  * O build roda via `npm run build` e serve o app unificado.
  * O servidor inicializa usando `npm run start` (ou `node server/index.js`).
* **Instalação do Admin Master**: Lembre-se de fornecer as variáveis `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `JWT_SECRET` no painel de controle do Easypanel para que o usuário administrador seja semeado de forma segura no primeiro boot.

### Configuração com Apache2 e Proxy Reverso (Alternativa)
Se preferir rodar em um servidor Ubuntu tradicional com Apache:
1. Configure o Apache para encaminhar requisições na porta 80 para a porta `3000` via módulo `proxy_http`.
2. Gerencie o processo Node.js em segundo plano utilizando PM2:
   ```bash
   pm2 start server/index.js --name educart
   ```
