import {serieTemp} from './templates/menu-top-template.js';
import ApiSe from './api/api-series.js';
import {addRowElements} from './templates/card-template.js';
import Api from './api.js';
import page from './pageFIle/page.mjs';

class Serie {
    constructor(id, titolo, descrizione, categoria, immagine, proprietario, nome){
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.categoria = categoria;
        this.immagine = immagine;
        this.proprietario = proprietario;
        this.nome = nome;
    }

    static form(json){
        const e = Object.assign(new Serie(), json);
        return e;
    }
}

/**
* Mostra tutti gli episodi di una certa serie
*/
async function showEpisodesOfOneSerie (seId, episodes, app) {
    let serie ;
    let log = await Api.isLoggedIn();
    let fav = false;

    if(seId != 0){
        serie = await ApiSe.getSingleSeries(seId);
    }

    try{
        //Verifico il login per far apparire il simbolo di serie preferita
        let favourites = await ApiSe.getSerieSeguite();
        for(let f of favourites){
            if(f.serieId == seId && seId != 0){
                fav = true;
                break;
            }
        }

        if(seId != 0){
            app.joinUs.insertAdjacentHTML('beforeend', serieTemp(serie, log, fav));
        }
        //aggiunta ed eliminazione della serie dai preferiti
        document.querySelector('#favButton').addEventListener('click', async () => {
            if(fav){
                await Api.deleteFavouriteSerie(seId);
            }
            else{
                await Api.addFavouriteEpSe(seId, 'series');
            }
            page.redirect(`/series/id/${seId}`);
        });
    }catch(err){
        if(seId != 0){
            app.joinUs.insertAdjacentHTML('beforeend', serieTemp(serie, log, fav));
        }
        console.log('userNotLogged')
    }

    if(seId == 0){
        app.mainTitle.innerText = `Risultato Ricerca:`;
    }
    else{
        app.mainTitle.innerText = `Episodi della serie:`;
    }
    
    //ordino gli episodi per data
    const sortedArray  = episodes.sort((a,b) => new moment(a.dataEp).format('YYYYMMDD') - new moment(b.dataEp).format('YYYYMMDD'));

    for(let i=1 ; 0<sortedArray.length ; i++){
        app.serieBox.insertAdjacentHTML('beforeend', addRowElements(i, sortedArray));
        sortedArray.splice(0,4);
    }
}

export default Serie;
export {showEpisodesOfOneSerie};