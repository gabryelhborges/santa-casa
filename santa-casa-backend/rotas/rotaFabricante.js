import { Router } from "express";
import FabricanteCtrl from "../controle/fabricanteCtrl.js";

const fornCtrl = new FabricanteCtrl();
const rotaFabricante = new Router();

rotaFabricante.get('/', fornCtrl.consultar)
.get('/:termo', fornCtrl.consultar)
.post('/',fornCtrl.gravar)
.patch('/',fornCtrl.atualizar)
.put('/',fornCtrl.atualizar)
.delete('/',fornCtrl.excluir)

export default rotaFabricante;