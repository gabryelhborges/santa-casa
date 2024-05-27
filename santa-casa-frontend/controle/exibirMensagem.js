const estiloAviso= `
background-color: #ffffcc;
border: 1px solid #fcfc28;
border-radius: 3px;
color: #333;
`;

const estiloOk= `
background-color: #58ffa3;
border: 1px solid #009c46;
border-radius: 3px;
color: #333;
`;

const estiloErro=`
background-color: #ff9999;
border: 1px solid #ff3838;
border-radius: 3px;
color: #333;
`;

const divExibicao= `
position: fixed;
top: 20px;
left: 50%;
transform: translateX(-50%);
width: 60%;
z-index: 9999;
`;

const divMsg=`
padding: 10px;
border-radius: 5px;
margin-bottom: 10px;
text-align: center;
`;

function exibirMensagem(mensagem, estilo) {
    let elemMensagem = document.createElement('div');
    elemMensagem.style= divExibicao;
    if (!estilo) {
        estilo = 'aviso';
    }

    if (estilo == 'aviso') {
        // Mensagem de aviso
        elemMensagem.innerHTML = `  <div style='${divMsg} ${estiloAviso}'>
                                        <p>${mensagem}</p>
                                    </div>`;
    } else if (estilo == 'ok') {
        // Mensagem de OK
        elemMensagem.innerHTML = `   <div style='${divMsg} ${estiloOk}'>
                                        <p>${mensagem}</p>
                                    </div>`;
    } else {
        // Mensagem de erro
        elemMensagem.innerHTML = `  <div style='${divMsg} ${estiloErro}'>
                                        <p>${mensagem}</p>
                                    </div>`;
    }

    // Adiciona a div à página
    document.body.appendChild(elemMensagem);

    // Remove a div após 7 segundos
    setTimeout(() => {
        elemMensagem.parentNode.removeChild(elemMensagem);
    }, 7000);
}