import Paciente from "../modelo/paciente.js";
import conectar from "./conexao.js";

export default class PacienteDAO{
    async gravar(paciente){
        if(paciente instanceof Paciente){
            const sql = "INSERT INTO pacientes (cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
            const parametros = [paciente.cpf, paciente.nome, paciente.raca, paciente.estado_civil, paciente.sexo, paciente.data_nascimento, paciente.endereco, paciente.bairro, paciente.telefone, paciente.profissao, paciente.numero, paciente.complemento, paciente.cep, paciente.naturalidade, paciente.nome_pai, paciente.nome_responsavel, paciente.nome_mae, paciente.nome_social, paciente.utilizar_nome_social, paciente.religiao, paciente.orientacao_sexual];//21 parametros, id será gerado pelo bd(após ser inserido) e cadastro é a data em que foi feito o insert
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            paciente.idPaciente = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(paciente){
        if(paciente instanceof Paciente){
            const sql = "UPDATE pacientes SET cpf = ?, nome = ?, raca = ?, estado_civil = ?, sexo = ?, data_nascimento = ?, endereco = ?, bairro = ?, telefone = ?, profissao = ?, numero = ?, complemento = ?, cep = ?, naturalidade = ?, nome_pai = ?, nome_responsavel = ?, nome_mae = ?, nome_social = ?, utilizar_nome_social = ?, religiao = ?, orientacao_sexual = ? WHERE id_paciente = ?";
            const parametros = [paciente.cpf, paciente.nome, paciente.raca, paciente.estado_civil, paciente.sexo, paciente.data_nascimento, paciente.endereco, paciente.bairro, paciente.telefone, paciente.profissao, paciente.numero, paciente.complemento, paciente.cep, paciente.naturalidade, paciente.nome_pai, paciente.nome_responsavel, paciente.nome_mae, paciente.nome_social, paciente.utilizar_nome_social, paciente.religiao, paciente.orientacao_sexual, paciente.idPaciente];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(paciente){
        if(paciente instanceof Paciente){
            const sql = "DELETE FROM pacientes WHERE id_paciente = ?";
            const parametro = [paciente.idPaciente];
            const conexao = await conectar();
            await conexao.execute(sql, parametro);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql= "";
        let parametros= [];
        if(!isNaN(parseInt(termo))){
            //Se termo é um número, pesquisar por id
            sql = "SELECT * FROM pacientes WHERE id_paciente = ?";
            parametros = [termo];
        }
        else{
            //Se não for número, decidir se vai buscar por cpf ou nome
            //Código busca por nome
            if(!termo){
                termo= "";
            }
            sql = "SELECT * FROM pacientes WHERE nome like ? ORDER BY nome";
            parametros = ["%" + termo + "%"];
        }
        const conexao = await conectar();
        const [registros, campos]= await conexao.execute(sql, parametros);//A execução do select retornará uma lista dos registros que atendem a condição em "registros"
        let listaPacientes = [];
        //Preenchendo a lista com cada registro retornado
        for(const registro of registros){
            const paciente = new Paciente(registro.id_paciente, registro.cpf, registro.nome, registro.raca, registro.estado_civil, registro.sexo, registro.data_nascimento, registro.endereco, registro.bairro, registro.telefone, registro.profissao, registro.numero, registro.complemento, registro.cep, registro.naturalidade, registro.nome_pai, registro.nome_responsavel, registro.nome_mae, registro.nome_social, registro.utilizar_nome_social, registro.religiao, registro.orientacao_sexual);
            listaPacientes.push(paciente);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaPacientes;
    }
}