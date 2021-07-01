## DEVLOG 2

오랜만에 들으니까 기억이 안나서 로그를 하나 더 만든다

- **정리** : graphQL resolvers는 graphql 서버에서 요청을 받음. graphql 서버가 schema에서 query나 mutation의 정의를 발견하면, resolver를 찾을 것이고 거기 적혀있는 함수를 실행

- **graphQL의 요점** : 1. operation에서 데이터가 어떻게 보일지 정의하고 / 2. operation을 resolve(해결)하는 함수를 만드는 것

- 잠깐 기존코드 수정

  ```js
  const getById = id => {
      console.log(id);
      const filteredPeople = people.filter(person => String(id) === person.id) // person의 id값이 string으로 되어있기 때문에 String(id) 로 비교
      return filteredPeople[0]  
  }
  ```

  

### argument와 함께 resolver 요청하기

```js
// resolvers.js

const resolvers = {
    Query : {
        people : () => people,
        person : (_, { id }) => getById(id)  // argument 전달, _는 현재 object를 보내는 object (root라고 쓰기도 함)
    }
};
```

📌 { id } 로 보내야 함! 그냥 id라고 보내면 getById() 내에서 console.log(id)를 찍었을 때 { id : 1 } 이런식으로 출력됨 (parameter로 보낼 때 (id:1) 이런식으로 보내기 때문)

```
// input
{
  person(id:1){  // 
    name
  }
}

// output : id=1 에 해당하는 person의 이름만 출력
  "data": {
    "person": {
      "name": "Jisu"
    }
  }
```

📌 이 접근법은 REST, EXPRESS, DJANGO 보다 훨씬 낫다. URL은 파라미터가 필요하고 form data, parsing body.. 등등 귀찮기 때문

📌 Resolvers can be anything : 다른 api, database 등등



#### 이제 Movie로 수정 & 함수 추가 & Mutation 추가(deleteMovie, addMovie)

- **Mutation** : 데이터베이스의 상태가 변할 때 사용 - 업데이트, 삭제, 생성
- export/import 하는데 혼동이 있어서 수정함 (강의에선 ES6 사용하는데 나는 기존? 자바스크립트 사용함 후에 ES6로 업데이트 필요할듯함)

```js
// db.js
 let movies = [  // deleteMovies() 가 movies를 바꿔야하니까 상수선언 안됨 (let으로  수정)
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
    const filteredMovies = movies.filter(movie => String(id) === movie.id)
    return filteredMovies[0]  
}

const getMovies = () => movies;

const deleteMovie = id => { 
  const cleanedMovies = movies.filter(movie => movie.id !== String(id));
  if (movies.length > cleanedMovies.length) {
    movies = cleanedMovies;
    return true;
  } else {
    return false;
  }
} // 지우고자 하는 MOVIE의 ID와 다른 ID를 가진 MOVIE들을 filter해서 기존 movies array를 대체

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
  } // 수정 : 한번에 export
```

```js
// resolvers.js

const movieFunction = require("./db.js");  // 수정 : 하나의 function? class?로 import

const resolvers = {
    Query : {
        movies : () => movieFunction.getMovies(), // 수정 : 이런식으로 사용
        movie : (_, {id}) => movieFunction.getById(id)
    },

    Mutation : {  // Mutation 추가
        addMovie: (_, {name, score}) => movieFunction.addMovie(name, score),
        deleteMovie : (_, {id}) => movieFunction.deleteMovie(id)
    }
};

module.exports = resolvers;
```

```js
// schema.graphql
type Movie {
    id : String!
    name : String!
    score : Int!
}
    
type Query {
    movies : [Movie]!
    movie(id:Int!) : Movie!
}

type Mutation {
    addMovie(name:Strng!, score : Int!) : Movie!
    deleteMovie(id:Int!) : Boolean! // true, false 값 return
    
}
```



📌 playground에서 schema 탭을 열면 내가 어떤 function을 가지고 있고 어떤 return 값이 있어야 하는 지 알 수 있음(완벽하게 api에 대해 확인하는 것) << 장고나 rest api에선 없어!

📌  어떤 backend에도 graphql을 적용할 수 있다 (그 중 하나는 다른 api(rest api))

```js
// playground
mutation {
	addMovie(name : "In the Heights", score:9){
    name
  }
} // 이거 하고 다시 movies 찍어보면 추가되어있음!

mutation {
	deleteMovie(id:4) // name 등 하위 항목?을 선택할 필요 없음
}
```

