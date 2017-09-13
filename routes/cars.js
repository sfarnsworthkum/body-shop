const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../models");

// GET -> /drivers/:driver_id/cars
router.get("/", function(req, res, next) {
  db.Driver
    .findById(req.params.driver_id)
    .populate("cars")
    .then(function(driver) {
      res.render("cars/index", { driver });
    })
    .catch(function(err) {
      next(err);
    });
});

// POST -> /drivers/:driver_id/cars
router.post("/", function(req, res, next) {
  // I need to make a car
  const newCar = Object.assign({}, req.body, { driver: req.params.driver_id });
  db.Car
    .create(newCar)
    .then(function(car) {
      // I need to then tell the driver about the car I made
      db.Driver.findById(req.params.driver_id).then(function(driver) {
        driver.cars.push(car);
        driver.save().then(function() {
          res.redirect(`/drivers/${driver.id}/cars`);
        });
      });
    })
    .catch(function(err) {
      next(err);
    });
});

router.get("/new", function(req, res, next) {
  db.Driver
    .findById(req.params.driver_id)
    .then(function(driver) {
      res.render("cars/new", { driver });
    })
    .catch(function(err) {
      next(err);
    });
});

router.get("/:id", function(req, res, next) {
  
  db.Car
    .findById(req.params.id)
    .then(function(car) {
      res.render(`cars/show`, { car });
    })
    .catch(function(err) {
      next(err);
    });
});

router.get("/:id/edit", function(req, res, next) {
  db.Car
    .findById(req.params.id)
    .then(function(car) {
      res.render(`cars/edit`, { car });
    })
    .catch(function(err) {
      next(err);
    });
});

router.patch("/:id", function(req, res, next) {
  db.Car
    .findByIdAndUpdate(req.params.id, req.body)
    .then(function(car) {
      res.redirect(`/drivers/${req.params.driver_id}/cars`);
    })
    .catch(function(err) {
      next(err);
    });
});

router.delete("/:id", function(req, res, next) {
  db.Car
    .findByIdAndRemove(req.params.id)
    .then(function() {
      res.redirect(`/drivers/${req.params.driver_id}/cars`);
    })
    .catch(function(err) {
      next(err);
    });
});

module.exports = router;
