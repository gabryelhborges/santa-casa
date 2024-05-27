import Consumo from "../modelo/consumo.js";
import Funcionario from "../modelo/funcionario.js";
import ItensConsumo from "../modelo/itensConsumo.js";
import Loc from "../modelo/local.js";
import Paciente from "../modelo/paciente.js";

export default class ConsumoDAO {
    async gravar(consumo, conexao) {
        if (consumo instanceof Consumo) {
            const sql = "INSERT INTO Consumo(cons_pac_id, cons_func_id, cons_loc_id) VALUES(?,?,?)";
            const parametros = [consumo.paciente.idPaciente, consumo.funcionario.idFuncionario, consumo.local.loc_id];
            //conexao deve ser criada no control
            const retorno = await conexao.execute(sql, parametros);
            consumo.idConsumo = retorno[0].insertId;
            //releaseConnection deve ser feita no final do controle
        }
    }

    async atualizar(consumo, conexao) {
        if (consumo instanceof Consumo) {
            const sql = "UPDATE Consumo SET cons_pac_id = ?, cons_func_id = ?, cons_dataConsumo = ? WHERE cons_id = ?";
            const parametros = [consumo.paciente.idPaciente, consumo.funcionario.idFuncionario, consumo.dataConsumo, consumo.idConsumo];
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(consumo, conexao) {
        if (consumo instanceof Consumo) {
            const sql = "DELETE FROM Consumo WHERE cons_id = ?";
            const parametro = [consumo.idConsumo];
            await conexao.execute(sql, parametro);
        }
    }

    async consultar(cons, conexao) {
        let sql = "";
        let parametros = [];
        //Principalmente pesquisar por paciente e data
        let partesData;
        if (cons.dataConsumo) {
            if (cons.dataConsumo.includes('-')) {
                partesData = cons.dataConsumo.split('-');//dia, mes, ano
            }
            else {
                partesData = cons.dataConsumo.split('/');
            }
        }
        if (cons.consumoId) {
            sql = "SELECT * FROM Consumo WHERE cons_id = ?";
            parametros = [cons.consumoId];
        }
        else {
            if (cons.paciente && cons.dataConsumo) {
                sql = `SELECT * FROM Consumo INNER JOIN Pacientes 
                WHERE DAY(cons_dataConsumo)= ? AND
                MONTH(cons_dataConsumo)= ? AND
                YEAR(cons_dataConsumo)= ?`;
                if (cons.paciente.nome) {
                    sql += ` AND nome LIKE ?`;
                    parametros = [partesData[0], partesData[1], partesData[2], '%' + cons.paciente.nome + '%'];
                }
                else {
                    sql += ` AND cons_pac_id = ?`;
                    parametros = [partesData[0], partesData[1], partesData[2], cons.paciente.idPaciente];
                }
            }
            else if (cons.paciente || cons.dataConsumo) {
                if (cons.paciente) {
                    if (cons.paciente.nome) {
                        sql = `SELECT * FROM Pacientes INNER JOIN Consumo 
                        ON cons_pac_id = id_paciente WHERE nome LIKE ?`;
                        parametros = ['%' + cons.paciente.nome + '%'];
                    }
                    else {
                        sql = `SELECT * FROM Consumo 
                        WHERE cons_pac_id = ?`;
                        parametros = [cons.paciente.idPaciente];
                    }
                }
                else {
                    sql = `SELECT * FROM Consumo 
                    WHERE DAY(cons_dataConsumo)= ? AND
                    MONTH(cons_dataConsumo)= ? AND
                    YEAR(cons_dataConsumo)= ? ORDER BY cons_dataConsumo DESC`;
                    parametros = [partesData[0], partesData[1], partesData[2]];
                }
            }
            else {
                sql = `SELECT * FROM Consumo ORDER BY cons_dataConsumo DESC`;
            }
        }
        const [registros, campos] = await conexao.execute(sql, parametros);
        let listaConsumos = [];
        for (const registro of registros) {
            let paciente = new Paciente();
            await paciente.consultar(registro.cons_pac_id).then((listaPac) => {
                paciente = listaPac.pop();
            });

            let funcionario = new Funcionario();
            await funcionario.consultar(registro.cons_func_id).then((listaFunc) => {
                funcionario = listaFunc.pop();
            });

            let local = new Loc();
            await local.consultar(registro.cons_loc_id).then((listaLocais) => {
                local = listaLocais.pop();
            })

            let consumo = new Consumo(registro.cons_id, paciente, funcionario, local, [], registro.cons_dataConsumo);
            let listaItensConsumo = [];
            let ic = new ItensConsumo(consumo);
            await ic.consultar(conexao).then((listaIC) => {
                listaItensConsumo = listaIC;
            })
            consumo.itensConsumo = listaItensConsumo;

            listaConsumos.push(consumo);
        }
        return listaConsumos;
    }
}