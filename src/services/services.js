// This file contains functions reused multiple times in several different places
// they could be stored in the already cluttered service file but will go here
const xss = require('xss');


// check if reviews for campsite
async function checkReviewsExist(req, res, next) {
    try {
        const rev = await campsiteServices.getCampsiteReviews(
            req.app.get('db'),
            req.params.campsite_id
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


module.exports = {
    checkReviewsExist,
    checkCampsiteExists
}