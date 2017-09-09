
// **************** This Code is Created and Modified by Sauradip Nag *****************

// This is a Sample of Express.js Code


/* global __dirname */
var path = require('path');
var resource = require(path.join(__dirname, '..', 'controllers', 'resourceCtrl'));
var jwt = require(path.join(__dirname, '..', 'service', 'auth', 'jwt'));
var featureChecker = require(path.join(__dirname, '..', 'service', 'auth', 'featureChecker'));
var featureList = require(path.join(__dirname, '..', 'data', 'featureList'));

var presentationModel = require('mongoose').model('Presentation');
var classModel = require('mongoose').model('ClassModel');


module.exports = function (app) {
	    
 
    //Add resource
    app.post('/api/resource/uploadresource', jwt.validateToken,
            resource.uploadResource);
    
    //Remove resource
    app.post('/api/resource/removeresource', jwt.validateToken,
            resource.removeResource);
            
    //Get resource
    app.get('/api/resource/getresource', function (req, res, next) {
        jwt.validateToken (req, res, function () {
            featureChecker.hasAccessToFeature (req, res, req.userId, featureList.availableFeatures().ReadClass, 
                function(role) {
                    resource.getResource(req, res, role, next);
            });
        });
    });
    
    app.get('/api/resource/getresourcelist', jwt.validateToken,
            resource.getResourceList);
    
    app.post('/api/resource/addresourcetag', function (req, res, next) {
        jwt.validateToken (req, res, function() {
            featureChecker.hasAccessToFeature (req, res, req.userId, featureList.availableFeatures().WriteClass,
                function () {
                    resource.addResourceTag(req, res, next);
            });
        });
    });
    
    app.post('/api/resource/removeresourcetag', function (req, res, next) {
        jwt.validateToken (req, res, function() {
            featureChecker.hasAccessToFeature (req, res, req.userId, featureList.availableFeatures().WriteClass,
                function () {
                    resource.removeResourceTag(req, res, next);
            });
        });
    });
    
    app.post('/api/resource/updateresourcedetails', function (req, res, next) {
        jwt.validateToken (req, res, function() {
            featureChecker.hasAccessToFeature (req, res, req.userId, featureList.availableFeatures().WriteClass,
                function () {
                    resource.updateResourceDetails(req, res, next);
            });
        });
    });
}
