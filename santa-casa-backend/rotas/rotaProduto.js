import { Router } from "express";
import ProdutoCtrl from "../controle/produtoCtrl.js";

const prodCTRL = new ProdutoCtrl();
const rotaProduto = new Router();

rotaProduto.get('/', prodCTRL.consultar)
.get('/:termo', prodCTRL.consultar)
.post('/', prodCTRL.gravar)
.patch('/', prodCTRL.atualizar)
.put('/', prodCTRL.atualizar)
.delete('/', prodCTRL.excluir);

export default rotaProduto;