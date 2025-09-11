// controllers/movies.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

const User = require('../models/user.js');
const token = process.env.ACCESS_TOKEN; 
const url = 'https://api.themoviedb.org/3/discover/movie?api_key=4f59be08f8f326dbbcd0d07eab04829c&certification=PG&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&vote_average.gte=8&with_original_language=en&page=1';
//const url = 'https://api.themoviedb.org/3/movie/popular?api_key=4f59be08f8f326dbbcd0d07eab04829c&page=1&language=en-US'

// Load data API from
const fetchMovies = async (page) => {    
    try {
      let result;     
      const response = await axios.get(url)
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
          //console.log('fetchdetails(), movie details:', response.data);
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
    //console.log("Favorite movies = ",currentUser.favoriteMovies);

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
        //console.log('show.ejs, movie details = ', movieDetails);

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
    console.log("req.body xxx:", req.body);
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

//DELETE - Remove a movie from user's favorites
router.delete('/movie/:movieId', async (req, res) => {   
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete
    // a favorite movie using the id supplied from req.params
    currentUser.favoriteMovies.id(req.params.movieId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the foods index view
    res.redirect(`/movies/showFavorites`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});
router.get('/movie/:movieId/edit', async (req, res) => {  
  try {
    const currentUser = await User.findById(req.session.user._id);
    const movie = currentUser.favoriteMovies.id(req.params.movieId);
    res.render('movies/edit.ejs',{
      user: req.session.user,
      movie
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});   
router.put('/movie/:movieId', async (req, res) => {
  try {
    // Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the current pantry item from the id supplied by req.params
    const movie = currentUser.favoriteMovies.id(req.params.movieId);
    // Update the pantry item with the new data from the form
    movie.set(req.body);
    // Save the current user
    await currentUser.save();
    // Redirect back to the foods index view
    res.redirect(`/movies/showFavorites`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
