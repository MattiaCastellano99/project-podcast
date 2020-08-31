'use strict';

/*********IMPORT***********/
const sqlite = require('sqlite3');
const db = new sqlite.Database('podcast.db', (err) => {
    if (err) throw err;
});

exports.getAllEpisodeSeries = function(id){
    return new Promise((resolve, reject) => {
        const sql = `SELECT episodi.id, episodi.titolo, episodi.descrizione, episodi.fileAudio, episodi.dataEp, episodi.sponsor, episodi.costo, episodi.serieId, serie.immagine FROM episodi JOIN serie ON episodi.serieId = serie.id WHERE episodi.serieId = ?`;
        db.all(sql, [id], (err, rows) => {
            if(err){
                reject(err);
            }
            resolve(rows);
        });
    });
};

exports.getAllUserEpisodeSeries = function(seid, usrid){
    return new Promise((resolve, reject) => {
        const sql = `SELECT episodi.id, episodi.titolo, episodi.descrizione, episodi.fileAudio, episodi.dataEp, episodi.sponsor, episodi.costo, episodi.serieId, serie.immagine FROM episodi JOIN serie ON serieId = serie.id WHERE episodi.serieId = ? AND serie.proprietario = ?`;
        db.all(sql, [seid, usrid], (err, rows) => {
            if(err){
                reject(err);
            }
            resolve(rows);
        });
    });
};

exports.getEpisodeById = function(id){
    return new Promise((resolve, reject) => {
        const sql = "SELECT episodi.id, episodi.titolo, episodi.descrizione, episodi.fileAudio, episodi.dataEp, episodi.sponsor, episodi.costo, episodi.serieId, serie.immagine FROM episodi JOIN serie ON serieId = serie.id WHERE episodi.id = ?";
        db.get(sql, [id], (err, row)=> {
            if(err){
                reject(err);
            }
            resolve(row);
        });
    });
}

exports.getEpisodeFileAudio = function(id){
    return new Promise((resolve, reject) => {
        const sql = "SELECT fileAudio from episodi WHERE id = ?";
        db.all(sql, [id], (err, row)=> {
            if(err || row.length == 0){
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}

exports.addEpisodeToFavourite = function (usrId, epId){
    return new Promise ((resolve, reject) => {
        let sql = 'INSERT INTO "episodi-preferiti"(userId, episodioId) VALUES(?,?)';
        db.run(sql, [usrId, epId] ,(err) =>{
            if(err){
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.createEpisode = function(ep){
    return new Promise((resolve, reject) =>{
        const sql = "INSERT INTO episodi(titolo, descrizione, fileAudio, dataEp, sponsor, costo, serieId) VALUES(?,?,?,?,?,?,?)";
        db.run(sql, [ep.titolo, ep.descrizione, ep.mp3, ep.data, ep.sponsor, ep.costo, ep.sId] ,(err) =>{
            if(err){
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.editSeEpisode = function(ep){
    return new Promise((resolve, reject) =>{
        const sql = "UPDATE episodi SET titolo=?, descrizione=?, fileAudio=?, sponsor=?, costo=?, serieId=? WHERE episodi.id = ? ";
        db.run(sql, [ep.titolo, ep.descrizione, ep.mp3, ep.sponsor, ep.costo, ep.sId, ep.id] ,(err) =>{
            if(err){
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.deleteSingleEpisode = function(id){
    return new Promise((resolve, rejected) => {
        const sql = 'DELETE from episodi WHERE id = ?';
        db.run(sql, [id], (err) =>{
            if(err){
                rejected(err);
            }
            const sql1 = 'DELETE from "episodi-comprati" WHERE episodioId = ?';
            db.run(sql1, [id], (err1) =>{
                if(err1){
                    rejected(err1);
                }
                const sql2 = 'DELETE from "episodi-preferiti" WHERE episodioId = ?';
                db.run(sql2, [id], (err2) =>{
                    if(err2){
                        rejected(err2);
                    }
                    resolve();
                });
            });
        });
    });
};

exports.deleteFavEpisodeByEpisodeId = function(epId, usrId) {
    return new Promise((resolve, rejected) => {
        const sql = 'DELETE FROM "episodi-preferiti" WHERE episodioId = ? AND userId = ?';
        db.run(sql, [epId, usrId], (err) =>{
            if(err){
                rejected(err);
                return;
            }
            resolve();
        });
    });
}

exports.deleteSingleEpisodeBySeId = function(id){
    return new Promise((resolve, rejected) => {
        const sql = 'DELETE from episodi WHERE serieId = ?';
        db.all(sql, [id], (err) =>{
            if(err){
                rejected(err);
                return;
            }
            resolve('Episodi cancellati correttamente');
        });
    });
};

exports.getUserFavouriteEpisodes = function(userId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from "episodi-preferiti" WHERE "userId" = ?';
        db.all(sql, [userId], (err, rows)=> {
            if(err){
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

exports.getEpisodesMatch = function(cat, txt){
    return new Promise((resolve, reject) => {
        txt = "%"+txt+"%";
        if(cat.localeCompare("Tutte le Categorie") == 0){
            const sql = 'SELECT episodi.id, episodi.titolo, episodi.descrizione, episodi.fileAudio, episodi.dataEp, episodi.sponsor, episodi.costo, episodi.serieId, serie.immagine FROM episodi JOIN serie ON episodi.serieId = serie.id WHERE episodi.titolo LIKE ? OR episodi.descrizione LIKE ?';
            db.all(sql, [txt, txt], (err, rows)=> {
                if(err){
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        }
        else{
            const sql = 'SELECT episodi.id, episodi.titolo, episodi.descrizione, episodi.fileAudio, episodi.dataEp, episodi.sponsor, episodi.costo, episodi.serieId, serie.immagine FROM episodi JOIN serie ON episodi.serieId = serie.id JOIN "categorie-serie" ON serie.categoria = "categorie-serie".id WHERE (nome LIKE ? AND episodi.descrizione LIKE ?) OR (nome LIKE ? AND episodi.titolo LIKE ?)';
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