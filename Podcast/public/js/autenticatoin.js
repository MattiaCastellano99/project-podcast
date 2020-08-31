import Api from './api.js';
import { createJoinUsForm, loginButton, createLoginForm } from './templates/login-template.js';
import { createAlert } from './templates/alert-template.js';
import page from './pageFIle/page.mjs';


/**
 * Esegue il logout
 * @param {*} user 
*/
async function logout (user) {
    await Api.doLogout();
    let lo = document.querySelector('#logout');
    lo.remove();
    document.querySelector('#navToggle').insertAdjacentHTML('afterend', loginButton());
    // rimuovo Area Personale dal menu in alto
    let pa = document.querySelector('#personalArea');
    pa.remove();
    user.ruolo = 'Default';
    page.redirect('/');
}

/**
 * Crea il form di iscrizione
 * @param {*} app
 * @param {*} user
*/
async function showJoinUsPage (app, user) {
    app.mainTitle.innerText = 'Iscriviti';
    app.serieBox.innerHTML = createJoinUsForm();
    document.getElementById('joinus-form').addEventListener('submit', (event) => onJoinUsSubmitted(user, event));
}

/**
 * Event listener per la sottomissione del form di iscrizione. Ne gestisce eventuali errori
 * @param {*} user
 * @param {*} event
*/
async function onJoinUsSubmitted (user, event) {
    event.preventDefault();
    const form = event.target;
    const alertMessage = document.getElementById('alert-message');

    if(form.checkValidity()) {
        try {
            if( document.getElementById('listenerRadio').checked ){
                user.ruolo = "Ascoltatore";
            }
            else if( document.getElementById('creatorRadio').checked ){
                user.ruolo = "Creatore";
            }
            const userAut = await Api.doJoinIn(form.email.value, form.password.value, form.nome.value, user.ruolo);
            if(userAut.localeCompare('Utente Già Registrato') == 0){
                alertMessage.innerHTML = createAlert('danger', `${userAut}!`);
            }
            else{
                // "Benvenuto"
                alertMessage.innerHTML = createAlert('success', `Iscrizione avvenuta con successo ${userAut}!`);
                // Lo rimuove in automatico dopo 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
                page.redirect('/login');
            }
        } catch(error) {
            if (error) {
                const errorMsg = error;
                // Aggiunge un messaggio di errore nel DOM
                alertMessage.innerHTML = createAlert('danger', errorMsg);
                // Lo rimuove in automatico dopo 5 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 5000);
            }
        }
    }
}

/**
 * Crea il form di login
 * @param {*} app
 * @param {*} user
*/
async function showLoginPage (app, user) {
    window.onscroll = function() {};
    app.mainTitle.innerText = 'Esegui il Login';
    app.serieBox.innerHTML = createLoginForm();
    document.getElementById('login-form').addEventListener('submit',(event) => onLoginSubmitted(user, event));
}

/**
 * Event listener per la sottomissione del form di login. Ne gestisce eventuali errori
 * @param {*} user 
 * @param {*} event
*/
async function onLoginSubmitted (user, Event) {
    Event.preventDefault();
    const form = Event.target;
    const alertMessage = document.getElementById('alert-message');

    if(form.checkValidity()) {
        try {
            await Api.doLogin(form.email.value, form.password.value);
            user = await Api.getUserById();
            // "Benvenuto"
            alertMessage.innerHTML = createAlert('success', `Benvenuto ${user.nome}!`);
            // Lo rimuove in automatico dopo 3 sec
            setTimeout(() => {
                alertMessage.innerHTML = '';
            }, 3000);
            page.redirect('/');
        } catch(error) {
            if (error) {
                const errorMsg = error;
                // Aggiunge un messaggio di errore nel DOM
                alertMessage.innerHTML = createAlert('danger', errorMsg);
                // Lo rimuove in automatico dopo 5 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 50000);
            }
        }
    }
}

export {logout, showLoginPage, showJoinUsPage};