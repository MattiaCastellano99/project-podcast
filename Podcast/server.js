/*********IMPORT***********/
const express = require('express');
const morgan = require('morgan'); //middleware per il log
const dao = require('./dao.js');
const daoSe = require('./daoSerie.js');
const daoEp = require('./daoEpisode.js');
const path = require('path');
const { check, validationResult } = require('express-validator');
const passport = require('passport'); // middleware di autenticazione
const LocalStrategy = require('passport-local').Strategy; // username e password per il login
const session = require('express-session');
const multer = require('multer');//per la gestione dell'upload delle immagini
let serieRouter = require('./routes/serieRoutes.js');
let episodiRouter = require('./routes/episodiRoutes.js');
let commentiRouter = require('./routes/commentiRoutes.js');
const fs = require('fs');//per l'eliminazione dei file non più usati



/*******SETUP USERNAME & PW (login)********/
passport.use(new LocalStrategy(
    //Funzione che verifica user e pw
    function(username, password, done) {
        dao.getUser(username, password).then(({user, check}) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!check) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    }
));
  
// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    dao.getUserById(id).then(user => {
        done(null, user);
    });
});

/*********INITIALIZATION***********/
const app = express(); 
const port = 3000;

/*********SETTAGGIO DEI MIDDLEWARE**********/
app.use(morgan('tiny')); //più compatta
// ogni request body sarà considerato nel formato JSON
app.use(express.json());
//set up della componente 'public' come un sito web statico
app.use(express.static('public'));
// set up delle sessioni
app.use(session({
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false 
}));

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(223).json({"statusCode" : 401, "message" : "not authenticated"});
}

/*********INIT PASSPORT*******/
app.use(passport.initialize());
app.use(passport.session());



// === REST API (podcast) === //

//GET, POST, DELETE delle Serie
app.use('/', serieRouter);

//GET, POST, DELETE degli Episodi
app.use('/', episodiRouter);

//GET, POST, DELETE dei Commenti
app.use('/', commentiRouter);


/**
 *                  GET
 */

// GET http://localhost:3000/api/categories
// Recuperare la lista di tutte le categorie disponibili
// Request body: empty
// Response body: array di objects che rappresenta tutte le categorie
app.get('/api/categories', (req, res) =>{
    dao.getAllCategories()
    .then((serie) => res.json(serie))
    .catch(() => res.status(508).end());
});

// GET http://localhost:3000/api
// Verifica che l'utente sia loggato
// Request body: empty
// Response body: empty
app.get('/api', isLoggedIn, (req,res) =>{
    res.json({"statusCode": 222});
});

// GET http://localhost:3000/api/user/
// Recuperare tutte le informazioni di un utente dato il suo id
// Request body: empty
// Response body: oggetto rappresentante l'utente
app.get('/api/user/', isLoggedIn, (req, res) =>{
    dao.getUserById(req.user.id)
    .then((user) => {
        res.json({"id":user.id , "nome":user.nome , "email":user.email , "ruolo":user.ruolo });
    })
    .catch(() => res.status(414).end());
});

// GET http://localhost:3000/api/search/:category/:text
// Recuperare tutte le serie ed episodi che fanno parte di una certa categoria e che contengono un certo testo
// Request body: empty
// Response body: array di oggetti rappresentanti le varie serie
app.get('/api/search/:category/:text', (req, res) =>{
    daoSe.getSeriesMatch(req.params.category, req.params.text)
    .then((series) => {
        daoEp.getEpisodesMatch(req.params.category, req.params.text)
        .then((episodes) => {
            res.status(201).json({'serie':series, 'episodi':episodes}).end();
        })
        .catch(() => res.status(410).json('Error in Search Episodes').end())
    })
    .catch(() => res.status(411).json('Error in Search Series').end());
});



/**
 *                  POST
*/

// POST http://localhost:3000/api/join-us
// Eseguire l'iscrizione (creare un nuovo utente)
// Request body: {"email":"prova@upo.it", "password":"prova", "nome":"Prova", "ruolo":"Creatore"}
// Response body: check message
app.post('/api/join-us', [
    check('email').isEmail(),
    check('password').notEmpty(),
    check('password').isLength({min:4}),
    check('nome').notEmpty()
    //check('ruolo').isString('Listener' || 'Creator')
] , (req, res) => {
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    const user = {
      email: req.body.email,
      pw: req.body.password,
      nome: req.body.nome,
      ruolo: req.body.ruolo
    };
    dao.controlUserAlreadyJoined(user.email)
    .then( () => {
        res.json('Utente Già Registrato')
    })
    .catch((result) => {
        if(result.localeCompare('nuovo utente') == 0){
            dao.createUser(user)
            .then(() => {
                res.json(user.email);
            })
            .catch((err) => res.status(503).json({ error: err}));
        }
        else
            res.status(503).json({ error: err});
    });
});

// POST http://localhost:3000/api/login
// Eseguire l'accesso
// Request body: {'email':'test@upo.it', 'password':'test'}
// Response body: check message
app.post('/api/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            // mostra il messaggio di errato login
            return res.status(401).json(info);
        }
        // OK --> esegue login
        req.login(user, function(err) {
            if (err) { return next(err); }
            app.get('/', (req, res) => res.redirect('/public/index.html/login/listener'));

            // req.user contiene ora l'utente autenticato
            return res.json(req.user.id);
        });
    })(req, res, next);
});

//POST /photos/upload 
// Esegue l'aggiunta dell'immagine alla cartella /public/uploads/Image/
// Request body: {}
// Response body: check message
let storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './public/FileCopertine/')
        },
        filename: function ( req, file, cb ) {
            //req.body is empty...
            cb( null, file.originalname);
        }
    }
);
//per la gestione dell'upload delle immagini
let upload = multer({ storage: storage });
app.post('/photos/upload', upload.single('uploaded_fileNew') , function (req, res, next) {
    //console.log(req.file);
    //res.status(201).end();
    res.redirect(`/personal/Creatore/${req.user.id}/leMieSerie`);
});

//POST /audio/upload
// Esegue l'aggiunta del file audio alla cartella /uploads/Audio/
// Request body: {}
// Response body: check message
let newStorage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './public/FileAudio/')
        },
        filename: function ( req, file, cb ) {
            //req.body is empty...
            cb( null, file.originalname);
        }
    }
);
let Aupload = multer({storage : newStorage})
app.post('/audio/upload/:id', Aupload.single('uploaded_mp3New'), function (req, res, next) {
    //return res.status(201);
    res.redirect(`/personal/Creatore/${req.user.id}/leMieSerie/serie/id/${req.params.id}`);
});



/**
 *                  DELETE
 */

// DELETE /api/login/current
// Effettua il logout della sessione corrente
// Request body: empty
// Response body: check message
app.delete('/api/login/current', function(req, res){
    req.logout();
    res.end();
});

// DELETE /photos/delete
// Elimina il file .png dalla cartella in cui era contenuto
// Request body: {"imgUrl" : "/FileCopertine/dnsv.mp3"}
// Response body: check message
app.delete('/photos/delete', function (req, res) {
    try{
        fs.unlinkSync('./public'+req.body.imgUrl);
        res.status(201).end();
    }
    catch(err){
        res.status(405).json({error : err});
    }
});

// DELETE /audio/delete
// Elimina il file .mp3 dalla cartella in cui era contenuto
// Request body: {"mp3Url" : "/FileAudio/dnsv.mp3"}
// Response body: check message
app.delete('/audio/delete', function (req, res) {
    try{
        fs.unlinkSync('./public'+req.body.mp3Url);
        res.status(201).end();
    }
    catch(err){
        res.status(405).json({error : err});
    }
});


/********OGNI ALTRA GET REQUEST VIENE GESTITA LATO CLIENT*********/
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public/index.html'));
});

/*********ACTIVATE THE SERVER**********/
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
