/* global describe, it, before, beforeEach, afterEach */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var app = require('../../../app/app');
var request = require('supertest');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var cp = require('child_process');

var Floor;

describe('floors', function(){

  before(function(done){
    db(function(){
      Floor = traceur.require(__dirname + '/../../../app/models/floor.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('floors').drop(function(){
      cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        factory('floor', function(floors){
          done();
        });
      });
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('GET /floors/new', function(){
    it('should get the new floors web page', function(done){
      request(app)
      .get('/floors/new')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /floors', function(){
    it('should save a new floor and redirect', function(done){
      request(app)
      .post('/floors')
      .field('name', 'tile')
      .field('rate', '5')
      .attach('photo', __dirname + '/../../fixtures/copy/tile1-DELETE.png') //this is for files
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/floors');
        done();
      });
    });
  });

  describe('GET /floors', function(){
    it('should show all floors', function(done){
      request(app)
      .get('/floors')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('<div class="floors"><p>cement</p><p>4</p></div><div class="floors"><p>water</p><p>5</p></div>');
        done();
      });
    });
  });
});
