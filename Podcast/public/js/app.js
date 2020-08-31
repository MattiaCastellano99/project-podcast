'use strict';

import ApiCat from './api/api-category.js';
import {loginButton, logoutButton} from './templates/login-template.js'
import Api from './api.js';
import ApiSe from './api/api-series.js';
import ApiEp from './api/api-episodes.js';
import {showEpisodesOfOneSerie} from './serie.js';
import {showDefaultPage} from './category.js';
import page from './pageFIle/page.mjs';
import Episode from './episode.js';
import { showMyComment, showSeriePreferite, showEpisodiPreferiti, showMySeries, showMySeEpisodes } from './user.js'
import { profileTemplate } from './templates/menu-top-template.js';
import { showLoginPage, logout, showJoinUsPage } from './autenticatoin.js';

class App{
    constructor(mainNav, categoryNav, joinUs, serieBox, catDropdown, mainTitle, searchBar) {

        let app = {
            'mainNav' : mainNav,
            'categoryNav' : categoryNav,
            'joinUs' : joinUs,
            'serieBox' : serieBox,
            'searchBar' : searchBar,
            'catDropdown' : catDropdown,
            'mainTitle' : mainTitle
        }
        // inserisco bottone di login
        document.querySelector('#navToggle').insertAdjacentHTML('afterend', loginButton());

        ApiCat.getAllCategories().then( async (categories) => {
            //per la verifica dell'avvenuto login o meno
            this.user = await Api.getUserById();
            
            //routing
            page('/', async () => {
                this.user = await Api.getUserById();
                this.resetElements( app );
                let series = await ApiSe.getAllSeries();
                showDefaultPage('Home', this.user, series, categories, app);
                this.renderNavBar( app );
            });
            page('/search/:scelta', async (req) => {
                try{
                    let seInput = document.querySelector('#searchInput').value;
                    let seCategory = document.querySelector('#exampleFormControlSelect1').value;
                    let val = {};
                    if( req.params.scelta.localeCompare('series') == 0 ){
                        val = { 'search' : await ApiSe.searchInSeries(seInput, seCategory)};
                    }
                    else if( req.params.scelta.localeCompare('episodes') == 0 ){
                        val = { 'search' : await ApiEp.searchInEpisodes(seInput, seCategory)};
                    }
                    else{
                        val = await Api.search(seInput, seCategory);
                    }
                    this.resetElements( app );
                    showDefaultPage('Home', this.user, val, categories, app);
                    this.renderNavBar( app );
                }catch(err){
                    page.redirect('/');
                }
            });
            page('/categories/:cat', async (req) => {
                this.resetElements( app );
                let series = await ApiSe.getCategorySeries(req.params.cat);
                showDefaultPage(req.params.cat, this.user, series, categories, app);
                this.renderNavBar( app );
            });
            page('/series/id/:id', async (req) => {
                this.resetElements( app );
                let episodes = await ApiEp.getAllEpisodesSerie(req.params.id);
                showEpisodesOfOneSerie(req.params.id, episodes, app);
                this.renderNavBar( app );
            });
            page('/episode/id/:id', async (req) => {
                this.resetElements( app );
                let episode = await ApiEp.getEpisodeById(req.params.id);
                Episode.showOneEpisode( episode, app );
                this.renderNavBar( app );
            });
            page('/join-us', () => {
                this.resetElements( app );
                showJoinUsPage(app, this.user);
            });
            page('/login', () => {
                this.resetElements( app );
                showLoginPage(app, this.user);
            });
            page('/logout', () =>{
                this.resetElements( app );
                logout(this.user);
            });
            page('/personal/:ruolo/:id/serieSeguite', (req) => {
                this.resetElements( app );
                if(req.params.ruolo.localeCompare('Ascoltatore') == 0 || req.params.ruolo.localeCompare('Creatore') == 0){
                    showSeriePreferite(req.params.ruolo, req.params.id, categories, app);
                    this.renderNavBar( app );
                }else{
                    page.redirect('/');
                }
            });
            page('/personal/:ruolo/:id/episodiPreferiti', (req) => {
                this.resetElements( app );
                if(req.params.ruolo.localeCompare('Ascoltatore') == 0 || req.params.ruolo.localeCompare('Creatore') == 0){
                    showEpisodiPreferiti(req.params.ruolo, req.params.id, categories, app);
                    this.renderNavBar( app );
                }else{
                    page.redirect('/');
                }
            });
            page('/personal/:ruolo/:id/commentiPersonali', (req) => {
                this.resetElements( app );
                if(req.params.ruolo.localeCompare('Ascoltatore') == 0 || req.params.ruolo.localeCompare('Creatore') == 0){    
                    showMyComment(req.params.ruolo, req.params.id, app);
                    this.renderNavBar( app );
                }else{
                    page.redirect('/');
                }
            });
            page('/personal/:ruolo/:id/leMieSerie', (req) => {
                this.resetElements( app );
                if(req.params.ruolo.localeCompare('Creatore') == 0){    
                    showMySeries(req.params.ruolo, req.params.id, app, categories);
                    this.renderNavBar( app );
                }else{
                    page.redirect('/');
                }
            });
            page('/personal/:ruolo/:usrId/leMieSerie/serie/id/:seId', (req) => {
                this.resetElements( app );
                if(req.params.ruolo.localeCompare('Creatore') == 0){    
                    showMySeEpisodes(req.params.ruolo, req.params.usrId, req.params.seId, app, categories);
                    this.renderNavBar( app );
                }else{
                    page.redirect('/');
                }
            });
            page('*', function(){
                $('body').text('Not found!');
            });
            page();
        });
    }

    /**
     * rendderizza la barra in alto nel caso in cui l'utente sia loggato
     */
    renderNavBar( app ){
        Api.isLoggedIn()
        .then((log) => {
            if(log){
                let li = document.querySelector('#login');
                if( li ){
                    li.remove();
                    app.mainNav.insertAdjacentHTML('beforeend', logoutButton());
                    app.catDropdown.insertAdjacentHTML('afterend', profileTemplate(this.user));
                }
            }
        })
    }
    
    /**
     * azzera i vari elementi html nel passaggio da una pagina ad un'altra
     */
    resetElements( app ){
        app.categoryNav.innerHTML = '';
        app.catDropdown.innerHTML = '';
        app.searchBar.innerHTML = '';
        app.joinUs.innerHTML = '';
        app.serieBox.innerHTML = '';
        app.mainTitle.innerText = '';
    }
}

export default App;