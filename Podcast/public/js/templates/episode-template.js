'use strict';

import {showAddFav} from './menu-top-template.js'

function addEpisode(ep, login, fav){
    return `${login ? showAddFav(fav) : ''}
    <div class="row">
        <div class="col-md-5 p-lg-5 mx-auto my-2 text-light">
            <h1 class="display-4 mx-auto font-weight-light text-white">${ep.titolo}</h1>
            <p class="lead font-weight-normal">
                ${ep.descrizione}
            </p>
        </div>

        <div class="col-md-4 p-lg-5 mx-auto my-2 text-light">
            <img class="rounded-circle" src="${ep.immagine}" width="100%">
            <p class="my-3">${ep.sponsor == null || ep.sponsor == '' ? '' : 'Sponsorizzato da: '+ep.sponsor}</p>
        </div>
    </div>
    
    <div id="payButton" class="p-lg-5 row mx-auto my-2 text-light">
        ${login ? insertMp3(ep) : joinUs()}
    </div>
    `;
}

function insertComment(com){
    let commenti = ``;

    for(let c of com){
        commenti = commenti + `<p class="text-light text-center">${c.testo}</p>`;
    }
    return commenti;
}

function insertAddComment(){
    return `Commenti
    <button id="myModal" type="button" class="btn my-button btn-outline" data-toggle="modal" data-target="#exampleModal0">
        <img src="./../../icons/plus.svg">
    </button>

    <div class="modal fade" id="exampleModal0" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog text-dark" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel">Nuovo Commento</h3>
                    <button type="button" class="close" id="close-modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form role="form" method="POST" id="myForm">
                    <div class="modal-body" id = "MB">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Testo Commento" id="inputDescription" aria-describedby="emailHelp">
                            <div class="invalid-feedback">
                                Inserire una descrizione.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="form-group">
                            <div>
                                <button id="editComment" type="button" class="btn btn-primary">Salva</button>
                                <button  type="submit" class="btn btn-outline d-none">Aggiorna</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}

function insertMp3(ep){
    return `<audio controls class="mx-auto">
        <source src="${ep.fileAudio}" type="audio/mp3">
        Your browser does not support the audio element.
    </audio>`;
}

function joinUs(){
    return `<button type="button" class="btn row mx-auto btn-primary" data-toggle="modal" data-target="#ModalCenter">
        Play
    </button>
    <div class="modal fade text-dark" id="ModalCenter" tabindex="-1" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Non Sei Loggato</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Per poter ascoltare i Podcast &egrave necessario essere registrati
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>    
                    <button type="button" id="accedi" class="btn btn-primary">Accedi</button>
                    <button type="button" id="registrati" class="btn btn-primary">Iscriviti</button>
                </div>
            </div>
        </div>
    </div>`;
}

function paymentTemplate(costo){
    return `<button id="newEp" type="button" class="btn row mx-auto btn-primary" data-toggle="modal" data-target="#exampleModal1">
        Episodio a Pagamento
    </button>

    <div class="modal h5 fade" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog text-dark" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel">Nuovo Episodio</h3>
                    <button type="button" class="close" id="close-modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form-group">
                        <div class="form-group">
                            <label for="description">
                                Episodio a pagamento</label>
                            <div class="input-group">
                                <p>Per poter ascoltare questo episodio è necessario pagare ${costo} €</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="cardNumberFor">
                                Numero di Carta</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="cardNumber" placeholder="Numero di Carta Valido" required autofocus>
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="nome">
                                Intestatario</label>
                            <div class="input-group">
                                <div class="row">
                                    <div class="col-xs-7 col-md-7">
                                        <label for="nome">
                                            Nome</label>
                                        <div class="col-xs-6 col-lg-6 pl-ziro">
                                            <input type="text" class="form-control" id="nome" placeholder="Mario" required autofocus>
                                            <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                        </div>
                                    </div>
                                    <div class="col-xs-5 col-md-5 pull-right">
                                        <label for="cognome">
                                            Cognome</label>
                                        <div class="col-xs-10 col-lg-10 pl-ziro">
                                            <input type="text" class="form-control" id="cognome" placeholder="Rossi" required>
                                            <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlSelect5">
                                Metodo di Pagamento</label>
                            <div class="input-group">
                                <div class="d-block my-3 mx-auto">

                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" id="credit" name="paymentMethod" value="option1" checked>
                                        <label class="form-check-label" for="exampleRadios1">
                                        Mastercard
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" id="debit" name="paymentMethod" value="option2">
                                        <label class="form-check-label" for="exampleRadios2">
                                        Carta di Debito
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" id="paypal" name="paymentMethod" value="option2">
                                        <label class="form-check-label" for="exampleRadios2">
                                        PayPal
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-xs-7 col-md-7">
                                    <label for="yy">
                                        Data Scadenza</label>
                                    <div class="col-xs-6 col-lg-6 pl-ziro">
                                        <input type="text" class="form-control" id="mm" placeholder="MM" required autofocus>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                    </div>
                                    <div class="col-xs-6 col-lg-6 pl-ziro">
                                        <input type="text" class="form-control" id="yy" placeholder="YY" required autofocus>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                    </div>
                                </div>
                                <div class="col-xs-3 col-md-3 pull-right">
                                    <label for="cvv">
                                        Codice CV</label>
                                    <input type="password" class="form-control" id="cvv" placeholder="CV" required autofocus>
                                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                </div>
                            </div>
                        </div>
                        <div id="mHeader">
                        </div>
                        <div class="modal-footer">
                            <div class="form-group">
                                <div>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>    
                                    <button type="button" id="pagaOk" class="btn btn-primary">Effettua Il Pagamento</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>` ;
}

export {addEpisode, paymentTemplate, insertComment, insertAddComment};