'use strict';

const express = require('express');
const daoCom = require('../daoComment.js');
const router = express.Router();
const { check, validationResult } = require('express-validator');


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

// GET http://localhost:3000/api/user/comment
// Recuperare tutti i commenti di un certo utente
// Request body: empty
// Response body: array di oggetti rappresentanti i vari commenti
router.get('/api/user/comment', isLoggedIn, (req, res) =>{
    daoCom.getUserComment(req.user.id)
    .then((comments) => res.json(comments))
    .catch(() => res.status(410).end());
});

// GET http://localhost:3000/api/user/episode/:epId/comment
// Recuperare tutti i commenti scritti da un utente riferiti ad un certo episodio
// Request body: empty
// Response body: array di oggetti rappresentanti i vari commenti
router.get('/api/user/episode/:epId/comment', isLoggedIn, (req, res) =>{
    daoCom.getUserEpisodeComment(req.user.id, req.params.epId)
    .then((comments) => res.json(comments))
    .catch(() => res.status(410).end());
});

// GET http://localhost:3000/api/episode/id/:id/comment
// Recuperare tutti i commenti di un certo episodio
// Request body: empty
// Response body: array di oggetti rappresentanti i vari commenti
router.get('/api/episode/id/:id/comment', (req, res) =>{
    daoCom.getEpisodeComments(req.params.id)
    .then((comments) => res.json(comments))
    .catch(() => res.status(401).end());
});


/*************************************/
/*****************POST****************/
/*************************************/

// POST http://localhost:3000/api/episode/comment/:id
// Modifica un certo Commento
// Request body: {"episodioId":4, "testo":"prova prova prova"}
// Response body: empty
router.post('/api/episode/:epId/proprietario/comment', isLoggedIn, (req, res) =>{
    daoCom.createComment(req.params.epId, req.user.id, req.body.testo)
    .then((result) => res.status(201).header('Location', `/episode/${result}`).end())
    .catch(() => res.status(503).json({error : 'Database error during creation'}));
});

// POST http://localhost:3000/api/episode/:epId/proprietario/comments
// Esegue l'aggiunta di un commento ad un episodio
// Request body: {epId":2, "testo":"pippipppipi"}
// Response body: check message
router.post('/api/episode/:epId/proprietario/comments',[
    check('epId').isInt({min:0}),
    check('testo').isLength({min:3})
], isLoggedIn, (req, res) =>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.json({errors:errors.array()});
    }
    daoCom.addComment(req.user.id, req.body.epId, req.body.testo)
    .then(() => res.status(201).end())
    .catch(() => res.status(504).json({error : 'Database error during creation'}));
});


/*************************************/
/***************DELETE****************/
/*************************************/

// DELETE http://localhost:3000/api/episode/:epId/proprietario/comment
// Cancellare un commento, dato il suo id.
// Request body: empty
// Response body: check message
// Error: 405, {"error": "Serie not found."}
router.delete('/api/episode/:epId/proprietario/comment', isLoggedIn, (req, res) => {
    //verifico la presenza del Podcast
    daoCom.deleteCommentByEpisodeId(req.params.epId, req.user.id)
    .then(() => {res.status(203).header('Status',`Comment Correctly Deleted`).end()})
    .catch((error) => res.status(405).json(error));
});

module.exports = router;