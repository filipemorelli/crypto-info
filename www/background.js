// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

setDefaultLocalStorage();
var loopTime = parseInt(localStorage.getItem('timeRefresh') ? localStorage.getItem('timeRefresh') : 1);
getCoins();
setInterval(function() {
    getCoins();
}, 1000 * 60 * loopTime);


function getCoins() {
    var q = {};
    q.limit = getLimitCoin();
    q.convert = getRealCoin();

    $.get("https://api.coinmarketcap.com/v1/ticker/?" + $.param(q), {}, function(data) {
        var coins = getCoinsToNotification();
        var newCoins = data;
        for (var i1 in newCoins) {
            for (var i2 in coins) {
                if (coins[i2].id == newCoins[i1].id && coins[i2].price_usd != newCoins[i1].price_usd) {
                    notify({
                        title: "Crypto Info - (" + newCoins[i1].symbol + ")",
                        body: newCoins[i1].name + "\n" + getRealCoin() + " " + numberFormat(parseFloat(newCoins[i1][nameCoin()]).toFixed(2)),
                        icon: "icon.png"
                    });
                    updateCoinValue(i2, newCoins[i1]);
                }
            }
        }
    }, "json");
}

function getCoinsToNotification() {
    return localStorage.getItem("notificationCoins") ? JSON.parse(localStorage.getItem("notificationCoins")) : [];
};

function notify(o) {
    var notification = new Notification(o.title, o);
};

function updateCoinValue(p, coin) {
    var coins = getCoinsToNotification();
    coins[p] = coin;
    setCoinsToNotification(coins);
};

function setCoinsToNotification(v) {
    localStorage.setItem("notificationCoins", JSON.stringify(v));
};

function numberFormat(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function getRealCoin() {
    return localStorage.getItem('realCoin') ? localStorage.getItem('realCoin') : 'USD';
};

function nameCoin() {
    return "price_" + getRealCoin().toLowerCase();
}

function getTimeRefresh() {
    return localStorage.getItem('timeRefresh') ? localStorage.getItem('timeRefresh') : 1;
};

function getLang() {
    return localStorage.getItem('lang') ? localStorage.getItem('lang') : getLangBrowser();
};

function getLangBrowser() {
    switch (navigator.language) {
        case "pt-BR":
            return navigator.language;
        default:
            return "en-US";
    }
}

function getLimitCoin() {
    return localStorage.getItem('limitCoin') ? localStorage.getItem('limitCoin') : 100;
};

function setDefaultLocalStorage() {
    localStorage.setItem('realCoin', getRealCoin());
    localStorage.setItem("timeRefresh", getTimeRefresh());
    localStorage.setItem('lang', getLang());
    localStorage.setItem('limitCoin', getLimitCoin());
}