import express from "express";
import cors from "cors";
import rotaPaciente from "./rotas/rotaPaciente.js";
import rotaFuncionario from "./rotas/rotaFuncionario.js";
import rotaProduto from "./rotas/rotaProduto.js";
import rotaFabricante from "./rotas/rotaFabricante.js";
import rotaUnidade from "./rotas/rotaUnidade.js";
import rotaForma from "./rotas/rotaForma.js";
import rotaLote from "./rotas/rotaLote.js";
import rotaConsumo from "./rotas/rotaConsumo.js";

//Aplicação HTTP pronta, bastando parametrizá-la
const host = "0.0.0.0";
const porta = 4040;
const app = express();
app.use(cors({origin:"*"}));

//Preparar a app para entender o formato JSON
app.use(express.json());

app.use('/paciente', rotaPaciente);
app.use('/funcionario', rotaFuncionario);
app.use('/produto', rotaProduto);
app.use('/fabricante',rotaFabricante);
app.use('/unidade',rotaUnidade);
app.use('/forma',rotaForma);
app.use( '/lotes', rotaLote);
app.use('/consumo', rotaConsumo);

app.listen(porta, host, ()=>{
    console.log(`API do sistema em execução: ${host}:${porta}`);
});
//Exemplo de url para testar no postman:     http://localhost:4040/paciente