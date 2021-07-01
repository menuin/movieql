## DEVLOG 1

**명령어**

- npm install -g yarn

- yarn init
- yarn add graphql-yoga



### GraphQL로 해결할 수 있는 문제 (REST API의 문제)

1. **Over-fetching** : 나는 user의 이름에 대한 정보만 얻고 싶은데 /users 로 요청을 보내면 user에 관한 모든 정보가 들어옴 (불필요한)
2.  **Under-fetching** : 예를 들면 인스타그램에 접속했을 때 user 프로필을 보여주기 위해 /users 에 요청, 알림을 보여주기 위해 /notification 에 요청, 피드를 보여주기 위해 /feed 에 요청하는 세가지  요청과 응답이 오고가야 앱이 실행됨 (필요한 데이터를 받기 위해 한번 이상의 요청을 보냄)

📌 Graphql을 사용하면 하나의 query를 이용해 graphql backend로 부터 필요한 정보만을 가져올 수 있다. (기존 URL 구조는 사용되지 않음)

```
query : {
	feed {
		comments
		likes
	}
	notifications {
		isRead
	}
	user {
		username
		profilePic
	}
} 
// you will send this to the graphql backend
```



### GraphQL 서버 만들기

- 강의에선 typescript 문법을 사용하는 것으로 보임

  명령어 )

  yarn add typescript

  yarn add ts-node

  touch index.ts  (index.ts라는 파일 생성)

- package.json에서 "main" : "index.ts" 로 변경 (기존 index.js는 삭제해야 yarn start가 제대로 실행되는 듯함)

```ts
// index.ts

import { GraphQLServer } from "graphql-yoga";
// const graphqlserver = require("graphql-yoga"); 랑 같은 의미인 듯함

const server = new GraphQLServer( {
    
})

server.start(() => console.log("Graphql server running"));
```



### Schema 

- **description** of the data that you are going to get (or send)
- GraphQL 서버에 우리가 어떤 query 와 mutation 을 가졌는 지 **설명**하는 것
- this is only for graphQL

```js
// graphql/schema.graphql
// 사용자에 뭘 할지에 대해 정의
// 사용자가 할 수 있는 일은 다음과 같다
// 1. query : get data from db  2. mutation : mutate data in db 

type Query {
	name : String!   // ! means that answer is required
}
// when someone sends a query with a name "name", i'll send him a string
```

### Resolvers

- we need to actually **program** the functionality of this schema => **resolvers**

```js
// graphql/resolvers.js

const resolvers = {  // it resolves name query
    Query : {
        name : () => "Nicolas"  // function() { return "Nicolas" }
    }
} // when someone sends name query, answer with a function that returns "Nicolas"
```

```ts
// index.ts
import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolvers";

const server = new GraphQLServer( {
    typeDefs : "./graphql/schema.graphql",
    resolvers : resolvers // 이 줄에는 그냥 resolvers만 써도 됨
})

server.start(() => console.log("Graphql server running"));
```

- yarn start 로 서버 실행
- localhost:4000 으로 접속 => playground

❗ "./graphql/resolvers" 를 모듈로 인식하지 못하는 오류가 있었는데 require문으로 바꿔주고 resolvers.js 내에서 export default resolvers 대신 module.exports = resolvers를 써주니까 해결됨



### Extending Schema #1

```js
// resolvers.js

const nicolas = {
    name : "Nicolas",
    age :18,
    gener : "female"
}

const resolvers = {
    Query : {
        person : () => nicolas
    }
}

module.exports = resolvers;
```

```js
// schema.graphql

type nicolas {
    name : String!
    age : Int!
    gender : String!
}
    
type Query {
    person : nicolas!
}
```

- 이 경우 playground에서 person의 **원하는 정보**를 특정해서 요청해야 한다.

  ```
  query {
  	person {
  		gender
  		age
  	}
  }
  ```

  

### Extending Schema #2

```js
// schema.graphql

type Person {
    name : String!
    age : Int!
    gender : String!
}
    
type Query {
    people : [Person]!  // 다수의 Person을 보낸다는 뜻 (array를 리턴)
    person(id : Int! ) : Person  // 오직 한 Person에 id로 접근할 수 있다
                                 // 해당하는 person을 못찾을 수도 있기때문에 ! 없음
}
```

```js
// resolvers.js

// people array
const people = {
     1 = { // ID
        name : "Nicolas",
        age :18,
        gender : "male"
     },

     2 = {
         name : "Menuin",
         age : 23,
         gender : "female"
     }
}

const resolvers = {
    Query : {
        people : () => people
    }
}

module.exports = resolvers;
```

- playground에서 실행해보면 people array 중 이렇게 **원하는 정보**만 빼올 수 있음!

  ```
  query {
  	people {
  		name
  	}
  }
  
  // result
  "data" : {
  	{
  		"name" : "Nicolas"
  	},
  	{
  		"name" : "Menuin"
  	}
  }
  ```
  
  

📌 지금부터 people 목록을 db.js에 작성하고 외부에서 import하는 방식으로 사용 (데이터가 너무 커짐! )

```js
// graphql/db.js

const people = [
    {
      id: "0",
      name: "Nicolas",
      age: 18,
      gender: "female"
    },
    {
      id: "1",
      name: "Jisu",
      age: 18,
      gender: "female"
    },
    {
      id: "2",
      name: "Japan Guy",
      age: 18,
      gender: "male"
    },
    {
      id: "3",
      name: "Daal",
      age: 18,
      gender: "male"
    },
    {
      id: "4",
      name: "JD",
      age: 18,
      gender: "male"
    },
    {
      id: "5",
      name: "moondaddi",
      age: 18,
      gender: "male"
    },
    {
      id: "6",
      name: "flynn",
      age: 18,
      gender: "male"
    }
  ];


const getById = id => {
    const filteredPeople = people.filter(person => id === person.id)
    // find person(people) with the same id with the id that's given
    return filteredPeople[0]  // 찾은 people중 첫번째 person을 return
}
modules.export = people
```

```js
// resolvers.js
const people = require("./db.js");

const resolvers = {
    Query : {
        people : () => people
    }
};

module.exports = resolvers;
```

```js
// schema.graphql
type Person {
    id : Int!
    name : String!
    age : Int!
    gender : String!
}
    
type Query {
    people : [Person]!
    person(id:Int!) : Person
}
```



