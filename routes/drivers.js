const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", function(req, res, next) {
  db.Driver
    .find({})
    .then(function(drivers) {
      res.render("drivers/index", { drivers });
    })
    .catch(function(err) {
      next(err);
    });
});

router.post("/", function(req, res, next) {
  db.Driver
    .create(req.body)
    .then(function() {
      res.redirect("/drivers");
    })
    .catch(function(err) {
      next(err);
    });
});

router.get("/new", function(req, res, next) {
  res.render("drivers/new");
});

router.get("/:id", function(req, res, next) {
  db.Driver.findById(req.params.id)
    .populate('cars')
    .then(function(driver) {
      res.render("drivers/show", {driver})
    })
    .catch(function(err) {
      next(err);
    });
});

router.get("/:id/edit", function(req, res, next) {
  db.Car
    .findById(req.params.id)
    .populate('driver')
    .then(function(car) {

      res.render(`drivers/${driver_id}/cars/${car.id}/edit`, { car });
    })
    .catch(function(err) {
      next(err);
    });
});

router.patch("/:id", function(req, res, next) {
  db.Driver
    .findByIdAndUpdate(req.params.id, req.body)
    .populate('cars')
    .then(function() {
      res.redirect("/drivers");
    })
    .catch(function(err) {
      next(err);
    });
});

router.delete("/:id", function(req, res, next) {
  db.Driver
    .findById(req.params.id)
    .then(function(driver){
      driver.remove().then(function() {
        res.redirect("/drivers");
      })
    })
    .catch(function(err) {
      next(err);
    });
});

module.exports = router;
