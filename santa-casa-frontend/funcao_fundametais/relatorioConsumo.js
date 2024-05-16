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
                        <th>Nome Paciente</th>
                        <th>CPF Paciente</th>
                        <th>Data Consumo</th>
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
                        <td>${consumo.dataConsumo}</td>
                        <td>
                            <button class="" onclick="excluirConsumo(${gerarParametrosConsumo(consumo)})">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="10px" viewBox="0 0 24 24">
                                    <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"></path>
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

function excluirConsumo(){
    return "";
}

function gerarParametrosConsumo(){
    return "";
}