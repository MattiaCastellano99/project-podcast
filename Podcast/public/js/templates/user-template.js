import Serie from "./../serie.js";
import Category from "../category.js";

function topTitle(){
    return `<h1 class="display-4 font-weight-light text-white">Area Personale</h1>`;
}

function addActionAtSecondaryBar(listenId, usrRole, link, testo){
    return `<a class="nav-link text-light mx-auto" id="action${link}" href="/personal/${usrRole}/${listenId}/${link}">${testo}</a>`;
}

/**
 * EPISODI E SERIE
 */
function addFavElements(count, cat, elements, val = false){
    return `<div class="d-md-flex flex-md-equal w-100 my-md-3 padding-between-seisode" id="rowse${count}">
    ${manageElements(elements, cat, val)}
    </div>`;
}

function manageElements (elements, cat, val) {
    let elFinal = '';
    for(let i=0 ; i<4 && i<elements.length ; i++){
        if(i%2 == 0){
            /* Background White */
            elFinal = elFinal + `<div class="col-md-3 col-sm-12 bg-white  px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div class="my-3 py-3">
                    ${addDeleteElement(i)}
                    ${val ? addEditElements(i, cat, elements[i]) : ''}
                    <h2 class="display-5">${elements[i].titolo}</h2>
                    <p class="lead">${ elements[i].descrizione.length >= 100 ? elements[i].descrizione.substr(0,80) : elements[i].descrizione}</p>
                    <p>${val ? continueLink(elements[i]) : ''}</p>
                </div>
                <div class="shadow-sm mx-auto box-style">
                    <img class="rounded-circle" src="${ elements[i].immagine }" width="100%">
                </div>
            </div>`;
        }
        else{
            /* Background Black */
            elFinal = elFinal + `<div class="col-md-3 col-sm-12 bg-dark  px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div class="my-3 py-3">
                    ${addDeleteElement(i)}
                    ${val ? addEditElements(i, cat, elements[i]) : ''}
                    <h2 class="display-5 text-light">${elements[i].titolo}</h2>
                    <p class="lead text-light">${ elements[i].descrizione.length >= 100 ? elements[i].descrizione.substr(0,80) : elements[i].descrizione}</p>
                    <p>${val ? continueLink(elements[i]) : ''}</p>
                </div>
                <div class="shadow-sm mx-auto box-style">
                    <!-- verifico se si tratta di una serie o di un episodio -->
                    <img class="rounded-circle" src="${ elements[i].immagine }" width="100%">
                </div>
            </div>`
        }
    }
    return elFinal;
}

function continueLink(serie){
    return `<a href="${serie instanceof Serie ? ("/personal/Creatore/"+ serie.proprietario +"/leMieSerie/serie/id/") : "/episode/id/"}${+serie.id}" id="serieID-${serie.id}"> ${serie instanceof Serie ? 'Episodi della Serie' : 'Pi&uacute; info...'}</a>`
}

function addDeleteElement(i){
    return `<button id="delete${i}" type="button" class="btn btn-outline" data-toggle="modal">
        <img src="/icons/delete.png"/>
    </button>`;
}

function addEditElements(i, cat, element){
    return `<button id="edit${i}" type="button" class="btn my-button btn-outline" data-toggle="modal" data-target="#exampleModal11${i}">
        <img src="/icons/edit.png"/>
    </button>
    
    <div class="modal h5 fade" id="exampleModal11${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog text-dark" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel${i}">${ element instanceof Serie ? 'Modifica Serie' : 'Modifica Episodio' }</h3>
                    <button type="button" class="close" id="close-modal${i}" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form-group" action="${ element instanceof Serie ? "/photos/upload" : "/audio/upload/"+element.serieId}" enctype="multipart/form-data" method="post">
                        <div class="form-group">
                            <label for="exampleFormControlSelect1">
                                Titolo</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="titolo${i}" value="${element.titolo}" required="" autofocus="">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlSelect2">
                                Descrizione</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="descrizione${i}" value="${element.descrizione}" required="" autofocus="">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            </div>
                        </div>
                        ${ element instanceof Serie ?` <div class="form-group">
                            <label for="exampleFormControlSelect3">
                                Categoria</label>
                            <div class="d-block my-3">
                                <select class="form-control" id="selectForm${i}">
                                    ${categoryList(cat, element.categoria)}
                                </select>
                            </div>
                        </div>` :
                        `<div class="form-group">
                            <label for="exampleFormControlSelect4">
                                Costo</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="costo${i}" value="${element.costo}" >
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlSelect5">
                                Sponsor</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="sponsor${i}" value="${element.sponsor}" autofocus>
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            </div>
                        </div>`}
                        <div class="form-group">
                            <label for="exampleFormControlSelect4">
                                ${element instanceof Serie ? 'Immagine di Copertina' : 'File Audio'}</label>
                            <input type="file" class="form-control-file" name="${ element instanceof Serie ? 'uploaded_fileNew' : 'uploaded_mp3New'}" id="inputGroupFile${i}" aria-describedby="inputGroupFileAddon01" accept="${element instanceof Serie ? 'image/png' : 'audio/mp3'}">
                        </div>
                        <div class="modal-footer">
                            <div class="form-group">
                                <div>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>    
                                    <button type="submit" id="salva${i}" class="btn btn-primary" data-toggle="modal" >Salva</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
}

function addNewElementTemp( cat_seId ){
    return `${ cat_seId[0] instanceof Category ? 'Nuova Serie' : 'Nuovo Episodio'}
    <button id="newEl" type="button" class="btn my-button btn-outline" data-toggle="modal" data-target="#exampleModal0">
        <img src="/icons/plus.svg">
    </button>
    
    <div class="modal h5 fade" id="exampleModal0" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog text-dark" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel">${ cat_seId[0] instanceof Category ? 'Nuova Serie' : 'Nuovo Episodio'}</h3>
                    <button type="button" class="close" id="close-modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="${ cat_seId[0] instanceof Category ? 'mainForm' : 'salvaNewEp'}" role="form-group" action="${ cat_seId[0] instanceof Category ? '/photos/upload' : '/audio/upload/'+cat_seId}" enctype="multipart/form-data" method="post">
                    <!--<form id="mainForm" role="form-group" enctype="multipart/form-data">-->
                        <div class="form-group">
                            <label for="exampleFormControlSelect1">
                                Titolo</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="titolo" placeholder="Titolo" required autofocus>
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlSelect2">
                                Descrizione</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="descrizione" placeholder="descrizione della serie" required autofocus>
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            </div>
                        </div>
                        ${ cat_seId[0] instanceof Category ? `
                            <div class="form-group">
                                <label for="exampleFormControlSelect3">
                                    Categoria</label>
                                <div class="d-block my-3">
                                    <select class="form-control" id="selectForm">
                                        ${categoryList(cat_seId)}
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect4">
                                    Immagine di Copertina</label>
                                <input type="file" class="form-control-file" name="uploaded_fileNew" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" accept="image/png" required>
                            </div>
                        ` : `
                            <div class="form-group">
                                <label for="exampleFormControlSelect4">
                                    Costo</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="costo" >
                                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect5">
                                    Sponsor</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="sponsor" placeholder="Google" autofocus>
                                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect6">
                                    File Audio</label>
                                <input type="file" class="form-control-file" name="uploaded_mp3New" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" accept="audio/mp3" required>
                            </div>
                        `}
                        <div class="modal-footer">
                            <div class="form-group">
                                <div>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>    
                                    <button type="submit" id="salvaNewEl" class="btn btn-primary" data-toggle="modal" >Salva</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
}

function categoryList(cat, catSelected ){
    let out = '';
    for(let c of cat){
        out += `<option ${c.id == catSelected ? "selected" : ""} id="${c.id}">${c.nome}</option>`
    }
    return out;
}

export {topTitle, addActionAtSecondaryBar, addFavElements, addNewElementTemp};