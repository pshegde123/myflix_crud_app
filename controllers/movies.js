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

//READ - List all the movies
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

//READ -  List all the movies user has marked as favorite
router.get('/showFavorites', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Render the favorites view, passing in the user's favorite movies
    res.render('movies/favorites.ejs', {  
      user: req.session.user,
      favoriteMovies: currentUser.favoriteMovies
    });
  } 
  catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});


//CREATE - Add a movie to favorites 
router.get('/movie/:movieid/new', async (req, res) => {  
    res.send("Add to favorites - to be implemented");
  });

//READ - Load details for the given movieid
router.get('/movie/:movieid', async (req, res) => {    
      try{
        const {movieid} = req.params;
        const movieDetails = await fetchDetails(movieid);
        //console.log('logged in user = ', req.session.user);
        res.render('movies/show.ejs', {
          user: req.session.user,
          movie_details: movieDetails,
        })
      } catch (err) {
        console.error(err);   
      }
    });       

//POST - Add a movie to user's favorites
router.post('/movie/:movieid', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    //console.log("req.body:", req.body);
    currentUser.favoriteMovies.push(req.body);
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the movies index view
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
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
