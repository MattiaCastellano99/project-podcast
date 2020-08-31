import {scrollFunction} from './menuCategory.js';
import {joinUsTemp, welcomeTemp, addMainTite} from './templates/menu-top-template.js';
import {addCatAtSecondaryBar, addSearchBar} from './templates/category-bar.js';
import {addRowElements} from './templates/card-template.js';
import page from './pageFIle/page.mjs';

class Category{

    constructor(id, nome){
        this.id = id;
        this.nome = nome;
        this.url = '/prova/'+nome;
    }

    /**
     * Costruisce una categoria dato un form json
     * @param {*} json 
     * @return {Category}
     */
    static form(json){
        const e = Object.assign(new Category(), json);
        return e;
    }
}

/**
     * chiama tutte le funzioni che si occupano di mostrare una determinata pagina 
     * @param {*}
    */
async function showDefaultPage ( actualPage , user, series, categories, app) {
    manageCategoryDropdown(categories);
    showSecondNav(categories, actualPage, app);
    if(actualPage == 'Home'){
        showHomeBody( user, series, app);
    }
    else{
        showOneCategoryPage( actualPage, series, app);
    }
}

/**
 * crea nella top NavBar il menù a dropdown delle categorie
 * @param {*}
*/
function manageCategoryDropdown(categories) {
    window.onscroll = function() {
        scrollFunction(categories);
    }
}

/**
 * crea la seconda NavBar (quella delle categorie)
 * @param {*}
*/
function showSecondNav (categories, catSelected, app) {
    app.categoryNav.insertAdjacentHTML('beforeend', addCatAtSecondaryBar({'nome':'Home', 'url':'/'}, catSelected));

    for(let category of categories){
        app.categoryNav.insertAdjacentHTML('beforeend', addCatAtSecondaryBar(category, catSelected));
    }
    app.searchBar.insertAdjacentHTML('beforeend', addSearchBar(categories));
    
    //event listener per la ricerca testuale
    document.querySelector('#editSearch').addEventListener('click', async () => {
        let seSerieEpisode = document.querySelector('#exampleFormControlSelect2').value;
        $(`#searchModalSe`).modal('toggle');
        if( seSerieEpisode.localeCompare("Serie") == 0 ){
            page.redirect('/search/series');
        }
        else if( seSerieEpisode.localeCompare("Episodi") == 0 ){
            page.redirect('/search/episodes');
        }
        else
            page.redirect('/search/all');
    });
}

/**
 * crea il corpo della schermata Home
 * @param {*}
*/
async function showHomeBody( user, series, app) {
    //sezione join Us
    app.serieBox.innerHTML = '';
    if(user.ruolo.localeCompare('Default') == 0){
        app.joinUs.insertAdjacentHTML('beforeend', joinUsTemp())
    }
    else{
        app.joinUs.insertAdjacentHTML('beforeend', welcomeTemp(user))
    }
    
    //verifica se si e' entrati qui per via di una search o no
    if(series.serie) {
        app.mainTitle.innerText = 'Risultati Ricerca Serie ed Episodi';
        for(let i=1 ; 0<series.serie.length ; i++){
            app.serieBox.insertAdjacentHTML('beforeend', addRowElements(i,series.serie));
            series.serie.splice(0,4);
        }
        
        for(let i=1 ; 0<series.episodi.length ; i++){
            app.serieBox.insertAdjacentHTML('beforeend', addRowElements(i+1,series.episodi));
            series.episodi.splice(0,4);
        }
    }
    else if(series.search){
        app.mainTitle.innerText = 'Risultati Ricerca';
        for(let i=1 ; 0<series.search.length ; i++){
            app.serieBox.insertAdjacentHTML('beforeend', addRowElements(i,series.search));
            series.search.splice(0,4);
        }
    }
    else{
        app.mainTitle.innerText = 'Le Nostre Serie';
        for(let i=1 ; 0<series.length ; i++){
            app.serieBox.insertAdjacentHTML('beforeend', addRowElements(i,series));
            series.splice(0,4);
        }
    }
}

/**
 * Crea il corpo della pagina relativa alle serie di una certa categoria
 * @param {*}
*/
async function showOneCategoryPage (cat, catSeries, app) {
    app.mainTitle.innerText = `Le Nostre serie di ${cat}`;
    for(let i=1 ; 0<catSeries.length ; i++){
        app.serieBox.insertAdjacentHTML('beforeend', addRowElements(i,catSeries));
        catSeries.splice(0,4);
    }
}

export {showDefaultPage, manageCategoryDropdown, showSecondNav};
export default Category;