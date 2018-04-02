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
    "path": "/course/pt-BR/",
    "el": document.querySelector('.page[data-name="course"]'),
}, {
    "path": "(.*)",
    "url": "./pages/404.html"
}];