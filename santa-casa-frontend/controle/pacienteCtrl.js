function carregaPacientes() {
    const tag = document.getElementById('listaPac');

    let endpoint = "http://localhost:4040/paciente";
    fetch(endpoint, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET', body: jsontext
    })
    .then(response => {return response.json()})
    .then(json=>{
        let lista= "";
        for(let elem of json){
            lista+=`<li>${elem.nome}</li>`;
        }
        tag.innerHTML= lista;
    })
    .catch(erro => {tag.innerHTML= `<li>Erro: ${erro}</li>`})
}