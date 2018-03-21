// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    id: 'io.framework7.testapp', // App bundle ID
    name: 'Framework7', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes: routes,
    cache: false
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
    url: '/'
});

document.addEventListener('backbutton', function () {
    // on device back button go back
    if (mainView.history.length > 1) {
        mainView.router.back();
    } else {
        if ($$(".dialog").length === 0) {
            app.dialog.confirm("Deseja Realmente sair do app", "Tutors App", function name(params) {
                navigator.app.exitApp();
            }, null);
        }
    }
}, false);

document.addEventListener("deviceready", function onDeviceReady() {
    if (window.plugins && window.plugins.AdMob) {
        var ad_units = {
            ios: {
                banner: 'ca-app-pub-xxxxxxxxxxx/xxxxxxxxxxx', //PUT ADMOB ADCODE HERE
                interstitial: 'ca-app-pub-xxxxxxxxxxx/xxxxxxxxxxx' //PUT ADMOB ADCODE HERE
            },
            android: {
                banner: 'ca-app-pub-9420257838571875/3347861187', //PUT ADMOB ADCODE HERE
                interstitial: 'ca-app-pub-9420257838571875/4331083441' //PUT ADMOB ADCODE HERE
            }
        };
        var admobid = (/(android)/i.test(navigator.userAgent)) ? ad_units.android : ad_units.ios;

        window.plugins.AdMob.setOptions({
            publisherId: "ca-app-pub-9420257838571875/3347861187",
            interstitialAdId: "ca-app-pub-9420257838571875/4331083441",
            adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER, //use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
            bannerAtTop: false, // set to true, to put banner at top
            overlap: false, // banner will overlap webview
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap
            isTesting: false, // receiving test ad
            autoShow: true // auto show interstitial ad when loaded
        });

        if (navigator.onLine) {
            doAdMob();
        } else {
            var timerAdmob;
            timerAdmob = setInterval(function () {
                if (navigator.onLine) {
                    doAdMob();
                    clearInterval(timerAdmob);
                }
            }, 10000);
        }

    } else {
        alert('admob plugin not ready');
    }

    function doAdMob() {
        registerAdEvents();
        window.plugins.AdMob.createBannerView();
        window.plugins.AdMob.createInterstitialView(); //get the interstitials ready to be shown
        window.plugins.AdMob.requestInterstitialAd();
    }

    //functions to allow you to know when ads are shown, etc.
    function registerAdEvents() {
        document.addEventListener('onReceiveAd', function () {});
        document.addEventListener('onFailedToReceiveAd', function (data) {});
        document.addEventListener('onPresentAd', function () {});
        document.addEventListener('onDismissAd', function () {});
        document.addEventListener('onLeaveToAd', function () {});
        document.addEventListener('onReceiveInterstitialAd', function () {});
        document.addEventListener('onPresentInterstitialAd', function () {});
        document.addEventListener('onDismissInterstitialAd', function () {
            // window.plugins.AdMob.createInterstitialView();			//REMOVE THESE 2 LINES IF USING AUTOSHOW
            // window.plugins.AdMob.requestInterstitialAd();			//get the next one ready only after the current one is closed
        });
    }
}, false);

// In page events:
$$(document).on('page:init', function (e) {
    // Page Data contains all required information about loaded and initialized page
    var page = e.detail;
    showBanner();
    setTimeout(function () {
        CodeMirror.colorize(document.querySelectorAll("pre[type=javascript]"), "text/javascript")
        CodeMirror.colorize(document.querySelectorAll("pre[type=html]"), "text/html")
        CodeMirror.colorize(document.querySelectorAll("pre[type=bash]"), "text/x-sh")
    }, 200)
});

var counterPage = 0;

function showBanner() {
    if (window.plugins && window.plugins.AdMob) {
        counterPage++;
        if (counterPage % 3 === 0) {
            window.plugins.AdMob.requestInterstitialAd();
        }
    }
}