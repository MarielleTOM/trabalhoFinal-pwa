import { openDB } from "idb";
let db;

async function createDB( ) {
    try{
        db = await openDB('banco', 1 , {
            upgrade(db, oldeVersion, newVersion, transaction){
                switch(oldeVersion){
                    case 0:
                    case 1: 
                        const store = db.createObjectStore('pessoas', {
                            //a propriedade nome será o campo chave
                            keyPath:'nome'
                        });
                        //crinado um indice id na store, deve estar contido no objeto do banco.
                        store.createIndex('id','id');
                        showResult('Banco de dados criado!');
                }
            }
        });
        showResult('Banco de dados aberto');
    }catch (e) {
        showResult('Erro ao criar o banco de dados: '+ e.message)
    }
}

window.addEventListener('DOMContentLoaded', async event =>{
    createDB();
    document.getElementById('input');
    document.getElementById('btnSalvar').addEventListener('click', addData);
    document.getElementById('btnListar').addEventListener('click', getData);
})

async function addData( ) {
    let nome = document.getElementById('nome').value;
    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    try{
        await store.add({nome:nome, foto:foto});
        await tx.done
    }catch (error){
        console.error('Erro ao add registros', error);
        tx.abort();
    }

}

async function getData( ) {
    if(db == undefined){
        showResult('O banco de dados está fechado');
        return;
    } else {
        showResult('Não há nenhum dado no banco!')
    }
}

function showResult (text){
    document.querySelector('output').innerHTML = text;
}