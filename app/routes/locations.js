'use strict';

var traceur = require('traceur');
var Location = traceur.require(__dirname + '/../models/location.js');

exports.index = (req, res)=>{
  Location.findAll(locations=>{
    res.render('locations/index', {locations: locations, title: 'Locations'});
  });
};

exports.new = (req, res)=>{
  res.render('locations/new', {title: 'Create a New Location'});
};

exports.create = (req, res)=>{
  Location.create(req.body, ()=>{
    res.redirect('/locations');
  });
};
