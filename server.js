/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Armin Sharifiyan Student ID: 130891203 Date: 17 September 2021
 *  Heroku Link: https://hidden-gorge-64232.herokuapp.com/
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const RestaurantDB = require("./modules/restaurantDB");
const db = new RestaurantDB();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

//API ROUTES
app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurant(req.body)
    .then(() => {
      res.status(201).json("New data Added successfully");
    })
    .catch((err) => {
      res.status(500).json("error " + err);
    });
});

app.get("/api/restaurants", (req, res) => {
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((data) => {
      if (data) {
        res.status(201).json(data);
      } else {
        res.status(404).json({ message: "id not found" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.get("/api/restaurants/:id", (req, res) => {
  db.getRestaurantById(req.params.id)
    .then((data) => {
      if (data) {
        res.status(201).json(data);
      } else {
        res.status(404).json({ message: "id not found" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.put("/api/restaurants/:id", (req, res) => {
  db.updateRestaurantById(req.body, req.params.id)
    .then(() => {
      res.status(201).json(`Updating ${req.params.id} done`);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
app.delete("/api/restaurants/:id", (req, res) => {
  db.deleteRestaurantById(req.params.id)
    .then(() => {
      res.status(202).json("Done!"); //status 202 is accepted which means that the request is confirmed but not completely.
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//----------app initialize---------
db.initialize(
  "mongodb+srv://dbuser1:dbuser@cluster0.avgax.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
)
  .then(() => {
    console.log("done");
    app.listen(HTTP_PORT, () => {
      console.log("Server is ready on PORT " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
