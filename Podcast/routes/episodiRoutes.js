'use strict';

const express = require('express');
const daoEp = require('../daoEpisode.js');
const dao = require('../dao.js');
const daoCom = require('./../daoComment.js');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const moment = require('moment');


// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(223).json({"statusCode" : 401, "message" : "not authenticated"});
}



/*************************************/
/*****************GET*****************/
/*************************************/

// GET http://localhost:3000/api/episode/id/:id
// Recuperare tutte le informazioni di un episodio dato il suo id
// Request body: empty
// Response body: array of objects representing all the propriety
router.get('/api/episode/id/:id', (req, res) =>{
    daoEp.getEpisodeById(req.params.id)
    .then((episode) => res.json(episode))
    .catch(() => res.status(404).end());
});

// GET http://localhost:3000/api/user/episode-favourites
// Recuperare tutti gli episodi preferite di un certo utente
// Request body: empty
// Response body: array di oggetti rappresentanti i vari episodi
router.get('/api/user/episodes-favourites', isLoggedIn, (req, res) =>{
    daoEp.getUserFavouriteEpisodes(req.user.id)
    .then((episodes) => res.json(episodes))
    .catch(() => res.status(411).end());
});

// GET http://localhost:3000/api/search/episodes/:category/:text
// Recuperare tutti gli episodi che fanno parte di una certa categoria e che contengono un certo testo
// Request body: empty
// Response body: array di oggetti rappresentanti i vari episodi
router.get('/api/search/episodes/:category/:text', (req, res) =>{
    daoEp.getEpisodesMatch(req.params.category, req.params.text)
    .then((series) => res.json(series))
    .catch(() => res.status(412).end());
});

// GET http://localhost:3000/api/episode/serie/:id
// Recuperare tutti gli episodi di una certa serie
// Request body: empty
// Response body: array di oggetti rappresentanti i vari episodi
router.get('/api/episode/serie/:id', (req, res) =>{
    daoEp.getAllEpisodeSeries(req.params.id)
    .then((episodes) => res.json(episodes))
    .catch(() => res.status(403).end());
});

// GET http://localhost:3000/api/user/series/:id/episodes
// Recuperare tutti gli episodi di una certa serie posseduta da un certo utente
// Request body: empty
// Response body: array di oggetti rappresentanti i vari episodi
router.get('/api/user/series/:id/episodes', isLoggedIn, (req, res) =>{
    daoEp.getAllUserEpisodeSeries(req.params.id, req.user.id)
    .then((series) => res.status(201).json(series))
    .catch(() => res.status(416).end());
});

// GET http://localhost:3000/api/user/episode-payed
// Recuperare tutti gli episodi acquistati da un certo utente
// Request body: empty
// Response body: array di oggetti rappresentanti i vari id degli episodi
router.get('/api/user/episode-payed', isLoggedIn, (req, res) =>{
    dao.getUserEpisodesPayed(req.user.id)
    .then((arrayEpId) => {
        GetEpisodesFromEpId(arrayEpId).then((response) => res.json(response));
    })
    .catch(() => res.status(409).end());
});

async function GetEpisodesFromEpId(arrayEpId){
    let arrayEp = [];
    for(let ep of arrayEpId){
        arrayEp.push(await daoEp.getEpisodeById(ep.episodioId));
    }
    return arrayEp;
}


/*************************************/
/*****************POST****************/
/*************************************/

// POST http://localhost:3000/api/episode
// Creare un nuovo episodio
// Request body: {"titolo":"MetWeb-2020 Ep1","descrizione":"prova","mp3":"FileAudio/METWEB.mp3","dataE":"14/02/2020","sponsor":"", "costo":"free", "serieid":"2"}
// Response body: empty
router.post('/api/episodes',[
    //validazione dei parametri
    check('titolo').isLength({min:2}),
    check('descrizione').notEmpty(),
    check('costo').notEmpty(),
    check('costo').isInt(),
    check('mp3').notEmpty(),
    check('mp3').isLength({min:2}),
    check('data').notEmpty(),
    check('seId').isInt()
], (req, res) =>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors:errors.array()});
    }
    const episodio = {
        titolo : req.body.titolo,
        descrizione : req.body.descrizione,
        mp3 : req.body.mp3,
        data : req.body.data,
        sponsor : req.body.sponsor,
        costo : req.body.costo,
        sId : req.body.seId,
    };
    daoEp.createEpisode(episodio)
    .then((result) => res.status(201).header('Location', `/episode/${result}`).end())
    .catch(() => res.status(503).json({error : 'Database error during creation'}).end());
});

// POST http://localhost:3000/api/episodes/id/:epId
// Aggiorna un episodio
// Request body: {"titolo":"MetWeb-2020 Ep1","descrizione":"prova","mp3":"FileAudio/METWEB.mp3","sponsor":"", "costo":"free", "serieid":"2"}
// Response body: empty
router.post('/api/episodes/id/:id',[
    //validazione dei parametri
    check('titolo').isLength({min:2}),
    check('descrizione').notEmpty(),
    check('costo').notEmpty(),
    check('costo').isInt(),
    check('mp3').notEmpty(),
    check('mp3').isLength({min:2}),
    check('serieId').isInt()
], (req, res) =>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    const episodio = {
        id : req.params.id,
        titolo : req.body.titolo,
        descrizione : req.body.descrizione,
        mp3 : req.body.mp3,
        sponsor : req.body.sponsor,
        costo : req.body.costo,
        sId : req.body.serieId,
    };
    daoEp.editSeEpisode(episodio)
    .then((result) => res.status(201).header('Location', `/episode/${result}`).end())
    .catch(() => res.status(503).json({error : 'Database error during creation'}));
});

// POST http://localhost:3000/api/episode/:epId/proprietario/favourite-episode
// Esegue l'aggiunta di un determinato episodio agli episodi preferiti
// Request body: {"epId":2}
// Response body: check message
router.post('/api/episode/:epId/proprietario/favourite-episode',[
    check('epId').isInt({min:0})
], isLoggedIn, (req, res) =>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.json({errors:errors.array()});
    }
    daoEp.addEpisodeToFavourite(req.user.id, req.body.elId)
    .then(() => res.status(201).end())
    .catch(() => res.status(504).json({error : 'Database error during creation'}));
});

// POST http://localhost:3000/api/pay/episode/${epId}
// Esegue il pagamento di un determinato episodio
// Request body: {"epId":3, " cardNumber":4022609224052989, "cvv":231, "mm":07, "yy":23}
// Response body: check message
router.post('/api/pay/episode/:id',[
    check('epId').isInt({min:0}),
    check('cardNumber').isCreditCard(),
    check('nome').notEmpty(),
    check('cognome').notEmpty(),
    check('cvv').isInt({ min : 100 , max : 999 }),
    check('mm').isInt({ min : 1 , max : 12 }),
    check('yy').isInt({ min : moment().format('YY') })
], isLoggedIn, (req, res) =>{
    let errors = validationResult(req);
    if(! errors.isEmpty()){
        console.log(errors, errors[0]);
        return res.status(405).json({errors :errors.array()});
    }
    //verifico che la carta non sia scaduta in questi mesi
    if( req.body.yy == moment().format('YY') && req.body.mm < moment().format('MM') ){
        errors = [{ param : 'mm' }];
        return res.status(405).json({errors: errors});
    }
    dao.doPayment(req.user.id, req.body.epId)
    .then(() => res.status(201).end())
    .catch(() => res.status(503).json({error : 'Database error during creation'}));
});


/*************************************/
/***************DELETE****************/
/*************************************/

// DELETE http://localhost:3000/api/episode/:id
// Cancellare un episodio, dato il suo id.
// Request body: empty
// Response body: check message
// Error: 405, {"error": "Serie not found."}
router.delete('/api/episode/:id', (req, res) => {
    //verifico la presenza del Podcast
    this.id = req.params.id;
    daoEp.getEpisodeById(this.id)
    .then(() => {
        daoCom.deleteCommentByEpisodeId(this.id)
        .then(() => {
            daoEp.deleteSingleEpisode(this.id)
            .then(() => {res.status(203).header('Status',`Episode Correctly Deleted`).end()})
            .catch((error) => res.status(405).json(error));
        })
        .catch((error) => res.status(406).json({error : 'Error deleteComment'}));
    })
    .catch(() => res.status(403).json({error:'Episode not present in Database'}));
});

// DELETE http://localhost:3000/api/episode/:epId/proprietario/favourite-episode
// Cancellare un episodio dagli episodi preferiti di un determinato proprietario
// Request body: empty
// Response body: check message
// Error: 405, {"error": "Episode not found."}
router.delete('/api/episode/:epId/proprietario/favourite-episode', isLoggedIn, (req, res) => {
    //verifico la presenza del Podcast
    daoEp.deleteFavEpisodeByEpisodeId(req.params.epId, req.user.id)
    .then(() => {res.status(203).header('Status',`Episode Correctly Deleted`).end()})
    .catch(() => res.status(405).json(error));
});

module.exports = router;