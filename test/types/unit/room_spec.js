/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Building;
var Room;

describe('Room', function(){
  before(function(done){
    db(function(){
      Building = traceur.require(__dirname + '/../../../app/models/building.js');
      Room = traceur.require(__dirname + '/../../../app/models/room.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('buildings').drop(function(){
      factory('building', function(buildings){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should create a Room', function(done){
      Room.create({name:'living room', begin: {x:0, y:50}, end: {x:50, y:100}, floorId:'b123456789abcdef01234568', buildingId:'c123456789abcdef01234567'}, function(building){
        var room = building.rooms[0];
        expect(room).to.be.instanceof(Room);
        expect(room.name).to.equal('living room');
        expect(room.begin.x).to.deep.equal(0);
        expect(room.begin.y).to.deep.equal(50);
        expect(room.end.x).to.deep.equal(50);
        expect(room.end.y).to.deep.equal(100);
        expect(room.floorId).to.deep.equal(Mongo.ObjectID('b123456789abcdef01234568'));
        done();
      });
    });
  });
});
