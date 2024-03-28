import { Router } from "express";
import FornecedorCtrl from "../controle/fornecedorCtrl.js";

const fornCtrl = new FornecedorCtrl();
const rotaFornecedor = new Router();

rotaFornecedor.get('/', fornCtrl.consultar)
.get('/:termo', fornCtrl.consultar)
.post('/',fornCtrl.gravar)
.patch('/',fornCtrl.atualizar)
.put('/',fornCtrl.atualizar)
.delete('/',fornCtrl.excluir)

export default rotaFornecedor;