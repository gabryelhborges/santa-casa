import Funcionario from "../modelo/funcionario.js";
import conectar from "./conexao.js";

export default class FuncionarioDAO{
    async gravar(funcionario){
        if(funcionario instanceof Funcionario){
            const sql = "INSERT INTO funcionarios (nome_funcionario,farmaceutico,coren,cpf,telefone_funcionario) VALUES(?,?,?,?,?)";
            const parametros =[
                funcionario.nome_funcionario,
                funcionario.farmaceutico,
                funcionario.coren,
                funcionario.cpf,
                funcionario.telefone_funcionario
            ]
            const conexao = await conectar();
            const retorno = await conexao.execute(sql,parametros);
            funcionario.idFuncionario = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(funcionario){
        if(funcionario instanceof Funcionario){
            const sql = "UPDATE funcionarios SET nome_funcionario = ?, farmaceutico = ?, coren = ?, cpf = ?, telefone_funcionario = ? WHERE idFuncionario = ?";
            const parametros =[
                funcionario.nome_funcionario,
                funcionario.farmaceutico,
                funcionario.coren,
                funcionario.cpf,
                funcionario.telefone_funcionario,
                funcionario.idFuncionario
            ];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql,parametros);
            funcionario.idFuncionario = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(funcionario){
        if(funcionario instanceof Funcionario){
            const sql = "DELETE FROM funcionarios WHERE idFuncionario = ?";
            const parametros =[
                funcionario.idFuncionario
            ]
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql = "";
        let parametros = [];
        if(!isNaN(parseInt(termo))){ //se o termo for um número de busca por ID
            sql = "SELECT * FROM funcionarios WHERE idFuncionario=?"; 
            parametros = [termo]; 
        }else{
            if(!termo){
                termo= "";
            }
            sql = "SELECT * FROM funcionarios WHERE nome_funcionario like ? ORDER BY nome_funcionario";
            parametros = ["%" + termo + "%"];
        }
        const conexao = await conectar();
        const [registros,campos] = await  conexao.execute(sql,parametros);
        let listaFuncionarios = [];
        for(const registro of registros){
            const funcionario = new Funcionario(registro.idFuncionario,
                                                registro.nome_funcionario,
                                                registro.coren,
                                                registro.cpf,
                                                registro.telefone_funcionario
                                                );
            listaFuncionarios.push(funcionario);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaFuncionarios;
    }    
}