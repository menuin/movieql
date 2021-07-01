
const movieFunction = require('./db.js');



const resolvers = {
    Query : {
        movies : () => movieFunction.getMovies(),
        movie : (_, {id}) => movieFunction.getById(id)
    },

    Mutation : {
        addMovie: (_, {name, score}) => movieFunction.addMovie(name, score),
        deleteMovie : (_, {id}) => movieFunction.deleteMovie(id),
    }
};

module.exports = resolvers;