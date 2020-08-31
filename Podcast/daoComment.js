'use strict';

/*********IMPORT***********/
const sqlite = require('sqlite3');
const db = new sqlite.Database('podcast.db', (err) => {
    if (err) throw err;
});

/********DATABASE QUERY*********/

exports.getEpisodeComments = function(epId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM "commenti-user" WHERE episodioId = ?';
        db.all(sql, [epId], (err, rows) => {
            if (err) 
                reject(err);
            else {
                resolve(rows);
            }
        });
    });
};

exports.getUserComment = function(usrId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM "commenti-user" WHERE userId = ?';
        db.all(sql, [usrId], (err, rows) => {
            if (err) 
                reject(err);
            else {
                resolve(rows);
            }
        });
    });
};

exports.getUserEpisodeComment = function(usrId, epId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM "commenti-user" WHERE userId = ? AND episodioId = ?';
        db.all(sql, [usrId, epId], (err, rows) => {
            if (err) 
                reject(err);
            else {
                resolve(rows);
            }
        });
    });
};

exports.deleteCommentByEpisodeId = function(epId, usrId) {
    return new Promise((resolve, rejected) => {
        if(usrId){
            const sql = 'DELETE FROM "commenti-user" WHERE episodioId = ? AND userId = ?'; 
            db.all(sql, [epId, usrId], (err) =>{
                if(err){
                    rejected(err);
                }
                resolve();
            });
        }else{
            const sql = 'DELETE FROM "commenti-user" WHERE episodioId = ?'; 
            db.all(sql, [epId], (err) =>{
                if(err){
                    rejected(err);
                }
                resolve();
            });
        }
    });
}

exports.createComment = function(epId, usrId, testo){
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE "commenti-user" SET userId = ?, episodioId = ?, testo = ? WHERE episodioId = ? AND userId = ?';
        db.run(sql, [usrId, epId, testo, epId, usrId] ,(err) =>{
            if(err){
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

exports.addComment = function (usrId, epId, testo){
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO "commenti-user"(userId, episodioId, testo) VALUES(?,?,?)';
        db.run(sql, [usrId, epId, testo] ,(err) =>{
            if(err){
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}