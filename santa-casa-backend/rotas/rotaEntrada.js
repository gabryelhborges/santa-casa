import { Router } from "express";
import EntradaCtrl from "../controle/entradaCtrl.js";

const entradaCtrl = new EntradaCtrl();
const rotaEntrada = new Router();

rotaEntrada.post('/',entradaCtrl.gravar)
.put('/',entradaCtrl.atualizar)
.patch('/',entradaCtrl.atualizar)
.delete('/', entradaCtrl.excluir)

export default rotaEntrada;