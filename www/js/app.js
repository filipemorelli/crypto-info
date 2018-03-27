// Dom7
var $$ = Dom7;

angular.module("app-crypto", ["provider.app", "run.app", "controller.app"]);

angular.module("run.app", []).run(['$rootScope', '$timeout', 'filtroService',
    function ($rootScope, $timeout, filtroService) {

        $rootScope.FILTERS = {};
        $rootScope.FILTERS.range = [0, 9.99999e5];
        $rootScope.IS_LOADING = false;
        $rootScope.NAME_PRICE = "price_" + filtroService.getRealCoin().toLowerCase();
        $rootScope.NAME_VOLUME = "24h_volume_" + filtroService.getRealCoin().toLowerCase();
        $rootScope.COIN_IDS = {};
        $rootScope.UPDATE_TIME = parseInt(filtroService.getTimeRefresh());
        $rootScope.SELECTED_COIN = filtroService.getRealCoin();
        $rootScope.LANG = filtroService.getLang();
        $rootScope.LIMIT_COINS = parseInt(filtroService.getLimitCoin());

        // Framework7 App main instance
        var app = new Framework7({
            root: '#app', // App root element
            id: 'app.crypto', // App bundle ID
            name: 'CryptoAgora', // App name
            theme: 'auto', // Automatic theme detection
            // App routes
            routes: routes
        });

        // Init/Create main view
        var mainView = app.views.create('.view-main', {
            url: '/'
        });

        // In page events:
        $$(document).on('page:init', function (e) {
            // Page Data contains all required information about loaded and initialized page
            var page = e.detail;
        });

        var hasRange = false;
        window.range = null;
        $$('.panel-right').on('panel:open', function () {
            if (!hasRange) {
                hasRange = true;
                window.range = app.range.create({
                    el: '.range-slider',
                    min: 0,
                    max: 9.99999e5,
                    value: [0, 9.99999e5],
                    on: {
                        change: function (e, values) {
                            console.log(values);
                            $timeout(function () {
                                $rootScope.FILTERS.range = values;
                            });
                        }
                    }
                });

                var smartSelect = app.smartSelect.create({
                    el: '.smart-select'
                });

            }
        });

        // create searchbar
        var searchbar = app.searchbar.create({
            el: '.searchbar',
            searchContainer: '.list-search',
            searchIn: '.item-title,.item-after',
            on: {
                search(sb, query, previousQuery) {
                    $timeout(function () {
                        $rootScope.IS_LOADING = true;
                    });
                }
            }
        });
    }
]);

angular.module("provider.app", ["pascalprecht.translate"]).config([
    "$translateProvider",
    function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            'prefix': '/translations/',
            'suffix': '.json'
        });
        var lang = getLang();
        console.log(lang);
        $translateProvider.preferredLanguage(lang);
    }
]);

angular.module("controller.app", ['service.app'])
    .controller("panelRightCtrl", ['$scope', '$rootScope', 'filtroService',
        function ($scope, $rootScope, filtroService) {
            $scope.title = "Price Filter";
            $scope.coins = filtroService.getCoins();
            $scope.time = [1, 5, 10, 20, 30, 60, 120, 60 * 5, 60 * 10];
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
                window.location.reload();
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
    .controller("coinsCtrl", ['$scope', '$rootScope', 'coinsService', '$interval', '$timeout',
        function ($scope, $rootScope, coinsService, $interval, $timeout) {

            $scope.showLoading = false;

            function getCoins() {
                $rootScope.IS_LOADING = true;
                $scope.showLoading = true;
                coinsService.getCoins()
                    .success(function (data) {
                        $timeout(function () {
                            $scope.showLoading = false;
                            $rootScope.IS_LOADING = false;
                        }, 500);
                        $rootScope.LIST_COINS = data;
                    });
            }

            function getCoinsIds() {
                coinsService.getCoinIds()
                    .success(function (data) {
                        $rootScope.COIN_IDS = data;
                        console.log($rootScope.COIN_IDS);
                    });
            }
            getCoinsIds();
            getCoins();
            $interval(function () {
                getCoins();
            }, 1000 * $rootScope.UPDATE_TIME);

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
                return localStorage.getItem('limitCoin') ? localStorage.getItem('limitCoin') : 500;
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
                return localStorage.getItem('timeRefresh') ? localStorage.getItem('timeRefresh') : 30;
            };

            this.setRangeValuesSearch = function (values) {
                localStorage.setItem("rangeValues", JSON.stringify(values));
            };

            this.getRangeValuesSearch = function () {
                return localStorage.getItem("rangeValues") ? JSON.parse(localStorage.getItem("rangeValues")) : {};
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

            this.getCoinIds = function () {
                return $http.get("/js/coins.json");
            };
        }
    ]);

function getLang() {
    switch (navigator.language) {
        case "pt-BR":
            return navigator.language;
        default:
            return "en-US";
    }
}