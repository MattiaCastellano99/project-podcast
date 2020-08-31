'use strict';

import Category from "./../category.js";

class ApiCat{

    /**
     * GET delle categorie
     */
    static getAllCategories = async () => {
        let response = await fetch('/api/categories');
        let jsonResponse = await response.json();
        if(response.ok){
            return jsonResponse.map((ex) => Category.form(ex));
        }
        else{
            //errore in formato json che arriva dal server
            throw jsonResponse;
        }
    }
}

export default ApiCat;