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

## ⚙️ Variáveis de Ambiente (.env)

Copie o arquivo `.env.example` para `.env` e configure as chaves:

```env
# Port do Servidor
PORT=3000

# Chave para criptografia JWT
JWT_SECRET="sua_chave_secreta_jwt"

# Configuração do Administrador Master (Auto-gerado nas migrações/fallback!)
ADMIN_NAME="Administrador Master"
ADMIN_EMAIL="admin@educart.com.br"
ADMIN_PASSWORD="sua_senha_de_admin"

# Banco de Dados MySQL (Opcional - Ativa o Fallback se não for fornecido ou falhar)
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="sua_senha_do_banco"
DB_NAME="educart"

# URL do Frontend
FRONTEND_URL="http://localhost:3000"

# Configuração do Supabase Storage (Opcional - Ativa upload em nuvem se fornecido)
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sua-chave-anonima-publica-supabase"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role-privada-supabase"
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
