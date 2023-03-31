const express = require('express');
const campsiteRouter = express.Router();
//To integrate mongoose schema "Campsite" model into express REST API drivers
const Campsite = require('../models/campsite');

campsiteRouter.route('/')
.get((req, res, next)=>{
    Campsite.find()
    .then(campsites=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json();
    })
    .catch(err=>next(err));
})
.post((req, res)=>{
    Campsite.create(req.body)
    .then(campsite=>{
        console.log('Campsite Created: ', campsite);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err=>next(err));
})
.put((req, res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next)=>{
    Campsite.deleteMany()
    .then(response=>{
        res.statusCode= 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err=>next(err));
});
//To use the client request from route.params.campsiteId property:
campsiteRouter.route('/:campsiteId')
.get((req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .then(campsite =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaion/json');
        res.json(campsite);
    })
    .catch(err=>next(err));
})
.post((req, res)=>{
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`)
})
.put((req, res, next)=>{
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, {new: true})
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaion/json');
        res.json(campsite);
    })
    .catch(err=>next(err));
})
.delete((req, res, next)=>{
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(respons=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resonse);
    })
    .catch(err=>next(err));
});

module.exports = campsiteRouter;