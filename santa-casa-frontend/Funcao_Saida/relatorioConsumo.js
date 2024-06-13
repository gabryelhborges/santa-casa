/*
    - Relatorio 1: filtrar por paciente mostrar cada consumo com seus itensConsumidos
    - Relatorio 2: Filtrar por produto mostrando a quantidade total consumida (sql sum)
*/

var jsonConsumoInicial = {
    idConsumo: 0,
    paciente: {},
    funcionario: {},
    itensConsumo: [],
    local: {},
    dataConsumo: ""
};

var varListaCons = [];
var modal = document.getElementById('myModal');
var openModalBtn = document.getElementById('openModalBtn');
var closeModalBtn = document.getElementsByClassName('close')[0];

var divPesquisaRelatorioPaciente = document.getElementById("div-pesquisa-relatorio-paciente");
var divPesquisaRelatorioConsumo = document.getElementById("div-pesquisa-relatorio-consumo");
var divPesquisaRelatorioProduto = document.getElementById("div-pesquisa-relatorio-produto");

divPesquisaRelatorioConsumo.style.display = "none";
divPesquisaRelatorioPaciente.style.display = "none";
divPesquisaRelatorioProduto.style.display = "none";

divPesquisaRelatorioConsumo.style.display = "flex";
divPesquisaRelatorioPaciente.style.display = "flex";
divPesquisaRelatorioProduto.style.display = "flex";

// Quando o usuário clicar no botão, exiba o modal
/*
openModalBtn.onclick = function () {
    modal.style.display = 'block';
}
*/
// Quando o usuário clicar no botão de fechar, oculte o modal
closeModalBtn.onclick = function () {

}

// Quando o usuário clicar fora do modal, oculte-o
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

const urlBase = 'http://localhost:4040';

exibirConsumos();



function exibirConsumos() {
    divPesquisaRelatorioPaciente.style.display = "none";
    divPesquisaRelatorioProduto.style.display = "none";
    document.getElementById('titulo').innerHTML= 'Relatório de Consumos';
    divPesquisaRelatorioConsumo.style.display = "flex";

    let pesquisa = document.getElementById("pesquisaConsumo").value;
    const regexData = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/;

    let queryParams = [];
    if (pesquisa) {
        if (regexData.test(pesquisa)) {
            queryParams.push(`dataConsumo=${encodeURIComponent(pesquisa)}`);
        }
        else {
            queryParams.push(`nomePaciente=${encodeURIComponent(pesquisa)}`);
        }
    }
    else {
        pesquisa = "";
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    fetch(urlBase + '/consumo' + queryString, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let divTabConsumo = document.getElementById("div-tabela-principal");
            if (json.status) {
                let listaConsumos = json.listaConsumos;
                if (Array.isArray(listaConsumos)) {
                    if (listaConsumos.length > 0) {
                        divTabConsumo.innerHTML = "";
                        let container = document.createElement('div');
                        container.id = "divContainer";

                        let tabela = document.createElement('table');
                        tabela.id = "tabela-primaria";

                        let cabecalho = document.createElement('thead');
                        cabecalho.id = "cabecalho-primario";
                        cabecalho.innerHTML = `
                            <tr>
                                <th>ID</th>
                                <th>Nome funcionário</th>
                                <th>Nome Paciente</th>
                                <th>CPF</th>
                                <th>Local</th>
                                <th>Data Consumo</th>
                                <th>Itens Consumidos</th>
                                <th>Ações</th>
                            </tr>
                        `;
                        tabela.appendChild(cabecalho);

                        let corpo = document.createElement('tbody');
                        for (let i = 0; i < listaConsumos.length; i++) {
                            let linha = document.createElement('tr');
                            let consumo = listaConsumos[i];
                            varListaCons.push(listaConsumos[i]);
                            linha.innerHTML = `
                                <td>${consumo.idConsumo}</td>
                                <td>${consumo.funcionario.nome_funcionario}</td>
                                <td>${consumo.paciente.nome}</td>
                                <td>${consumo.paciente.cpf}</td>
                                <td>${consumo.local.loc_nome}</td>
                                <td class="">${formataDataHora(consumo.dataConsumo)}</td>
                                <td class="coluna-menor">
                                    <button class="botaoItCons" onclick="exibirItensConsumidosModal(${consumo.idConsumo})">
                                        <svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50">
                                            <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"></path>
                                        </svg>
                                    </button>
                                </td>
                                `;
                            if (ehDataAtual(consumo.dataConsumo)) {
                                linha.innerHTML += `
                                        <td class="coluna-menor">
                                            <button class="botaoExcluir" onclick="excluirConsumo(${consumo.idConsumo})">
                                                <svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 64 64">
                                                    <path d="M 28 11 C 26.895 11 26 11.895 26 13 L 26 14 L 13 14 C 11.896 14 11 14.896 11 16 C 11 17.104 11.896 18 13 18 L 14.160156 18 L 16.701172 48.498047 C 16.957172 51.583047 19.585641 54 22.681641 54 L 41.318359 54 C 44.414359 54 47.041828 51.583047 47.298828 48.498047 L 49.839844 18 L 51 18 C 52.104 18 53 17.104 53 16 C 53 14.896 52.104 14 51 14 L 38 14 L 38 13 C 38 11.895 37.105 11 36 11 L 28 11 z M 18.173828 18 L 45.828125 18 L 43.3125 48.166016 C 43.2265 49.194016 42.352313 50 41.320312 50 L 22.681641 50 C 21.648641 50 20.7725 49.194016 20.6875 48.166016 L 18.173828 18 z"></path>
                                                </svg>
                                            </button>
                                        </td>
                                `;
                            }
                            else {
                                linha.innerHTML += `
                                    <td></td>
                                `;
                            }
                            linha.style.borderBottom = '1px solid';
                            corpo.appendChild(linha);
                        }
                        tabela.appendChild(corpo);
                        container.appendChild(tabela);
                        divTabConsumo.appendChild(container);
                    } else {
                        divTabConsumo.innerHTML = `<div>Não existem consumos com essa descrição</div>`;
                    }
                }
            }
            else {
                divTabConsumo.innerHTML = "Não foi possível consultar os consumos";
            }
        })
}

function fecharModal() {
    modal.style.display = 'none';
}

function resetaConteudoModal() {
    conteudoModal.innerHTML = `
        <span onclick="fecharModal()" class="close">&times;</span>
    `;

}

function exibirItensConsumidosModal(consumoId) {
    let cons = varListaCons.find(item => item.idConsumo == consumoId);
    let listaItensConsumidos = cons.itensConsumo;

    conteudoModal = document.getElementById("modalContent");
    resetaConteudoModal();
    modal.style.display = 'block';//exibe modal
    modal.innerHTML = "";

    let container = document.createElement('div');
    container.className = 'divTabela';

    let tabela = document.createElement('table');
    tabela.id = 'tabela-primaria';

    let cabecalho = document.createElement('thead');
    cabecalho.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Lote</th>
            <th>Quantidade utilizada</th>
        </tr>
    `;
    cabecalho.className = 'cabecalhoItCons';
    tabela.appendChild(cabecalho);

    let corpo = document.createElement('tbody');
    for (let i = 0; i < listaItensConsumidos.length; i++) {
        let linha = document.createElement('tr');
        let itCons = listaItensConsumidos[i];
        linha.innerHTML = `
            <td>${itCons.produto.nome}</td>
            <td>${itCons.lote.codigo}</td>
            <td>${itCons.qtdeConteudoUtilizado} ${itCons.produto.unidade.unidade}</td>
        `;
        linha.style.border = '1px solid';
        linha.className = 'linhaItCons';
        corpo.appendChild(linha);
    }
    tabela.appendChild(corpo);
    container.appendChild(tabela);
    conteudoModal.appendChild(container);
    modal.appendChild(conteudoModal);
}

function excluirConsumo(idConsumo) {
    
    fetch(urlBase + "/consumo", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idConsumo })
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((dados) => {
            exibirMensagem(dados.mensagem, 'ok');
            exibirConsumos();
        })
        .catch((erro) => {
            exibirMensagem(erro);
        });
}

function formataData(dataP) {
    let data = new Date(dataP);
    let ano = data.getFullYear();
    let mes = ('0' + (data.getMonth() + 1)).slice(-2);
    let dia = ('0' + data.getDate()).slice(-2);
    let dataFormatada = dia + '/' + mes + '/' + ano;
    return dataFormatada;
}

function formataDataHora(dataParametro) {
    // Convertendo a string em um objeto Date
    let data = new Date(dataParametro);

    // Obtendo o ano, mês e dia
    let ano = data.getFullYear();
    let mes = ('0' + (data.getMonth() + 1)).slice(-2); // Adicionando 1 porque os meses são zero indexados
    let dia = ('0' + data.getDate()).slice(-2);

    // Obtendo as horas, minutos e segundos
    let horas = ('0' + data.getHours()).slice(-2);
    let minutos = ('0' + data.getMinutes()).slice(-2);
    let segundos = ('0' + data.getSeconds()).slice(-2);

    // Formatando a data e a hora no formato esperado
    let dataFormatada = dia + '/' + mes + '/' + ano + ' | ' + horas + ':' + minutos + ':' + segundos;

    // Atribuindo a data e hora formatadas ao campo
    return dataFormatada;
}

function ehDataAtual(dataParametro) {
    // Convertendo a string em um objeto Date
    formataDataHora(dataParametro);
    let data = new Date(dataParametro);

    // Obtendo o ano, mês e dia da data fornecida
    let ano = data.getFullYear();
    let mes = data.getMonth() + 1; // Adicionando 1 porque os meses são zero indexados
    let dia = data.getDate();

    // Obtendo o ano, mês e dia da data atual
    let dataAtual = new Date();
    let anoAtual = dataAtual.getFullYear();
    let mesAtual = dataAtual.getMonth() + 1;
    let diaAtual = dataAtual.getDate();

    // Verificando se a data fornecida é do dia atual
    return ano === anoAtual && mes === mesAtual && dia === diaAtual;
}


function exibirConsumoPorPaciente() {
    divPesquisaRelatorioConsumo.style.display = "none";
    divPesquisaRelatorioProduto.style.display = "none";
    document.getElementById('titulo').innerHTML= 'Relatório de Consumo por Paciente';
    divPesquisaRelatorioPaciente.style.display = "flex";

    let pesquisa = document.getElementById("input-pesquisa-relatorio-paciente").value;
    let queryParams = [];
    queryParams.push(`nomePaciente=${encodeURIComponent(pesquisa)}`);

    let query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    fetch(urlBase + '/consumo' + query, {method: "GET"})
        .then(resposta => resposta.json())
        .then(json => {
            let divTabPrincipal = document.getElementById("div-tabela-principal");
            if (json.status) {
                divTabPrincipal.innerHTML = "";
                let listaConsumos = json.listaConsumos;
                if (Array.isArray(listaConsumos) && listaConsumos.length > 0) {
                    let listaPacientesComConsumo = getPacientesComConsumo(listaConsumos);
                    let tabelaPaciente = criarTabelaPaciente(listaPacientesComConsumo, listaConsumos);
                    divTabPrincipal.appendChild(tabelaPaciente);
                }
                else {
                    console.log("Não existem consumos");
                }
            } 
            else {
                divTabPrincipal.innerHTML = "Não foi possível consultar os consumos";
            }
        })
        .catch(error => {
            console.error('Erro ao consultar os consumos:', error);
            let divTabPrincipal = document.getElementById("div-tabela-principal");
            divTabPrincipal.innerHTML = "Erro ao consultar os consumos";
        });
}

function getPacientesComConsumo(listaConsumos) {
    let listaPacientesComConsumo = [];
    for (let cons of listaConsumos) {
        if (!listaPacientesComConsumo.find(reg => reg.idPaciente == cons.paciente.idPaciente)) {
            listaPacientesComConsumo.push(cons.paciente);
        }
    }
    return listaPacientesComConsumo;
}


function criarTabelaPaciente(listaPacientesComConsumo, listaConsumos) {
    let tabelaPaciente = document.createElement('table');
    tabelaPaciente.className = 'tabPaciente';
    let cabecalhoPaciente = document.createElement('thead');
    cabecalhoPaciente.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data Nascimento</th>
            <th>Sexo</th>
        </tr>
    `;
    tabelaPaciente.appendChild(cabecalhoPaciente);

    let corpoTabPac = document.createElement('tbody');
    for (let pac of listaPacientesComConsumo) {
        let consumosDessePaciente = listaConsumos.filter(c => c.paciente.idPaciente == pac.idPaciente);
        listaConsumos = listaConsumos.filter(c => c.paciente.idPaciente != pac.idPaciente);

        let linhaPac = document.createElement('tr');
        linhaPac.innerHTML = `
            <td>${pac.nome}</td>
            <td>${pac.cpf}</td>
            <td>${formataData(pac.data_nascimento)}</td>
            <td>${pac.sexo}</td>
        `;
        corpoTabPac.appendChild(linhaPac);

        let linhaConsumo = document.createElement('tr');
        let tdTabConsumo = document.createElement('td');
        tdTabConsumo.colSpan = 4;  // Span across all columns for a better layout
        tdTabConsumo.appendChild(criarTabelaConsumo(consumosDessePaciente));
        linhaConsumo.appendChild(tdTabConsumo);
        corpoTabPac.appendChild(linhaConsumo);
    }
    tabelaPaciente.appendChild(corpoTabPac);
    return tabelaPaciente;
}

function criarTabelaConsumo(consumosDessePaciente) {
    let tabelaConsumo = document.createElement('table');
    tabelaConsumo.classList.add('tabela-aninhada');
    let cabecalhoConsumo = document.createElement('thead');
    cabecalhoConsumo.innerHTML = `
        <tr>
            <th>Funcionário</th>
            <th>Local</th>
            <th>Data e hora consumo</th>
            <th>Itens Consumidos</th>
        </tr>
    `;
    tabelaConsumo.appendChild(cabecalhoConsumo);

    let corpoTabCons = document.createElement('tbody');
    for (let consumo of consumosDessePaciente) {
        let linhaCons = document.createElement('tr');
        linhaCons.innerHTML = `
            <td>${consumo.funcionario.nome_funcionario}</td>
            <td>${consumo.local.loc_nome}</td>
            <td>${formataDataHora(consumo.dataConsumo)}</td>
        `;
        let tdTabItCons = document.createElement('td');
        tdTabItCons.appendChild(criarTabelaItensConsumo(consumo.itensConsumo));
        linhaCons.appendChild(tdTabItCons);
        corpoTabCons.appendChild(linhaCons);
    }
    tabelaConsumo.appendChild(corpoTabCons);
    return tabelaConsumo;
}

function criarTabelaItensConsumo(itensCons) {
    let tabelaItCons = document.createElement('table');
    tabelaItCons.classList.add('tabela-aninhada');
    let cabecalhoItCons = document.createElement('thead');
    cabecalhoItCons.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Lote</th>
            <th>Quantidade utilizada</th>
        </tr>
    `;
    tabelaItCons.appendChild(cabecalhoItCons);

    let corpoTabItCons = document.createElement('tbody');
    for (let itemConsumido of itensCons) {
        let linhaItCons = document.createElement('tr');
        linhaItCons.innerHTML = `
            <td>${itemConsumido.produto.nome}</td>
            <td>${itemConsumido.lote.codigo}</td>
            <td>${itemConsumido.qtdeConteudoUtilizado} ${itemConsumido.produto.unidade.unidade}</td>
        `;
        corpoTabItCons.appendChild(linhaItCons);
    }
    tabelaItCons.appendChild(corpoTabItCons);
    return tabelaItCons;
}























function exibirConsumoPorProduto() {
    divPesquisaRelatorioConsumo.style.display = "none";
    divPesquisaRelatorioPaciente.style.display = "none";
    document.getElementById('titulo').innerHTML= 'Relatório de Consumo por Produto';
    divPesquisaRelatorioProduto.style.display = "flex";


    let pesquisa = document.getElementById("input-pesquisa-relatorio-produto").value;
    let queryParams = [];

    let dataInicio = document.getElementById('inputDataInicio').value;
    let dataFim = document.getElementById('inputDataFim').value;

    if (dataInicio) {
        queryParams.push(`dataInicio=${encodeURIComponent(dataInicio)}`);
    }
    
    if (dataFim) {
        queryParams.push(`dataFim=${encodeURIComponent(dataFim)}`);
    }

    queryParams.push(`nomeProduto=${encodeURIComponent(pesquisa)}`);

    let query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    fetch(urlBase + '/consumo/relatorio-produtos-consumidos/' + query, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let divTabConsumo = document.getElementById("div-tabela-principal");
            if (json.status) {
                let listaConsumos = json.listaConsumos;
                if (Array.isArray(listaConsumos)) {
                    if (listaConsumos.length > 0) {
                        divTabConsumo.innerHTML = "";
                        let container = document.createElement('div');
                        container.id = "divContainer";

                        let tabela = document.createElement('table');
                        tabela.id = "tabela-primaria";

                        let cabecalho = document.createElement('thead');
                        cabecalho.id = "cabecalho-primario";
                        cabecalho.innerHTML = `
                            <tr>
                                <th>Produto</th>
                                <th>Lote</th>
                                <th>Quantidade total utilizada</th>
                                <th>Conteúdo Restante no Lote</th>
                            </tr>
                        `;
                        tabela.appendChild(cabecalho);

                        let corpo = document.createElement('tbody');
                        for (let i = 0; i < listaConsumos.length; i++) {
                            let linha = document.createElement('tr');
                            let consumo = listaConsumos[i];
                            linha.innerHTML = `
                                <td>${consumo.produto.nome}</td>
                                <td>${consumo.lote.codigo}</td>
                                <td>${consumo.total} ${consumo.produto.unidade.un_min}</td>
                                <td>${consumo.lote.total_conteudo} ${consumo.produto.unidade.un_min}</td>
                                `;
                            
                            linha.style.borderBottom = '1px solid';
                            corpo.appendChild(linha);
                        }
                        tabela.appendChild(corpo);
                        container.appendChild(tabela);
                        divTabConsumo.appendChild(container);
                    } else {
                        divTabConsumo.innerHTML = `<div>Não existem consumos com essa descrição</div>`;
                    }
                }
            }
            else {
                divTabConsumo.innerHTML = "Não foi possível consultar os consumos";
            }
        })
}