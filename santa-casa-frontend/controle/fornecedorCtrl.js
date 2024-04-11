const urlBase = "http://localhost:4040/fornecedor";

var formFor = document.getElementById('formFornecedor');
formFor.reset();
formFor.onsubmit=validarFormulario;

exibirFornecedores();
var acao = 'cadastrar';
var id;

function validarFormulario(eventos) {

    if(formFor.checkValidity()){
        let cnpj = document.getElementById('cnpj').value;
        let f_nome = document.getElementById('f_nome').value;
        let endereco = document.getElementById('endereco').value;
        let numero = document.getElementById('numero').value;
        let complemento = document.getElementById('complemento').value;
        let bairro = document.getElementById('bairro').value;
        let cidade = document.getElementById('cidade').value;
        let uf = document.getElementById('uf').value;
        let telefone = document.getElementById('telefone').value;
        let forn = new Fornecedor(0,cnpj,f_nome,endereco,numero,complemento,bairro,cidade,uf,telefone);

        if(acao==='cadastrar'){
            fetch(urlBase,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(forn)
            }).then((resposta)=>{
                return resposta.json();
            }).then((dados)=>{
                if(dados.status){
                    limparFormulario();
                    exibirMensagem(dados.mensagem);
                    exibirFornecedores();
                }
                else{
                    exibirMensagem(dados.mensagem);
                }
            }).catch((erro)=>{
                exibirMensagem('Problema ao executar operação: '+erro.message);
            })
        }
        else if (acao === 'alterar'){
            if(confirm('Deseja realmente alterar esse fornecedor?')){
                let cnpj = document.getElementById('cnpj').value;
                let f_nome = document.getElementById('f_nome').value;
                let endereco = document.getElementById('endereco').value;
                let numero = document.getElementById('numero').value;
                let complemento = document.getElementById('complemento').value;
                let bairro = document.getElementById('bairro').value;
                let cidade = document.getElementById('cidade').value;
                let uf = document.getElementById('uf').value;
                let telefone = document.getElementById('telefone').value;
                let forn = new Fornecedor(id,cnpj,f_nome,endereco,
                    numero,complemento,bairro,cidade,uf,telefone);
                fetch(urlBase, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(forn)
                })
                    .then((resposta) => {
                        return resposta.json();
                    })
                    .then((dados) => {
                        if (dados.mensagem) {
                            limparFormulario();
                            exibirMensagem(dados.mensagem);
                            exibirFornecedores();
                        }
                        else {
                            exibirMensagem(dados.mensagem);
                        }
                    })
                    .catch((erro) => {
                        exibirMensagem('Não foi possível realizar a operação: ' + erro.message);
                    });
            }
        }
        else if (acao === 'excluir') {
            if(confirm('Deseja realmente excluir esse fornecedor?')){
                let forn = new Fornecedor(id);
                fetch(urlBase, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(forn)
                }).then((resposta)=>{
                    return resposta.json();
                }).then((dados)=>{
                    limparFormulario();
                    exibirMensagem(dados.mensagem);
                    exibirFornecedores();
                }).catch((erro)=>{
                    exibirMensagem('Erro ao tentar excluir o fornecedor: '+erro.message);
                });
            }
        }
    }
    else{
        formFor.classList.add('was-validated');
    }
    eventos.preventDefault();
    eventos.stopPropagation();
}

function exibirFornecedores(){
    fetch(urlBase, {
        method:'GET',
        redirect: 'follow'
    }).then((resposta)=>{
        return resposta.json();
    }).then((json)=>{
        let divTabela = document.getElementById('tabela');
        divTabela.innerHTML = '';
        listaFornecedores = json.listaFornecedor;
        if(Array.isArray(listaFornecedores)){
            if(listaFornecedores.length > 0){
                let tabela = document.createElement('table');
                tabela.className= 'table table-striped table-hover';
                let cabecalho = document.createElement('thead');
                cabecalho.innerHTML= `
                <tr>
                    <th>ID</th>
                    <th>CNPJ</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                </tr>
                `;
                tabela.appendChild(cabecalho);
                let corpo = document.createElement('tbody');
                for(let i=0; i<listaFornecedores.length;i++){
                    let linha = document.createElement('tr');
                    let fornecedor = listaFornecedores[i];
                    linha.innerHTML=`
                        <td>${fornecedor.idFornecedor}</td>
                        <td>${fornecedor.cnpj}</td>
                        <td>${fornecedor.f_nome}</td>
                        <td>${fornecedor.telefone}</td>
                        <td>
                            <button class="btn btn-danger" onclick="selecionarFornecedor(${gerarParametrosFornecedor(fornecedor)},'excluir')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                            </button>
                            <button class="btn btn-warning" onclick="selecionarFornecedor(${gerarParametrosFornecedor(fornecedor)},'alterar')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </button>
                        </td>
                    `;
                    corpo.appendChild(linha);
                }
                tabela.appendChild(corpo);
                divTabela.appendChild(tabela);
            }
            else{
                divTabela.innerHTML = `<div class="alert alert-warning" role="alert"> 
                                        Não existem fornecedores cadastrados
                                        </div>`;
            }
        }
    }).catch((erro)=>{
        exibirMensagem('Não foi possível recuperar os fornecedores do backend: '+erro.message);
    })
}

function gerarParametrosFornecedor(fornecedor) {
    return `'${fornecedor.idFornecedor}','${fornecedor.cnpj}','${fornecedor.f_nome}',
    '${fornecedor.endereco}','${fornecedor.numero}','${fornecedor.complemento}',
    '${fornecedor.bairro}','${fornecedor.cidade}',
    '${fornecedor.uf}','${fornecedor.telefone}'`;
}

function selecionarFornecedor(idFornecedor,cnpj,f_nome,endereco,numero,complemento,bairro,cidade,uf,telefone, modo){
    id = idFornecedor;
    document.getElementById('cnpj').value = cnpj;
    document.getElementById('f_nome').value = f_nome;
    document.getElementById('endereco').value = endereco;
    document.getElementById('numero').value = numero;
    document.getElementById('complemento').value = complemento;
    document.getElementById('bairro').value = bairro;
    document.getElementById('cidade').value = cidade;
    document.getElementById('uf').value = uf;
    document.getElementById('telefone').value = telefone;

    let btnForm = document.getElementById('btnForm');
    if(modo=='alterar'){
        document.getElementById('cnpj').disabled = true;
        acao = 'alterar';
        btnForm.innerHTML='Alterar';
    }
    else if(modo == 'excluir'){
        acao = 'excluir';
        btnForm.innerHTML='Excluir';
    }
}

function limparFormulario(){
    document.getElementById('cnpj').value = '';
    document.getElementById('f_nome').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('complemento').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('uf').value = '';
    document.getElementById('telefone').value = '';

    acao = 'cadastrar';
    let btnForm = document.getElementById('btnForm');
    btnForm.innerHTML = "Cadastrar";
}

function exibirMensagem(mensagem){
    let elemMensagem = document.getElementById('mensagem');
    elemMensagem.innerHTML = `<div class='alert alert success'>
    <p class = 'text-center'>${mensagem}</p>
    </div>`;
    setTimeout(() => {
        elemMensagem.innerHTML = '';
    } , 3000);
}

function buscarFornecedorPorNome(dado) {
    // Constrói a URL da requisição, adicionando o CNPJ como parâmetro
    const urlBusca = `${urlBase}/${dado}`;

    // Realiza a requisição GET para o backend
    fetch(urlBusca, {
        method:'GET',
        redirect: 'follow'
    }).then((resposta)=>{
        return resposta.json();
    }).then((json)=>{
        let divTabela = document.getElementById('tabela');
        divTabela.innerHTML = '';
        listaFornecedores = json.listaFornecedor;
        if(Array.isArray(listaFornecedores)){
            if(listaFornecedores.length > 0){
                let tabela = document.createElement('table');
                tabela.className= 'table table-striped table-hover';
                let cabecalho = document.createElement('thead');
                cabecalho.innerHTML= `
                <tr>
                    <th>ID</th>
                    <th>CNPJ</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                </tr>
                `;
                tabela.appendChild(cabecalho);
                let corpo = document.createElement('tbody');
                for(let i=0; i<listaFornecedores.length;i++){
                    let linha = document.createElement('tr');
                    let fornecedor = listaFornecedores[i];
                    linha.innerHTML=`
                        <td>${fornecedor.idFornecedor}</td>
                        <td>${fornecedor.cnpj}</td>
                        <td>${fornecedor.f_nome}</td>
                        <td>${fornecedor.telefone}</td>
                        <td>
                            <button class="btn btn-danger" onclick="selecionarFornecedor(${gerarParametrosFornecedor(fornecedor)},'excluir')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                            </button>
                            <button class="btn btn-warning" onclick="selecionarFornecedor(${gerarParametrosFornecedor(fornecedor)},'alterar')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </button>
                        </td>
                    `;
                    corpo.appendChild(linha);
                }
                tabela.appendChild(corpo);
                divTabela.appendChild(tabela);
            }
            else{
                divTabela.innerHTML = `<div class="alert alert-warning" role="alert"> 
                                        Não existem fornecedores cadastrados
                                        </div>`;
            }
        }
    }).catch((erro)=>{
        exibirMensagem('Não foi possível recuperar os fornecedores do backend: '+erro.message);
    })
}

function exibirDetalhesFornecedor(fornecedor) {
    // Preencha os campos do formulário com os detalhes do fornecedor encontrado
    document.getElementById('cnpj').value = fornecedor.cnpj;
    document.getElementById('f_nome').value = fornecedor.f_nome;
    document.getElementById('endereco').value = fornecedor.endereco;
    document.getElementById('numero').value = fornecedor.numero;
    document.getElementById('complemento').value = fornecedor.complemento;
    document.getElementById('bairro').value = fornecedor.bairro;
    document.getElementById('cidade').value = fornecedor.cidade;
    document.getElementById('uf').value = fornecedor.uf;
    document.getElementById('telefone').value = fornecedor.telefone;
}

document.getElementById('btnBuscar').addEventListener('click', function() {
    const dado = document.getElementById('nomebusca').value;
    if (dado.trim() !== '') {
        buscarFornecedorPorNome(dado);
        
    } else {
        exibirMensagem('Por favor, insira um nome válido.');
    }
});