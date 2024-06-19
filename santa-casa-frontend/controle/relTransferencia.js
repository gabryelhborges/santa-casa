document.addEventListener('DOMContentLoaded', function () {
    addListaTransferencia();
});

const urlBase = 'http://localhost:4040';
var listaTransferencia = [];

function addListaTransferencia() {
    fetch(urlBase + "/transferencia", {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    }).then((json) => {
        listaTransferencia = [];
        let transferenciaList = json.listaTransferencia;
        if (Array.isArray(transferenciaList)) {
            for (let i = 0; i < transferenciaList.length; i++) {
                let transferencia = transferenciaList[i];
                let objTransferencia = new Transferencia(
                    transferencia.tf_id,
                    transferencia.tf_data,
                    transferencia.func_id,
                    transferencia.itf_origem,
                    transferencia.itf_destino,
                    transferencia.itensTransferencia
                );
                listaTransferencia.push(objTransferencia);
            }
        }
        renderTransferencias(listaTransferencia);
    }).catch((error) => {
        console.error('Erro ao buscar as transferências:', error);
    });
}

function renderTransferencias(listaTransferencia) {
    const container = document.getElementById('transferencias-container');
    container.innerHTML = '';
    
    listaTransferencia.forEach(transferencia => {
        const transferenciaContainer = document.createElement('div');
        transferenciaContainer.classList.add('transferencia-container');
        transferenciaContainer.setAttribute('onclick', `toggleItems(${transferencia.tf_id})`);

        const transferenciaHeader = document.createElement('div');
        transferenciaHeader.classList.add('transferencia-header');
        const tabela = document.createElement('table');
        const cabecalho = document.createElement('thead');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('botaoExcluir');
        deleteButton.textContent = '🗑️';
        deleteButton.onclick = function(event) {
            event.stopPropagation();
            confirmarExclusao(transferencia.tf_id, transferencia.tf_data);
        };
        transferenciaHeader.textContent = `Transferência ID: ${transferencia.tf_id} - Data: ${new Date(transferencia.tf_data).toLocaleDateString()} - Origem: ${transferencia.tf_destino.loc_nome} - Destino: ${transferencia.tf_origem.loc_nome} - Funcionario: ${transferencia.func_id.nome_funcionario} `;
        
        const dataAtual = new Date();
        const dataTransf = new Date(transferencia.tf_data);
        const diferencaHoras = Math.abs(dataAtual - dataTransf) / 36e5;
        
        if(diferencaHoras<=24){
            transferenciaHeader.appendChild(deleteButton);
        }


        const transferenciaItems = document.createElement('div');
        transferenciaItems.classList.add('transferencia-items');
        transferenciaItems.setAttribute('id', `items-${transferencia.tf_id}`);

        
        cabecalho.innerHTML = `
            <tr>
                <th>Lote</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Unidade</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        

        const corpo = document.createElement('tbody');
        transferencia.itensTransferencia.forEach(item => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${item.lote_cod.codigo}</td>
                <td>${item.lote_cod.produto.nome}</td>
                <td>${item.quantidade}</td>
                <td>${item.lote_cod.unidade.unidade}</td>
            `;
            corpo.appendChild(linha);
        });
        tabela.appendChild(corpo);

        transferenciaItems.appendChild(tabela);
        transferenciaContainer.appendChild(transferenciaHeader);
        transferenciaContainer.appendChild(transferenciaItems);
        container.appendChild(transferenciaContainer);
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

function confirmarExclusao(id, dataTransferencia) {
    const dataAtual = new Date();
    const dataTransf = new Date(dataTransferencia);
    const diferencaHoras = Math.abs(dataAtual - dataTransf) / 36e5;

    if (diferencaHoras <= 24) {
        if (confirm('Tem certeza que deseja excluir esta transferência?')) {
            excluirTransferencia(id);
        }
    } else {
        alert('Somente transferências dentro do prazo de 24h podem ser excluídas.');
    }
}

function excluirTransferencia(id) {
    fetch(urlBase + "/transferencia", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tf_id: id })
    }).then(response => response.json())
    .then(json => {
        if (json.status) {
            alert('Transferência excluída com sucesso.');
            addListaTransferencia();
        } else {
            alert('Erro ao excluir a transferência.');
        }
    }).catch((error) => {
        console.error('Erro ao excluir a transferência:', error);
    });
}

function applyFilters() {
    const dateStart = document.getElementById('filter-date-start').value;
    const dateEnd = document.getElementById('filter-date-end').value;
    const origem = document.getElementById('filter-destino').value.toLowerCase();
    const destino = document.getElementById('filter-origem').value.toLowerCase();

    // Convertendo strings de data para objetos Date
    const dateStartObj = dateStart ? new Date(dateStart) : null;
    const dateEndObj = dateEnd ? new Date(dateEnd) : null;

    const filteredList = listaTransferencia.filter(transferencia => {
        const transferenciaData = new Date(transferencia.tf_data);
        const transferenciaOrigem = transferencia.tf_origem.loc_nome.toLowerCase();
        const transferenciaDestino = transferencia.tf_destino.loc_nome.toLowerCase();

        // Verificando se a data da transferência está dentro do intervalo especificado
        const startDateValid = !dateStartObj || transferenciaData >= dateStartObj;
        const endDateValid = !dateEndObj || transferenciaData <= dateEndObj;
        const dateFilter = startDateValid && endDateValid;

        // Verificando se os filtros de origem e destino são satisfeitos
        const origemFilter = !origem || transferenciaOrigem.includes(origem);
        const destinoFilter = !destino || transferenciaDestino.includes(destino);

        return dateFilter && origemFilter && destinoFilter;
    });

    renderTransferencias(filteredList);
}


function printPage() {
    const dateStart = document.getElementById('filter-date-start').value;
    const dateEnd = document.getElementById('filter-date-end').value;
    const origem = document.getElementById('filter-origem').value.toLowerCase();
    const destino = document.getElementById('filter-destino').value.toLowerCase();

    const filteredList = listaTransferencia.filter(transferencia => {
        const transferenciaData = new Date(transferencia.tf_data).toISOString().slice(0, 10);
        const transferenciaOrigem = transferencia.itf_origem.loc_nome.toLowerCase();
        const transferenciaDestino = transferencia.itf_destino.loc_nome.toLowerCase();

        const startDateValid = !dateStart || new Date(transferenciaData) >= new Date(dateStart);
        const endDateValid = !dateEnd || new Date(transferenciaData) <= new Date(dateEnd);
        const dateFilter = startDateValid && endDateValid;

        const origemFilter = !origem || transferenciaOrigem.includes(origem);
        const destinoFilter = !destino || transferenciaDestino.includes(destino);

        return dateFilter && origemFilter && destinoFilter;
    });

    renderTransferencias(filteredList);

    // Expande todas as tabelas
    const transferenciaItems = document.querySelectorAll('.transferencia-items');
    transferenciaItems.forEach(items => {
        items.style.display = 'block';
    });

    // Espera um pouco antes de imprimir para garantir que as tabelas estejam expandidas
    setTimeout(() => {
        window.print();
    }, 1000);
}