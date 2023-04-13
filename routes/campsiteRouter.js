const express = require('express');
const campsiteRouter = express.Router();
//To integrate mongoose schema "Campsite" model into express REST API drivers
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');
const cors = require('./cors');

campsiteRouter.route('/')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200))//pre-flight request and check available options such as Access-Control-Allow-Origin and Access-Control-Allow-Methods.
.get(cors.cors, (req, res, next)=>{
    Campsite.find() 
    .populate('campsites.comments.author') //<== Mongoose Population: req.body.author = req.user._id; campsite.comments.push(req.body);
    .then(campsites=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);
    })
    .catch(err=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Campsite.create(req.body)
    .then(campsite=>{
        console.log('Campsite Created: ', campsite);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
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
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200))
.get(cors.cors, (req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .populate('campsites.comments.author') //<== req.body.author = req.user._id; campsite.comments.push(req.body);
    .then(campsite =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res)=>{
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`)
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, {new: true})
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err=>next(err));
});

campsiteRouter.route('/:campsiteId/comments')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200))
.get(cors.cors, (req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite=>{
        if(campsite){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments);
        }else{
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status =404;
            return next(err);
        }
    })
    .catch(err=> next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .then(campsite=>{
        if(campsite){
            req.body.author = req.user._id;//To reference the server-side User data
            campsite.comments.push(req.body);
            campsite.save()
            .then(campsite=>{
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(campsite);
            })
            .catch(err=>next(err));
        }else{
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res)=>{
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .then(campsite=>{
        if(campsite){
            for (let i=(campsite.comments.length-1); i>=0; i--){
                campsite.comments.id(campsite.comments[i]._id).remove();
            }
            campsite.save()
            .then(campsite=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err=>next(err));
        }else{
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
});

campsiteRouter.route('/:campsiteId/comments/:commentId')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200))
.get(cors.cors, (req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite=>{
        if(campsite && campsite.comments.id(req.params.commentId)){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments.id(req.params.commentId));
        }else if(!campsite){
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }else{
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res)=>{
    res.statusCode = 403; //forbidden
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`);//POST operation not supported on /campsites/6430b05d92a1a13c3021df27/comments/6430b09492a1a13c3021df28
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .then(campsite=>{
        if(campsite && campsite.comments.id(req.params.commentId)){
            if((campsite.comments.id(req.params.commentId).author._id).equals(req.user._id)){
                if(req.body.rating){
                    campsite.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.text){
                    campsite.comments.id(req.params.commentId).text = req.body.text;
                }
                campsite.save()
                .then(campsite=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(campsite);
                })
                .catch(err=>next(err));
            }else{
                err = new Error("You are not authorized to update this comment!");
                err.status = 401; //403: Forbidden, 401: Unauthorized
                return next(err);
            }
        }else if(!campsite){
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }else{
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .then(campsite=>{
        if(campsite && campsite.comments.id(req.params.commentId)){
            if((campsite.comments.id(req.params.commentId).author._id).equals(req.user._id)){
                campsite.comments.id(req.params.commentId).remove();
                campsite.save()
                .then(campsite=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(campsite);
                })
                .catch(err=>next(err));
            }else{
                err = new Error("You are not authenticated to updatd this comment!");
                err.status = 403;
                return next(err);
            }
        }else if(!campsite){
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }else{
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
});


module.exports = campsiteRouter;