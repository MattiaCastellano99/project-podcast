'use strict';

function addCatAtSecondaryBar(cat, active){
    return `<a class="nav-link text-light mx-auto ${active == cat.nome ? 'active' : ''}" href="${cat.nome != 'Home' ? '/categories/'+cat.nome : '/'}">${cat.nome}</a>`;
}

function addSearchBar(cat){
    return `<input class="form-control mr-sm-2 mx-md-5 col-md-10 col-sm-5 text-center" type="text" id="searchInput" placeholder="Cerca in Serie/Episodio" required aria-label="Search">
    
    <button id="buttonSerachSe" type="button" class="btn btn-outline-success my-2 my-sm-0 mx-auto" data-toggle="modal" data-target="#searchModalSe">Cerca</button>

    <div class="modal fade" id="searchModalSe" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel">Filtri</h3>
                    <button type="button" class="close" id="close-modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form role="form" method="POST" id="myForm">
                    <div class="modal-body" id = "MB">
                        Scegliere che filtri si vogliono applicare alla ricerca che si sta facendo (se i campi non vengono modificati la ricerca verr&aacute; effettuata su tutte le categorie e sia sulle Serie che sugli Episodi).
                        La ricerca andr&aacute; a cercare la parola inserita tra i commenti e i titoli
                        <div class="form-group">
                            <label for="exampleFormControlSelect1">Categorie</label>
                            <select class="form-control" id="exampleFormControlSelect1">
                            <option>Tutte le Categorie</option>
                            ${categoryOption(cat)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlSelect2">Serie/Episodi</label>
                            <select class="form-control" id="exampleFormControlSelect2">
                                <option>Sia Serie che Episodi</option>
                                <option>Serie</option>
                                <option>Episodi</option>
                            </select>
                        </div>
                    </div> 
                    <div class="modal-footer">
                        <div class="form-group">
                            <div>
                                <button id="editSearch" type="button" class="btn btn-primary">Cerca</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}

function categoryOption(cat){
    let ret = '';
    for(let c of cat){
        ret += `<option>${c.nome}</option>`;
    }
    return ret;
}

export {addCatAtSecondaryBar, addSearchBar};