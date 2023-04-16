const express = require('express');
const favoriteRouter = express.Router();
//to import the local-file-based modules 
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200))//pre-flight request and check available options such as Access-Control-Allow-Origin and Access-Control-Allow-Methods.
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
    Favorite.find({ user: req.user._id })
    .populate('user') 
    .populate('campsites') 
    .then(favorite => res.status(200).json(favorite))
    .catch(err=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Favorite.findOne({user: req.user._id })
    .then(favorite=>{
        if(favorite){ 
            req.body.forEach(fav => {if(!favorite.campsites.includes(fav._id)){favorite.campsites.push(fav._id);}})//user's req.body array: [{"_id": "123"}, ...]           
            
            favorite.save()
            .then(favorite=>res.status(200).json(favorite))                
            .catch(err=>next(err))                                        
        } else {
            Favorite.create({user: req.user._id})
            .then(favorite=> {
                req.body.forEach(fav => favorite.campsites.push(fav._id)); 
                
                favorite.save()
                .then(favorite => res.status(200).json(favorite))
                .catch(err => next(err))
            })
            .catch(err=>next(err))
        }
    })
    .catch(err=>next(err))  
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Favorite.findOneAndDelete({user: req.user._id})
    .then(favorite=>{
        res.statusCode = 200;
        if(favorite){       
            //res.statusCode = 200;     
            //res.setHeader('Content-Type', 'application/json');
            res.status(200).json(favorite);
        }else{
            //res.statusCode = 200;
            //res.setHeader('Content-Type', 'text/plain');
            res.status(200).end('You do not have any favorites to delete.');
        }
    })
    .catch(err=>next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200))//pre-flight request and check available options such as Access-Control-Allow-Origin and Access-Control-Allow-Methods.
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Favorite.findOne({user: req.user._id})
    .then(favorite=>{
        if(favorite){
            if(!favorite.campsites.includes(req.params.campsiteId)){ //To execute if the campsite is not in the favorites.campsites array
                favorite.campsites.push(req.params.campsiteId);

                favorite.save()
                .then(favorite=>res.status(200).json(favorite))
                .catch(err=>next(err));
            }else{
                res.status(200).end('That campsite is already in the list of favorites!')
            }
        }else{
            Favorite.create({user:req.user._id, campsites:[req.params.campsiteId]})
            .then(favorite=> res.status(200).json(favorite))
            .catch(err=>next(err))
        }
    })
    .catch(err=>next(err));
})    
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res)=>{
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Favorite.findOne({user: req.user._id})
    .then(favorite=>{ //Alternatively, you could use the filter array method. Afterward, save the document then return a response with a status code of 200, a Content-Type header of 'application/json', and the favorite document. 
        if(favorite){
            const index = favorite.campsites.indexOf(req.params.campsiteId);
            if(index >-1){
                favorite.campsites.splice(index, 1);

                favorite.save()
                .then(favorite=>res.status(200).json(favorite))
                .catch(err=>next(err))       
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You do not have any favorites to delete.');
            }
        }
    })
    .catch(err=>next(err));

});


module.exports = favoriteRouter;