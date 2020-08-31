'use strict';

function addCatSring(){
    return `<a class="nav-link dropdown-toggle" href="http://example.com" id="catStrDropdown1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Categorie</a>`;
}

function addCatDropdown(cat) {
    return `<a class="dropdown-item category-dropdown text-light" href="/categories/${cat.nome}">${cat.nome}</a>`;
}

function joinUsTemp(){
    return `<div class="col-md-5 p-lg-5 mx-auto my-5 text-light">
        <h1 class="display-4 font-weight-light text-white">Perch&eacute; ascoltare i nostri podcast?</h1>
        <p class="lead font-weight-normal">Mi serve una frase che tocchi la gente, per poi rosolare parole per niente.</p>
        <a href="/join-us"><button class="btn btn-light">Iscriviti</button></a>
        <a href="/login"><button class="btn btn-dark">Accedi</button></a>
    </div>`;
}

/**
 * template sostitutivo del joinUs della schermata di una serie specifica
 */
function serieTemp(se, log, fav){
    return `${log ? showAddFav(fav) : ''}
    <div class="col-md-5 mx-auto text-light">
        <h1 class="display-4 font-weight-light text-white">${se.titolo}</h1>
        <p class="lead font-weight-normal">${se.descrizione}</p>
    </div>
    <p class="text-right">${se.nome}</p>`;
}

function showAddFav(fav){
    if (! fav){
        return `<button id="favButton" type="button" class="btn btn-outline favourite-button" data-toggle="modal">
            <svg width="3em" height="3em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>
        </button>`;
    }
    return `<button id="favButton" type="button" class="btn btn-outline favourite-button" data-toggle="modal">
        <svg width="3em" height="3em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>
    </button>`;
}

function welcomeTemp(user){
    return `<div class="col-md-5 p-lg-5 mx-auto my-5 text-light">
        <h1 class="display-4 font-weight-light text-white">Bentornato ${user.nome}</h1>
    </div>`;
}

function profileTemplate(user){
    return `<a class="nav-link" id="personalArea" href="/personal/${user.ruolo}/${user.id}/serieSeguite">Area Personale</a>`;
}

function addMainTite(txt){
    return`<div class="bg-dark padding-between-episode">
        <h1 class="text-light text-center">${txt}</h1>
    </div>`;
}

export {addCatDropdown, joinUsTemp, serieTemp, welcomeTemp, addCatSring, profileTemplate, showAddFav, addMainTite};