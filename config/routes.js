var Appointment = require('../models/appointment.js');
var fs = require('fs');
var Handlebars = require('handlebars');

module.exports = function( io ){
   return [
	{
	    method: 'GET',
	    path:'/', 
	    handler: function (request, reply) {
	       reply.view('index');
	    }
	},
	{
	    method: 'GET',
	    path:'/{id}', 
	    handler: function (request, reply) {
	      Appointment.findOne({ _id: request.params.id }, function(err, apt) {
		if (err) {
		  reply(err);
		  return;
		}
		apt.requests = apt.requests.reverse()
		apt.host = request.info.host;
		reply.view('show', {data: apt});
	      });
	    }
	},
	{
	  method: 'GET',
	  path:'/public/{path*}',
	  handler: {
	    directory: {
	      path: "./public",
	      listing: false,
	      index: false
	    }
	  }
	},
	{
	    method: 'GET',
	    path:'/appointments/create', 
	    handler: function (req, res) {
	      var apt = new Appointment({
	        createdAt: new Date()
	      })
	      apt.save(function( err, apt ){
		if( err ) {
		  res( err );
		  return;
		}
		res.redirect('/'+ apt._id );
	      })
	    }
	},
	{
	  method: 'POST',
	  path: '/{id}',
	  handler: function( req, res ){
	    Appointment.findOne({_id: req.params.id}, function( err, apt ){
	      if( err ) {
		res( err );
	        return;
	      }
	      var request = {
			headers: req.headers, 
			payload: req.payload,
			createdAt: new Date().toISOString(),
	        id: apt._id,
	      }
	      apt.requests.push( request );
	      apt.save();
	      fs.readFile('views/request.html', 'utf8', function (err,data) {
		if (err) {
		  return console.log(err);
		}
		var template = Handlebars.compile(data);
		var r = template( request );
		io.sockets.emit('request', r );
	      });
	      res( request )
	    })
	  }
	},

	{
	  method: 'PUT',
	  path: '/{id}',
	  handler: function( req, res ){
	    Appointment.findOne({_id: req.params.id}, function( err, apt ){
	      if( err ) {
		res( err );
	        return;
	      }
	      var request = {
			headers: req.headers, 
	                method: "PUT",
			payload: req.payload,
			createdAt: new Date().toISOString(),
	        id: apt._id,
	      }
	      apt.requests.push( request );
	      apt.save();
	      fs.readFile('views/request.html', 'utf8', function (err,data) {
		if (err) {
		  return console.log(err);
		}
		var template = Handlebars.compile(data);
		var r = template( request );
		io.sockets.emit('request', r );
	      });
	      res( request )
	    })
	  }
	},
	{
	  method: 'PATCH',
	  path: '/{id}',
	  handler: function( req, res ){
	    Appointment.findOne({_id: req.params.id}, function( err, apt ){
	      if( err ) {
		res( err );
	        return;
	      }
	      var request = {
			headers: req.headers, 
	                method: "PATCH",
			payload: req.payload,
			createdAt: new Date().toISOString(),
	        id: apt._id,
	      }
	      apt.requests.push( request );
	      apt.save();
	      fs.readFile('views/request.html', 'utf8', function (err,data) {
		if (err) {
		  return console.log(err);
		}
		var template = Handlebars.compile(data);
		var r = template( request );
		io.sockets.emit('request', r );
	      });
	      res( request )
	    })
	  }
	},
	{
	  method: 'DELETE',
	  path: '/{id}',
	  handler: function( req, res ){
	    Appointment.findOne({_id: req.params.id}, function( err, apt ){
	      if( err ) {
		res( err );
	        return;
	      }
	      var request = {
			headers: req.headers, 
	                method: "DELETE",
			payload: req.payload,
			createdAt: new Date().toISOString(),
	        id: apt._id,
	      }
	      apt.requests.push( request );
	      apt.save();
	      fs.readFile('views/request.html', 'utf8', function (err,data) {
		if (err) {
		  return console.log(err);
		}
		var template = Handlebars.compile(data);
		var r = template( request );
		io.sockets.emit('request', r );
	      });
	      res( request )
	    })
	  }
	}
]
}