// implement your API here
const express = require('express');

const db = require('./data/db.js')

const server = express();
server.use(express.json())

server.get('/api/users', (request, response) => {
  db.find()
    .then(users => {
      response.status(200).json(users)
    })
    .catch(error => {
      response.status(500).json({ message: 'error getting list of the users'})
    })
})

server.get("/api/users/:id", async (request, response) => {
  const id = request.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        response.status(200).json(user)
      } else {
        response.status(404).json({ message: 'user not found' })
      }
    })
    .catch(error => {
      response.status(500).json({ message: 'error fetching user'})
    })
});

server.post("/api/users", async (request, response) => {
  const { name, bio } = request.body;

  if (!name || !bio) {
    response.status(400).send({
      errorMessage: "Please provide name and bio for the user."
    });
  } else {
    db.insert(request.body)
      .then(user => {
        response.status(201).json(user)
      })
      .catch(error => {
        response.status(500).json({ message: 'error creating new user'})
      })
    // try {
    //   const user = await db.insert(request.body);
    //   response.status(201).json(user);
    // } catch (err) {
    //   response.status(500).json({
    //     error: "There was an error while saving the user to the database."
    //   });
    // }
  }
});

server.delete("/api/users/:id", async (request, response) => {
  const id = request.params.id;

  db.remove(id)
    .then(user => {
      if (user) {
        response.status(200).json(user)
      } else {
        response.status(404).json({ message: 'user not found' })
      } 
    })
    .catch(error => {
      response.status(500).json({ message: 'error deleting the user'})
    })
});

const port = 8000;
server.listen(port, () => console.log('api running'))