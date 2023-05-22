create table if not exists tabel1 (
  id serial primary key,
  title varchar(255),
  release_date varchar(255),
  poster_path varchar(900),
  overview varchar(100000),
  comment varchar(100000)
);


create table if not exists movies (
  id serial primary key,
  title varchar(255),
  release_date varchar(255),
  poster_path varchar(900),
  overview varchar(100000),
  comment varchar(100000) 
);
create table if not exists web (
  id serial primary key,
  movie_id integer ,
  title varchar(255),
  release_date varchar(255),
  poster_path varchar(900),
  overview varchar(100000),
  comment varchar(100000) 
);