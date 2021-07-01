## DEVLOG 3

### Wrapping REST API with GraphQL

- YTS API 사용 (토렌트에서 사용됨) 
- yarn add node-fetch

```js
// db.js

const API_URL = "https://yts.mx/api/v2/list_movies.json?"
const fetch = require("node-fetch");

const getMovies = (limit, rating) => {

  let REQUEST_URL = API_URL;
  if (limit > 0 ){
    REQUEST_URL += `limit=${limit}`;
  }

  if(rating > 0) {
    REQUEST_URL += `&minimum_rating=${rating}`;
    console.log(REQUEST_URL);
  }

  return fetch(`${REQUEST_URL}`)
          .then(res => res.json())
          .then(json => json.data.movies);
}

module.exports = {getMovies};
```



