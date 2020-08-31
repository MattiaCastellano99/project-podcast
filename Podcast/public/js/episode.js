import ApiEp from './api/api-episodes.js';
import { addEpisode, insertComment, paymentTemplate, insertAddComment } from './templates/episode-template.js';
import Api from './api.js';
import page from './pageFIle/page.mjs';
import { createAlert } from './templates/alert-template.js';

class Episode{
    constructor(id, titolo, costo, dataEp, fileAudio, descrizione, serieId, sponsor, immagine){
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.fileAudio = fileAudio;
        this.dataEp = dataEp;
        this.sponsor = sponsor;
        this.costo = costo;
        this.serieId = serieId;
        this.immagine = immagine;
    }
    
    /**
     * Costruisce un episodio dato un form json
     * @param {*} json 
     * @return {Episode}
     */
    static form(json){
        const e = Object.assign(new Episode(), json);
        e.dataEp = moment(e.dataEp, "DD/MM/YYYY");
        return e;
    }

    /**
    * Mostra un certo episodio
    */
    static showOneEpisode = async (episode, app) => {
        let log = await Api.isLoggedIn();
        let comments = await Api.getCommentsByEpId(episode.id);

        let fav = false;
        try{
            let favourites = await ApiEp.favouritesEpisodes();
            for(let f of favourites){
                if(f.episodioId == episode.id){
                    fav = true;
                    break;
                }
            }
        }catch(err){
            console.log('userNotLogged')
        }
        app.joinUs.insertAdjacentHTML('beforeend', addEpisode(episode, log, fav));
        try{
            document.querySelector('#favButton').addEventListener('click', async () => {
                if(fav){
                    await Api.deleteFavouriteEpisode(episode.id);
                }
                else{
                    await Api.addFavouriteEpSe(episode.id, 'episode');
                }
                page.redirect(`/episode/id/${episode.id}`);
            });
        }catch(err){
            console.log('userNotLogged')
        }

        app.mainTitle.innerText = `Commenti`;
        app.serieBox.insertAdjacentHTML('beforeend', insertComment(comments));
        //se l'utente non si è autenticato
        if(log){
            userAuth(episode, app);
        }else{
            userNotAuth();
        }
    }
}

function userNotAuth () {
    document.getElementById('accedi').addEventListener('click', function () {
        $('#ModalCenter').modal('toggle');
        page.redirect('/login')
    });
    document.getElementById('registrati').addEventListener('click', function () {
        $('#ModalCenter').modal('toggle');
        page.redirect('/join-us');
    });
}

async function userAuth (episode, app) {
    try{
        //possibilita' di aggiungere commenti
        let add = await ApiEp.getUserEpisodeComment(episode.id);
        if(add.length == 0){
            app.mainTitle.innerHTML = insertAddComment();
            let edit = document.querySelector(`#editComment`);
            edit.addEventListener('click', function () {
                Api.addEpisodeComment(episode.id, document.querySelector(`#inputDescription`).value)
                .then(() => {
                    $(`#exampleModal0`).modal('toggle');
                    page.redirect(`/episode/id/${episode.id}`);
                })
                .catch((error) => {throw(error)});
            });
        }
        let epPay = await ApiEp.getUserPayedEpisodes();
        let payed = false;
        for(let ep of epPay){
            if(ep.id == episode.id){
                payed = true;
                break;
            }
        }
        //se l'episodio è a pagamento e l'utente NON l'ha già acquistato
        if(episode.costo != 0 && !payed){
            document.querySelector('#payButton').innerHTML='';
            document.querySelector('#payButton').insertAdjacentHTML('beforeend', paymentTemplate(episode.costo));
            document.getElementById('pagaOk').addEventListener('click', async function() {
                const cardN = document.getElementById('cardNumber').value;
                const nome = document.getElementById('nome').value;
                const cognome =  document.getElementById('cognome').value;
                const cvv = document.getElementById('cvv').value;
                const month =  document.getElementById('mm').value;
                const year = document.getElementById('yy').value;
                let payment = await Api.userPayEpisode(episode.id, cardN, nome, cognome, cvv, month, year );
                if(payment != true){
                    const alertMessage = document.getElementById('mHeader');
                    alertMessage.insertAdjacentHTML('beforeend', createAlert('danger', `Campo: ${payment[0].param} errato !`));
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 5000);
                }
                else{
                    $(`#exampleModal1`).modal('toggle');
                    page.redirect(`/episode/id/${episode.id}`);
                }
            });
        }
    }catch(err){
        throw(err);
    }
}


export default Episode;