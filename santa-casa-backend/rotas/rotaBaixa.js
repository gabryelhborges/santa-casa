import {Router} from "express";
import BaixaCtrl from "../controle/baixaCtrl.js";

const bCtrl = new BaixaCtrl();
const rotaBaixa = new Router();

rotaBaixa.get('/', bCtrl.consultar)
.get('/:termo', bCtrl.consultar)
.post('/', bCtrl.gravar)
.patch('/', bCtrl.atualizar)
.put('/', bCtrl.atualizar)
.delete('/', bCtrl.excluir)

export default rotaBaixa;