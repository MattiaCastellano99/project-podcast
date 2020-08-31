'use strict';

const express = require('express');
const daoSe = require('../daoSerie.js');
const daoEp = require('../daoEpisode.js');
const daoCom = require('./../daoComment.js');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const fs = require('fs');//per l'eliminazione dei file non più usati


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

// GET http://localhost:3000/api/series
// Recuperare la lista di tutte le serie disponibili
// Request body: empty
// Response body: array di objects che rappresenta tutte le series
router.get('/api/series', (req, res) =>{
    daoSe.getAllSeries()
    .then((serie) => res.json(serie))
    .catch(() => res.status(500).end());
});

// GET http://localhost:3000/api/series/categories/:categoryName
// Recuperare la lista di tutte le serie che fanno parte di una certa categoria
// Request body: empty
// Response body: array di objects che rappresenta tutte le series di quella categoria
router.get('/api/series/categories/:categoryName', (req, res) =>{
    daoSe.getCategorySeries(req.params.categoryName)
    .then((serie) => res.json(serie))
    .catch(() => res.status(500).end());
});

// GET http://localhost:3000/api/serie/episode/:id
// Recupera l'id di una certa serie dato l'id dell'episodio
// Request body: empty
// Response body: la serie di cui fa parte quel determinato episodio
router.get('/api/serie/episode/:id', (req, res) =>{
    daoSe.getSerieEpisode(req.params.id)
    .then((episode) => res.json(episode))
    .catch(() => res.status(404).end());
});

// GET http://localhost:3000/api/series/id/:id
// Recuperare tutte le informazioni di una serie dato il suo id
// Request body: empty
// Response body: array of objects representing all the propriety
router.get('/api/series/id/:id', (req, res) =>{
    daoSe.getSerieById(req.params.id)
    .then((serie) => res.json(serie))
    .catch(() => res.status(404).end());
});

// GET http://localhost:3000/api/user/serie-favourites
// Recuperare tutte le serie preferite di un certo utente
// Request body: empty
// Response body: array di oggetti rappresentanti le varie serie
router.get('/api/user/serie-favourites', isLoggedIn, (req, res) =>{
    daoSe.getUserFavouriteSeries(req.user.id)
    .then((series) => res.json(series))
    .catch(() => res.status(412).end());
});

// GET http://localhost:3000/api/search/series/:category/:text
// Recuperare tutte le serie che fanno parte di una certa categoria e che contengono un certo testo
// Request body: empty
// Response body: array di oggetti rappresentanti le varie serie
router.get('/api/search/series/:category/:text', (req, res) =>{
    daoSe.getSeriesMatch(req.params.category, req.params.text)
    .then((series) => res.json(series))
    .catch(() => res.status(411).end());
});

// GET http://localhost:3000/api/user/series
// Recuperare tutte le serie di un certo proprietario
// Request body: empty
// Response body: array di oggetti rappresentanti i vari episodi
router.get('/api/user/series', isLoggedIn, (req, res) =>{
    daoSe.getMySeries(req.user.id)
    .then((series) => res.json(series))
    .catch(() => res.status(415).end());
});


/*************************************/
/*****************POST****************/
/*************************************/

// POST http://localhost:3000/api/series
// Creare una nuova serie
// Request body: {"titolo":"MetWeb-2020","descrizione":"prova","categoria":"2","immagine":"FileCopertine/METWEB.png"}
// Response body: empty
router.post('/api/series',[
    //validazione dei parametri
    check('titolo').isLength({min:2}),
    check('categoria').notEmpty(),
    check('categoria').isInt(),
    check('immagine').notEmpty()
], isLoggedIn, (req, res) =>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    const serie = {
        titolo : req.body.titolo,
        descrizione : req.body.descrizione,
        categoria : req.body.categoria,
        immagine : req.body.immagine,
        proprietario : req.user.id,
    };
    daoSe.createSerie(serie)
    .then((result) => res.status(201).header('Location', `/series/${result}`).end())
    .catch(() => res.status(503).json({error : 'Database error during creation'}));
});

// POST http://localhost:3000/api/series/id/:id
// Modifica una serie dato il suo id
// Request body: {"titolo":"MetWeb-2020","descrizione":"prova","categoria":"2","immagine":"FileCopertine/METWEB.png"}
// Response body: empty
router.post('/api/series/id/:id',[
    //validazione dei parametri
    check('titolo').isLength({min:2}),
    check('categoria').notEmpty(),
    check('categoria').isInt(),
    check('immagine').notEmpty()
], isLoggedIn, (req, res) =>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    const serie = {
        id : req.params.id,
        titolo : req.body.titolo,
        descrizione : req.body.descrizione,
        categoria : req.body.categoria,
        immagine : req.body.immagine,
        proprietario : req.user.id,
    };
    daoSe.editSerie(serie)
    .then((result) => res.status(201).header('Location', `/series/${result}`).end())
    .catch(() => res.status(503).json({error : 'Database error during creation'}));
});

// POST http://localhost:3000/api/series/:seId/proprietario/favourite-series
// Esegue l'aggiunta di una determinata serie alle serie preferite
// Request body: {"seId":2}
// Response body: check message
router.post('/api/series/:seId/proprietario/favourite-series',[
    check('seId').isInt({min:0})
], isLoggedIn, (req, res) =>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.json({errors:errors.array()});
    }
    daoSe.addSerieToFavourite(req.user.id, req.body.elId)
    .then(() => res.status(207).end())
    .catch(() => res.status(502).json({error : 'Database error during creation'}));
});



/*************************************/
/***************DELETE****************/
/*************************************/

// DELETE http://localhost:3000/api/serie/:seId/proprietario/favourite-series
// Cancellare una seri dalle serie preferite di un determinato proprietario
// Request body: empty
// Response body: check message
// Error: 405, {"error": "Episode not found."}
router.delete('/api/serie/:seId/proprietario/favourite-series', isLoggedIn, (req, res) => {
    //verifico la presenza del Podcast
    daoSe.deleteFavSerieBySerieId(req.params.seId, req.user.id)
    .then(() => {res.status(203).header('Status',`Episode Correctly Deleted`).end()})
    .catch((error) => res.status(405).json(error));
});

// DELETE /api/serie/:id
// Cancellare una serie, dato il suo id.
// Request body: empty
// Response body: check message
// Error: 405, {"error": "Serie not found."}
router.delete('/api/series/:id', isLoggedIn, (req, res) => {
    //verifico la presenza del Podcast
    this.id = req.params.id;
    daoSe.getSerieById(this.id)
    .then(() => {
        daoEp.getAllEpisodeSeries(this.id)
        .then( (episodes) => {
            for(let ep of episodes){
                daoEp.getEpisodeById(ep.id)
                .then(() => {
                    daoCom.deleteCommentByEpisodeId(ep.id)
                    .then(() => {
                        try{
                            fs.unlinkSync('./public'+ep.fileAudio);
                            res.status(201).end();
                        }
                        catch(err){
                            res.status(405).json({error : err});
                        }
                        daoEp.deleteSingleEpisode(ep.id)
                        .then(() => {res.status(203)})
                        .catch(() => res.status(405).json({error: 'error delete single episode'}).end());
                    })
                    .catch(() => res.status(406).json({error : 'Error deleteComment'}).end());
                })
                .catch(() => res.status(403).json({error:'Episode not present in Database'}).end());
            }
            daoSe.deleteSingleSerie(this.id)
            .then(res.status(201).end())
            .catch(() => res.status(402).json({error : 'errore in serieDelete'}).end())
        })
        .catch(() => res.status(408).json({error : 'EpisodesSerie error'}).end())
    })
    .catch(() => res.status(407).json({error:'Serie not present in Database'}).end());
});



module.exports = router;