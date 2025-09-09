// controllers/movies.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

const User = require('../models/user.js');
const token = process.env.ACCESS_TOKEN; 

// Load data API from
const fetchMovies = async (page) => {    
    try {
      let result;     
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=4f59be08f8f326dbbcd0d07eab04829c&page=1&language=en-US')
        .then((response) => {         
          //console.log('response.data.results:', response.data.results);
          result = response.data.results;
        })
        .catch((error) => {          
          console.log(error);
        });
      return result;
    } catch (error) {      
      console.error(error);
    }
  };

const fetchDetails = async (movieid) => {    
    try {
      let result;
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieid}?api_key=4f59be08f8f326dbbcd0d07eab04829c&language=en-US`)
        .then((response) => {
          //console.log('movie details:', response.data);
          result = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      return result;
    } catch (error) {
      console.error(error);
    }
  };

router.get('/all', async (req, res) => {
  try {
        const {page} = req.query;
        const data = await fetchMovies(page);
        res.render('movies/index.ejs', {
          user: req.session.user,
          movies: data,          
        });
      } catch (err) {
        console.error(err);
      }
});

router.get('/movie/:movieid/new', async (req, res) => {  
    res.send("Add to favorites - to be implemented");
  });

router.get('/movie/:movieid', async (req, res) => {    
      try{
        const {movieid} = req.params;
        const movieDetails = await fetchDetails(movieid);
        res.render('movies/show.ejs', {
          user: req.session.user,
          movie_details: movieDetails,
        })
      } catch (err) {
        console.error(err);   
      }
    });       

module.exports = router;
