
const movieFunction = require('./db.js');



const resolvers = {
    Query : {
        movies : (_,{limit, rating}) => movieFunction.getMovies(limit, rating),
       
    },
};

module.exports = resolvers;