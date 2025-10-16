/**
 * ==========================================================
 * SCRIPT: Limpeza de Campos HTML no MongoDB
 * ==========================================================
 * Remove tags HTML, entidades &nbsp; e espaços extras
 * de campos textuais em documentos específicos.
 *
 * 🔧 Como usar:
 *   node update_clean_html.js
 *
 * 💡 Dica:
 * - Edite o nome da collection e a query.
 * - Ajuste os campos que deseja limpar.
 * ==========================================================
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = 'NameOfYourCollection';

// Função utilitária para limpeza de texto
function cleanText(text) {
  if (!text) return text;
  return text
    .replace(/<[^>]+>/g, '') // remove tags HTML
    .replace(/&nbsp;/gi, ' ') // substitui &nbsp; por espaço
    .replace(/;/g, '') // remove ponto e vírgula solto
    .replace(/\r?\n|\r/g, ' ') // quebra de linha -> espaço
    .replace(/\t/g, ' ') // tabulação -> espaço
    .replace(/\s+/g, ' ') // compacta múltiplos espaços
    .trim();
}

async function updateCollection() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Query dos documentos a atualizar caso queira filtrar algum campo
    const query = { Version: 'Import' };

    const docs = await collection.find(query).toArray();

    for (const doc of docs) {
      const updatedDoc = {
        ...(doc.Name && { Name: cleanText(doc.Name) }),
        ...(doc.Description && { Description: cleanText(doc.Description) }),
        Questions: (doc.Questions || []).map((q) => ({
          ...q,
          Title: cleanText(q.Title),
          AuxText: cleanText(q.AuxText),
        })),
      };

      await collection.updateOne({ _id: doc._id }, { $set: updatedDoc });
    }

    console.log(`✅ ${docs.length} documentos limpos com sucesso!`);
  } catch (err) {
    console.error('❌ Erro durante a limpeza:', err);
  } finally {
    await client.close();
  }
}

updateCollection();
