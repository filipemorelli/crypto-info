routes = [{
        "path": "/",
        "url": "./index.html"
    }, {
        "path": "/info/",
        "el": document.querySelector('.page[data-name="info"]'),
    }, {
        "path": "(.*)",
        "url": "./pages/404.html"
    }];