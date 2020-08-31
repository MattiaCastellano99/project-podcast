'use strict';

import App from './app.js';

//ottengo i container dei 2 nav bar, del join us e del corpo
const MainNav = document.querySelector('#navbarTogglerDemo02');
const CategoryNav = document.querySelector('#nav-tab');
const JoinUs = document.querySelector('#joinUs');
const SerieBox = document.querySelector('#SerieBox');
const searchBar = document.querySelector('#searchBar');
const catDropdown = document.querySelector('#categoriesDropdown');
const mainTitle = document.querySelector('#mainTitle');


//creating our app
const app = new App(MainNav, CategoryNav, JoinUs, SerieBox, catDropdown, mainTitle, searchBar);
