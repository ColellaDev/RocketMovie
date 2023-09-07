const sqlite3 = require("sqlite3"); // driver estabelece conexão com a base de dados
const sqlite = require("sqlite"); // responsavel por conectar
const path = require("path") // Biblioteca do Node que resolve o caminho onde é salvo

async function sqliteConnection(){
    const database = await sqlite.open({
        filename: path.resolve(__dirname, "..", "database.db"),
        // filename define o local onde será salvo o arquivo do Banco de Dados
        driver: sqlite3.Database
    })
    
    return database;
}

module.exports = sqliteConnection;