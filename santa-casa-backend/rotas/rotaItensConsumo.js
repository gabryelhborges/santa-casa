import { Router } from "express";
import ItensConsumoCtrl from "../controle/itensConsumoCtrl.js";

const icCtrl = new ItensConsumoCtrl();
const rotaItensConsumo = new Router();

rotaItensConsumo.get('/', icCtrl.consultar)
.get('/:termo', icCtrl.consultar)
.post('/', icCtrl.gravar)
.patch('/', icCtrl.atualizar)
.put('/', icCtrl.atualizar)
.delete('/', icCtrl.excluir);

export default rotaItensConsumo;