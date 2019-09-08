const express = require('express');
const campsiteServices = require('./campsites-service');
const jsonBodyParser = express.json()
const campsiteRouter = express.Router();

// get all campsites
campsiteRouter
        .route('/')
        .get((req, res, next)=>{
            campsiteServices
                .getAllSites(req.app.get('db'))
                    .then(results =>{
                        res.json(results)
                    }).catch(next);
        });

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
                res.json(result);
            }).catch(next)

        })

// update campsite
campsiteRouter
        .route('/:id')
        .all(checkCampsiteExists)
        .patch(jsonBodyParser, (req, res, next)=>{
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
            })


        })//end update

// insert new site
campsiteRouter.route('/')
    .post(jsonBodyParser,(req, res, next)=>{
                //get data
                const { img, name, description, park, city, state } = req.body;
                const newCampsite = {
                    img: img,
                    name: name,
                    description: description,
                    park: park,
                    city: city,
                    state: state
                };

                // check if fields are there
                Object.keys(newCampsite).forEach(field => {
                    console.log(field);
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
                    res.status(204)
                        .location(`/${result.id}`)
                        .json(result)
                }).catch(next);

            });

// delete the campsite
campsiteRouter.route('/:id')
            .all(checkCampsiteExists)
            .delete((req, res, next)=>{
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
            return res.status(404).json({
                error: `campsite doesn't exist`
            })

        res.campsite = campsite
        next()
    } catch (error) {
        next(error)
    }
}
        
module.exports = campsiteRouter;