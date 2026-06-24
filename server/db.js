import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fallbackFilePath = path.join(__dirname, '../database/fallback_data.json');

// Garante que o diretório do banco fallback exista
const dbDir = path.dirname(fallbackFilePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Dados de conteúdo iniciais padrão
const defaultContent = {
  hero_title: 'Transforme o Futuro do Seu Filho com Reforço Escolar de Qualidade',
  hero_subtitle: 'Atendimento personalizado para alunos do 1º ao 9º ano com profissionais especializadas em Língua Portuguesa',
  hero_cta: 'Agende uma Aula Experimental',
  about_title: 'Sobre o EDUCART',
  about_text: 'O EDUCART é um espaço dedicado ao reforço escolar, oferecendo suporte educacional personalizado para alunos do 1º ao 9º ano do Ensino Fundamental. Nossa missão é ajudar cada estudante a alcançar seu máximo potencial através de metodologias modernas e acompanhamento individualizado.',
  teachers_title: 'Nossas Profissionais',
  teachers_subtitle: 'Equipe especializada e comprometida com a excelência',
  teacher1_name: 'Profª. Ana Paula Silva',
  teacher1_title: 'Especialista em Língua Portuguesa',
  teacher1_bio: 'Formada em Letras - Língua Portuguesa, com mais de 10 anos de experiência em educação e reforço escolar.',
  teacher2_name: 'Profª. Maria Eduarda Costa',
  teacher2_title: 'Especialista em Língua Portuguesa',
  teacher2_bio: 'Graduada em Letras - Língua Portuguesa, apaixonada por ensinar e desenvolver o potencial de cada aluno.',
  services_title: 'Nossos Serviços',
  services_subtitle: 'Soluções personalizadas para cada necessidade',
  service1_title: 'Reforço Escolar Individual',
  service1_description: 'Aulas personalizadas focadas nas dificuldades específicas de cada aluno',
  service2_title: 'Reforço em Grupo',
  service2_description: 'Turmas reduzidas para melhor aproveitamento e interação',
  service3_title: 'Preparação para Provas',
  service3_description: 'Revisão intensiva e estratégias para melhor desempenho',
  service4_title: 'Acompanhamento Escolar',
  service4_description: 'Suporte contínuo para o desenvolvimento do aluno',
  contact_title: 'Entre em Contato',
  contact_subtitle: 'Estamos prontos para ajudar seu filho a ter sucesso',
  contact_phone: '(11) 98765-4321',
  contact_email: 'contato@educart.com.br',
  contact_address: 'Rua das Flores, 123 - São Paulo, SP'
};

const initFallbackData = () => {
  if (fs.existsSync(fallbackFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(fallbackFilePath, 'utf8'));
    } catch (e) {
      console.error('Erro ao ler banco local fallback, criando novo:', e);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@educart.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD || '12345678';
  const adminName = process.env.ADMIN_NAME || 'Administrador Master';

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(adminPassword, salt);

  const data = {
    users: [
      {
        id: 999,
        name: adminName,
        email: adminEmail,
        password_hash: passwordHash
      }
    ],
    content: Object.entries(defaultContent).map(([key, val]) => ({
      content_key: key,
      content_value: val
    })),
    images: []
  };

  fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
};

// Objeto de banco em memória
let memoryDb = initFallbackData();

const saveFallbackData = () => {
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao salvar dados localmente:', error);
  }
};

let isFallbackMode = false;

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'educart',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true
});

// Testar conexão ao inicializar com retentativas rápidas
const connectWithRetry = async (retries = 2, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Conectado ao MySQL com sucesso!');
      
      // Executar migrações automáticas se conectado
      try {
        const migrationsPath = path.join(__dirname, '../database/migrations.sql');
        if (fs.existsSync(migrationsPath)) {
          console.log('🔄 Executando migrações automáticas no MySQL...');
          const sqlContent = fs.readFileSync(migrationsPath, 'utf8');
          await connection.query(sqlContent);
          console.log('✅ Tabelas criadas/verificadas com sucesso no MySQL!');

          // Semeando o administrador master
          const adminEmail = process.env.ADMIN_EMAIL || 'admin@educart.com.br';
          const adminPassword = process.env.ADMIN_PASSWORD || '12345678';
          const adminName = process.env.ADMIN_NAME || 'Administrador Master';

          const salt = bcrypt.genSaltSync(10);
          const passwordHash = bcrypt.hashSync(adminPassword, salt);

          await connection.query('USE educart;');
          const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
          if (rows.length === 0) {
            await connection.query(
              'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
              [adminName, adminEmail, passwordHash]
            );
            console.log(`✅ Usuário administrador master (${adminEmail}) criado com sucesso!`);
          } else {
            await connection.query(
              'UPDATE users SET name = ?, password_hash = ? WHERE email = ?',
              [adminName, passwordHash, adminEmail]
            );
            console.log(`✅ Usuário administrador master (${adminEmail}) atualizado com sucesso!`);
          }
        }
      } catch (migrationErr) {
        console.error('⚠️ Erro ao executar migrações automáticas no MySQL:', migrationErr.message);
      }

      connection.release();
      return;
    } catch (err) {
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.warn('⚠️ Não foi possível conectar ao MySQL. Ativando o modo de persistência local em arquivo JSON para garantir o pleno funcionamento do app.');
        isFallbackMode = true;
      }
    }
  }
};

connectWithRetry();

// Emulador de queries SQL
const executeFallbackQuery = async (sql, params = []) => {
  const norm = sql.replace(/\s+/g, ' ').trim().toLowerCase();

  // 1. SELECT id FROM users WHERE email = ?
  if (norm.includes('select id from users where email =')) {
    const email = params[0];
    const matching = memoryDb.users.filter(u => u.email === email);
    return [matching.map(u => ({ id: u.id }))];
  }

  // 2. INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)
  if (norm.includes('insert into users')) {
    const [name, email, password_hash] = params;
    const newId = memoryDb.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    const newUser = { id: newId, name, email, password_hash };
    memoryDb.users.push(newUser);
    saveFallbackData();
    return [{ insertId: newId }];
  }

  // 3. SELECT * FROM users WHERE email = ?
  if (norm.includes('select * from users where email =')) {
    const email = params[0];
    const matching = memoryDb.users.filter(u => u.email === email);
    return [matching];
  }

  // 4. SELECT id, name, email FROM users WHERE id = ?
  if (norm.includes('select id, name, email from users where id =')) {
    const id = Number(params[0]);
    const matching = memoryDb.users.filter(u => u.id === id);
    return [matching.map(u => ({ id: u.id, name: u.name, email: u.email }))];
  }

  // 5. SELECT content_key, content_value FROM content
  if (norm.includes('select content_key, content_value from content') && !norm.includes('where')) {
    return [memoryDb.content];
  }

  // 6. SELECT content_value FROM content WHERE content_key = ?
  if (norm.includes('select content_value from content where content_key =')) {
    const key = params[0];
    const matching = memoryDb.content.filter(c => c.content_key === key);
    return [matching.map(c => ({ content_value: c.content_value }))];
  }

  // 7. INSERT INTO content / ON DUPLICATE KEY UPDATE
  if (norm.includes('insert into content')) {
    const key = params[0];
    const val = params[1];
    const idx = memoryDb.content.findIndex(c => c.content_key === key);
    if (idx !== -1) {
      memoryDb.content[idx].content_value = val;
    } else {
      memoryDb.content.push({ content_key: key, content_value: val });
    }
    saveFallbackData();
    return [{ affectedRows: 1 }];
  }

  // 8. INSERT INTO images
  if (norm.includes('insert into images')) {
    const [original_name, saved_name, file_path, file_size, mime_type, uploaded_by] = params;
    const newId = memoryDb.images.reduce((max, i) => Math.max(max, i.id), 0) + 1;
    const newImg = { id: newId, original_name, saved_name, file_path, file_size, mime_type, uploaded_by };
    memoryDb.images.push(newImg);
    saveFallbackData();
    return [{ insertId: newId }];
  }

  console.warn('⚠️ Query SQL não suportada pelo emulador:', sql, params);
  return [[]];
};

// Wrapper do Pool para interceptar erros de conexão e fazer fallback de forma transparente
const dbWrapper = {
  query: async (sql, params = []) => {
    if (isFallbackMode) {
      return executeFallbackQuery(sql, params);
    }
    try {
      return await pool.query(sql, params);
    } catch (err) {
      const isConnectionError = ['EAI_AGAIN', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'PROTOCOL_CONNECTION_LOST', 'ER_NO_SUCH_TABLE', 'ER_BAD_DB_ERROR'].includes(err.code) || 
                                err.message.includes('getaddrinfo') || 
                                err.message.includes('connect') ||
                                err.message.includes('table') ||
                                err.message.includes('database');
      if (isConnectionError) {
        console.warn(`⚠️ Conexão ou tabela MySQL indisponível (${err.code || err.message}). Mudando para persistência local.`);
        isFallbackMode = true;
        return executeFallbackQuery(sql, params);
      }
      throw err;
    }
  },

  getConnection: async () => {
    if (isFallbackMode) {
      return {
        beginTransaction: async () => {},
        commit: async () => {},
        rollback: async () => {},
        release: () => {},
        query: async (sql, params = []) => executeFallbackQuery(sql, params)
      };
    }
    try {
      const conn = await pool.getConnection();
      return conn;
    } catch (err) {
      const isConnectionError = ['EAI_AGAIN', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'PROTOCOL_CONNECTION_LOST', 'ER_NO_SUCH_TABLE', 'ER_BAD_DB_ERROR'].includes(err.code) || 
                                err.message.includes('getaddrinfo') || 
                                err.message.includes('connect') ||
                                err.message.includes('table') ||
                                err.message.includes('database');
      if (isConnectionError) {
        console.warn(`⚠️ Conexão ou tabela MySQL indisponível ao solicitar conexão (${err.code || err.message}). Mudando para persistência local.`);
        isFallbackMode = true;
        return {
          beginTransaction: async () => {},
          commit: async () => {},
          rollback: async () => {},
          release: () => {},
          query: async (sql, params = []) => executeFallbackQuery(sql, params)
        };
      }
      throw err;
    }
  }
};

export default dbWrapper;
