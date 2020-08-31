import {topTitle, addActionAtSecondaryBar, addFavElements, addNewElementTemp} from './templates/user-template.js';
import {addEpisodeComment } from './templates/commenti-template.js'
import ApiSe from './api/api-series.js';
import ApiEp from './api/api-episodes.js';
import Api from './api.js';
import page from './pageFIle/page.mjs';


/*
var express = require('express')
const multer  = require('multer');//per la gestione dell'upload delle immagini
const upload = multer({ dest: 'upload/' });//per la gestione dell'upload delle immagini

var app = express()
*/
class User{

    constructor(id, email, nome, ruolo='Default'){
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.ruolo = ruolo;
    }

    /**
     * Costruisce un utente dato un form json
     * @param {*} json
     * @return {User}
     */
    static form(json){
        const e = Object.assign(new User(), json);
        return e;
    }
}

/**
 * crea la seconda NavBar (quella del menù delle varie azioni)
 * @param {*} usrRole 
 * @param {*} listenerId 
 * @param {*} categoryNav 
 */
function showSecondNav (usrRole, listenerId, categoryNav) {
    categoryNav.innerHTML = '';
    categoryNav.insertAdjacentHTML('beforeend', addActionAtSecondaryBar(listenerId, usrRole, 'serieSeguite', 'Serie Seguite'));
    categoryNav.insertAdjacentHTML('beforeend', addActionAtSecondaryBar(listenerId, usrRole, 'episodiPreferiti','Episodi Preferiti'));
    categoryNav.insertAdjacentHTML('beforeend', addActionAtSecondaryBar(listenerId, usrRole, 'commentiPersonali','I Miei Commenti'));
    if(usrRole.localeCompare('Creatore') == 0){
        categoryNav.insertAdjacentHTML('beforeend', addActionAtSecondaryBar(listenerId, usrRole, 'leMieSerie', 'Le Mie Serie'));
    }
}

async function showSeriePreferite(usrRole, usrId, categories, app){
    try{
        showSecondNav(usrRole, usrId, app.categoryNav);
        app.joinUs.insertAdjacentHTML('beforeend', topTitle());
        document.querySelector('#actionserieSeguite').classList.add('active');
    
        let serieSeguite = await ApiSe.getSerieSeguite()
        let serieTot = [] ;
        for(let i=0 ; i<serieSeguite.length ; i++){
            let serie = await ApiSe.getSingleSeries(serieSeguite[i].serieId)
            serieTot.push(serie);
        }
        let arrSize = [];
        Object.assign(arrSize, serieTot);
        for(let i=1 ; 0<serieTot.length ; i++){
            app.serieBox.insertAdjacentHTML('beforeend', addFavElements(i, categories, serieTot));
            serieTot.splice(0,4);
        }

        //event listener per eliminare da serie preferite
        for(let i = 0 ; i<arrSize.length ; i++){
            let del = document.querySelector(`#delete${i}`);
            del.addEventListener('click', () => {
                Api.deleteFavouriteSerie(arrSize[i].id)
                .then(page.redirect(`/personal/${usrRole}/${usrId}/serieSeguite`))
                .catch((error) => {throw(error)});
            });
        }
    }catch(err){
        throw(err)
    }
}

async function showEpisodiPreferiti(usrRole, usrId, categories, app){
    try{
        showSecondNav(usrRole, usrId, app.categoryNav);
        app.joinUs.insertAdjacentHTML('beforeend', topTitle());
        document.querySelector('#actionepisodiPreferiti').classList.add('active');
        let episodiPreferiti = await ApiEp.favouritesEpisodes();
        let epTot = [] ;
        for(let i=0 ; i<episodiPreferiti.length ; i++){
            let episode = await ApiEp.getEpisodeById(episodiPreferiti[i].episodioId);
            let serie = await ApiSe.getSerieByEpisodeId(episodiPreferiti[i].episodioId);
            let obj = { immagine : serie.immagine};
            episode = Object.assign(episode, obj);
            epTot.push(episode);
        }
        let arrSize = [];
        Object.assign(arrSize, epTot);
        for(let i=1 ; 0<epTot.length ; i++){
            app.serieBox.insertAdjacentHTML('beforeend', addFavElements(i, categories, epTot));
            epTot.splice(0,4);
        }

        //event listener per eliminare da episodi preferiti
        for(let i = 0 ; i<arrSize.length ; i++){
            let del = document.querySelector(`#delete${i}`);
            del.addEventListener('click', () => {
                Api.deleteFavouriteEpisode(arrSize[i].id)
                .then(page.redirect(`/personal/${usrRole}/${usrId}/episodiPreferiti`))
                .catch((error) => {throw(error)});
            });
        }
    }catch(err){
        console.log('userNotLogged')
        page.redirect('/');
    }
}

async function showMyComment(usrRole, usrId, app){
    try{
        showSecondNav(usrRole, usrId, app.categoryNav);
        app.joinUs.insertAdjacentHTML('beforeend', topTitle());
        document.querySelector('#actioncommentiPersonali').classList.add('active');
        let commenti = await Api.getMyComment();
        let episodeArray = [];
        for(let comm of commenti){
            let imgTxt = { testo : comm.testo, proprietario:comm.userId};
            let ep = await ApiEp.getEpisodeById(comm.episodioId);
            ep = Object.assign(ep, imgTxt);
            episodeArray.push(ep);
        }
        let arrSize = [];
        Object.assign(arrSize, episodeArray);
        for(let i=1 ; 0<episodeArray.length ; i++){
            app.serieBox.insertAdjacentHTML('beforeend', addEpisodeComment(i,episodeArray));
            episodeArray.splice(0,4);
        }
        //Event Lisener Per cancellazione e modifica dei commenti Personali su episodi
        for(let i=0 ; i<arrSize.length ; i++){
            let del = document.querySelector(`#delete${i}`);
            del.addEventListener('click', () => {
                Api.deleteEpisodeComment(arrSize[i].id)
                .then(page.redirect(`/personal/${usrRole}/${usrId}/commentiPersonali`))
                .catch((error) => {throw(error)});
            });
            let edit = document.querySelector(`#editComment${i}`);
            edit.addEventListener('click', function () {
                Api.editEpisodeComment(arrSize[i].id, document.querySelector(`#inputDescription${i}`).value)
                .then(() => {
                    $(`#exampleModal${i}`).modal('toggle');
                    page.redirect(`/personal/${usrRole}/${usrId}/commentiPersonali`);
                })
                .catch((error) => {throw(error)});
            });
        }
    }catch(err){
        page.redirect('/');
    }
}

async function showMySeries (usrRole, usrId, app, categories) {
    let arrSize = [];
    Object.assign(arrSize,  await inizializzazioneSeEp(true, usrRole, usrId, null, app, categories));

    //event listener per modifica e cancellazione delle proprie serie
    for(let i = 0 ; i<arrSize.length ; i++){
        //cancellazione
        let del = document.querySelector(`#delete${i}`);
        del.addEventListener('click', () => {
            ApiSe.deleteSerie(arrSize[i].id)
            .then( async () => {
                try{
                    await Api.deleteImmage(arrSize[i].immagine)
                }catch(err){
                    throw(err);
                }
                page.redirect('/personal/Creatore/usrId/leMieSerie')
            })
            .catch((error) => {throw(error)});
        });
        //modifica
        let edit = document.querySelector(`#salva${i}`);
        edit.addEventListener('click', async function () {
            const title = document.querySelector(`#titolo${i}`).value;
            const descr = document.querySelector(`#descrizione${i}`).value;
            const cat = document.querySelector(`#selectForm${i}`).selectedOptions[0].id;
            let img = arrSize[i].immagine;
            const newImg = document.querySelector(`#inputGroupFile${i}`).files[0];
            if(newImg != undefined){
                try{
                    await Api.deleteImmage(arrSize[i].immagine)
                }catch(err){
                    throw(err)
                }
                img = '/FileCopertine/'+ newImg.name;
            }
            ApiSe.editMySerie(arrSize[i].id, title, descr, cat, img)
            .then(() => {
                $(`#exampleModal11${i}`).modal('toggle');
                page.redirect(`/personal/Creatore/${usrId}/leMieSerie`);
            })
            .catch((error) => {throw(error)});
        });
    }
    //creazione
    creazioneSeEp('mainForm', usrId);
}

async function showMySeEpisodes (usrRole, usrId, seId, app, categories) {
    let arrSize = [];
    Object.assign(arrSize, await inizializzazioneSeEp(false, usrRole, usrId, seId, app, categories));

    //event listener per modifica e cancellazione delle proprie serie
    for(let i = 0 ; i<arrSize.length ; i++){
        //cancellazione
        let del = document.querySelector(`#delete${i}`);
        del.addEventListener('click', () => {
            ApiEp.deleteEpisode(arrSize[i].id)
            .then(() => {
                try{
                    Api.deleteAudio(arrSize[i].fileAudio)
                }catch(err){
                    throw(err)
                }
                page.redirect(`/personal/Creatore/${usrId}/leMieSerie/serie/id/${seId}`)
            })
            .catch((error) => {throw(error)});
        });
        //modifica
        let edit = document.querySelector(`#salva${i}`);
        edit.addEventListener('click', function () {
            const title = document.querySelector(`#titolo${i}`).value;
            const descr = document.querySelector(`#descrizione${i}`).value;
            const costo = document.querySelector(`#costo${i}`).value;
            const spons = document.querySelector(`#sponsor${i}`).value;
            let mp3 = arrSize[i].fileAudio;
            const newMp3 = document.querySelector(`#inputGroupFile${i}`).files[0];
            if(newMp3 != undefined){
                try{
                    Api.deleteAudio(arrSize[i].fileAudio)
                }catch(err){
                    throw(err)
                }
                mp3 = '/FileAudio/'+ newMp3.name;
            }
            arrSize[i].titolo = title;
            arrSize[i].descrizione = descr;
            arrSize[i].costo = costo;
            arrSize[i].sponsor = spons;
            arrSize[i].fileAudio = mp3;
            
            ApiEp.editMySeEpisode(arrSize[i])
            .then(() => {
                $(`#exampleModal11${i}`).modal('toggle');
                page.redirect(`/personal/Creatore/${usrId}/leMieSerie/serie/id/${seId}`)
            })
            .catch((error) => {throw(error)});
        });
    }
    //creazione
    creazioneSeEp('salvaNewEp', usrId, seId);
}

/**
 * crea un nuovo episodio o una nuova serie
 * @param {salvaNewEp-mainForm} nomeform
 * @param {*} usrId
 */
function creazioneSeEp (nomeform, usrId, seId) {
    console.log(document.querySelector('#'+nomeform));
    document.querySelector(`#${nomeform}`).addEventListener('submit', async function () {
        const form = event.target;
        const title = document.querySelector(`#titolo`).value;
        const descr = document.querySelector(`#descrizione`).value;
        if(nomeform.localeCompare('salvaNewEp') == 0){
            if(form.checkValidity()) {
                let costo = document.querySelector(`#costo`).value;
                const spons = document.querySelector(`#sponsor`).value;
                if(costo == '' || costo == 0){
                    costo = 0;
                }
                await ApiEp.addNewEpisode(title, descr, costo, spons, `/FileAudio/${document.querySelector(`#inputGroupFile01`).files[0].name}`, moment().format("DD/MM/YYYY"), seId);
                $(`#exampleModal0`).modal('toggle');
                page.redirect(`/personal/Creatore/${usrId}/leMieSerie/serie/id/${seId}`);
            }
        }
        else{
            if(form.checkValidity()) {
                const categoria = document.querySelector(`#selectForm`).selectedOptions[0].id;
                const immagine = `/FileCopertine/${document.querySelector(`#inputGroupFile01`).files[0].name}` ;
                await ApiSe.addNewSerie(title, descr, categoria, immagine);
                $(`#exampleModal0`).modal('toggle');
                page.redirect(`/personal/Creatore/${usrId}/leMieSerie`);
            }
        }
    });
}

/**
 * inizializzazione showMySe e showMyEp
 * @param {*} seEp 
 * @param {*} usrRole 
 * @param {*} usrId 
 * @param {*} seId 
 * @param {*} app
 * @param {*} categories 
 */
async function inizializzazioneSeEp (seEp, usrRole, usrId, seId, app, categories) {
    let elements = [];
    try{
        showSecondNav(usrRole, usrId, app.categoryNav);
        app.joinUs.insertAdjacentHTML('beforeend', topTitle());
        document.querySelector('#actionleMieSerie').classList.add('active');
        if(seEp){
            app.mainTitle.insertAdjacentHTML('beforeend', addNewElementTemp(categories));
            elements = await ApiSe.getMySeries();
        }else{
            app.mainTitle.insertAdjacentHTML('beforeend', addNewElementTemp(seId));
            elements = await ApiEp.getMyEpisodes(seId);
        }
    }catch(err){
        console.log('userNotLogged');
        page.redirect('/');
    }
    let arrSize = [];
    Object.assign(arrSize, elements);
    for(let i=1 ; 0<elements.length ; i++){
        app.serieBox.insertAdjacentHTML('beforeend', addFavElements(i, categories, elements, true));
        elements.splice(0,4);
    }
    return arrSize;
}

export default User;
export {showSeriePreferite, showEpisodiPreferiti, showMyComment, showMySeries, showMySeEpisodes};