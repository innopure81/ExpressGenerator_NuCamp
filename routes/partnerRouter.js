const express = require('express');
const partnerRouter = express.Router();
//To implement Mongoose Partner model created in partnerSchema into Express REST API drivers
const Partner = require('../models/partner');
const authenticate = require('../authenticate');

partnerRouter.route('/')
.get((req, res, next)=>{
    Partner.find()
    .then(partners=>res.status(200).json(partners))
    .catch(err=>next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Partner.create(req.body)
    .then(partner=>res.status(201).json(partner)) //201 HTTP code: Created success status response code
    .catch(err=>next(err));
})
.put(authenticate.verifyUser, (req, res)=>{ 
    res.statusCode = 403; //Unallowed verb can be removed
    res.end('PUT operation not supported on /partners');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Partner.deleteMany()
    .then(partners => res.status(200).json(partners))
    .catch(err.next(err));
});
//To use the client request from route.params.partnerId property:
partnerRouter.route('/:partnerId')
.get((req, res, next)=>{
    Partner.findById(req.params.partnerId)
    .then(partner =>res.status(200).json(partner))
    .catch(err=>next(err));
})
.post(authenticate.verifyUser, (req, res)=>{
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`)
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Partner.findByIdAndUpdate(req.params.partnerId, req.body, {new: true}) //{$set:{name: "Ha"}}:for a query to update a specific field,{new: true}:To send back to the client w/ a new document  
    .then(partner => res.status(200).json(partner))
    .catch(err=>next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response=> res.status(200).json(response))
    .catch(err=>next(err));
});

module.exports = partnerRouter;

/*Before using mongoose Schema model "Partner" to interact w/ MongoDB database:
//https://mongoosejs.com/docs/queries.html

partnerRouter.route('/')
.all((req, res, next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=>{
    res.end('Will send all the partners to you');
})
.post((req, res)=>{
    res.end(`Will add the partner: ${req.body.name} with dexcription: ${req.body.description}`)
})
.put((req, res)=>{
    res. statusCode = 403;
    res.end('PUT operation not supported on /cmapsites');
})
delete((req, res)=>{
    res.end('Deleting all partners');
});

partnerRouter.route('/:partnerId')
.all((req, res, next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=>{
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
})
.post((req, res)=>{
    res.end(`POST operations not supported on /partners/${req.params.partnerId}`);
})
.put((req, res)=>{
    res.statusCode = 403;
    res.write(`Updating the campsite: ${req.params.partnerId}\n`);
    res.end(`Will update the partner: ${req.body.name} with description: ${req.body.description}`);
})
.delete((req, res)=>{
    res.end(`Deleting partner: ${req.params.partnerId}`);
})
*/

