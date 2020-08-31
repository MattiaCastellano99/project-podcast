'use strict';

import Serie from "./../serie.js";

class ApiSe{
    
    /**
     * Get la lista di tutte le serie
     */
    static getAllSeries = async () => {
        let response = await fetch('/api/series');
        let jsonResponse = await response.json();
        if(response.ok){
            let series = jsonResponse.map((ex) => Serie.form(ex));
            return series;
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * GET una certa serie dato un cero id
     * @param {*} id 
     */
    static getSingleSeries = async (id) => {
        let response = await fetch(`/api/series/id/${id}`);
        let jsonResponse = await response.json();
        if(response.ok){
            let serie = Serie.form(jsonResponse[0]);
            return serie;
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * GET un insieme di serie che hanno in conume una certa categoria
     * @param {*} categoria
     */
    static getCategorySeries = async (cat) => {
        let response = await fetch(`/api/series/categories/${cat}`);
        let jsonResponse = await response.json();
        if(response.ok){
            let serie = jsonResponse.map((ex) => Serie.form(ex));
            return serie;
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * GET della serie di un particolare episodio
     * @param {*} epID 
     */
    static getSerieByEpisodeId = async (epID) => {
        let response = await fetch(`/api/serie/episode/${epID}`);
        let jsonResponse = await response.json();
        if(response.ok){
            return Serie.form(jsonResponse[0]);
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Esegue la GET di tutte le serie preferite dell'utente loggato
     */
    static getSerieSeguite = async () =>{
        let response = await fetch(`/api/user/serie-favourites`);
        let jsonResponse = await response.json();
        if(response.ok && jsonResponse.statusCode != 401){
            return jsonResponse;
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse.message;
        }
    }

    /**
     * Ricerca le serie che contengono nel titolo o nella descrizione il testo di input
     * @param {*} inputTxt 
     * @param {*} category 
     */
    static searchInSeries = async (inputTxt, category) =>{
        let response = await fetch(`/api/search/series/${category}/${inputTxt}`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse.map((ex) => Serie.form(ex));
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Esegue la GET di tutte le serie di proprietà di un certo Creatore
     */
    static getMySeries= async () =>{
        let response = await fetch(`/api/user/series`);
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse.map((ex) => Serie.form(ex));
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }

    /**
     * Crea una nuova serie
     * @param {*} titolo 
     * @param {*} descrizione 
     * @param {*} categoria 
     * @param {*} fileImg 
     */
    static addNewSerie = async (titolo, descrizione, categoria, immagine) => {
        let response = await fetch(`/api/series`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({titolo, descrizione, categoria, immagine}),
        });
        if(response.ok) {
            return true;
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
     * Modifica i parametri di una determinata serie
     * @param {*} seId 
     * @param {*} titolo 
     * @param {*} descrizione 
     * @param {*} categoria 
     * @param {*} immagine 
     */
    static editMySerie = async (seId, titolo, descrizione, categoria, immagine) => {
        let response = await fetch(`/api/series/id/${seId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({titolo, descrizione, categoria, immagine}),
        });
        if(response.ok) {
            return true;
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
     * Elimina una determinata serie
     * @param {*} seId 
     */
    static deleteSerie = async (seId) => {
        let response = await fetch(`/api/series/${seId}`, {
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
}

export default ApiSe;