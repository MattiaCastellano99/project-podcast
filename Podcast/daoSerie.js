'use strict';

/*********IMPORT***********/
const sqlite = require('sqlite3');
const db = new sqlite.Database('podcast.db', (err) => {
    if (err) throw err;
});

/********DATABASE QUERY*********/
exports.getAllSeries = function(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from serie';
        db.all(sql, (err, rows)=> {
            if(err){
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

exports.getSerieById = function(id){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT serie.id, serie.titolo, serie.descrizione, serie.categoria, serie.immagine, serie.proprietario, utenti.nome from serie JOIN utenti ON serie.proprietario = utenti.id WHERE serie.id = ?';
        db.all(sql, [id], (err, row)=> {
            if(err || row.length == 0){
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}

exports.getCategorySeries = function(categoria){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT serie.id, serie.titolo, serie.descrizione, serie.categoria, serie.immagine, serie.proprietario from serie JOIN "categorie-serie" ON serie.categoria = "categorie-serie".id  WHERE "categorie-serie".nome = ?';
        db.all(sql, [categoria], (err, row)=> {
            if(err || row.length == 0){
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}

exports.getSerieEpisode = function(episodioId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT serie.id, serie.titolo, serie.descrizione, serie.categoria, serie.immagine, serie.proprietario from serie JOIN episodi ON serie.id = episodi.serieId WHERE episodi.id = ?';
        db.all(sql, [episodioId], (err, row)=> {
            if(err || row.length == 0){
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}

exports.addSerieToFavourite = function (usrId, seId){
    return new Promise ((resolve, reject) => {
        let sql = 'INSERT INTO "serie-preferite"(userId, serieId) VALUES(?,?)';
        db.run(sql, [usrId, seId] ,(err) =>{
            if(err){
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.createSerie = function(serie){
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO serie(titolo, descrizione, categoria, immagine, proprietario) VALUES(?,?,?,?,?)';
        db.run(sql, [serie.titolo, serie.descrizione, serie.categoria, serie.immagine, serie.proprietario] ,(err) =>{
            if(err){
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.editSerie = function(serie){
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE serie SET titolo = ?, descrizione = ?, categoria = ?, immagine = ? WHERE id = ? AND proprietario = ?';
        db.run(sql, [serie.titolo, serie.descrizione, serie.categoria, serie.immagine, serie.id, serie.proprietario] ,(err) =>{
            if(err){
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.deleteSingleSerie = function(id){
    return new Promise((resolve, rejected) => {
        const sql = 'DELETE from serie WHERE id = ?';
        db.run(sql, [id], (err) =>{
            if(err){
                rejected(err);
            }
            
            const sql1 = 'DELETE from "serie-preferite" WHERE serieId = ?';
            db.run(sql1, [id], (err1) =>{
                if(err1){
                    rejected(err1);
                }
                resolve(id);
            });
        });
    });
};

exports.deleteFavSerieBySerieId = function(seId, usrId) {
    return new Promise((resolve, rejected) => {
        const sql = 'DELETE FROM "serie-preferite" WHERE serieId = ? AND userId = ?';

        db.run(sql, [seId, usrId], (err) =>{
            if(err){
                rejected(err);
                return;
            }
            resolve();
        });
    });
}

exports.getUserFavouriteSeries = function(userId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from "serie-preferite" WHERE "userId" = ?';
        db.all(sql, [userId], (err, rows)=> {
            if(err){
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

exports.getSeriesMatch = function(cat, txt){
    return new Promise((resolve, reject) => {
        txt = "%"+txt+"%";
        if(cat.localeCompare("Tutte le Categorie") == 0){
            const sql = 'SELECT * from "serie" WHERE titolo LIKE ? OR descrizione LIKE ?';
            db.all(sql, [txt, txt], (err, rows)=> {
                if(err){
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        }
        else{
            const sql = 'SELECT * FROM serie JOIN "categorie-serie" ON serie.categoria = "categorie-serie".id WHERE (nome LIKE ? AND descrizione LIKE ?) OR (nome LIKE ? AND titolo LIKE ?)';
            db.all(sql, [cat, txt, cat, txt], (err, rows)=> {
                if(err){
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        }
    });
}

exports.getMySeries = function(userId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from serie WHERE proprietario = ?';
        db.all(sql, [userId], (err, rows)=> {
            if(err){
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

