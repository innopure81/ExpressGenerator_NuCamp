const express = require('express');
const promotionRouter = express.Router();
//To implement Mongoose promotion model created in promotionSchema into Express REST API drivers
const Promotion = require('../models/promotion.js');

promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotions => res.status(200).json(promotions))
    .catch(err => next(err));
})
.post((req, res, next)=>{
    Promotion.create(req.body)
    .then(promotion=> res.status(201).json(promotion))//201 HTTP code: Created success status response code
    .catch(err=>next(err));
})
.put((req, res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next)=>{
    Promotion.deleteMany()
    .then(response=> res.status(200).json(response))
    .catch(err=>next(err));
});
//To use the client request from route.params.promotionId property:
promotionRouter.route('/:promotionId')
.get((req, res, next)=>{
    Promotion.findById(req.params.promotionId)
    .then(promotion => res.status(200).json(promotion))
    .catch(err=>next(err));
})
.post((req, res)=>{
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`)
})
.put((req, res, next)=>{
    Promotion.findByIdAndUpdate(req.params.promotionId, req.body, {new: true})//{$set:{name: "Ha"}}:for a query to update a specific field,{new: true}:To send the client a new document back
    .then(promotion => res.status(200).json(promotion))
    .catch(err=>next(err));
})
.delete((req, res, next)=>{
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response=> res.status(200).json(response))
    .catch(err=>next(err));
});

module.exports = promotionRouter;


/* Before using mongoose Schema model "Promotion" to interact w/ MongoDB database:
//https://mongoosejs.com/docs/queries.html

promotionRouter.route('/')
.all((req, res, next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=>{
    res.end('Will send all the promotions to you');
})
.post((req, res)=>{
    res.end(`Will add the promotion: ${req.body.name} with dexcription: ${req.body.description}`)
})
.put((req, res)=>{
    res. statusCode = 403;
    res.end('PUT operation not supported on /cmapsites');
})
delete((req, res)=>{
    res.end('Deleting all promotions');
});

promotionRouter.route('/:promotionId')
.all((req, res, next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=>{
    res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
})
.post((req, res)=>{
    res.end(`POST operations not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res)=>{
    res.statusCode = 403;
    res.write(`Updating the cmapsite: ${req.params.promotionId}\n`);
    res.end(`Will update the promotion: ${req.body.name} with description: ${req.body.description}`);
})
.delete((req, res)=>{
    res.end(`Deleting promotion: ${req.params.promotionId}`);
})
*/
