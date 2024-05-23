/*
create table consumo(
    cons_id integer not null auto_increment,
    cons_pac_id integer not null,
    cons_func_id integer not null,
    cons_loc_id integer not null,
    cons_dataConsumo datetime DEFAULT CURRENT_TIMESTAMP,
    constraint pk_cons_id primary key (cons_id),
    constraint fk_cons_pac_id foreign key (cons_pac_id) references Pacientes(id_paciente),
    constraint fk_cons_func_id foreign key (cons_func_id) references Funcionarios(idFuncionario),
    constraint fk_cons_loc_id foreign key (cons_loc_id) references Loc(loc_id)
);

create table itensConsumo(
    ic_cons_id integer not null,
    ic_lote_codigo varchar(15) not null,
    ic_prod_id integer not null,
    ic_qtdeConteudoUtilizado integer not null,
    constraint pk_ic primary key (ic_cons_id, ic_lote_codigo, ic_prod_id),
    constraint fk_ic_cons_id foreign key (ic_cons_id) references Consumo(cons_id) ON DELETE CASCADE,
    constraint fk_ic_lote_codigo_e_produto_id foreign key (ic_lote_codigo, ic_prod_id) references Lote(codigo, produto_prod_ID)
);
*/

/*
    - Relatorio 1: filtrar por paciente mostrar cada consumo com seus itensConsumidos
    - Relatorio 2: Filtrar por produto mostrando a quantidade total consumida (sql sum)
*/

var varListaCons = [];
var modal = document.getElementById('myModal');
var openModalBtn = document.getElementById('openModalBtn');
var closeModalBtn = document.getElementsByClassName('close')[0];

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
    let pesquisa = "";
    fetch(urlBase + '/consumo' + '/' + pesquisa, {
        method: "GET"
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let divTabConsumo = document.getElementById("tabelaConsumo");
            if (json.status) {
                divTabConsumo.innerHTML = "";
                let listaConsumos = json.listaConsumos;
                if (Array.isArray(listaConsumos)) {
                    if (listaConsumos.length > 0) {
                        let container = document.createElement('div');
                        container.style.overflowY = 'auto';
                        container.style.height = '600px'; // Ajuste a altura conforme necessário
                        container.style.border = '1px solid #ddd';

                        let tabela = document.createElement('table');
                        tabela.style.borderCollapse = 'collapse';
                        tabela.style.width = '1500px';
                        tabela.style.borderBottom = '1px solid';

                        let cabecalho = document.createElement('thead');
                        cabecalho.style.borderBottom = '1px solid';
                        cabecalho.style.position = 'sticky';
                        cabecalho.style.top = '0';
                        cabecalho.style.backgroundColor = '#fff';
                        cabecalho.innerHTML = `
                            <tr>
                                <th>ID</th>
                                <th>Nome funcionário</th>
                                <th>Nome Paciente</th>
                                <th>CPF Paciente</th>
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
                                <td>${formataDataHora(consumo.dataConsumo)}</td>
                                <td>
                                    <button class-"" onclick="exibirItensConsumidos(${consumo.idConsumo})">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50">
                                            <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"></path>
                                        </svg>
                                    </button>
                                </td>
                                <td>
                                    <button class="" onclick="excluirConsumo(${consumo.idConsumo})">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 64 64">
                                            <path d="M 28 11 C 26.895 11 26 11.895 26 13 L 26 14 L 13 14 C 11.896 14 11 14.896 11 16 C 11 17.104 11.896 18 13 18 L 14.160156 18 L 16.701172 48.498047 C 16.957172 51.583047 19.585641 54 22.681641 54 L 41.318359 54 C 44.414359 54 47.041828 51.583047 47.298828 48.498047 L 49.839844 18 L 51 18 C 52.104 18 53 17.104 53 16 C 53 14.896 52.104 14 51 14 L 38 14 L 38 13 C 38 11.895 37.105 11 36 11 L 28 11 z M 18.173828 18 L 45.828125 18 L 43.3125 48.166016 C 43.2265 49.194016 42.352313 50 41.320312 50 L 22.681641 50 C 21.648641 50 20.7725 49.194016 20.6875 48.166016 L 18.173828 18 z"></path>
                                        </svg>
                                    </button>
                                </td>
                            `;
                            linha.style.borderBottom = '1px solid';
                            corpo.appendChild(linha);
                        }
                        tabela.appendChild(corpo);
                        container.appendChild(tabela);
                        divTabConsumo.appendChild(container);
                    } else {
                        divTabConsumo.innerHTML = `<div> 
                                    Não existem consumos com essa descrição
                                </div>`;
                    }
                }
            } else {
                divTabConsumo.innerHTML = "Não foi possível consultar os consumos";
            }
        })
}

function fecharModal(){
    modal.style.display = 'none';
}

function resetaConteudoModal(){
    conteudoModal.innerHTML= `
        <span onclick="fecharModal()" class="close">&times;</span>
    `;
    
}

function exibirItensConsumidos(consumoId) {
    let cons = varListaCons.find(item => item.idConsumo == consumoId);
    let listaItensConsumidos = cons.itensConsumo;

    conteudoModal = document.getElementById("modalContent");
    resetaConteudoModal();
    modal.style.display = 'block';//exibe modal
    modal.innerHTML= "";

    let container = document.createElement('div');
    container.className= 'divTabela';

    let tabela = document.createElement('table');
    tabela.className= 'tabItCons';

    let cabecalho = document.createElement('thead');
    cabecalho.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Lote</th>
            <th>Quantidade utilizada</th>
        </tr>
    `;
    cabecalho.className= 'cabecalhoItCons';
    tabela.appendChild(cabecalho);

    let corpo = document.createElement('tbody');
    for (let i = 0; i < listaItensConsumidos.length; i++) {
        let linha = document.createElement('tr');
        let itCons = listaItensConsumidos[i];
        linha.innerHTML = `
            <td>${itCons.produto.nome}</td>
            <td>${itCons.lote.codigo}</td>
            <td>${itCons.qtdeConteudoUtilizado}</td>
        `;
        linha.style.border = '1px solid';
        linha.className= 'linhaItCons';
        corpo.appendChild(linha);
    }
    tabela.appendChild(corpo);
    container.appendChild(tabela);
    conteudoModal.appendChild(container);
    modal.appendChild(conteudoModal);
}

function excluirConsumo() {
    fetch(urlBase + "/")
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
    let dataFormatada = ano + '-' + mes + '-' + dia + ' | ' + horas + ':' + minutos + ':' + segundos;

    // Atribuindo a data e hora formatadas ao campo
    return dataFormatada;
}

/*
function exibirConsumos() {
    let pesquisa = "";
    fetch(urlBase + '/consumo' + '/' + pesquisa, {
        method: "GET"
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let divTabConsumo = document.getElementById("tabelaConsumo");
            if (json.status) {
                divTabConsumo.innerHTML = "";
                let listaConsumos = json.listaConsumos;
                if (Array.isArray(listaConsumos)) {
                    if (listaConsumos.length > 0) {
                        let tabela = document.createElement('table');
                        tabela.style.borderCollapse = 'collapse';
                        tabela.style.width = '95%';
                        tabela.style.borderBottom = '1px solid';
                        //tabela.className = 'table table-striped table-hover';
                        let cabecalho = document.createElement('thead');
                        cabecalho.style.borderBottom = '1px solid';
                        cabecalho.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Nome funcionário</th>
                        <th>Nome Paciente</th>
                        <th>CPF Paciente</th>
                        <th>Local</th>
                        <th>Data Consumo</th>
                        <th>Itens Consumidos</th>
                    </tr>
                    `;
                        tabela.appendChild(cabecalho);
                        let corpo = document.createElement('tbody');
                        for (let i = 0; i < listaConsumos.length; i++) {
                            let linha = document.createElement('tr');
                            let consumo = listaConsumos[i];
                            linha.innerHTML = `
                        <td>${consumo.idConsumo}</td>
                        <td>${consumo.funcionario.nome_funcionario}</td>
                        <td>${consumo.paciente.nome}</td>
                        <td>${consumo.paciente.cpf}</td>
                        <td>${consumo.local.loc_nome}</td>
                        <td>${formataDataHora(consumo.dataConsumo)}</td>
                        <td>${consumo.itensConsumo}</td>
                        <td>
                            <button class="" onclick="excluirConsumo(${gerarParametrosConsumo(consumo)})">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 64 64">
                                    <path d="M 28 11 C 26.895 11 26 11.895 26 13 L 26 14 L 13 14 C 11.896 14 11 14.896 11 16 C 11 17.104 11.896 18 13 18 L 14.160156 18 L 16.701172 48.498047 C 16.957172 51.583047 19.585641 54 22.681641 54 L 41.318359 54 C 44.414359 54 47.041828 51.583047 47.298828 48.498047 L 49.839844 18 L 51 18 C 52.104 18 53 17.104 53 16 C 53 14.896 52.104 14 51 14 L 38 14 L 38 13 C 38 11.895 37.105 11 36 11 L 28 11 z M 18.173828 18 L 45.828125 18 L 43.3125 48.166016 C 43.2265 49.194016 42.352313 50 41.320312 50 L 22.681641 50 C 21.648641 50 20.7725 49.194016 20.6875 48.166016 L 18.173828 18 z"></path>
                                </svg>
                            </button>
                        </td>
                        `;
                            linha.style.borderBottom = '1px solid';
                            corpo.appendChild(linha);
                        }
                        tabela.appendChild(corpo);
                        divTabConsumo.appendChild(tabela);
                    }
                    else {
                        divTabConsumo.innerHTML = `<div> 
                                    Não existem pacientes com essa descrição
                                </div>`;
                    }
                }
            }
            else {
                divTabConsumo.innerHTML = "Não foi possível consultar os produtos";
            }
        })
}
*/