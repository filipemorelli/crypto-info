// Dom7
var $$ = Dom7;

angular.module("app-crypto", ["provider.app", "run.app", "controller.app"]);

angular.module("run.app", []).run(['$rootScope', '$timeout',
    function ($rootScope, $timeout) {

        $rootScope.FILTERS = {};

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

        $$('.panel-right').on('panel:open', function () {
            var range = app.range.create({
                el: '.range-slider',
                on: {
                    change: function (e, values) {
                        console.log(values);
                        $timeout(function () {
                            $rootScope.FILTERS.range = values;
                        });
                    }
                }
            });
        });

        // create searchbar
        var searchbar = app.searchbar.create({
            el: '.searchbar',
            searchContainer: '.list-teste',
            searchIn: '.item-title',
            on: {
                search(sb, query, previousQuery) {
                    console.log(query, previousQuery);
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

        function getLang() {
            switch (navigator.language) {
                case "pt-BR":
                    return navigator.language;
                default:
                    return "en-US";
            }
        }
    }
]);

angular.module("controller.app", []).controller("panelRightCtrl", ['$scope', '$rootScope',
    function ($scope, $rootScope) {
        $scope.title = "Price Filter";
    }
]);