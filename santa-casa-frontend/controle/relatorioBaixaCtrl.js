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

function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
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
        baixaHeader.textContent = `Baixa ID: ${baixa.idBaixa} - Data: ${formatarData(baixa.dataBaixa)} - Funcionario: ${baixa.funcionario.nome_funcionario}`;

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
    } else {
        items.style.display = "none";
    }
}
