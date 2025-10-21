# 🧰 Mongo Ops

Coleção de scripts em **Node.js** para automação de tarefas administrativas em bancos de dados **MongoDB**.
Esses utilitários foram criados para facilitar operações pontuais como **backup**, **importação de dados** e **limpeza de campos**, com foco em simplicidade, segurança e reuso.

---

## ⚙️ Configuração do Ambiente

1. Copie o arquivo `.env.example` para `.env`.
2. Edite o arquivo `.env` e adicione suas credenciais e o nome do banco:
3. Se você quiser testar seu script antes de executar as alterações no banco de forma permanente, adicione a variável DRY_RUN ao seu arquivo .env

```env
MONGODB_URI=mongodb+srv://usuario:senha@host/dbname
DB_NAME=nome_do_banco
````

3. Instale as dependências necessárias:

```bash
npm install
```

4. Verifique se o Node.js está instalado (versão 18 ou superior recomendada):

```bash
node -v
```

---

## ⚠️ Boas Práticas

* Sempre **faça backup** antes de executar scripts que alteram dados no banco.
* Verifique o `.env` antes de cada execução para garantir que está conectado ao banco correto.
* Os filtros e nomes de coleções estão definidos **dentro de cada script** — edite conforme necessário.
* Execute apenas um script por vez e acompanhe o progresso pelo terminal.

---

## 🧩 Requisitos

* **Node.js** 18 ou superior
* **MongoDB Atlas** ou instância local configurada
* Dependências instaladas com:

```bash
npm install
```

Pacotes principais utilizados:

* `mongodb`
* `dotenv`
* `json2csv`
* `fs`
* `crypto`

---

## 🪪 Licença

Uso interno e restrito.
Distribuição externa não recomendada sem revisão de segurança e anonimização dos dados.