'use strict';

import Serie from "../serie.js";

/*  count corrisponde al settaggio dell'identificativo
    element corrisponde o alle serie che vanno inserite o agli episodi 
*/

/**
 * EPISODI E SERIE
 */
function addRowElements(count, elements){
    return `<div class="d-md-flex flex-md-equal w-100 my-md-3 padding-between-seisode" id="rowse${count}">
    ${manageElements(elements)}
    </div>`;
}

function manageElements (se) {
    let se4 = '';
    for(let i=0 ; i<4 && i<se.length ; i++){
        if(i%2 == 0){
            /* Background White */
            se4 = se4 + `<div class="col-md-3 col-sm-12 bg-light px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div class="my-3 py-3">
                    <h2 class="display-5">${se[i].titolo}</h2>
                    <p class="lead">${ se[i].descrizione.substr(0,80)+continueLink(se[i]) }</p>
                </div>
                <div class="shadow-sm mx-auto box-style">
                    <img class="rounded-circle" src="${ se[i].immagine }" width="100%">
                </div>
            </div>`;
        }
        else{
            /* Background Black */
            se4 = se4 + `<div class="col-md-3 col-sm-12 bg-dark  px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div class="my-3 py-3">
                    <h2 class="display-5 text-light">${se[i].titolo}</h2>
                    <p class="lead text-light">${se[i].descrizione.substr(0,80)+ continueLink(se[i])}</p>
                </div>
                <div class="shadow-sm mx-auto box-style">
                    <!-- verifico se si tratta di una serie o di un episodio -->
                    <img class="rounded-circle" src="${ se[i].immagine }" width="100%">
                </div>
            </div>`
        }
    }
    return se4;
}

function continueLink(serie){
    return `<a href="${serie instanceof Serie ? "/series/id/" : "/episode/id/"}${+serie.id}" id="serieID-${serie.id}"> Pi&uacute; info...</a>`
}


export {addRowElements};