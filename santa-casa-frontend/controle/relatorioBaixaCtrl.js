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
        container.appendChild(baixaContainer);
    });
}

function toggleItems(id) {
    const items = document.getElementById(`items-${id}`);
    if (items.style.display === "none" || items.style.display === "") {
        items.style.display = "block";
        items.style.maxHeight = items.scrollHeight + "px";
    } else {
        items.style.maxHeight = "0";
        items.addEventListener('transitionend', () => {
            items.style.display = "none";
        }, { once: true });
    }
}


function applyFilters() {
    const dateStartFilter = document.getElementById('filter-date-start').value;
    const dateEndFilter = document.getElementById('filter-date-end').value;
    const productFilter = document.getElementById('filter-product').value.toLowerCase();
    const lotFilter = document.getElementById('filter-lote').value.toLowerCase();

    const filteredBaixas = listaBx.filter(baixa => {
        const dataBaixa = new Date(baixa.dataBaixa);
        const dataBaixaLocal = new Date(dataBaixa.getTime() - dataBaixa.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        
        const matchDate = dateStartFilter ? 
            (dateEndFilter ? dataBaixaLocal >= dateStartFilter && dataBaixaLocal <= dateEndFilter : dataBaixaLocal === dateStartFilter)
            : true;
        const matchProduct = productFilter ? baixa.itensBaixa.some(item => item.produto.nome.toLowerCase().includes(productFilter)) : true;
        const matchLot = lotFilter ? baixa.itensBaixa.some(item => item.lote.codigo.toLowerCase().includes(lotFilter)) : true;

        return matchDate && matchProduct && matchLot;
    });

    renderBaixas(filteredBaixas);
}

function printBaixas() {
    const dateStartFilter = document.getElementById('filter-date-start').value;
    const dateEndFilter = document.getElementById('filter-date-end').value;
    const productFilter = document.getElementById('filter-product').value.toLowerCase();
    const lotFilter = document.getElementById('filter-lote').value.toLowerCase();

    // Filtrar as baixas
    const filteredBaixas = listaBx.filter(baixa => {
        const dataBaixa = new Date(baixa.dataBaixa);
        const dataBaixaLocal = new Date(dataBaixa.getTime() - dataBaixa.getTimezoneOffset() * 60000).toISOString().split('T')[0];

        const matchDate = dateStartFilter ?
            (dateEndFilter ? dataBaixaLocal >= dateStartFilter && dataBaixaLocal <= dateEndFilter : dataBaixaLocal === dateStartFilter)
            : true;

        const matchProduct = productFilter ? baixa.itensBaixa.some(item => item.produto.nome.toLowerCase().includes(productFilter)) : true;
        const matchLot = lotFilter ? baixa.itensBaixa.some(item => item.lote.codigo.toLowerCase().includes(lotFilter)) : true;

        return matchDate && matchProduct && matchLot;
    });

    // Renderizar baixas filtradas ou todas as baixas
    if (filteredBaixas.length > 0) {
        renderBaixas(filteredBaixas);
    } else {
        renderBaixas(listaBx);
    }

    // Garantir que todas as tabelas renderizadas estão abertas
    const baixaItemsContainers = document.querySelectorAll('.baixa-items');
    baixaItemsContainers.forEach(items => {
        items.style.display = 'block';
        items.style.maxHeight = items.scrollHeight + "px";
    });

    // Atrasar a impressão para garantir que as tabelas estejam abertas
    setTimeout(() => {
        window.print();

        // Fechar todas as tabelas após a impressão
        baixaItemsContainers.forEach(items => {
            items.style.display = 'none';
            items.style.maxHeight = '0';
        });

        // Aplicar filtros novamente para restaurar a exibição original
        applyFilters();
    }, 500); // Ajuste o tempo, se necessário
}




