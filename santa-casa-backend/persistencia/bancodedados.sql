create database santa_casa;
use santa_casa;
create table pacientes (
    id_paciente           integer not null auto_increment,
    cpf                   varchar(14) not null unique,
    nome                  varchar(50) not null,
    raca                  varchar(8) not null,
    estado_civil          varchar(1) not null,
    sexo                  varchar(1) not null,
    data_nascimento       date, -- YYYY-MM-DD
    endereco              varchar(100),
    bairro                varchar(50),
    telefone              varchar(20),
    profissao             varchar(50),
    cadastro              timestamp default current_timestamp,
    numero                varchar(10),
    complemento           varchar(60),
    cep                   varchar(10),
    naturalidade          varchar(50),
    nome_pai              varchar(50),
    nome_responsavel      varchar(50),
    nome_mae              varchar(50),
    nome_social           varchar(60),
    utilizar_nome_social  varchar(1) default 'N',
    religiao              varchar(50),
    orientacao_sexual     integer default 0, --  0 -HETEROSSEXUAL  1- HOMOSSEXUAL  2- BISSEXUAL 3- OUTRO
    constraint pkPacientes primary key (id_paciente)
);

create table fornecedor(
    idFornecedor integer not null  auto_increment,
    cnpj varchar(18) not null unique,
    f_nome varchar(70) not null,
    endereco varchar(100),
    numero integer,
    complemento varchar(200),
    bairro varchar(100),
    cidade varchar(30), --maior nome de cidade do brasil tem 29 caracteres
    uf char(2) not null,
    telefone varchar(14),
    constraint pk_fornecedor primary  key (idFornecedor);
);