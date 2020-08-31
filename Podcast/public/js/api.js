import User from './user.js'
import Serie from './serie.js';
import Episode from './episode.js';


class Api {

    /**
     * Esegue il login
     */
    static doLogin = async (username, password) => {
        let response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password}),
        });
        if(response.ok) {
            const user = await response.json();
            return user;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) {
                throw err;
            }
        }
    }

    /**
     * Esegue il join-in
     */
    static doJoinIn = async (email, password, nome, ruolo) => {
        let response = await fetch('/api/join-us', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, nome, ruolo}),
        });
        if(response.ok) {
            const username = await response.json();
            return username;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) {
                throw err;
            }
        }
    }

    /**
     * Esegue il logout
     */
    static doLogout = async () => {
        await fetch('/api/login/current', { method: 'DELETE' });
    }

    /**
     * Verifica che l'utente sia loggato o meno
     */
    static isLoggedIn = async () => {
        let response = await fetch(`/api`);
        let jsonResponse = await response.json();
        if(jsonResponse.statusCode == 222){
            return true;
        }
        else{
            //errore in formato json che arriva dal server
            return false;
        }
    }

    /**
     * Ottiene tutte le informazione dell'utente (id, email, nome, ruolo)
     */
    static getUserById = async () =>{
        let response = await fetch(`/api/user/`);
        let jsonResponse = await response.json();
        if(response.ok){
            return User.form(jsonResponse);
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Get di tutti i commenti scritti da un certo utente
     */
    static getMyComment = async () =>{
        let response = await fetch(`/api/user/comment`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse;
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }
    
    /**
     * Get di tutti i commenti riferiti ad un certo episodio
     * @param {*} epId 
     */
    static getCommentsByEpId = async (epId) =>{
        let response = await fetch(`/api/episode/id/${epId}/comment`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse;
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Ricerca all'interno delle srie e degli episodi un ceto testo
     * @param {*} inputText 
     * @param {*} category 
     */
    static search = async (inputText, category) =>{
        let response = await fetch(`/api/search/${category}/${inputText}`);
        let jsonResponse = await response.json();
        if(response.ok){
            const serie = jsonResponse.serie.map((se) => Serie.form(se));
            const episodi = jsonResponse.episodi.map((ep) => Episode.form(ep));
            return {'serie':serie, 'episodi':episodi};
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Esegue il pagamento di un certo episodio
     * @param {*} epId 
     * @param {*} cardNumber 
     * @param {*} cvv 
     * @param {*} mm 
     * @param {*} yy 
     */
    static userPayEpisode = async (epId, cardNumber, nome, cognome, cvv, mm, yy) => {
        let response = await fetch(`/api/pay/episode/${epId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({epId, cardNumber, nome, cognome, cvv, mm, yy}),
        });
        if(response.ok) {
            return true;
        }
        else {
            try {
                const errDetail = await response.json();
                return errDetail.errors;
            }
            catch(err) {
                throw err;
            }
        }
    }

    /**
     * Elimina un commento di un certo utente di un certo episodio
     * @param {*} usrId 
     * @param {*} epId 
     */
    static deleteEpisodeComment = async (epId) => {
        let response = await fetch(`/api/episode/${epId}/proprietario/comment`, { 
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }

    /**
     * modifica il contenuto di un certo commento
     * @param {*} usrId 
     * @param {*} epId 
     */
    static editEpisodeComment = async (epId, testo) => {
        let response = await fetch(`/api/episode/${epId}/proprietario/comment/`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({episodioId:epId, testo:testo}),//oggetto esame che stiaamo passando
        });
        if(response.ok){
            return;
        }
        else{
            response.json()
            .then( (obj) => {throw `Error: ${obj}`;} )
            .catch( (err) => {throw ({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
        }
    }

    /**
     * Elimina un episodio dagli episodi preferiti di un certo utente
     * @param {*} usrId 
     * @param {*} epId 
     */
    static deleteFavouriteEpisode = async (epId) => {
        let response = await fetch(`/api/episode/${epId}/proprietario/favourite-episode`, { 
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }

    /**
     * Elimina una serie dalle serie preferite di un certo utente
     * @param {*} usrId 
     * @param {*} seId 
     */
    static deleteFavouriteSerie = async (seId) => {
        let response = await fetch(`/api/serie/${seId}/proprietario/favourite-series`, { 
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }

    /**
     * aggiunge un episodio/serie agli episodi/serie preferiti di un determinato utente
     * @param {*} pisodio/serie-Id 
     * @param {*} 'episodio'/'serie' 
     */
    static addFavouriteEpSe = async (elId, epSe) => {
        let response = await fetch(`/api/${epSe}/${elId}/proprietario/favourite-${epSe}`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({elId}),//oggetto esame che stiamo passando
        });
        if(response.ok){
            return;
        }
        else{
            response.json()
            .then( (obj) => {throw `Error: ${obj}`;} )
            .catch( () => {throw ({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
        }
    }

    /**
     * aggiunge un commento ad una determinata serie da parte di un certo user
     * @param {*} epId 
     * @param {*} testo
     */
    static addEpisodeComment = async (epId, testo ) => {
        let response = await fetch(`/api/episode/${epId}/proprietario/comments`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({epId, testo}),//oggetto esame che stiamo passando
        });
        if(response.ok){
            return;
        }
        else{
            response.json()
            .then( (obj) => {throw `Error: ${obj}`;} )
            .catch( () => {throw ({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
        }
    }

    /**
     * Quando si elimina una serie questa api va ad eliminare anche la relativa immagine
     * @param {*} imgUrl 
     */
    static deleteImmage = async (imgUrl) => {
        let response = await fetch(`/photos/delete`, {
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({imgUrl}),
        });
        if(response.ok){
            return;
        }
        else{
            response.json()
            .then( (obj) => {throw `Error: ${obj}`;} )
            .catch( () => {throw ({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
        }
    }

    /**
     * cancella il file audio da un certo percorso
     * @param {*} mp3Url
     */
    static deleteAudio = async (mp3Url) => {
        let response = await fetch(`/audio/delete`, {
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({mp3Url}),
        });
        if(response.ok){
            return;
        }
        else{
            response.json()
            .then( (obj) => {throw `Error: ${obj}`;} )
            .catch( () => {throw ({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
        }
    }
}

export default Api;