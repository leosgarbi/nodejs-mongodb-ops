/**
 * ==========================================================
 * SCRIPT: Importar Usuários no MongoDB
 * ==========================================================
 * Este script lê um arquivo JSON local (user.json) contendo
 * dados de usuários e insere cada um como um novo documento
 * na collection definida.
 *
 * 📄 Estrutura esperada do user.json:
 * [
 *   { "Name": "João", "Surname": "Silva", "Email": "joao@teste.com" },
 *   { "Name": "Maria", "Surname": "Souza", "Email": "maria@teste.com" }
 * ]
 * ==========================================================
 */

const fs = require('fs');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = 'Users';

// Valores padrão para novos usuários
const DEFAULT_ROLES = ['student'];
const DEFAULT_PASSWORD_HASH = '5a6f1048142969e73ffe64e971db22a9'; // hash da senha "Professor@2025"

// Lê o arquivo de entrada (user.json)
const raw = fs.readFileSync('./data/user.json', 'utf-8');
const usersInput = JSON.parse(raw);

async function importUsers() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCol = db.collection(COLLECTION_NAME);

    for (const row of usersInput) {
      const userId = crypto.randomUUID();
      const now = new Date();

      // Monta o documento completo do usuário
      const userDoc = {
        _id: userId,
        CreatedAt: now,
        CreatedBy: userId,
        Name: row.Name,
        Surname: row.Surname,
        Login: `${row.Name}.${row.Surname}`,
        Emails: row.Email,
        PasswordHash: DEFAULT_PASSWORD_HASH,
        Roles: DEFAULT_ROLES,
        Addresses: [],
      };

      await usersCol.insertOne(userDoc);

      // Exibe no console um resumo (útil para importar em outra collection)
      console.log(
        `✅ Inserido: ${userDoc.Name} ${userDoc.Surname} (UserId: ${userId})`
      );
    }

    console.log('🎉 Importação concluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro durante importação:', err);
  } finally {
    await client.close();
  }
}

importUsers();
