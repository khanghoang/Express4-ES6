# Express 4 with ES6 [![Build Status](https://travis-ci.org/khanghoang/Express4-ES6.svg?branch=master)](https://travis-ci.org/khanghoang/Express4-ES6)

## At first glance
I always ask myself "can I really do TDD?", this project is ~~a challenge~~ an answer that I CAN do TDD in NodeJS (Express).
## How can I run this project?
#### To start the server:
Run 'gulp' command in the project folder
#### To run test, test coverage, lint, etc...
To run test
 - 'npm run test' to run test full the project.
 - 'npm run test-co' to run test coverage.
 - 'npm run lint' to lint the project.  

## Well, this project is interesting, how can I contribute for it?
This project was created to be the skeleton of my future apps, so feel free to grab whatever parts of code that fits you.  
PRs, feature requests and posting issues are also welcome.  

##GraplQL support
###Example with pagination
```javascript```
http://localhost:3000/graphql?q={viewer{designs(first:5,after:%22Y29ubmVjdGlvbi41NjJhNzNiOWFmOGM1MjM2YThkOGM0MTA=%22){count,edges{node{_id,%20imageURL}},pageInfo{startCursor,endCursor,hasPreviousPage,hasNextPage}}}}
```
###Normal request
Get ```imageURL``` and ```_id``` from ```Design``` models
```javascript```
http://localhost:3000/graphql?q={designs{_id,imageURL}}
```
