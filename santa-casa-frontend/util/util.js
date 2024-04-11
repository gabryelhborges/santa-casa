function mascaraCPF(input){
    let cpf = input.value.replace(/\D/g, '');
    // Aplica a máscara de CPF
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    // Atualiza o valor do input com o CPF formatado
    input.value = cpf;
}

function mascaraCNPJ(input){
    let cnpj = input.value.replace(/\D/g, '');
    cnpj = cnpj.replace(/(\d{2})(d{3})(d{3})(d{2})(d{2})/,"$1.$2.$3/$4-$5");
    input.value = cnpj;
}

function mascaraTelefone(input) {
    // Remove qualquer caractere que não seja número
    let telefone = input.value.replace(/\D/g, '');
    
    // Aplica a máscara de telefone
    if (telefone.length <= 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    
    // Atualiza o valor do input com o telefone formatado
    input.value = telefone;
}