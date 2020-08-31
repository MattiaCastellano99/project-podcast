'use strict';

/**
 * COMMENTI
 */
function addEpisodeComment(i,arr){
    return `<div class="d-md-flex flex-md-equal w-100 my-md-3 padding-between-seisode" id="rowse${i}">
    ${manageEpComment(arr)}
    </div>`;
}

function manageEpComment (se) {
    let elFinal = '';
    for(let i=0 ; i<4 && i<se.length ; i++){
        if(i%2 == 0){
            /* Background White */
            elFinal = elFinal + `<div class="col-md-3 col-sm-12 bg-white  px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div class="my-3 py-5">
                    <h2 class="display-5">${se[i].titolo}</h2>
                </div>
                <div class="shadow-sm mx-auto box-style">
                    <img class="rounded-circle" src="${ se[i].immagine }" width="100%">
                </div>
                <div class="my-3 py-3">
                    <p class="display-5">${se[i].testo}</p>
                    ${addManageComment(se[i].testo, i)}
                    ${addDeleteComment(i)}
                </div>
            </div>`;
        }
        else{
            /* Background Black */
            elFinal = elFinal + `<div class="col-md-3 col-sm-12 bg-dark  px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div class="my-3 py-5">
                    <h2 class="display-5 text-light">${se[i].titolo}</h2>
                </div>
                <div class="shadow-sm mx-auto box-style">
                    <img class="rounded-circle" src="${ se[i].immagine }" width="100%">
                </div>
                <div class="my-3 py-3">
                    <p class="display-5 text-light">${se[i].testo}</p>
                    ${addManageComment(se[i].testo, i)}
                    ${addDeleteComment(i)}
                </div>
            </div>`;
        }
    }
    return elFinal;
}

function addManageComment(ep, i){
    return `<button id="myModal" type="button" class="btn btn-outline" data-toggle="modal" data-target="#exampleModal${i}">
        <img src="https://img.icons8.com/pastel-glyph/64/000000/edit.png"/>
    </button>

    <div class="modal fade" id="exampleModal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel">Modifica Commento</h3>
                    <button type="button" class="close" id="close-modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form role="form" method="POST" id="myForm">
                    <div class="modal-body" id = "MB">
                        <div class="form-group">
                            <label for="validationTextarea">Commento</label>
                            <input type="text" class="form-control" value="${ep}" id="inputDescription${i}" aria-describedby="emailHelp">
                            <div class="invalid-feedback">
                                Inserire una descrizione.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="form-group">
                            <div>
                                <button id="editComment${i}" type="button" class="btn btn-primary">Salva</button>
                                <button  type="submit" class="btn btn-outline d-none">Aggiorna</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}

function addDeleteComment(i){
    return `<button id="delete${i}" type="button" class="btn btn-outline" data-toggle="modal">
        <img src="https://img.icons8.com/flat_round/64/000000/delete-sign.png"/>
    </button>`;
}

export {addEpisodeComment, addManageComment}