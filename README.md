# project-podcast

## Autore: Castellano Mattia, 20031813

Link al video introduttivo: https://youtu.be/TFlnsaby9zA

Link al repository su GitHub contenente il progetto: https://github.com/MattiaCastellano99/project-podcast

una volta scaricato il progetto dal link qui sopra, basterà aprire la cartella su Visual Studio Code, aprire il terminale e digitare il comando 'npm install' al fine di andare ad installare tutto il necessario per il corretto funzionamento sulla propria macchina.
Una volta fatto ciò si potrà andare a lanciare il server digitando sempre su terminale:
-   per lanciare il server su linux --> npm start
    per lanciare il server su windows --> npx nodemon server.js

a questo punto il server sarà online e disponibile alla pagina: 
http://localhost:3000/


TIPS
-   al fine di avere un effetto video non distorto è bene che le immagini siano in formato 500x500 px

-   Indicazioni server.js:
    .   server.js contiene le routes legate all'autenticazione (login, join-us e logout). Contiene inoltre routes legate all'utente (verifica dell'accesso e recupero delle informazioni). Infine contiene le routes che permettono l'upload delle immagini e dei file audio.
    .   tutte le routes che si riferiscono alle Serie sono contenute in serieRoutes.js contenuta nella cartella routes.
    .   tutte le routes che si riferiscono agli Episodi sono contenute in episodiRoutes.js contenuta nella cartella routes.
    .   tutte le routes che si riferiscono ai Commenti sono contenute in commentiRoutes.js contenuta nella cartella routes.

-   fs: è un modulo js built in che consente l'eliminazione di un certo file dato un certo path

-   multer: middleware js che consente di caricare un file in un determinato percorso

-   il deploy del database in sql si trova nella cartella Podcast ed è chiamato podcast.db.sql
-   il deploy del database in sqlite si trova nella cartella Podcast ed è chiamato podcast.db

-   Per comodità nel progetto sono stati aggiunti dei file .mp3 e .png per fare esempi di caricamento di serie e episodi
    
CREDIT CARD NUMBER :

    4556402106232018
    4485911827473194
    5165231280711699
    2221003995241869
    5271433822095208
    6763590020072397
    5038626043207114
    5893012647561079

USER:

    US:earwolf@mail.com
    PW:earwolf
    ROLE: Creator

    US: test@uniupo.it
    PW: test
    ROLE: Creator
    
    US:luigi@professore.it
    PW:luigi
    ROLE: Creator
    
    US:Lollo@uniupo.it
    PW:lollo
    ROLE: Listener
    
    US:pluto@uniupo.it
    PW:pluto
    ROLE: Listener
    
    US:ludovica@uniupo.it
    PW:ludovica
    ROLE: Listener
    
    US:elena@mail.com
    PW:elena
    ROLE: Listener
    
    US:creator1@uniupo.it
    PW:creator1
    ROLE: Creator
