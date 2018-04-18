// Dom7
var $$ = Dom7;

angular.module("app-crypto", ["provider.app", "run.app", "controller.app"]);

angular.module("run.app", []).run(['$rootScope', '$timeout', 'filtroService', 'notificationService', 'coinsService',
    function ($rootScope, $timeout, filtroService, notificationService, coinsService) {

        $rootScope.IS_LOADING = false;
        $rootScope.NAME_PRICE = "price_" + filtroService.getRealCoin().toLowerCase();
        $rootScope.NAME_VOLUME = "24h_volume_" + filtroService.getRealCoin().toLowerCase();
        $rootScope.COIN_IDS = {};
        $rootScope.UPDATE_TIME = parseInt(filtroService.getTimeRefresh());
        $rootScope.SELECTED_COIN = filtroService.getRealCoin();
        $rootScope.LANG = filtroService.getLang();
        $rootScope.LIMIT_COINS = parseInt(filtroService.getLimitCoin());
        $rootScope.LIST_COINS_5 = coinsService.getInfoTop5();
        notificationService.notificationActive();
        $rootScope.NAME_APP = {
            name: "Crypto Info"
        };

        // Framework7 App main instance
        window.app = new Framework7({
            root: '#app', // App root element
            id: 'app.crypto', // App bundle ID
            name: 'Crypto Info', // App name
            theme: 'auto', // Automatic theme detection
            // App routes
            routes: routes,
            touch: {
                tapHold: true,
                disableContextMenu: false
            }
        });

        // Init/Create main view
        window.mainView = window.app.views.create('.view-main', {
            url: '/'
        });

        var hasSelect = false;
        $rootScope.$on('$includeContentLoaded', function (event, templateName) {
            $timeout(function () {
                if (!hasSelect) {
                    hasSelect = true;
                    var smartSelect = app.smartSelect.create({
                        el: '.smart-select'
                    });

                    // create searchbar
                    var searchbar = window.app.searchbar.create({
                        el: '.searchbar',
                        searchContainer: '.list-search',
                        searchIn: '.item-title,.item-after',
                        on: {
                            search(sb, query, previousQuery) {

                            }
                        }
                    });
                }
            });
        });

        // In page events:
        $$(document).on('page:init', function (e) {
            // Page Data contains all required information about loaded and initialized page
            var page = e.detail;
        });

        $$(document).on('page:beforein', '.page[data-name="calculator"]', function (e) {
            $$(".fab").hide();
        });

        $$(document).on('page:beforeout', '.page[data-name="calculator"]', function (e) {
            $$(".fab").show();
        });
    }
]);

angular.module("provider.app", ["pascalprecht.translate"]).config([
    "$translateProvider",
    function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            'prefix': 'translations/',
            'suffix': '.json'
        });
        var lang = getLang();
        $translateProvider.preferredLanguage(lang);
    }
]);

angular.module("controller.app", ['service.app'])
    .controller("filterCtrl", ['$scope', '$rootScope', 'filtroService', '$timeout', '$filter',
        function ($scope, $rootScope, filtroService, $timeout, $filter) {
            $scope.title = "Price Filter";
            $scope.coins = filtroService.getCoins();
            $scope.time = [1, 2, 3, 5, 10, 20, 30, 60];
            $scope.limitCoins = [0, 10, 20, 50, 100, 250, 500, 750, 1000, 1500];
            $scope.lang = ['pt-BR', 'en-US'];
            $scope.cad = {};
            $scope.cad.time = $rootScope.UPDATE_TIME;
            $scope.cad.lang = $rootScope.LANG;
            $scope.cad.coin = $rootScope.SELECTED_COIN;
            $scope.cad.limit = $rootScope.LIMIT_COINS;
            $scope.saveData = function () {
                filtroService.setRealCoin($scope.cad.coin);
                filtroService.setTimeRefresh($scope.cad.time);
                filtroService.setLang($scope.cad.lang);
                filtroService.setLimitCoin($scope.cad.limit);
                var textToast = $filter("translate")("SAVED SUCCESSFULLY");
                window.app.toast.create({
                    text: textToast,
                    closeTimeout: 2000,
                }).open();
                $timeout(function () {
                    window.location.reload();
                }, 500);
            };
        }
    ])
    .controller("navbarCtrl", ['$scope',
        function ($scope) {
            $scope.reload = function () {
                window.location.reload();
            };
        }
    ])
    .controller("coursesPtBrCtrl", ['$scope', 'courseService',
        function ($scope, courseService) {
            $scope.courses = [];
            courseService.ptBr().then(
                function (res) {
                    var data = res.data;
                    $scope.courses = data;
                }
            );
        }
    ])
    .controller("coursesEnUsCtrl", ['$scope', 'courseService',
        function ($scope, courseService) {
            $scope.courses = [];
            courseService.enUs().then(
                function (res) {
                    var data = res.data;
                    $scope.courses = data;
                }
            );
        }
    ])
    .controller("calculatorCtrl", ['$scope', '$filter',
        function ($scope, $filter) {

            $scope.totalBuy = function () {
                var total = this.qtdeCryptoCompra / this.precoCryptoCompra;
                var comissionTotal = total * this.comissaoCryptoCompra ? total * this.comissaoCryptoCompra : 0;
                var netTotal = total - comissionTotal;
                return netTotal ? netTotal.toFixed(8) : 0;
            };

            $scope.totalSell = function () {
                var total = this.qtdeCryptoVenda * this.precoCryptoVenda;
                var comissionTotal = total * this.comissaoCryptoVenda ? total * this.comissaoCryptoVenda : 0;
                var netTotal = total - comissionTotal;
                return netTotal ? netTotal.toFixed(8) : 0;
            };

            $scope.profit = function () {
                var total = this.qtdeCryptoVenda * this.precoCryptoVenda;
                var comissionTotal = this.qtdeCryptoVenda * this.precoCryptoVenda * this.comissaoCryptoVenda;
                var profit = (total - comissionTotal) - this.qtdeCryptoCompra;
                return profit ? profit.toFixed(2) : 0;
            };

            $scope.percentageProfit = function () {
                var total = this.qtdeCryptoVenda * this.precoCryptoVenda;
                var comissionTotal = this.qtdeCryptoVenda * this.precoCryptoVenda * this.comissaoCryptoVenda;
                var amout = total - comissionTotal;
                var profit = (total - comissionTotal) - this.qtdeCryptoCompra;
                var percentage = ((amout / this.qtdeCryptoCompra) - 1);
                return percentage ? (percentage * 100).toFixed(4) + "%" : 0;
            };
        }
    ])
    .controller("coinsCtrl", ['$scope', '$rootScope', 'coinsService', '$interval', '$timeout', 'notificationService', '$filter',
        function ($scope, $rootScope, coinsService, $interval, $timeout, notificationService, $filter) {

            $scope.showLoading = false;
            $scope.showTop5 = $rootScope.LIST_COINS_5.length ? true : false;
            $scope.top5Info = coinsService.getTop5();

            function getCoins() {
                $rootScope.IS_LOADING = true;
                $scope.showLoading = true;
                coinsService.getCoins()
                    .success(function (data) {
                        $timeout(function () {
                            $scope.showLoading = false;
                            $rootScope.IS_LOADING = false;
                            $rootScope.LIST_COINS = data;
                            $rootScope.LIST_COINS_5 = data.slice(0, 5);
                            coinsService.setInfoTop5($rootScope.LIST_COINS);
                            getTop5Cons(data);
                        }, 250);
                        notificationService.verifyChangesAndNotify(data);
                    })
                    .error(function () {
                        window.app.toast.create({
                            text: 'ERROR SERVER CONNECTION',
                            closeTimeout: 2000,
                        }).open();
                    });
            }

            function getTop5Cons(coins) {
                var array = coins.slice(0, 5);
                var arrayCoins = [];
                for (var i in array) {
                    arrayCoins.push(array[i].symbol);
                }
                coinsService.getMultiCoinInfo(arrayCoins)
                    .success(function (data) {
                        $timeout(function () {
                            $scope.top5Info = data;
                            coinsService.setTop5(data);
                            $scope.showTop5 = true;
                        }, 0);
                    })
                    .error(function () {
                        $scope.showTop5 = false;
                    });
            }

            function getCoinsIds() {
                coinsService.getCoinIds()
                    .success(function (data) {
                        $rootScope.COIN_IDS = data;
                    })
                    .error(function () {
                        window.app.toast.create({
                            text: 'ERROR SERVER CONNECTION',
                            closeTimeout: 2000,
                        }).open();
                    });
            }

            $scope.setNotify = function (c) {
                var msg, title;
                if (!notificationService.isInArray(c)) {
                    msg = $filter("translate")("DO YOU WANT TO BE NOTIFIED ABOUT CURRENCY CHANGE?");
                    title = $filter("translate")("ADD NOTIFICATION");
                    app.dialog.confirm(msg, title, function () {
                        notificationService.addCoin(c);
                        $scope.$apply();
                    });
                } else {
                    msg = $filter("translate")("DO YOU WANT TO REMOVE CURRENCY CHANGE NOTIFICATION?");
                    title = $filter("translate")("DELETE NOTIFICATION");
                    app.dialog.confirm(msg, title, function () {
                        notificationService.removeCoin(c);
                        $scope.$apply();
                    });
                }
            };

            $scope.isNotified = function (c) {
                return notificationService.isInArray(c);
            };

            getCoinsIds();
            getCoins();
            $interval(function () {
                getCoins();
            }, 1000 * 60 * $rootScope.UPDATE_TIME);

        }
    ]);


angular.module("service.app", [])
    .service("filtroService", [
        function () {

            this.getCoins = function () {
                return ["USD", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];
            };

            this.setRealCoin = function (c) {
                localStorage.setItem('realCoin', c);
            };

            this.getRealCoin = function () {
                return localStorage.getItem('realCoin') ? localStorage.getItem('realCoin') : 'USD';
            };

            this.setLimitCoin = function (c) {
                localStorage.setItem('limitCoin', c);
            };

            this.getLimitCoin = function () {
                return localStorage.getItem('limitCoin') ? localStorage.getItem('limitCoin') : 100;
            };

            this.setLang = function (c) {
                localStorage.setItem('lang', c);
            };

            this.getLang = function () {
                return localStorage.getItem('lang') ? localStorage.getItem('lang') : getLang();
            };

            this.setTimeRefresh = function (time) {
                localStorage.setItem("timeRefresh", time);
            };

            this.getTimeRefresh = function () {
                return localStorage.getItem('timeRefresh') ? localStorage.getItem('timeRefresh') : 1;
            };

            this.setRangeValuesSearch = function (values) {
                localStorage.setItem("rangeValues", JSON.stringify(values));
            };

            this.getRangeValuesSearch = function () {
                return localStorage.getItem("rangeValues") ? JSON.parse(localStorage.getItem("rangeValues")) : {};
            };
        }
    ])
    .service("notificationService", ['$rootScope', '$filter',
        function ($rootScope, $filter) {
            this.notificationActive = function () {
                // Let's check if the browser supports notifications
                if (!("Notification" in window)) {
                    //alert("This browser does not support desktop notification");
                }
                // Otherwise, we need to ask the user for permission
                else if (Notification.permission !== 'granted') {
                    Notification.requestPermission(function (permission) {
                        // If the user accepts, let's create a notification
                        if (permission === "granted") {
                            var notification = new Notification("Crypo Info start!");
                        }
                    });
                }
            };

            this.setCoinsToNotification = function (v) {
                localStorage.setItem("notificationCoins", JSON.stringify(v));
            };

            this.getCoinsToNotification = function () {
                return localStorage.getItem("notificationCoins") ? JSON.parse(localStorage.getItem("notificationCoins")) : [];
            };

            this.addCoin = function (c) {
                var coins = this.getCoinsToNotification();
                coins.push(c);
                this.setCoinsToNotification(coins);
            };

            this.removeCoin = function (c) {
                var coins = this.getCoinsToNotification();
                for (var i in coins) {
                    if (coins[i].id == c.id) {
                        coins.splice(i, 1);
                        this.setCoinsToNotification(coins);
                        return;
                    }
                }
                return;
            };

            this.updateCoinValue = function (p, coin) {
                var coins = this.getCoinsToNotification();
                coins[p] = coin;
                this.setCoinsToNotification(coins);
            };

            this.isInArray = function (c) {
                var coins = this.getCoinsToNotification();
                for (var i in coins) {
                    if (coins[i].id == c.id) {
                        return true;
                    }
                }
                return false;
            };

            this.notify = function (o) {
                var notification = new Notification(o.title, o);
            };

            this.verifyChangesAndNotify = function (newCoins) {
                var coins = this.getCoinsToNotification();
                for (var i1 in newCoins) {
                    for (var i2 in coins) {
                        if (coins[i2].id == newCoins[i1].id && coins[i2].price_usd != newCoins[i1].price_usd) {
                            this.notify({
                                id: newCoins[i1].rank,
                                title: "Crypto Info - (" + newCoins[i1].symbol + ")",
                                body: newCoins[i1].name + "\n" + $filter('currency')(newCoins[i1][$rootScope.NAME_PRICE], $rootScope.SELECTED_COIN + ' '),
                                icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/" + $rootScope.COIN_IDS[newCoins[i1].symbol] + ".png"
                            });
                            this.updateCoinValue(i2, newCoins[i1]);
                        }
                    }
                }
            };
        }
    ])
    .service("coinsService", ['$http', 'filtroService',
        function ($http, filtroService) {
            this.getCoins = function () {
                var q = {};
                q.limit = filtroService.getLimitCoin();
                q.convert = filtroService.getRealCoin();
                return $http.get("https://api.coinmarketcap.com/v1/ticker/?" + $.param(q));
            };

            this.getMultiCoinInfo = function (arrayCoins) {
                var q = {};
                q.fsyms = arrayCoins.join(",");
                q.tsyms = filtroService.getRealCoin();
                return $http.get("https://min-api.cryptocompare.com/data/pricemultifull?" + $.param(q));
            };

            this.getCoinIds = function () {
                return $http.get("js/coins.json");
            };

            this.getTop5 = function (o) {
                return localStorage.getItem("top5") ? JSON.parse(localStorage.getItem("top5")) : {};
            };

            this.setTop5 = function (o) {
                delete o.DISPLAY;
                localStorage.setItem("top5", JSON.stringify(o));
            };

            this.getInfoTop5 = function (o) {
                return localStorage.getItem("infoTop5") ? JSON.parse(localStorage.getItem("infoTop5")) : [];
            };

            this.setInfoTop5 = function (o) {
                var top5 = o.slice(0, 5);
                localStorage.setItem("infoTop5", JSON.stringify(top5));
            };

        }
    ])
    .service("courseService", ['$http',
        function ($http) {
            this.ptBr = function () {
                return $http.get("js/courses/courses-ptbr.json");
            };

            this.enUs = function () {
                return $http.get("js/courses/courses-enus.json");
            };
        }
    ]);

function getLang() {
    if (localStorage.getItem('lang')) {
        return localStorage.getItem('lang');
    }
    switch (navigator.language) {
        case "pt-BR":
            return navigator.language;
        default:
            return "en-US";
    }
}


function getOfflineMessage() {
    var messages = {
        "pt-BR": "O app somente funciona com conexão a internet.",
        "en-US": "The app only works with internet connection."
    };
    return messages[getLang()];
}

function isOfflineEvent() {
    var dialog;
    doWhenOffline();
    setInterval(function () {
        doWhenOffline();
    }, 2500);

    function doWhenOffline() {
        if (!navigator.onLine) {
            if (dialog === undefined) {
                dialog = window.app.dialog.preloader(getOfflineMessage());
            }
        } else if (dialog !== undefined) {
            dialog.close();
            dialog = undefined;
        }
    }
}
isOfflineEvent();