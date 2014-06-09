/* global describe, it, before, beforeEach */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var app = require('../../../app/app');
var request = require('supertest');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Location;

describe('locations', function(){

  before(function(done){
    db(function(){
      Location = traceur.require(__dirname + '/../../../app/models/location.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('locations').drop(function(){
      factory('location', function(locations){
        done();
      });
    });
  });

  describe('GET /locations/new', function(){
    it('should get the new locations web page', function(done){
      request(app)
      .get('/locations/new')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /locations', function(){
    it('should save a new location and redirect', function(done){
      request(app)
      .post('/locations')
      .send('name=mountains')
      .send('rate=55')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/locations');
        done();
      });
    });
  });

  describe('GET /locations', function(){
    it('should show all locations', function(done){
      request(app)
      .get('/locations')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('<div class="location"><p>Mountain</p><p>3.42</p></div><div class="location"><p>Lake</p><p>86.11</p></div><div class="location"><p>Ocean</p><p>56.39</p></div><div class="location"><p>Valley</p><p>98.22</p></div><div class="location"><p>Manhattan</p><p>100.55</p></div>');
        done();
      });
    });
  });
});
