'use strict';

import Episode from "./../episode.js";

class ApiEp{

    /**
     * GET di tutti gli episodi di una certa serie
     * @param {*} serieId
     */
    static getAllEpisodesSerie = async (seID) => {
        let response = await fetch(`/api/episode/serie/${seID}`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse.map((ex) => Episode.form(ex));
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * GET di un episodio dato un certo id
     * @param {*} epID 
     */
    static getEpisodeById = async (epID) => {
        let response = await fetch(`/api/episode/id/${epID}`);
        let jsonResponse = await response.json();
        if(response.ok){
            return Episode.form(jsonResponse);
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * GET di tutti gli episodi preferiti di un certo utente
     */
    static favouritesEpisodes = async () => {
        let response = await fetch(`/api/user/episodes-favourites`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse.map((ex) => Episode.form(ex));
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Get di tutti gli epsodi acquistati da un certo utente
     */
    static getUserPayedEpisodes = async () =>{
        let response = await fetch(`/api/user/episode-payed`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse.map((ex) => Episode.form(ex));
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Esegue la ricerca di una parola fra tutti i titoli e le descrizioni degli episodi
     * @param {*} inputTxt 
     * @param {*} category 
     */
    static searchInEpisodes = async (inputTxt, category) =>{
        let response = await fetch(`/api/search/episodes/${category}/${inputTxt}`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse.map((ex) => Episode.form(ex));
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * GET di tutti gli episodi di un certo proprietario di una certa serie
     * @param {*} seId 
     */
    static getMyEpisodes = async (seId) =>{
        let response = await fetch(`/api/user/series/${seId}/episodes`);
        let jsonResponse = await response.json();
        if(response.ok){
            if(response.length == 0){
                return response;    
            }
            else{
                return jsonResponse.map((ex) => Episode.form(ex));
            }
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }
    
    /**
     * Aggiunge un nuovo episoio ad una certa serie
     * @param {*} titolo 
     * @param {*} descrizione 
     * @param {*} costo 
     * @param {*} sponsor 
     * @param {*} mp3 
     * @param {*} data 
     * @param {*} seId 
     */
    static addNewEpisode = async (titolo, descrizione, costo, sponsor, mp3, data, seId) => {
        let response = await fetch(`/api/episodes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({titolo, descrizione, costo, sponsor, mp3, data, seId}),
        });
        if(response.ok) {
            return ;
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
     * Elimina un episodio
     * @param {*} epId 
     */
    static deleteEpisode = async (epId) => {
        let response = await fetch(`/api/episode/${epId}`, {
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
     * GET di tutti i commenti di un certo utente riferiti ad un certo episodio
     * @param {*} epId 
     */
    static getUserEpisodeComment = async (epId) =>{
        let response = await fetch(`/api/user/episode/${epId}/comment`);
        let jsonResponse = await response.json();
        if(response.ok){
            if(response.length == 0){
                return response;
            }
            else{
                return jsonResponse;
            }
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Esegue l'aggiornamento delle informazioni riguardanti un certo episodio
     * @param {*} episodeEdited 
     */
    static editMySeEpisode = async (episodeEdited) => {
        let response = await fetch(`/api/episodes/id/${episodeEdited.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'titolo' : episodeEdited.titolo, 'descrizione' : episodeEdited.descrizione, 'mp3' : episodeEdited.fileAudio, 'sponsor' : episodeEdited.sponsor , 'costo' : episodeEdited.costo, 'serieId' : episodeEdited.serieId }),
        });
        if(response.ok) {
            return ;
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
}

export default ApiEp;