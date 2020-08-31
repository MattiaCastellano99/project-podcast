'use strict'

function createLoginForm() {
    return`<form method="POST" action="" id="login-form" class="col-6 mx-auto">            
        <div class="form-group">
            <label for="email">Indirizzo mail</label>
            <input type="email" name="email" class="form-control" required />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" class="form-control" required autocomplete/>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        <p>
            <a class="text-white" href="/join-us">Non sei Registrato? Unisciti a noi</a>
        </p>
    </form>`;
}

function createJoinUsForm(){
    return `<form id="joinus-form" class="col-6 mx-auto">
        <div class="form-group">
            <label for="email">Indirizzo mail</label>
            <input type="email" name="email" class="form-control" placeholder="example@mail.com" required />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" class="form-control" placeholder="password" required autocomplete/>
        </div>
        <div class="form-group">
            <label for="nome">Il tuo Nome</label>
            <input type="text" name="nome" class="form-control" id="exampleDropdownFormNome" placeholder="Marco ( nome che apparir&aacute; come proprietario )" required>
        </div>
        <div class="form-group">
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="listenerRadio" name="Radio" class="custom-control-input" value="Listener" checked>
                <label class="custom-control-label" for="listenerRadio">Ascoltatore</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="creatorRadio" name="Radio" class="custom-control-input" value="Creator">
                <label class="custom-control-label" for="creatorRadio">Creatore</label>
            </div>
        </div>
        <button type="submit" class="btn btn-primary">Iscriviti</button>
        <p>
            <a class="text-white" href="/login">Sei gi&aacute Registrato? Esegui il Login</a>
        </p>
    </form>`;
}

function logoutButton(){
    return `<a class="nav-item nav-link rem-padding" id="logout" href="/logout" title"Logout">
        <svg class="bi bi-door-closed bg-dark" width="2em" height="2em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2zm1 0v13h8V2H4z"/>
            <path d="M7 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            <path fill-rule="evenodd" d="M1 15.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
        </svg>
    </a>`;
}

function loginButton(){
    return `<a class="nav-item nav-link rem-padding" id="login" href="/login" title"Login">
        <svg class="bi bi-people-circle bg-dark" width="2em" height="2em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z"/>
            <path fill-rule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clip-rule="evenodd"/>
        </svg>
    </a>`;
}

export {createLoginForm, createJoinUsForm, loginButton, logoutButton};