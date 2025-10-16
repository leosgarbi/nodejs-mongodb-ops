/**
 * ==========================================================
 * SCRIPT: Exportar / Fazer Backup de Documentos no MongoDB
 * ==========================================================
 * Este script conecta ao banco MongoDB, faz uma busca
 * (query personalizada) em uma collection e exporta
 * os documentos encontrados em dois formatos:
 *  - JSON completo
 *  - CSV (para visualização rápida ou import em planilhas)
 *
 * 🔧 Como usar:
 *   node export_or_backup.js
 *
 * 💡 Dica:
 * - Altere o nome da collection (COLLECTION_NAME)
 * - Ajuste a query conforme a necessidade
 * - O arquivo exportado terá timestamp no nome
 * ==========================================================
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const { Parser } = require('json2csv');

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

// Nome da collection a ser exportada
const COLLECTION_NAME = 'NameOfYourCollection';

// Query de filtro (personalize conforme o caso)
const QUERY = { Version: 'ID' };

// Campos opcionais para CSV (pode deixar vazio que ele pega todos)
const CSV_FIELDS = ['_id', 'Name', 'Version', 'TenantId', 'CreatedAt'];

async function exportData() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Busca dos documentos
    const docs = await collection.find(QUERY).toArray();

    if (docs.length === 0) {
      console.log('⚠️ Nenhum documento encontrado.');
      return;
    }

    console.log(`✅ ${docs.length} documentos encontrados.`);

    // Criação dos arquivos de saída
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonFile = `backup_${COLLECTION_NAME}_${timestamp}.json`;
    const csvFile = `backup_${COLLECTION_NAME}_${timestamp}.csv`;

    // --- Salva em JSON ---
    fs.writeFileSync(jsonFile, JSON.stringify(sanitized, null, 2), 'utf-8');

    // --- Salva em CSV ---
    const parser = new Parser({
      fields: CSV_FIELDS.length ? CSV_FIELDS : Object.keys(sanitized[0]),
    });
    const csv = parser.parse(sanitized);
    fs.writeFileSync(csvFile, csv, 'utf-8');

    console.log('🎉 Exportação concluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao exportar dados:', err);
  } finally {
    await client.close();
  }
}

exportData();
