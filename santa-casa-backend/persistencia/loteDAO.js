import Lote from "../modelo/lote";
import conectar from "./conexao.js";


export default class LoteDAO{
    async gravar(lote){
        if(lote instanceof Lote){
            const sql = `INSERT INTO lote(codigo,
                        data_validade,
                        quantidade,
                        produto_prod_ID,
                        formafarmaceutica_ffa_cod,
                        conteudo_frasco,
                        unidade_un_cod,
                        total_conteudo
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
            const parametros = [
                lote.codigo,
                lote.data_validade,
                lote.quantidade,
                lote.produto.produto_id,
                lote.formaFarmaceutica.ffa_cod,
                lote.conteudo_frasco,  
                lote.unidade.un_cod,  
                lote.total_conteudo
            ];
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
}

/*
{
    "codigo": 1,
    "data_validade": "2000-02-20",
    "quantidade": 12,
    "produto": {"prod_ID": 1},
    "formaFarmaceutica": {
            "ffa_cod": 1,
            "forma": "comprimido"
        },
    "conteudo_frasco": 13,
    "unidade": {
            "un_cod": 1,
            "unidade": "Quilograma(kg)"
        },
    "total_conteudo": 106
}
*/