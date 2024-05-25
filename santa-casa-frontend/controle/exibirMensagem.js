function exibirMensagem(mensagem, estilo) {
    let elemMensagem = document.createElement('div');

    if (!estilo) {
        estilo = 'aviso';
    }

    if (estilo == 'aviso') {
        // Mensagem de aviso
        elemMensagem.innerHTML = `  <div class='divMsg msgAviso'>
                                        <p>${mensagem}</p>
                                    </div>`;
    } else if (estilo == 'ok') {
        // Mensagem de OK
        elemMensagem.innerHTML = `   <div class='divMsg msgOk'>
                                        <p>${mensagem}</p>
                                    </div>`;
    } else {
        // Mensagem de erro
        elemMensagem.innerHTML = `  <div class='divMsg msgErro'>
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