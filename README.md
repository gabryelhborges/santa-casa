# 🏥 Sistema de Gestão Farmacêutica - Santa Casa

Um sistema completo para gerenciamento de farmácia hospitalar, desenvolvido com arquitetura full-stack utilizando JavaScript, Node.js e interface web responsiva.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Módulos do Sistema](#módulos-do-sistema)
- [API Endpoints](#api-endpoints)

## 🎯 Sobre o Projeto

O Sistema de Gestão Farmacêutica Santa Casa é uma solução completa para o controle de medicamentos e produtos farmacêuticos em ambientes hospitalares. O sistema oferece funcionalidades abrangentes desde o cadastro de produtos até relatórios detalhados de consumo e movimentação.

### Objetivos Principais

- Controle rigoroso de estoque farmacêutico
- Rastreabilidade completa de medicamentos
- Gestão de consumo por paciente e funcionário
- Relatórios gerenciais para tomada de decisão
- Interface intuitiva e responsiva

## ⚡ Funcionalidades

### 📊 Gestão de Cadastros
- **Pacientes**: Cadastro completo com dados pessoais e histórico
- **Funcionários**: Gerenciamento de colaboradores do sistema
- **Produtos**: Controle de medicamentos e materiais médicos
- **Fabricantes**: Cadastro de fornecedores e laboratórios

### 📦 Controle de Estoque
- **Entrada de Produtos**: Registro de recebimento com lotes e validades
- **Transferência**: Movimentação entre setores hospitalares
- **Baixa de Produtos**: Controle de perdas, vencimentos e descartes
- **Consumo**: Registro de utilização por paciente

### 📈 Relatórios Gerenciais
- **Relatório de Consumo**: Análise por paciente, produto e período
- **Relatório de Baixa**: Controle de perdas por motivo
- **Relatório de Entrada**: Histórico de recebimentos
- **Relatório de Transferência**: Movimentação entre setores

## 🛠 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **Arquitetura MVC** - Padrão de desenvolvimento

### Frontend
- **HTML5** - Estruturação das páginas
- **CSS3** - Estilização e responsividade
- **JavaScript (ES6+)** - Lógica de negócio client-side
- **Vue.js** - Framework reativo (em alguns módulos)
- **Bootstrap** - Framework CSS

### Ferramentas
- **Axios** - Cliente HTTP
- **jsPDF** - Geração de relatórios PDF
- **Nicepage** - Design de interface

## 📁 Estrutura do Projeto

```
santa-casa/
├── santa-casa-backend/
│   ├── controle/              # Controllers da API
│   │   ├── baixaCtrl.js
│   │   ├── consumoCtrl.js
│   │   ├── entradaCtrl.js
│   │   └── ...
│   ├── modelo/                # Models de dados
│   ├── persistencia/          # Camada de acesso a dados
│   ├── rotas/                 # Definição de rotas
│   ├── implementacoesEngSoftware/
│   ├── package.json
│   └── index.js              # Servidor principal
│
├── santa-casa-frontend/
│   ├── controle/             # Controladores frontend
│   ├── modelo/               # Models JavaScript
│   ├── Formularios/          # Páginas de cadastro
│   ├── funcao_fundametais/   # Operações principais
│   │   ├── efetuar_consumo.html
│   │   ├── baixa_produto.html
│   │   ├── entrada_de_produto.html
│   │   └── transferir_produtos.html
│   ├── Funcao_Saida/         # Relatórios
│   │   ├── relatorioConsumo.html
│   │   ├── relatorioBaixa.html
│   │   └── relatorioEntrada/
│   ├── estilização/          # Arquivos CSS
│   ├── image/                # Recursos visuais
│   ├── util/                 # Utilitários
│   └── index.html            # Página inicial
│
├── ModeloConceitualSantaCasa.asta
├── README.md
└── LICENSE
```

## 🚀 Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- MySQL (v8 ou superior)
- Git

### Backend

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/santa-casa.git
cd santa-casa/santa-casa-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Configure as credenciais do MySQL no arquivo de configuração
# Importe o schema do banco de dados
```

4. **Inicie o servidor**
```bash
npm start
# Servidor rodando em http://localhost:4040
```

### Frontend

1. **Navegue para o diretório frontend**
```bash
cd ../santa-casa-frontend
```

2. **Abra o arquivo index.html em um servidor web local**
```bash
# Recomenda-se usar Live Server do VS Code ou similar
# O frontend estará disponível em http://localhost:3000
```

### Fluxo Básico de Operação

1. **Cadastros Iniciais**
   - Cadastre funcionários, pacientes e fabricantes
   - Registre produtos com suas especificações

2. **Operações de Estoque**
   - Registre entradas de produtos com lotes
   - Execute transferências entre setores
   - Registre consumos por paciente

3. **Gestão e Controle**
   - Efetue baixas quando necessário
   - Consulte relatórios para análise
   - Monitore movimentações

## 🏗 Módulos do Sistema

### 📋 Cadastros
- Gestão de pacientes
- Controle de fabricantes
- Formulários integrados com validação

### 🔄 Operações
- Registro de consumo
- Controle de baixas
- Entradas no estoque

### 📊 Relatórios
- Relatórios de consumo
- Relatórios de baixa
- Relatórios de entrada

## 🌐 API Endpoints

### Principais Rotas

```javascript
// Pacientes
GET    /paciente          // Listar pacientes
POST   /paciente          // Cadastrar paciente
PUT    /paciente          // Atualizar paciente
DELETE /paciente          // Excluir paciente

// Produtos
GET    /produto           // Listar produtos
POST   /produto           // Cadastrar produto
PUT    /produto           // Atualizar produto
DELETE /produto           // Excluir produto

// Consumo
GET    /consumo           // Listar consumos
POST   /consumo           // Registrar consumo
DELETE /consumo           // Excluir consumo

// Baixa
GET    /baixa             // Listar baixas
POST   /baixa             // Registrar baixa
DELETE /baixa             // Excluir baixa

// Entrada
GET    /entrada           // Listar entradas
POST   /entrada           // Registrar entrada
DELETE /entrada           // Excluir entrada
```

### Base URL
```
http://localhost:4040
```
