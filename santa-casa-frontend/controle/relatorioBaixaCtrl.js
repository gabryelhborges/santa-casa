document.addEventListener('DOMContentLoaded', function () {
    addListaBaixa();
});

const urlBase = 'http://localhost:4040';
var listaBx = [];
var listaItBx = [];

function addListaBaixa() {
    fetch(urlBase + "/baixa", {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    }).then((json) => {
        listaBx = [];
        let baixaList = json.listaBaixas;
        if (Array.isArray(baixaList)) {
            for (let i = 0; i < baixaList.length; i++) {
                let baixa = baixaList[i];
                let objBaixa = new Baixa(baixa.idBaixa, baixa.itensBaixa, baixa.funcionario, baixa.dataBaixa, baixa.local);
                listaBx.push(objBaixa);
            }
        }
        renderBaixas(listaBx);
    }).catch((error) => {
        console.error('Erro ao buscar as baixas:', error);
    });
}

function renderBaixas(listaBx) {
    const container = document.getElementById('baixas-container');
    container.innerHTML = '';
    
    listaBx.forEach(baixa => {
        const baixaContainer = document.createElement('div');
        baixaContainer.classList.add('baixa-container');
        baixaContainer.setAttribute('onclick', `toggleItems(${baixa.idBaixa})`);

        const baixaHeader = document.createElement('div');
        baixaHeader.classList.add('baixa-header');
        baixaHeader.textContent = `Baixa ID: ${baixa.idBaixa} - Data: ${new Date(baixa.dataBaixa).toLocaleDateString()} - Funcionario: ${baixa.funcionario.nome_funcionario}`;

        const baixaItems = document.createElement('div');
        baixaItems.classList.add('baixa-items');
        baixaItems.setAttribute('id', `items-${baixa.idBaixa}`);

        const tabela = document.createElement('table');
        const cabecalho = document.createElement('thead');
        cabecalho.innerHTML = `
            <tr>
                <th>Lote</th>
                <th>Produto</th>
                <th>Qtde</th>
                <th>Unidade</th>
                <th>Motivo</th>
                <th>Observacao</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        const corpo = document.createElement('tbody');
        baixa.itensBaixa.forEach(item => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${item.lote.codigo}</td>
                <td>${item.produto.nome}</td>
                <td>${item.quantidade}</td>
                <td>${item.unidade.unidade}</td>
                <td>${item.motivo.motivo}</td>
                <td>${item.ib_idObservacao}</td>
            `;
            corpo.appendChild(linha);
        });
        tabela.appendChild(corpo);

        baixaItems.appendChild(tabela);
        baixaContainer.appendChild(baixaHeader);
        baixaContainer.appendChild(baixaItems);
        
        // Adiciona o botão de lixeira
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '🗑️';
        deleteButton.onclick = function(event) {
            event.stopPropagation(); // Previne o clique de abrir/fechar itens
            confirmDelete(baixa.idBaixa);
        };
        baixaContainer.appendChild(deleteButton);

        container.appendChild(baixaContainer);
    });
}

function toggleItems(id) {
    const items = document.getElementById(`items-${id}`);
    if (items.style.display === "none" || items.style.display === "") {
        items.style.display = "block";
    } else {
        items.style.display = "none";
    }
}

function applyFilters() {
    const startDateFilter = document.getElementById('filter-start-date').value;
    const endDateFilter = document.getElementById('filter-end-date').value;
    const productFilter = document.getElementById('filter-product').value.toLowerCase();
    const lotFilter = document.getElementById('filter-lote').value.toLowerCase();

    const filteredBaixas = listaBx.filter(baixa => {
        const matchDate = (startDateFilter || endDateFilter) ? 
            (new Date(baixa.dataBaixa) >= new Date(startDateFilter) && new Date(baixa.dataBaixa) <= new Date(endDateFilter || startDateFilter)) : true;
        const matchProduct = productFilter ? baixa.itensBaixa.some(item => item.produto.nome.toLowerCase().includes(productFilter)) : true;
        const matchLot = lotFilter ? baixa.itensBaixa.some(item => item.lote.codigo.toLowerCase().includes(lotFilter)) : true;

        return matchDate && matchProduct && matchLot;
    });

    renderBaixas(filteredBaixas);
}

function confirmDelete(idBaixa) {
    const confirmed = confirm("Tem certeza de que deseja excluir esta baixa?");
    if (confirmed) {
        deleteBaixa(idBaixa);
    }
}

function deleteBaixa(idBaixa) {
    fetch(`${urlBase}/baixa`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idBaixa: idBaixa })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar a baixa');
        }
        // Atualizar a lista de baixas após a exclusão
        addListaBaixa();
    })
    .catch(error => console.error('Erro ao deletar a baixa:', error));
}

function printPage() {
    // Abre todos os itens antes de imprimir
    const baixaItems = document.querySelectorAll('.baixa-items');
    baixaItems.forEach(item => {
        item.style.display = 'block';
    });
    
    window.print();
}
