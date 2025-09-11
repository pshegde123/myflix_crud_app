const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,   
  },
  poster_path:{
    type: String,
  },  
  vote_average:{
    type: Number,
  },
  notes:{
    type: String,
  }
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteMovies: [movieSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;