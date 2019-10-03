const express = require('express');
const campsiteServices = require('./campsites-service');
const { requireAuth } = require('../middleware/jwt-auth');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date() + file.originalname);
    },
});

const fileFilter = (req, file, cb)=>{
    console.log('getting called')
    console.log('checking file type')
    console.log(file.mimetype, 'mimetype');
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        console.log('uploading now')
        cb(null, true);
    }else{
        console.log('denying upload')
        cb(new Error('Only Images cano be uploaded'), false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15
    },
    fileFilter: fileFilter
    });
const jsonBodyParser = express.json()
const campsiteRouter = express.Router();

// get all campsites
campsiteRouter
        .route('/')
        .get((req, res, next)=>{
            
            campsiteServices
                .getAllSites(req.app.get('db'), req.query.order)
                    .then(result =>{
                       
                        res.status(200).json(result.map( campsiteServices.serializeCampsites))

                    }).catch(next);
        });
// temp route to test if working
campsiteRouter.route('/test')
        .post(upload.single('img'),(req, res, next)=>{
            console.log(req.file.path, 'file path');  
            res.status(200).json({
                message: 'uploaded'
            })
        })

// get by id
campsiteRouter
        .route('/:id')
        .all(checkCampsiteExists)
        .get((req, res, next)=>{
            const id = req.params.id;

            // get by id with id and db
            campsiteServices.getById(
                req.app.get('db'),
                id
            ).then(result=>{
                  res.status(200).json(campsiteServices.serializeCampsites(result[0]));
            }).catch(next)

        })
// 
// get the reviews for campsite
campsiteRouter.route('/:campsite_id/reviews/')
            .all(checkReviewsExist)
            .get((req, res, next)=>{
                campsiteServices.getCampsiteReviews(
                    req.app.get('db'),
                    Number(req.params.campsite_id)
                ).then(result=>{
                    res.json(result.rows.map(campsiteServices.serializeReviews));
                }).catch(next);
            });



// update campsite
campsiteRouter
        .route('/:id')
        .all(checkCampsiteExists)
        .patch(requireAuth, jsonBodyParser, (req, res, next)=>{
            const {img, name, description, park, city, state} = req.body;
            const updated = {img: img, 
                name: name, 
                description: description, 
                park: park, 
                city: city, 
                state: state};
            
            // check if fields are there
            Object.keys(updated).forEach(field => {
                if (!updated[field]) {
                    return res.status(400).json({
                        error: `Missing '${field}' in request body`
                    })

                }
            })
            // update the entry
            campsiteServices.update(
                req.app.get('db'),
                req.params.id,
                updated
            ).then(result=>{
                res.status(204)
                    .location(`/${result.id}`)
                    .json({result});
            }).catch(next);


        })//end update

// insert new site
campsiteRouter.route('/')
    .post(upload.single('img'), jsonBodyParser,(req, res, next)=>{
                console.log('printing file path')
                if (req.file === undefined || req.file === null){
                   console.log(req.file, 'req.file exists');
                }
                
                console.log(req.body, 'body');
                
                console.log(req.file, 'file');
                //get data
                const {name, description, park, city, state } = req.body;

                const newCampsite = {
                    img: req.file.path,
                    name: name,
                    description: description,
                    park: park,
                    city: city,
                    state: state
                };
               
                // check if fields are there
                Object.keys(newCampsite).forEach(field => {
                   
                    if (!newCampsite[field]) {
                        return res.status(400).json({
                            error: `Missing '${field}' in request body`
                        })

                    }
                })

                campsiteServices.insertCampsite(
                    req.app.get('db'),
                    newCampsite
                ).then(result=>{
                    console.log(campsiteServices.serializeCampsites(result) ,'serialized result');
                    res.status(204)
                        .json(campsiteServices.serializeCampsites(result));
                }).catch(next);

            });

// delete the campsite
campsiteRouter.route('/:id')
            .all(checkCampsiteExists)
            .delete(requireAuth,(req, res, next)=>{
                campsiteServices.deleteCampsite(
                    req.app.get('db'),
                    req.params.id
                ).then(result=>{
                    res.status(204);
                }).catch(next);
            })

/* async/await syntax for promises */
async function checkCampsiteExists(req, res, next) {
    try {
        const campsite = await campsiteServices.getById(
            req.app.get('db'),
            req.params.id
        )

        if (!campsite)
            return res.status(400).json({
                error: `campsite doesn't exist`
            })

        res.campsite = campsite
        next()
    } catch (error) {
        next(error)
    }
}

// check if reviews for campsite
async function checkReviewsExist(req, res, next) {
    
    try {
        const rev = await campsiteServices.getCampsiteReviews(
            req.app.get('db'),
            Number(req.params.campsite_id)
        )

        if (!rev)
            return res.status(400).json({
                error: `campsite doesn't exist`
            })

        res.rev = rev
        next()
    } catch (error) {
        next(error)
    }
}


        
module.exports = campsiteRouter;