create table if not exists tabel1 (
  id serial primary key,
  title varchar(255),
  release_date varchar(255),
  poster_path varchar(900),
  overview varchar(100000),
  comment varchar(100000)
);

insert into tabel1 (title,poster_path,release_date,overview,comment) values ( 'hi all ','anywhere','its good movie','mohmmad','jadaan' )