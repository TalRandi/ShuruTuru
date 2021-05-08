const express = require('express'),
    userRoutes = require('./tour'); 

var router = express.Router();


router.get('/tours', userRoutes.read_tour); //Get all tours
router.get('/tours/:id', userRoutes.read_tour); //Get specific tour

router.post('/tours', userRoutes.create_tour); //Add new tour
router.put('/tours', userRoutes.create_tour); //Add site

router.put('/tours/:id', userRoutes.update_tour); //Edit site

router.delete('/tours/:id', userRoutes.delete_tour); //Delete tour
router.delete('/sites/:id', userRoutes.delete_site);  //Delete site

module.exports = router;