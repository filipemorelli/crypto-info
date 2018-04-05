routes = [{
    "path": "/",
    "url": "./index.html"
}, {
    "path": "/info/",
    "el": document.querySelector('.page[data-name="info"]'),
}, {
    "path": "/donation/",
    "el": document.querySelector('.page[data-name="donation"]'),
}, {
    "path": "/filter/",
    "el": document.querySelector('.page[data-name="filter"]'),
}, {
    "path": "/courses/pt-BR/",
    "el": document.querySelector('.page[data-name="courses-ptbr"]'),
}, {
    "path": "/courses/en-US/",
    "el": document.querySelector('.page[data-name="courses-enus"]'),
}, {
    "path": "/exchanges/",
    "el": document.querySelector('.page[data-name="coming-soon"]'),
}, {
    "path": "(.*)",
    "url": "./pages/404.html"
}];