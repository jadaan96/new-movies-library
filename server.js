

const express = require('express')

const cors = require('cors');
const axios = require('axios');
const app = express()

require('dotenv').config()
const datajson = require('./MovieData/datajson.json')

const pg = require('pg')

const PORT = process.env.PORT || 3005;
const client = new pg.Client(process.env.DBURL)


app.use(cors());
app.use(express.json())

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`i am ready to gooooooo ${PORT}`)

  })
})
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.get('/', mainData)
app.get('/favorite', favorites)

app.get('/trending', trending)
app.get('/search', searchFun)
app.get('/top_rated', topRated)
app.get('/upcoming', upcoming)
app.get('/getMovies', getMovies)
app.post('/getMovies', addMovies)
app.put('/UPDATE/:id', updateMovies)
app.delete('/delete/:id',deletMovie)
app.get('/getMovie/:id' , getMoviesById)

app.post('/addMovie',addMovieToWeb)
app.get('/addMovie',getMovieFromData)





async function trending(requast, respons) {
  console.log(Movie.all)
  movies = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.API}`)
  Movie.all =[]
  movies.data.results.map(items =>
    new Movie(items.id, items.title, items.release_date, items.poster_path, items.overview))
  respons.status(200).json(Movie.all)
}
function searchFun(req, res) {
  const searchQuery = req.query.search;
  console.log(req.query)
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API}&query=${searchQuery}`).then(result => {
    res.status(200).json({
      'code': 200,
      'movies': result.data.results
    })
  }).catch(err => {
    serverError(err, req, res,next)
  })
}

function topRated(req, res) {
  axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API}&language=en-US&page=1`).then(result => {
    res.status(200).json({
      'code': 200,
      'movies': result.data.results
    })
  }).catch(err => {
    serverError(err, req, res,next)
  })
}
function upcoming(req, res) {
  axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API}&language=en-US&page=1`).then(result => {
    res.status(200).json({
      'code': 200,
      'movies': result.data.results
    })
  }).catch(err => {
    serverError(err, req, res,next)
  })
}

function getMovies(req, res) {
  const sql = `select * from tabel1`
  client.query(sql).then(item => {
    res.json(item.rows)
  }).catch(err => {
    console.log(err)
    serverError(err, req, res)
  })
}
function addMovies(req, res) {
  const addingMovie = req.body
  const sql = `insert into tabel1 (title,release_date,poster_path,overview,comment) values ( $1,$2,$3,$4,$5) returning *`
  const theValues = [addingMovie.title,addingMovie.release_date, addingMovie.poster_path, addingMovie.overview,addingMovie.comment]
  client.query(sql, theValues).then(data => {
    res.json(data.rows)
  }).catch(err => {
    serverError(err, req, res,next)
  })
}
//
function updateMovies (req,res){
  const id = req.params.id;
  const newData= req.body;
  const sql = `update tabel1 set title=$1, release_date=$2, poster_path=$3,overview=$4,comment=$5 where id=${id} returning *`
  const newValues = [newData.title ,newData.release_date ,newData.poster_path ,newData.overview ,newData.comment]
  client.query(sql ,newValues).then(data =>{
    res.status(202).json(data.rows)
  })
}

function deletMovie (req,res){
  const id = req.params.id
  const sql =  `delete from tabel1 where id = ${id} `;
  client.query(sql).then(() =>{
    res.status(204).send('deleted')
  })
}
function getMoviesById (req,res){
  const id = req.params.id
  const sql = `select * from tabel1 where id= ${id}`
  client.query(sql).then(data =>{
    res.status(200).json(data.rows)
  })
}

function addMovieToWeb(req,res){
  const userinput = req.body
  
  console.log(req.body)
 

  const sql = `insert into movies (title,release_date,poster_path,overview,comment) values ( $1,$2,$3,$4,$5) returning *`
  const theValues = [userinput.title,userinput.release_date, userinput.poster_path, userinput.overview,userinput.comment]
  client.query(sql, theValues).then(data => {
    res.json(data.rows)
  }).catch(err => {
    console.log(err)
    serverError(err, req, res,next)
  })
}
function getMovieFromData (req,res){
  const sql = `select * from movies`
  client.query(sql).then(item => {
    res.json(item.rows)
  }).catch(err => {
    serverError(err, req, res)
  })
}


app.use(serverError)


function serverError(err, req, res,next) {
  res.status(500).json({
    "status": 500,
    "responseText": `Sorry, something went wrong ${err}`
  })
}

function favorites(requast, respons) {
  respons.status(201).send('Welcome to Favorite Page')
}

function mainData(requast, respons) {
  Movie.all =[]
  let movies = new Movie(datajson.title, datajson.poster_path, datajson.overview)
  respons.status(200).json(movies)
  console.log(movies)
  
}

app.get('*', pageNotfound)
function pageNotfound(requast, respons) {
  respons.status(404).json({
    'code': 404,
    'message': 'page Not found'
  })
}


function Movie(id, title, poster_path, release_date, overview) {
  this.id = id;
  this.title = title;
  this.poster_path = poster_path;
  this.release_date = release_date;
  this.overview = overview;
  Movie.all.push(this)

}

Movie.all = [];


