var buildingCollection = global.nss.db.collection('buildings');
var traceur = require('traceur');
var Building = traceur.require(__dirname + '/building.js');
var Mongo = require('mongodb');

class Room{
  static create(obj, fn){
    Building.findById(obj.buildingId, building=>{
      var room = new Room();
      room.name = obj.name;
      room.begin = {};
      room.end ={};
      room.begin.x = parseInt(obj.begin.x);
      room.begin.y = parseInt(obj.begin.y);
      room.end.x = parseInt(obj.end.x);
      room.end.y = parseInt(obj.end.y);
      room.floorId = Mongo.ObjectID(obj.floorId);
      building.rooms.push(room);
      buildingCollection.update({_id:building._id}, {$push:{rooms:room}}, ()=>fn(building));
    });
  }
}

  module.exports = Room;
