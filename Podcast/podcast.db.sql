BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "utenti" (
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"nome"	TEXT NOT NULL,
	"ruolo"	TEXT NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "episodi-comprati" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL,
	"episodioId"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES "utenti"("id") ON DELETE CASCADE,
	FOREIGN KEY("episodioId") REFERENCES "episodi"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "episodi-preferiti" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL,
	"episodioId"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES "utenti"("id") ON DELETE CASCADE,
	FOREIGN KEY("episodioId") REFERENCES "episodi"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "serie-preferite" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL,
	"serieId"	INTEGER NOT NULL,
	FOREIGN KEY("userId") REFERENCES "utenti"("id") ON DELETE CASCADE,
	PRIMARY KEY("id"),
	FOREIGN KEY("serieId") REFERENCES "serie"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "commenti-user" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL,
	"episodioId"	INTEGER NOT NULL,
	"testo"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES "utenti"("id") ON DELETE CASCADE,
	FOREIGN KEY("episodioId") REFERENCES "episodi"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "episodi" (
	"id"	INTEGER NOT NULL UNIQUE,
	"titolo"	TEXT NOT NULL,
	"descrizione"	TEXT,
	"fileAudio"	TEXT,
	"dataEp"	TEXT,
	"sponsor"	TEXT,
	"costo"	TEXT,
	"serieId"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("serieId") REFERENCES "serie"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "serie" (
	"id"	INTEGER NOT NULL UNIQUE,
	"titolo"	TEXT NOT NULL,
	"descrizione"	TEXT,
	"categoria"	INTEGER,
	"immagine"	TEXT,
	"proprietario"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("categoria") REFERENCES "categorie-serie"("id") ON DELETE SET NULL,
	FOREIGN KEY("proprietario") REFERENCES "utenti"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "categorie-serie" (
	"id"	INTEGER NOT NULL UNIQUE,
	"nome"	TEXT NOT NULL,
	PRIMARY KEY("id")
);
INSERT INTO "utenti" VALUES (1,'test@uniupo.it','$2b$10$XOV1zpXska3HsDmr02ltSe7P/GadjvkL.8Pgvdn7j6kqMgLkuVCka','Mattia','Creatore');
INSERT INTO "utenti" VALUES (2,'luigi@professore.it','$2b$10$pC2.91PWFpXtl4NKp9Znbu5D4XHT9f9qgz8EJAEkvDBnbgPfIlqw6','Luigi De Russis','Creatore');
INSERT INTO "utenti" VALUES (3,'earwolf@mail.com','$2b$10$cd0KlNjnrK7hGsP2ieGPLuyAtWZbC6wOElvjpyevxKcIrk3whxe7e','EARWOLF','Creatore');
INSERT INTO "utenti" VALUES (6,'Lollo@uniupo.it','$2b$10$lqAeO.cP1/adv7xyK1NhiOaAzodmclU6Htag.Kjuq7mHUjsowNXze','LolloShow','Ascoltatore');
INSERT INTO "utenti" VALUES (7,'pluto@uniupo.it','$2b$10$GhNIVNQ9V.6OSvNiCmb.S.Hw3b9wgAYMj.UBmkLX/Za8kaGYT1ShG','Pluto','Ascoltatore');
INSERT INTO "utenti" VALUES (8,'ludovica@uniupo.it','$2b$10$di8WKUxB3OSNBF2gt8.S8.36vbxG1HMSsSucy68.M9RahEnKnbv5i','Ludovica','Ascoltatore');
INSERT INTO "utenti" VALUES (9,'elena@mail.com','$2b$10$DukocPTSY5iivZjHJqfHyeofxHXPdTokw1rIs2f9XaH3e1j3Wk2kO','Elena','Ascoltatore');
INSERT INTO "utenti" VALUES (10,'creator1@uniupo.it','$2b$10$NxvdHmNIEkXqV65DJ9Ki8.8LXJyrXbnPi4t7Uxwhm7tfrJw.3iH1y','Creator1','Creatore');
INSERT INTO "episodi-comprati" VALUES (4,6,3);
INSERT INTO "episodi-comprati" VALUES (8,10,8);
INSERT INTO "episodi-comprati" VALUES (9,10,7);
INSERT INTO "episodi-comprati" VALUES (10,3,7);
INSERT INTO "episodi-comprati" VALUES (11,3,8);
INSERT INTO "episodi-comprati" VALUES (12,6,5);
INSERT INTO "episodi-comprati" VALUES (13,6,7);
INSERT INTO "episodi-comprati" VALUES (14,10,10);
INSERT INTO "episodi-preferiti" VALUES (2,7,8);
INSERT INTO "episodi-preferiti" VALUES (5,7,12);
INSERT INTO "episodi-preferiti" VALUES (6,9,3);
INSERT INTO "episodi-preferiti" VALUES (7,6,2);
INSERT INTO "episodi-preferiti" VALUES (8,10,8);
INSERT INTO "episodi-preferiti" VALUES (11,10,7);
INSERT INTO "episodi-preferiti" VALUES (14,3,2);
INSERT INTO "episodi-preferiti" VALUES (15,3,3);
INSERT INTO "episodi-preferiti" VALUES (17,3,8);
INSERT INTO "serie-preferite" VALUES (2,6,3);
INSERT INTO "serie-preferite" VALUES (3,6,1);
INSERT INTO "serie-preferite" VALUES (4,10,3);
INSERT INTO "serie-preferite" VALUES (9,10,5);
INSERT INTO "serie-preferite" VALUES (10,3,3);
INSERT INTO "serie-preferite" VALUES (11,3,2);
INSERT INTO "commenti-user" VALUES (2,6,4,'Seconad Prova commento episodio sad the Valley Mountain');
INSERT INTO "commenti-user" VALUES (4,6,3,'Prova Inserimento mio Lollo');
INSERT INTO "commenti-user" VALUES (5,10,8,'Prova Commento 1');
INSERT INTO "commenti-user" VALUES (6,10,3,'Commento Creator 1 edit');
INSERT INTO "commenti-user" VALUES (7,3,2,'Commento Earwolf');
INSERT INTO "commenti-user" VALUES (9,3,10,'Commento2');
INSERT INTO "commenti-user" VALUES (10,3,4,'sgdfg ');
INSERT INTO "episodi" VALUES (1,' Node.js Ep1','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','/FileAudio/NodejsEp1.mp3','12/03/2020','UPO','0',2);
INSERT INTO "episodi" VALUES (2,'Best Friends Ep1','It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ''Content here, content here'', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for ''lorem ipsum'' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). Node.js','/FileAudio/BestFriendsEp1.mp3','03/12/2010',NULL,'0',1);
INSERT INTO "episodi" VALUES (3,'Node.js Ep2','The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.','/FileAudio/NodejsEp2.mp3','15/04/2020','UPO','0',2);
INSERT INTO "episodi" VALUES (4,'Best Friends Ep2','The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.','/FileAudio/BestFriendsEp2.mp3','20/04/2015',NULL,'0',1);
INSERT INTO "episodi" VALUES (5,'Ted Bonolis Ep1','Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','/FileAudio/TEDBonolisEp1.mp3','12/02/2019','Luiss','9',3);
INSERT INTO "episodi" VALUES (7,'Ted Bonolis Ep3','Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.','/FileAudio/TEDBonolisEp3.mp3','12/01/2019','Luiss','8',3);
INSERT INTO "episodi" VALUES (8,'Ted Bonolis Ep4','It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ''Content here, content here'', making it look like readable EnglishIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ''Content here, content here'', making it look like readable English','/FileAudio/TEDBonolisEp4.mp3','20/06/2020','Luiss','7',3);
INSERT INTO "episodi" VALUES (9,'Best Friends Ep3','Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?','/FileAudio/BestFriendsEp3.mp3','09/05/2020',NULL,'0',1);
INSERT INTO "episodi" VALUES (10,'TG4 River Sound','Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?','/FileAudio/TG4Ep1.mp3','10/05/2020',NULL,'15',5);
INSERT INTO "episodi" VALUES (11,'JS L01','Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,','/FIleAudio/METWEB1.mp3','04/04/2020','UPO','5',4);
INSERT INTO "episodi" VALUES (12,'JS L02','Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,sd.','/FileAudio/METWEB2.mp3','19/06/2020','UPO','5',4);
INSERT INTO "serie" VALUES (1,'Best Friends','Gayle & Oprah. Bonnie & Clyde. Nicole & Sasheer. Entra nel pantheon della migliore amicizia. Quando sei costretto a cambiare il tuo numero, sei stanco di essere single o vuoi seguire una lezione di pole dance, avrai bisogno di un migliore amico ... e se non lo fai, puoi comunque avere questo podcast.
',1,'/FileCopertine/best-friends.png',3);
INSERT INTO "serie" VALUES (2,'Node.js','è una runtime di JavaScript Open source multipiattaforma orientato agli eventi per l''esecuzione di codice JavaScript, costruita sul motore JavaScript V8 di Google Chrome. Molti dei suoi moduli base sono scritti in JavaScript, e gli sviluppatori possono scrivere nuovi moduli in JavaScript.',2,'/FileCopertine/Nodejs.jpg',2);
INSERT INTO "serie" VALUES (3,'TED','Paolo Bonolis è uno dei conduttori televisivi e autori più noti in Italia. Attraverso il racconto "Answer" di Fredric Brown spiega il rapporto tra tecnologia e Dio. Ciò che hanno in comune è la capacità di andare oltre i limiti di tempo e spazio. Non c''è più bellezza da scoprire perché tutto è ora disponibile grazie a Internet.',4,'/FileCopertine/TEDTalks.png',1);
INSERT INTO "serie" VALUES (4,'MetWeb','Introduzione al linguaggio Java Script. Lezioni erogate in lingua italiana dal Prof. Luigi De Russis. Node.',2,'/FileCopertine/METWEB.png',2);
INSERT INTO "serie" VALUES (5,'The Journal Of Music1','Leditore Toner Quinn intervista la pionieristica arpista irlandese Laoise Kelly, recentemente annunciata come vincitrice del prestigioso premio TG4 Gradam Ceoil. Quando Kelly è apparso sul programma televisivo River of Sound negli anni 90 suonando melodie dance sull arpa - al contrario del repertorio tradizionale di canzoni e melodie Carolan - ha svegliato una nuova generazione al potenziale dello strumento. Gli ultimi due decenni hanno visto un aumento straordinario del numero di arpisti irlandesi e le cifre potrebbero essere a livello storico. Laoise racconta a Toner della sua educazione musicale, dell impatto che il programma ha avuto sulla sua carriera e del perché vuole che l Irlanda sia orgogliosa della tradizione arpionante. Node.js',3,'/FileCopertine/TheMusicJournal.jpg',3);
INSERT INTO "serie" VALUES (6,'hvb fgvb fvb ','hvb nhn bhn ',1,'/FileCopertine/coperitna3.png',3);
INSERT INTO "categorie-serie" VALUES (1,'Commedia');
INSERT INTO "categorie-serie" VALUES (2,'Tecnologia');
INSERT INTO "categorie-serie" VALUES (3,'Musica');
INSERT INTO "categorie-serie" VALUES (4,'Informazione');
COMMIT;
