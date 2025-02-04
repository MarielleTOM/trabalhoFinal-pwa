import { openDB } from "idb";
let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('pessoas', {
                            keyPath: 'nome' // a propriedade 'nome' será a chave principal
                        });
                        store.createIndex('id', 'id');
                        showResult('Banco de dados criado!');
                }
            }
        });
        showResult('Banco de dados aberto');
    } catch (e) {
        showResult('Erro ao criar o banco de dados: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event => {
    createDB();
    document.getElementById('input');
    document.getElementById('btnSalvar').addEventListener('click', addData);
    document.getElementById('btnListar').addEventListener('click', getData);
});

async function addData() {
    let nome = document.getElementById('nome').value;
    let cameraOutput = document.getElementById('camera-output');
    let foto = cameraOutput ? cameraOutput.src : ""; 
    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    try {
        await store.add({ nome: nome, foto: foto });
        await tx.done;
        showResult('Dado salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar registros', error);
        tx.abort();
        showResult('Erro ao salvar dados');
    }
}

async function getData() {
    if (db == undefined) {
        showResult('O banco de dados está fechado');
        return;
    }

    const tx = await db.transaction('pessoas', 'readonly');
    const store = tx.objectStore('pessoas');
    
    try {
        const pessoas = await store.getAll(); 
        if (pessoas.length === 0) {
            showResult('Não há nenhum dado no banco!');
        } else {
          
            let resultHTML = '<h2>Lista de Produtos!</h2>';
            pessoas.forEach(pessoa => {
                resultHTML += `
                    <div>
                        <h3>${pessoa.nome}</h3>
                        <img src="${pessoa.foto}" alt="${pessoa.nome}" width="200" />
                    </div>
                `;
            });
            showResult(resultHTML);
        }
    } catch (error) {
        console.error('Erro ao listar dados', error);
        showResult('Erro ao listar dados');
    }
}

function showResult(text) {
    document.querySelector('output').innerHTML = text;
}
