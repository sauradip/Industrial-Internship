
// *************** Code Created By Sauradip Nag ******************

// This is a Sampe of Node.js Code / MongoDB Query Code

var _ = require('lodash-node');
var Resource = require('mongoose').model('Resource');
var Class = require('mongoose').model('ClassModel');
var Path = require('path');
var Restify = require('restify');
var ExceptionHandler = require(Path.join(__dirname, '..', 'service', 'util', 'exceptionHandler'));


exports.updateResourceDetails = function(req, res, next) {
    if(!req.body || !req.body.resId) {
        ExceptionHandler
            .invalidParam(res, 'Unauthorized request');
        next(false);
        return;
    }
    
    Resource.findOne({ _id: req.body.resId })
        .exec(function (err, resource) {
            if(err)
                return next(new Restify.errors.InternalServerError(err));
            
            if(resource.teacherId != req.userId) {
                ExceptionHandler
                    .invalidParam(res, 'Unauthorized request');
                next(false);
                return;
            } else {
                resource.title = req.body.title;
                resource.description = req.body.description;
                resource.tags = req.body.tags;
                resource.save(function(err, updatedResource) {
                    if(err)
                        return next(new Restify.errors.InternalServerError(err));
                    
                    res.status(200);
                    res.send(updatedResource);
                    next();
                });
            }
        });
};
