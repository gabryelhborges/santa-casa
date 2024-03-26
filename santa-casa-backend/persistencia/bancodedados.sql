CREATE TABLE PACIENTES (
    ID_PACIENTE           INTEGER NOT NULL,
    NUMERO_CARTAO         VARCHAR(50),
    TIPO_DOCUMENTO        VARCHAR(1) NOT NULL,
    DOCUMENTO             VARCHAR(20),
    NOME                  VARCHAR(50) NOT NULL,
    DATA_NASCIMENTO       DATE,
    SEXO                  VARCHAR(1) NOT NULL,
    NOME_RESPONSAVEL      VARCHAR(50),
    NOME_MAE              VARCHAR(50),
    ENDERECO              VARCHAR(50),
    BAIRRO                VARCHAR(50),
    TELEFONE              VARCHAR(15),
    RACA                  VARCHAR(2) NOT NULL,
    ESTADO_CIVIL          VARCHAR(1) NOT NULL,
    PROFISSAO             VARCHAR(50),
    CADASTRO              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NUMERO                VARCHAR(10),
    COMPLEMENTO           VARCHAR(60),
    CEP                   INTEGER,
    NOME_PAI              VARCHAR(50),
    NATURALIDADE          VARCHAR(50),
    NOME_SOCIAL           VARCHAR(60),
    UTILIZAR_NOME_SOCIAL  VARCHAR(1) DEFAULT 'N',
    RELIGIAO              VARCHAR(60),
    ORIENTACAO_SEXUAL     VARCHAR(1) DEFAULT '0'
);