-- drop database santa_casa;
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

create table funcionarios(
    idFuncionario       integer not null auto_increment,
    nome_funcionario    varchar(60) not null,
    farmaceutico        varchar(1),
    coren               varchar(14),
    cpf                 varchar(14) not null unique,
    telefone_funcionario varchar(20),
    constraint pfFuncionario primary key (idFuncionario)
);

create table fabricante(
    idFabricante integer not null  auto_increment,
    cnpj varchar(18) not null unique,
    f_nome varchar(70) not null,
    endereco varchar(100),
    numero integer,
    complemento varchar(200),
    bairro varchar(100),
    cidade varchar(30), -- maior nome de cidade do brasil tem 29 caracteres
    uf char(2) not null,
    telefone varchar(20),
    constraint pk_fabricante primary  key (idFabricante)
);

create table produtos(
    prod_ID integer not null,
    Fabricante_idFabricante integer not null,
    nome varchar(45) not null,
    psicotropico varchar(1) not null,
    valor_custo decimal(5,2) not null,
    ultima_compra date,
    ultima_saida date,
    observacao varchar(300),
    descricao_uso varchar(300) not null,
    quantidade_total integer not null,
    tipo varchar(50) not null,
    constraint pk_prod primary key (prod_ID),
    constraint fk_pf foreign key (Fabricante_idFabricante) references fabricante(idFabricante)
);

create table unidade(
    un_cod integer not null auto_increment,
    unidade varchar(30) not null, -- ml, comprimido, 
    constraint pk_un primary key (un_cod)
);

create table nomefarmacologico(
    far_cod integer not null auto_increment,
    nome_far varchar(70) not null, -- novalgina = diporona
    constraint pk_far primary key (far_cod)
);

create table formafarmaceutica(
    ffa_cod integer not null auto_increment,
    forma varchar(40) not null, -- solução oral, comprimido, capsula, dragea 
    constraint pk_ffa primary key(ffa_cod)
);

create table lote(
    codigo varchar(15) not null,
    data_validade date not null,
    quantidade integer not null,
    produto_prod_ID integer not null,
    formafarmaceutica_ffa_cod integer  not null,
    conteudo_frasco integer not null,
    unidade_un_cod integer not null,
    total_conteudo integer not null,
    constraint pk_codigo primary key (codigo),
    constraint fk_prod_ID  foreign key (produto_prod_ID) references produtos(prod_ID), 
    constraint fk_ffa_cod foreign key (formafarmaceutica_ffa_cod) references formafarmaceutica(ffa_cod),  
    constraint fk_un_cod foreign key (unidade_un_cod) references unidade(un_cod)
);

-- insert nos pacientes
insert into pacientes values(1,'526.217.888-07','Leon B Ronchi', 'branco','s','m','2004-02-07','Rua Monsenhor Nakamura','Parque dos Orixás','(18) 98106-9187','estudante',null,'1146','Não há complemento','19160-000','Brasileiro','Sergio','Geovanna','Marcia','Solange','S','Ateu',3);
insert into pacientes values(2,'999.999.999-99','Fulano da Silva Sauro','pardo','c','m','1997-10-13','Rua tal','Bairro X','(99) 99998-9999','marceneiro',null,'9999','complemento X','00000-000','Testeiro','Fulanão','Fulaninho','Fulanona','Robson','N','Catolico',3);
insert into pacientes values(null,'396.354.698-02','Yago Akio', 'preto','v','f','1500-02-28','Rua do arco-iris','Bairro do unicornio','(69) 96969-6969','Garoto de Programa',null,'69','Complemento A','12345-123','Japonês','Ricardo','Gabryel H Borges','Liria','Suzane Von Richthofen','S','Petista',3);
-- select * from pacientes;

-- insert nos funcionários
insert into funcionarios values(null, 'Gabryel H Borges', 'S','','478.067.288-05','(18) 99808-2343');
insert into funcionarios values(null, 'Aglae Pereira Zaupa','N','SP-12345-6','069.916.188-61','(11) 95555-5999');
insert into funcionarios values(null, 'Gabriel Carrocini', 'N','','999.999.999-99','(18) 10101-0011');
--  * from funcionarios;


-- insert nos fabricantes
insert into fabricante values(null, '54.516.661/0001-01','Johnson & Johnson','Av. Pres. Juscelino Kubitschek',2041,'','Vila Nova Conceição','São Paulo','SP','0800 703 6363');
insert into fabricante values(null, '56.994.502/0001-30','Novartis','Av. Professor Vicente Rao',90,'','Cidade Monções','Sao Paulo','SP','0800 020 7758');
insert into fabricante values(null, '33.009.945/0001-23','Roche','R. Dr. Rubens Gomes Bueno',691,'','Santo Amaro','Sao Paulo','SP','0800 772 0295');
insert into fabricante values(null, '61.072.393/0001-33','Pfizer','R. Alexandre Dumas',1860,'','Santo Amaro','Sao Paulo','SP','(11) 5185-8500');
insert into fabricante values(null, '02.685.377/0001-57','Sanofi', 'Av. das Nações Unidas',14401,'Zona Sul','Chácara Santo Antônio', 'Sao Paulo', 'SP', '(11) 2889-3800');
insert into fabricante values(null, '33.069.212/0001-84','Merck', 'Av. das Nações Unidas',12995,'30 andar','Pinheiros','Sao Paulo', 'SP', '(11) 3346-8507');
insert into fabricante values(null, '33.247.743/0001-10','GSK (GlaxoSmithKline)','R. Carneiro da Cunha',303,'','Vila da Saúde','Sao Paulo','SP','(11) 2276-2183');
insert into fabricante values(null, '60.318.797/0001-00','AstraZeneca','Rodovia Raposo Tavares',0,'KM 26.9 S/N','Moinho Velho','Cotia', 'SP', '(11) 3737-1200');
insert into fabricante values(null, '18.459.628/0001-15','Bayer','R. Domingos Jorge',1100,'','Vila Socorro','Sao Paulo', 'SP','(11) 5694-5166');
insert into fabricante values(null, '15.670.288/0002-60','Gilead Sciences','Av. Dr. Chucri Zaidan',1240,'','Morumbi', 'Sao Paulo', 'SP','0800 771 0744');
-- select * from fabricante;

-- insert nas unidades
insert into unidade values(null,'Grama(g)');
insert into unidade values(null,'mililitro(ml)');
insert into unidade values(null,'gotas(gt)');
insert into unidade values(null,'Unidade Internacional(UI)');
-- select * from unidade;

-- insert nas formas farmacêuticas
insert into formafarmaceutica values(null,'comprimido');
insert into formafarmaceutica values(null,'cápsula');
insert into formafarmaceutica values(null,'drágea');
insert into formafarmaceutica values(null,'pastilha');
insert into formafarmaceutica values(null,'supositório');
insert into formafarmaceutica values(null,'pomada');
insert into formafarmaceutica values(null,'gel');
insert into formafarmaceutica values(null,'creme');
insert into formafarmaceutica values(null,'xarope');
insert into formafarmaceutica values(null,'gota');
insert into formafarmaceutica values(null,'solução nasal');
insert into formafarmaceutica values(null,'oftálmica');
insert into formafarmaceutica values(null,'injetável');
insert into formafarmaceutica values(null,'spray');
insert into formafarmaceutica values(null,'aerossol');
-- select * from formafarmaceutica;