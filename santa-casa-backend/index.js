import express from "express";
import cors from "cors";
import rotaPaciente from "./rotas/rotaPaciente.js";

//Aplicação HTTP pronta, bastando parametrizá-la
const host = "0.0.0.0";
const porta = 4040;
const app = express();
app.use(cors({origin:"*"}));

//Preparar a app para entender o formato JSON
app.use(express.json());

app.use('/paciente', rotaPaciente);

app.listen(porta, host, ()=>{
    console.log(`API do sistema em execução: ${host}:${porta}`);
});
//Exemplo de url para testar no postman:     http://localhost:4040/paciente