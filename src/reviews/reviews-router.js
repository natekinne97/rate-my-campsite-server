const express = require('express');
const reviewService = require('./reviews-service');
// const { checkReviewsExist } = '../services/service';
const jsonBodyParser = express.json()
const revRouter = express.Router();

// get reviews by id
revRouter.route('/:id')
        .all(checkReviewsExist)
        .get((req, res, next)=>{
            reviewService.getById(
                req.app.get('db'),
                req.params.id
            ).then(result => {
                
                res.json(result.rows.map(reviewService.serializeReviews));
            }).catch(next);
        })

// update comment
revRouter.route('/:id')
        .all(checkReviewsExist)
        .patch(jsonBodyParser, (req, res, next)=>{
            const {text, rating, campsite_id} = req.body;
            const updated = {
                text: text,
                rating: rating,
                campsite_id: campsite_id
            }
            
            // check if fields are there
            Object.keys(updated).forEach(field => {
                if (!updated[field]) {
                    return res.status(400).json({
                        error: `Missing '${field}' in request body`
                    })

                }
            })
            // update the entry
            reviewService.update(
                req.app.get('db'),
                req.params.id,
                updated
            ).then(result => {
                res.status(204)
                    .location(`/${result.id}`)
                    .json({ result });
            }).catch(next);


        })

// insert new review
revRouter.route('/')
        .post(jsonBodyParser,(req,res, next)=>{
            const { text, rating, campsite_id } = req.body;
            const newReview = {
                text: text,
                rating: rating,
                campsite_id: campsite_id
            }
            
            // check if fields are there
            Object.keys(newReview).forEach(field => {
                
                if (!newReview[field]) {
                    return res.status(400).json({
                        error: `Missing '${field}' in request body`
                    })

                }
            })

            reviewService.insertReview(
                req.app.get('db'),
                newReview
            ).then(result => {
                res.status(204)
                    .location(`/${result.id}`)
                    .json(result)
            }).catch(next);

        })

// delete review
revRouter.route('/:id')
    .all(checkReviewsExist)
    .delete((req, res, next) => {
        reviewService.deleteRev(
            req.app.get('db'),
            req.params.id
        ).then(result => {
            res.status(204);
        }).catch(next);
    })

// check if reviews for campsite
async function checkReviewsExist(req, res, next) {
    try {
        const rev = await reviewService.getById(
            req.app.get('db'),
            req.params.id
        )

        if (!rev)
            return res.status(404).json({
                error: `campsite doesn't exist`
            })

        res.rev = rev
        next()
    } catch (error) {
        next(error)
    }
}


module.exports = revRouter;