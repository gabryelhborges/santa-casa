create table pacientes(
    pac_id int not null auto_increment,
    pac_cpf varchar(14) not null unique,
    pac_nome varchar(100),
    constraint pkPacientes primary key (pac_id)
);