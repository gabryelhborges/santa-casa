const urlBase = 'http://localhost:4040';

var pesquisa = document.getElementById('form_pesquisa_produto');
var listaItensTransferencia = [];
var listaLot = [];
var listaFab = [];
var listaLocais = [];
var valormedida;
pesquisa.reset();
pesquisa.onsubmit = PesquisaProd;

listalocais();
nomeDoFabricante();
adicionarOrigem();
adicionarDestino();
exibirListaItensTransferencia();

function limparFormulario(){
    document.getElementById('codProd').value=""
    document.getElementById('selectOrigem').value = "";
    document.getElementById('selectFabricante').value = "";
    document.getElementById('selectDestino').value = "";
    document.getElementById('iProd').value = "";
    document.getElementById('iLote').value = "";
    document.getElementById('iData').value = "";
    document.getElementById('iQtde').value = "";
    document.getElementById('iMedida').value = "";
}

function listalocais(){
    fetch(urlBase+'/local', {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    }).then((json)=>{
        listaLocais = json.listaLocais;
    })
}

function adicionarOrigem(){
    fetch(urlBase + "/local",{
        method: 'GET',
        redirect: 'follow'
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let select = document.getElementById('selectOrigem');
            let op = document.createElement('option');
            op.text = 'Origem';
            op.value = '';
            select.appendChild(op);
            listaFor = json.listaLocais;
            if (Array.isArray(listaFor)) {
                if (listaFor.length > 0) {
                    for (let i = 0; i < listaFor.length; i++) {
                        let lugar = listaFor[i];
                        let option = document.createElement('option');
                        option.text = lugar.loc_nome;
                        option.value = lugar.loc_id;
                        select.appendChild(option);
                    }
                }
                else {
                    select.innerHTML = `<option>Erro Local</option>`;
                }
            }
        })
        .catch((erro) => {
            exibirMensagem('Não foi possível recuperar os locais do backend: ' + erro.message);
        });
}

function PesquisaProd(evento) {
    if (pesquisa.checkValidity()) {
        let prod_ID = document.getElementById('pesquisa_produto').value;

        fetch(urlBase + "/produto" + "/" + prod_ID, {
            method: "GET"
        })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`HTTP error! status: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then((json) => {
            let divTabela = document.getElementById('tabela');
            divTabela.innerHTML = '';
            listaProdutos = json.listaProdutos;
            if (Array.isArray(listaProdutos)) {
                if (listaProdutos.length > 0) {
                    let tabela = document.createElement('table');
                    tabela.style.borderCollapse = 'collapse';
                    tabela.style.width = '95%';
                    tabela.style.borderBottom = '1px solid';
                    let cabecalho = document.createElement('thead');
                    cabecalho.style.borderBottom = '1px solid';
                    cabecalho.innerHTML = `
                    <tr>
                        <th>Nome</th>
                        <th>Fabricante</th>
                        <th>Psicotropico</th>
                    </tr>
                    `;
                    tabela.appendChild(cabecalho);
                    let corpo = document.createElement('tbody');
                    for (let i = 0; i < listaProdutos.length; i++) {
                        let linha = document.createElement('tr');
                        let nomeDoFab;
                        let produto = listaProdutos[i];
                        nomeDoFab = listaFab.find(nomeDoFabricante => nomeDoFabricante.idFabricante === produto.Fabricante_idFabricante).f_nome;
                        linha.innerHTML = `
                            <td>${produto.nome}</td>
                            <td>${nomeDoFab}</td>
                            <td>${produto.psicotropico}</td>
                            <td>
                                <button class="" style="border-radius:50%" onclick="selecionarProduto(${gerarParametrosProduto(produto)})">
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
                    divTabela.appendChild(tabela);
                }
                else {
                    divTabela.innerHTML = `<div class="alert alert-warning" role="alert"> 
                                    Não existem Produtos cadastrados
                                </div>`;
                }
            }
        })
        .catch((erro) => {
            console.log('Não foi possível encontrar os Produtos: ' + erro.message);
        });
    }
    else {
        pesquisa.classList.add('was-validated');
    }
    // evento.preventDefault();
    // evento.stopPropagation();
}


function selecionarProduto(prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, ffa_cod, uni_cod, observacao, descricao_uso,tipo) {
    document.getElementById('iProd').value = nome;
    document.getElementById('codProd').value = prod_ID;
    fetch(urlBase + "/fabricante" + "/" + Fabricante_idFabricante, {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
    .then((json) => {
        listaFabricante = json.listaFabricante;
        document.getElementById('selectFabricante').value = listaFabricante[0].f_nome;
    });
    adicionarLote(prod_ID);
}

function nomeDoFabricante(){
    fetch(urlBase + "/fabricante", {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
    .then((json) => {
        listaFab = json.listaFabricante;
    });
}


function adicionarLote(produto){
    fetch(urlBase + "/lote" + "?" + "produto=" + produto, {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
    .then((json) => {
        let select = document.getElementById("iLote");
        let op = document.createElement("option");
        op.text = "SELECIONE UM LOTE";
        select.appendChild(op);
        listaLot=[];
        let listaLotes = json.listaLotes;
        if(Array.isArray(listaLotes)){
            for (let i=0 ;i < listaLotes.length; i++){  
                let lit = listaLotes[i]
                let option = document.createElement("option");
                option.value = lit.codigo + "/" + lit.data_validade
                 + "/" + lit.conteudo_frasco + "/" + lit.formaFarmaceutica.ffa_cod
                 + "/" + lit.unidade.unidade  + "/" + lit.quantidade + 
                 "/" + lit.total_conteudo; 
                option.text = lit.codigo + "/" + produto;
                select.appendChild(option);
                listaLot.push(lit);              
            };
        }
    });
}

function separarPorHifen(str) {
    if (str.includes('/')) {
        const partes = str.split('/');
        
        return {
            parte1: partes[0],
            parte2: partes[1],
            parte3: partes[2],
            parte4: partes[3],
            parte5: partes[4],
            parte6: partes[5],
            parte7: partes[6]
        };
    } else {
        return null; // ou throw new Error('A string não contém um hífen.');
    }
}

function criarLimpar(){
    document.getElementById('iData').value = "";
    document.getElementById('iMedida').value = "";
}

document.getElementById("selectOrigem").addEventListener("change", function(){
    //this.classList.add('readonly');
    this.ariaReadOnly=true;
})
document.getElementById("selectDestino").addEventListener("Change", function(){
    //this.classList.add('readonly');
})

document.getElementById("iLote").addEventListener("change", function() {
    if(this.value){                                                                                                         
        let valor = separarPorHifen(this.value);
        document.getElementById('iData').value = formataData(valor.parte2);
        document.getElementById('iMedida').value = valor.parte3 + " " + valor.parte5;
        valormedida = valor.parte3;
    }
});

function adicionarDestino(){
    fetch(urlBase + "/local",{
        method: 'GET',
        redirect: 'follow'
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let select = document.getElementById('selectDestino');
            let op = document.createElement('option');
            op.text = 'Destino';
            op.value = '';
            select.appendChild(op);
            listaFor = json.listaLocais;
            if (Array.isArray(listaFor)) {
                if (listaFor.length > 0) {
                    for (let i = 0; i < listaFor.length; i++) {
                        let lugar = listaFor[i];
                        let option = document.createElement('option');
                        option.text = lugar.loc_nome;
                        option.value = lugar.loc_id;
                        select.appendChild(option);
                    }
                }
                else {
                    select.innerHTML = `<option>Erro Local</option>`;
                }
            }
        })
        .catch((erro) => {
            exibirMensagem('Não foi possível recuperar os locais do backend: ' + erro.message);
        });
}

function formataData(dataParametro){
    // Convertendo a string em um objeto Date
    let data = new Date(dataParametro);

    // Obtendo o ano, mês e dia
    let ano = data.getFullYear();
    let mes = ('0' + (data.getMonth() + 1)).slice(-2); // Adicionando 1 porque os meses são zero indexados
    let dia = ('0' + data.getDate()).slice(-2);

    // Formatando a data no formato esperado pelo input tipo date
    let dataFormatada = ano + '-' + mes + '-' + dia;

    // Atribuindo a data formatada ao campo de data
    return dataFormatada;
}


function gerarParametrosProduto(produto) {
    return `'${produto.prod_ID}','${produto.Fabricante_idFabricante}','${produto.nome}',
    '${produto.psicotropico}','${produto.valor_custo}','${produto.far_cod}',
    '${produto.observacao}','${produto.tipo}'`;
}

function disabled_able() {
    let a = document.getElementById('capacidade').disabled;
    let inputs = ['iData', 'iMedida', 'selectFabricante'];
    
    for (let i = 0; i < inputs.length; i++) {
        let input = document.getElementById(inputs[i]);
        input.disabled = !a;
    }

}

function adicionarItemTransf() {
    let val = separarPorHifen(document.getElementById('iLote').value);
    let codLote = val.parte1;
    let codProd = document.getElementById('codProd').value;
    let loc = document.getElementById('selectOrigem').value;
    let dest = document.getElementById('selectDestino').value;
    let objLote = listaLot.find(itemLote => itemLote.codigo === codLote && itemLote.produto.prod_ID == codProd && itemLote.local.loc_id == loc);
    let objProd;
    objLote ? objProd = objLote.produto : objProd = null;
    let qtde = document.getElementById('iQtde').value * valormedida;
    if (objLote && objProd && qtde > 0) {
        let itemExistente = listaItensTransferencia.find(item => item.lote.codigo === objLote.codigo && item.produto.prod_ID === objProd.prod_ID);
        // Verifica se já existe um item com o mesmo produto e lote
        if (itemExistente) {
            // Se existir, apenas aumenta a quantidade
            let num = parseInt(itemExistente.qtdeConteudoUtilizado);
            num += parseInt(qtde);
            itemExistente.qtdeConteudoUtilizado = parseInt(num);
        }
        else {
            let novoItem = {
                lote: objLote, 
                produto: objProd, 
                quantidade: parseInt(qtde),
                origem: loc,
                destino: dest
            };
            listaItensTransferencia.push(novoItem);
        }
    }
    else {
        alert('Faltam dados ou dados estão incorretos.')
    }
    limparFormItemTransf();
    exibirListaItensTransferencia();
}

function removerItemTransferencia(index) {
    listaItensTransferencia.splice(index, 1);
    exibirListaItensTransferencia();
}

function limparFormItemTransf() {
    document.getElementById('codProd').value = '';
    document.getElementById('iProd').value = '';
    document.getElementById('iMedida').value = '';
    document.getElementById('iLote').value = '';
    document.getElementById('iLote').innerHTML = '';
    document.getElementById('iData').value = '';
    document.getElementById('iQtde').value = '';
    document.getElementById('selectFabricante').value = '';
    valormedida=0;
}

function exibirListaItensTransferencia() {
    let divItensTransf = document.getElementById("tabelaItensTransf");
    divItensTransf.innerHTML = '';
    if (listaItensTransferencia.length) {
        let tabela = document.createElement('table');
        tabela.style.borderCollapse = 'collapse';
        tabela.style.width = '95%';
        tabela.style.borderBottom = '1px solid';
        tabela.style.position='relative';
        //tabela.style.maxHeight= '100px';
        //tabela.className = 'table table-striped table-hover';
        let cabecalho = document.createElement('thead');
        cabecalho.style.borderBottom = '1px solid';
        cabecalho.style.position='sticky';
        cabecalho.style.top='-1 px';
        cabecalho.style.backgroundColor='#55ACEE'
        cabecalho.innerHTML = `
                    <tr>
                        <th>Lote</th>
                        <th>|Produto</th>
                        <th>|Qtde</th>
                        <th>|Unidade de medida</th>
                        <th>|Origem</th>
                        <th>|Destino</th>
                        <th>
                    </tr>
                    `;
        tabela.appendChild(cabecalho);
        let corpo = document.createElement('tbody');
        for (let i = 0; i < listaItensTransferencia.length; i++) {
            let linha = document.createElement('tr');
            let nomelocaldestino;
            let itTransf = listaItensTransferencia[i];
            nomelocaldestino = listaLocais.find(nomedolocal => nomedolocal.loc_id == itTransf.destino).loc_nome;
            linha.innerHTML = `
                        <td>${itTransf.lote.codigo}</td>
                        <td>|${itTransf.produto.nome}</td>
                        <td>|${itTransf.quantidade}</td>
                        <td>|${itTransf.lote.conteudo_frasco + " " + itTransf.lote.unidade.unidade}</td>
                        <td>|${itTransf.lote.local.loc_nome}</td>
                        <td>|${nomelocaldestino}</td>
                        <td>
                            <button class="" onclick="onclick="removerItemTransferencia(${i})"">
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
        divItensTransf.appendChild(tabela);
    }
    else {
        divItensTransf.innerHTML = 'Nenhum produto foi utilizado';
    }
}

function gerarParametrosTransferencia(itens) {
    return `'${itens.lote.codigo}','${itens.produto.prod_ID}','${itens.qtdeConteudoUtilizado}','${itens.unidade}','${itens.origem}','${itens.destino}'`;
}
/*
function validarFormulario(evento) {
    if(formTransferir.checkValidity() && listaItensTransferencia.length){
        fetch(urlBase + '/transferir', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listaItensTransferencia)
        }).then((resposta)=>{
            return resposta.json();
        }).then((dados)=>{
            if(dados.status){
                limparFormItemTransf();
                limparFormulario();
                listaItensTransferencia = [];
                exibirListaItensTransferencia();
                alert(dados.mensagem);
            }
            else{
                alert(dados.mensagem);
            }
        }).catch((erro)=>{
            alert("Não foi possível completar a operação: "+erro.message)
        })
    }
    else{
        alert('Verifique se todos os dados foram informados corretamente.');
    }
    evento.preventDefault();
    evento.stopPropagation();
}
*/