'use strict';

import {addCatDropdown, addCatSring} from'./templates/menu-top-template.js';

// Quando l'utente scrolla in giù più di 50px dalla cima della pagina, le categorie diventano un dropdown terminal

let count = 0;
function scrollFunction(cat) {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        if(count == 0){
            document.querySelector('#titleHere').insertAdjacentHTML('afterbegin', addCatSring());
            for(let category of cat){
                document.querySelector('#categoriesDropdown').insertAdjacentHTML('beforeend', addCatDropdown(category));
            }
            count = 1;
        }
    }
    else{
        count = 0;
        document.querySelector('#categoriesDropdown').innerHTML="";
        if(document.querySelector('#catStrDropdown1') != null ){
            let title = document.querySelector('#titleHere')
            title.removeChild(title.firstChild);
        }
    }
}

export {scrollFunction};