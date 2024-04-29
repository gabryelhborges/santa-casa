const urlBase = 'http://localhost:4040/transferir';
const urlLocal = 'hhtp://localhost:4040/local';
var formTransf = document.getElementById('formTransferencia');
formTransf.reset();
formTransf.onsubmit = validarFormulario;

inputLocaisNome();

function validarFormulario(evento){

}

function inputLocaisNome(){
    fetch(urlForn,{
        method: 'GET',
        redirect: 'follow'
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let select = document.getElementById('Locais_Locais');
            
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

