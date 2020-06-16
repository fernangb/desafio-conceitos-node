const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request,response, next){
  const {method, url} = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function validateRepositoryId(request, response, next){
  const {id} = request.params;

  if(!isUuid()){
      return response.status(400).json({error: 'This is an invalid ID'});
  }
  
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, owner, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    owner,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, owner, techs} = request.body;
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex<0){
      return response.status(400).json({error: "Invalid repository"});
  }

  const repository = {
      id,
      title,
      owner,
      techs,
      likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex<0){
      return response.status(400).json({error: "Invalid repository"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex<0){
      return response.status(400).json({error: "Invalid repository"});
  }

  const repository = {
    id,
    title: repositories[repositoryIndex].title,
    owner: repositories[repositoryIndex].owner,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes + 1,   
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});


module.exports = app;
