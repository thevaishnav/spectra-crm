const mongoose = require('mongoose');
const Service = require('../models/Service');
const serviceMaster = require('../config/serviceMaster');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spectra_crm';

async function init() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany(serviceMaster);
    console.log('Service master initialized');
  } else {
    console.log('Service master already populated');
  }
  mongoose.disconnect();
}

init(); 