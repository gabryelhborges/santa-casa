document.addEventListener('DOMContentLoaded', function () {
    addListaBaixa();
});

const urlBase = 'http://localhost:4040';
var listaBx = [];

function addListaBaixa() {
    fetch(urlBase + "/baixa", {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    }).then((json) => {
        listaBx = json.listaBaixas;

        renderBaixasPorMotivo(listaBx);
    }).catch((error) => {
        console.error('Erro ao buscar as baixas:', error);
    });
}

function renderBaixasPorMotivo(listaBx) {
    const container = document.getElementById('baixas-container');
    container.innerHTML = '';

    // Agrupando as baixas por motivo
    const baixasPorMotivo = groupByMotivo(listaBx);

    // Iterando pelos motivos
    for (const motivo in baixasPorMotivo) {
        if (baixasPorMotivo.hasOwnProperty(motivo)) {
            const baixas = baixasPorMotivo[motivo];

            const motivoTable = document.createElement('table');
            motivoTable.classList.add('motivo-table');

            // Cabeçalho do motivo
            const headerRow = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.colSpan = 6;
            headerCell.textContent = `Motivo: ${motivo}`;
            headerRow.appendChild(headerCell);
            motivoTable.appendChild(headerRow);

            // Cabeçalho da tabela de baixas
            const cabecalho = document.createElement('thead');
            cabecalho.innerHTML = `
                <tr>
                    <th>Baixa ID</th>
                    <th>Data</th>
                    <th>Funcionário</th>
                </tr>
            `;
            motivoTable.appendChild(cabecalho);

            // Corpo da tabela de baixas
            const corpo = document.createElement('tbody');

            baixas.forEach(baixa => {
                const linhaBaixa = document.createElement('tr');
                linhaBaixa.innerHTML = `
                    <td>${baixa.idBaixa}</td>
                    <td>${new Date(baixa.dataBaixa).toLocaleDateString()}</td>
                    <td>${baixa.funcionario.nome_funcionario}</td>
                `;

                // Detalhes da baixa (itens)
                const detalhesBaixa = document.createElement('tr');
                detalhesBaixa.classList.add('baixa-details');
                const detalhesCell = document.createElement('td');
                detalhesCell.colSpan = 6;
                const detalhesContainer = document.createElement('div');
                detalhesContainer.classList.add('baixa-container');
                detalhesContainer.setAttribute('id', `baixa-${baixa.idBaixa}`);
                detalhesContainer.style.display = 'none'; // Inicia fechado

                const tabelaItens = document.createElement('table');
                const cabecalhoItens = document.createElement('thead');
                cabecalhoItens.innerHTML = `
                    <tr>
                        <th>Lote</th>
                        <th>Produto</th>
                        <th>Qtde</th>
                        <th>Unidade</th>
                        <th>Motivo</th>
                        <th>Observacao</th>
                    </tr>
                `;
                tabelaItens.appendChild(cabecalhoItens);

                const corpoItens = document.createElement('tbody');
                baixa.itensBaixa.forEach(item => {
                    const linhaItem = document.createElement('tr');
                    linhaItem.innerHTML = `
                        <td>${item.lote.codigo}</td>
                        <td>${item.produto.nome}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.unidade.unidade}</td>
                        <td>${item.motivo.motivo}</td>
                        <td>${item.ib_idObservacao}</td>
                    `;
                    corpoItens.appendChild(linhaItem);
                });
                tabelaItens.appendChild(corpoItens);

                detalhesContainer.appendChild(tabelaItens);
                detalhesCell.appendChild(detalhesContainer);
                detalhesBaixa.appendChild(detalhesCell);

                linhaBaixa.addEventListener('click', () => toggleItems(baixa.idBaixa));

                corpo.appendChild(linhaBaixa);
                corpo.appendChild(detalhesBaixa);
            });

            motivoTable.appendChild(corpo);
            container.appendChild(motivoTable);
        }
    }
}

function groupByMotivo(listaBx) {
    const grupos = {};
    listaBx.forEach(baixa => {
        const motivo = baixa.itensBaixa[0].motivo.motivo;
        if (!grupos[motivo]) {
            grupos[motivo] = [];
        }
        grupos[motivo].push(baixa);
    });
    return grupos;
}

function toggleItems(id) {
    const items = document.getElementById(`baixa-${id}`);
    if (items.style.display === "none" || items.style.display === "") {
        items.style.display = "block";
    } else {
        items.style.display = "none";
    }
}

function applyFilters() {
    const motivoFilter = document.getElementById('filter-motivo').value.toLowerCase();

    const filteredBaixas = listaBx.filter(baixa => {
        const baixaMotivo = baixa.itensBaixa[0].motivo.motivo.toLowerCase();
        return motivoFilter ? baixaMotivo.includes(motivoFilter) : true;
    });

    renderBaixasPorMotivo(filteredBaixas);
}

function printPage() {
    const motivoTables = document.querySelectorAll('.motivo-table');
    motivoTables.forEach(table => {
        table.querySelectorAll('.baixa-container').forEach(container => {
            const baixaId = container.getAttribute('id').replace('baixa-', '');
            const items = document.getElementById(`baixa-${baixaId}`);
            items.style.display = 'block';
        });
    });

    window.print();
}
