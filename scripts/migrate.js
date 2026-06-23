import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🔄 Iniciando migração do banco de dados...');

  // Configuração inicial para se conectar (sem especificar banco caso ele não exista)
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Habilita múltiplas declarações de uma vez
  };

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('🔌 Conectado ao servidor MySQL com sucesso!');

    const migrationsPath = path.join(__dirname, '../database/migrations.sql');
    if (!fs.existsSync(migrationsPath)) {
      throw new Error(`Arquivo de migração não encontrado em: ${migrationsPath}`);
    }

    console.log(`📄 Lendo arquivo de migrações: ${migrationsPath}`);
    const sqlContent = fs.readFileSync(migrationsPath, 'utf8');

    // Executa as declarações
    console.log('🛠️ Executando comandos SQL...');
    await connection.query(sqlContent);

    console.log('👤 Criando ou atualizando usuário administrador master...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@educart.com.br';
    const adminPassword = process.env.ADMIN_PASSWORD || '12345678';
    const adminName = process.env.ADMIN_NAME || 'Administrador Master';

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(adminPassword, salt);

    // Verificar se já existe
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

    console.log('✅ Migração e inserção do Admin concluídas com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
