// bring in dependencies
const mongoose = require("mongoose");
const db =require("./")
// create a schema

const driverSchema = new mongoose.Schema({
  name: String,
  age: Number,
  cars: [
    {
      ref: "Car",
      type: mongoose.Schema.Types.ObjectId
    }
  ]
});

driverSchema.pre('remove', function(next){
	db.Car.remove({driver: this._id}).then(function() {
		console.log("removing cars")
		next()
	})
})
// create a model
const Driver = mongoose.model("Driver", driverSchema);

// export the model
module.exports = Driver;
