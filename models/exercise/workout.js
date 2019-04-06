// ~~~Worry about breaking into seperate file later~~~
const mongoose = require(`mongoose`);

const resistanceSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 1, max: 10000, trim: true },
  sets: { type: Number, required: true, min: 1, max: 10000, trim: true },
  reps: {
    type: [Number],
    required: function() {
      return 1 || this.sets;
    },
    min: 0,
    max: 10000,
    trim: true
  },
  weight: {
    type: [Number],
    required: true,
    required: function() {
      return 1 || this.sets;
    },
    min: 0,
    max: 10000,
    trim: true
  }
});

const cardioSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  distance: {
    type: Number,
    required: function() {
      return !this.time; //only required if there is no time
    },
    min: 0,
    max: 10000,
    trim: true
  },
  time: {
    type: Number,
    required: function() {
      return !this.distance; //only required if there is no distance
    },
    min: 0,
    max: 10000,
    trim: true
  }
});

const workOutSchema = new mongoose.Schema({
  date: { type: String },
  week: { type: Number },
  user: { type: String },
  name: {
    type: String,
    min: 0,
    sparse: true,
    max: 250,
    trim: true
  },
  resistance: {
    type: [resistanceSchema],
    required: function() {
      return !this.cardio;
    }
  },
  cardio: {
    type: [cardioSchema],
    required: function() {
      return !this.resistance;
    }
  }
});

const WorkOut = mongoose.model("WorkOut", workOutSchema);

module.exports = WorkOut;
