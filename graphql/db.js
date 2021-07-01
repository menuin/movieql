 let movies = [
    {
      id: "0",
      name: "Iron Man",
      score : 9
    },
    {
      id: "1",
      name: "Thor",
      score : 8

    },
    {
      id: "2",
      name: "Loki",
      score : 7

    },
    {
      id: "3",
      name: "The Avengers",
      score : 10

    }   
  ];

const getById = id => {

  console.log(id);
  const filteredMovies = movies.filter(movie => String(id) === movie.id)
  return filteredMovies[0]  
}

const getMovies = () => {
  return movies;
}

const deleteMovie = id => {
  const cleanedMovies = movies.filter(movie => movie.id !== String(id));
  if (movies.length > cleanedMovies.length) {
    movies = cleanedMovies;
    return true;
  } else {
    return false;
  }
}

const addMovie = (name, score) => {
  const newMovie = {
    id : `${movies.length + 1}`,
    name,
    score
  };
  movies.push(newMovie);
  return newMovie;
}


  module.exports = {
    getMovies, getById, deleteMovie, addMovie
  }

