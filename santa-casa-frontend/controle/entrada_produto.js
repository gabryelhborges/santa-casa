const urlBase = 'http://localhost:4040';

adicinar();

var pesquisa = document.getElementById('form_pesquisa_produto');
pesquisa.reset();
pesquisa.onsubmit = validarFormulario;


var uni = document.getElementById("unidade");




function adicinar(){
    fetch(urlBase + "/unidade",{
        method: "GET",
        redirect: "follow"
    }).then((resposta) => { 
       return resposta.json();
    }).then((json) => {  
        let select = document.getElementById("unidade");
        listaUnidades = json.listaUnidades;
        if(Array.isArray(listaUnidades)){
            for (let i=0 ;i < listaUnidades.length; i++){  
                let option = document.createElement("option")  ;
                option.value = listaUnidades[i].un_cod;
                option.text = listaUnidades[i].unidade;
                select.appendChild(option);                      
            };
        }
    });
    fetch(urlBase + "/forma",{
        method:"GET"
    }).then((response)=>{
        return response.json()
    }).then((json)=>{
        let select = document.getElementById("forma_farmaceutica");
        listaFormaFaramaceuticas = json.listaFormaFaramaceuticas;
        if(Array.isArray(listaFormaFaramaceuticas)){
            for (let i=0 ;i < listaFormaFaramaceuticas.length; i++){  
                let option = document.createElement("option");
                option.value = listaFormaFaramaceuticas[i].ffa_cod;
                option.text = listaFormaFaramaceuticas[i].forma;
                select.appendChild(option);                      
            };
        }
    });
};

function validarFormulario(evento) {
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
                    tabela.className = 'table table-striped table-hover';
                    let cabecalho = document.createElement('thead');
                    cabecalho.innerHTML = `
                    <tr>
                        <th>Nome</th>
                        <th>Fabricante</th>
                        <th>Valor</th>
                    </tr>
                    `;
                    tabela.appendChild(cabecalho);
                    let corpo = document.createElement('tbody');
                    for (let i = 0; i < listaProdutos.length; i++) {
                        let linha = document.createElement('tr');
                        let produto = listaProdutos[i];
                        linha.innerHTML = `
                        <td>${produto.nome}</td>
                        <td>${produto.Fabricante_idFabricante}</td>
                        <td>${produto.psicotropico}</td>
                        <td>
                            <button class="" onclick="selecionarProduto(${gerarParametrosProduto(produto)})">  
                            </button>
                        </td>
                        `;
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
            exibirMensagem('Não foi possível encontrar os Produtos: ' + erro.message);
        });
    }
    else {
        pesquisa.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
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



function dataAtualFormatada(){
    let dataAtual = new Date();

    // Obtendo o ano, mês, dia, hora, minuto, segundo e milissegundo da data atual
    let ano = dataAtual.getFullYear();
    let mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2); // Adicionando 1 porque os meses são zero indexados
    let dia = ('0' + dataAtual.getDate()).slice(-2);
    let hora = ('0' + dataAtual.getHours()).slice(-2);
    let minuto = ('0' + dataAtual.getMinutes()).slice(-2);
    let segundo = ('0' + dataAtual.getSeconds()).slice(-2);
    let milissegundo = ('00' + dataAtual.getMilliseconds()).slice(-3);

    // Formatando a data atual no formato ISO 8601
    let dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}.${milissegundo}Z`;
    return dataFormatada;
}

function gerarParametrosProduto(produto) {
    return `'${produto.prod_ID}','${produto.Fabricante_idFabricante}','${produto.nome}',
    '${produto.psicotropico}','${produto.valor_custo}','${produto.far_cod}',
    '${produto.observacao}','${produto.tipo}'`;
}

function selecionarProduto(prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, ffa_cod, uni_cod, observacao, descricao_uso,tipo) {
    document.getElementById('id_produto').value = prod_ID;
    document.getElementById('nome_produto').value = nome;
    fetch(urlBase + "/fabricante" + "/" + Fabricante_idFabricante, {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
    .then((json) => {
        listaFabricante = json.listaFabricante;
        document.getElementById('nome_fabricante').value = listaFabricante[0].f_nome;
    });
    excluirLote();
    adicionarLote(prod_ID);
}

function adicionarLote(produto){
    fetch(urlBase + "/lote" + "?" + "produto=" + produto, {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
    .then((json) => {
        let select = document.getElementById("codigo_lote");
        let op = document.createElement("option");
        op.text = "Selecione um Lote";
        select.appendChild(op);
        listaLotes = json.listaLotes;
        if(Array.isArray(listaLotes)){
            for (let i=0 ;i < listaLotes.length; i++){  
                let lit = listaLotes[i]
                let option = document.createElement("option");
                option.value = lit.codigo + "/" + lit.data_validade
                 + "/" + lit.conteudo_frasco + "/" + lit.formaFarmaceutica.ffa_cod
                 + "/" + lit.unidade.un_cod  + "/" + lit.quantidade + 
                 "/" + lit.total_conteudo; 
                option.text = lit.codigo + "/" + produto;
                select.appendChild(option);                      
            };
            let criarNovo = document.createElement("option");
            criarNovo.textContent = "Criar Novo Lote"; // Correção: usar textContent em vez de text
            criarNovo.value = "criarNovo";// Correção: adicionar evento de click corretamente
            select.appendChild(criarNovo);
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

function disabled_able() {
    let a = document.getElementById('capacidade').disabled;
    let inputs = ['capacidade', 'validade', 'forma_farmaceutica', 'unidade'];
    
    for (let i = 0; i < inputs.length; i++) {
        let input = document.getElementById(inputs[i]);
        input.disabled = !a;
    }

}

function criarLimpar(){
    document.getElementById('capacidade').value = "";
    document.getElementById('validade').value = "";
    document.getElementById('forma_farmaceutica').value = "";
    document.getElementById('unidade').value = "";
}

document.getElementById("codigo_lote").addEventListener("change", function() {
    if(document.getElementById('validade').value)
        disabled_able();
    criarLimpar();
    if (this.value === "criarNovo") { // Se a opção "Criar Novo Lote" for selecionada
        
        criarLote();
    }else if(!this.value){
        criarLimpar();
    }else{
        let valor = separarPorHifen(this.value);
        let capacidadeInteiro = parseInt(valor.parte3); // Acessa a propriedade corretamente
        document.getElementById('capacidade').value = capacidadeInteiro;
        document.getElementById('validade').value = formataData(valor.parte2);
        document.getElementById('forma_farmaceutica').value = valor.parte4;
        document.getElementById('unidade').value = valor.parte5;
        disabled_able();
    }
});

function criarLote(){
    document.getElementById('codigo_lote').style.display = 'none';
    document.getElementById('seta_selec').style.display = 'none';
    document.getElementById('criar_codigo_lote').style.display = "block";
    document.getElementById('btn-select').style.display = "block";
}

function exibirMensagem(mensagem) {
    let elemMensagem = document.getElementById('mensagem');
    elemMensagem.innerHTML = `<div class='alert alert success'>
                        <p class = 'text-center'>${mensagem}</p>
                    </div>`;
    setTimeout(() => {
        elemMensagem.innerHTML = '';
    }, 7000);//7 Segundos
}

function excluirLote(){
    var select = document.getElementById('codigo_lote');
    if (select) {
        while (select.options.length > 0) {
            select.remove(0);
        }
    }
}

function limparFormulario(){
    document.getElementById('capacidade').value = "";
    document.getElementById('validade').value = "";
    document.getElementById('forma_farmaceutica').value = "";
    document.getElementById('unidade').value = "";
    document.getElementById('id_produto').value = "";
    document.getElementById('nome_produto').value = "";
    document.getElementById('nome_fabricante').value = "";
    document.getElementById('codigo_lote').value = "";
    document.getElementById('quantidade').value = "";

    excluirLote();
}

document.getElementById('id_produto').addEventListener("change",function(){
    if(!this.value){
        if(document.getElementById('codigo_lote').value)
            disabled_able();
    
        limparFormulario();
    }
        
})

var entrada_prod = document.getElementById('form_entrada');
entrada_prod.reset();
entrada_prod.onsubmit = validarFormularioEntrada;

function validarFormularioEntrada(evento){

    if(entrada_prod.checkValidity()){
        let valor = null;
        if(document.getElementById('validade').disabled == true){
            valor = separarPorHifen(document.getElementById('codigo_lote').value);
            let qtd  = parseInt(document.getElementById('quantidade').value) + parseInt(valor.parte6);
            let prod = new Produto(document.getElementById('id_produto').value);
            let forma = new FormaFarmaceutica(valor.parte4);
            let uni = new Unidade(valor.parte5);
            let tot = parseInt(valor.parte7) + (parseInt(document.getElementById('quantidade').value)*parseInt(valor.parte3));
            let lote = new Lote(
                valor.parte1,
                formataData(valor.parte2),
                qtd,
                prod,
                forma,
                valor.parte3,
                uni,
                tot
            );
            fetch(urlBase + "/lote",{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lote)
            }).then((resposta) => {
                return resposta.json();
            }).then((dados) => {
                if (dados.mensagem) {
                    limparFormulario();
                    exibirMensagem(dados.mensagem);
                }
                else {
                    exibirMensagem(dados.mensagem);
                }
            })
            .catch((erro) => {
                exibirMensagem('Não foi possível realizar a operação: ' + erro.message);
            });
        }else{
            let lote = new Lote(
                document.getElementById().value,
            );
            fetch(urlBase + "/lote",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lote)
            }).then((resposta) => {
                return resposta.json();
            }).then((dados) => {
                if (dados.mensagem) {
                    limparFormulario();
                    exibirMensagem(dados.mensagem);
                }
                else {
                    exibirMensagem(dados.mensagem);
                }
            })
            .catch((erro) => {
                exibirMensagem('Não foi possível realizar a operação: ' + erro.message);
            });
        }

    }else{
        formFor.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}
