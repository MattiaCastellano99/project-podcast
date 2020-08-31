'use strict';

/*********IMPORT***********/
const sqlite = require('sqlite3');
const db = new sqlite.Database('podcast.db', (err) => {
    if (err) throw err;
});
const bcrypt = require('bcrypt');

/********DATABASE QUERY*********/

exports.getAllCategories = function(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from "categorie-serie"';
        db.all(sql, (err, rows)=> {
            if(err){
                reject(err);
            }
            resolve(rows);
        });
    });
};

exports.getUserEpisodesPayed = function(usrId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM "episodi-comprati" WHERE userId = ?';
        db.all(sql, [usrId], (err, rows) => {
            if (err) 
                reject(err);
            else {
                resolve(rows);
            }
        });
    });
};

exports.getUser = function(email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
              const user = {id: row.id, username: row.email};
              let check = false;
              if(bcrypt.compareSync(password, row.password))
                check = true;
              resolve({user, check});
            }
        });
    });
};

exports.getUserById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
                resolve(row);
            }
        });
    });
};

exports.createUser = function(user) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO utenti("email", "password", "nome", "ruolo") VALUES (?,?,?,?)';
        //cripto la password con chiave di cifratura 10
        bcrypt.hash(user.pw, 10).then((hash => {
            db.run(sql, [user.email, hash, user.nome, user.ruolo], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(this.lastID);
            });
        }));
    });
}

exports.doPayment = function(usrId, epId){
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO "episodi-comprati"(userId, episodioId) VALUES(?,?)';
        db.run(sql, [usrId, epId] ,(err) =>{
            if(err){
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

exports.controlUserAlreadyJoined = function(usrEmail) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE email = ?';
        db.all(sql, [usrEmail], (err, rows) => {
            if (err) 
                reject(err);
            if(rows.length == 0)
                reject("nuovo utente");
            else
                resolve(rows);
        });
    });
};
