const urlBase = "http://localhost:4040/funcionario";
var formFun = document.getElementById("formFuncionario");
formFun.onsubmit = validarFormulario;

exibirFun();
var acao = 'cadastrar';

function validarFormulario(evento){

    if(formFun.checkValidity()){
        let cpf = document.getElementById("cpf").value;
        let nome = document.getElementById("nome").value;
        let coren = document.getElementById("coren").value;
        let telefone = document.getElementById( "telefone" ).value; 
        let farmaceutico = document.getElementById("farmaceutico").value;
        let fun = new Funcionario(0,nome, farmaceutico, coren, cpf, telefone);

        if (acao === 'cadastrar'){
            fetch(urlBase, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(fun)
            })
            .then((resposta)=>{
                return resposta.json();
            })
            .then((dados)=>{
                if (dados.status){
                    limparFormulario();
                    exibirMensagem(dados.mensagem);
                    exibirFun();
                }
                else{
                    exibirMensagem(dados.mensagem);
                }
            })
            .catch((erro)=>{
                exibirMensagem("Problema ao executar a operação:" + erro.message);
            });
        }
        else if (acao === 'excluir'){
            if (confirm('Deseja realmente excluir esse funcionario?'))
            {
                const cpf = document.getElementById("cpf").value;
                fetch(urlBase+"/"+email, {method:"DELETE"}).then((resposta)=>{
                    return resposta.json();
                })
                .then((dados)=>{
                    exibirFun(); //atualizar a exibição da tabela
                    limparFormulario();
                    exibirMensagem(dados.mensagem);
                })
                .catch((erro)=>{
                    exibirMensagem("Erro ao tentar excluir o registro: " + erro.message);
                });
                
            }
        }
        else if (acao ==='alterar'){
            if (confirm('Deseja realmente alterar esse voluntario?'))
            {
                const email = document.getElementById("email").value;
                fetch(urlBase+ "/" + email,{method:"DELETE"})
                .then((resposta)=>{
                    return resposta.json();
                })
                .then((dados)=>{
                    exibirFun(); //atualizar a exibição da tabela
                    limparFormulario();
                    exibirMensagem(dados.mensagem);
                })
                .catch((erro)=>{
                    exibirMensagem("Erro ao tentar excluir o registro: " + erro.message);
                });
                
            }
        }
        //É necessário atualizar a exibição da tabela
        exibirFun();
    }
    else {
        formFun.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation()
}

function exibirFun(){
    fetch(urlBase,{
        method: 'GET',
        redirect: 'follow'
    })
    .then((resposta)=>{
        return resposta.json();
    })
    .then((json)=>{
        let divTabela = document.getElementById('tabela');
    divTabela.innerHTML = "";
    listaFuncionarios = json.listaFuncionarios;
    if (Array.isArray(listaFuncionarios)) {
        if (listaFuncionarios.length > 0) {
            let tabela = document.createElement('table');
            tabela.className = "table table-striped table-hover";
            let cabecalho = document.createElement('thead');
            cabecalho.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Coren</th>
                    <th>Farmaceutico</th>
                </tr>
            `;
            tabela.appendChild(cabecalho);
            let corpo = document.createElement('tbody');
            for (let i = 0; i < listaFuncionarios.length; i++) {
                let linha = document.createElement('tr');
                let fun = listaFuncionarios[i];
                linha.innerHTML = `
                    <td>${fun.idFuncionario}</td>
                    <td>${fun.nome_funcionario}</td>
                    <td>${fun.cpf}</td>
                    <td>${fun.telefone_funcionario}<td>
                    <td>${fun.coren}</td>
                    <td>${fun.farmaceutico}</td>
                    <td>
                        <button class="btn btn-danger" onclick="selecionarFun(${gerarParametrosFun(fun)},'excluir')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                            </svg>
                        </button>
                        <button class="btn btn-warning" onclick="selecionarFun(${gerarParametrosFun(fun)},'alterar')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                          </svg>
                        </button>
                    </td>
                `;
                corpo.appendChild(linha);
            }
            tabela.appendChild(corpo);

            //tabela passa a ser visível na div
            divTabela.appendChild(tabela);

        }
        else {
            divTabela.innerHTML = `<div class="alert alert-warning" role="alert"> 
                                    Não existem Funcionarios cadastrados
                                </div>`;
        }
    }

    })
    .catch((erro)=>{
        exibirMensagem("Não foi possível recuperar os voluntarios do backend: " + erro.message);
    })
    
}

function gerarParametrosFun(fun){
    return `'${fun.idFuncionario}','${fun.nome_funcionario}','${fun.coren}','${fun.cpf}','${fun.telefone_funcionario}','${fun.farmaceutico}'`
}

function selecionarFun(pidFuncionario,pnome_funcionario,pcoren,pcpf,ptelefone_funcionario,pfarmaceutico){
    document.getElementById('idFuncionario').value= pidFuncionario;
    document.getElementById("cpf").value = pcpf;
    document.getElementById("nome_funcionario").value = pnome_funcionario
    document.getElementById("coren").value = pcoren;
    document.getElementById( "telefone_funcionario" ).value = ptelefone_funcionario; 
    document.getElementById("farmaceutico").value = pfarmaceutico;
    let botao = document.getElementById('botao');
    if (modo == 'excluir'){
        acao = 'excluir';
        botao.innerHTML = 'Excluir';
    }
    else if (modo == 'alterar'){
    acao = 'alterar';
    botao.innerHTML = 'Alterar';
    }
}

function limparFormulario(){
    document.getElementById("cpf").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("coren").value = "";
    document.getElementById( "telefone" ).value = ""; 
    document.getElementById("farmaceutico").value = "";
    acao="cadastrar";
}

function exibirMensagem(mensagem){
    let elemMensagem = document.getElementById("mensagem");
    elemMensagem.innerHTML=`
      <div class='alert alert-success'>
        <p class='text-center'>${mensagem}</p>
      </div>
    `;
    setTimeout(()=>{
        elemMensagem.innerHTML="";  
    },5000);
}
