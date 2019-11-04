angular.module("library_to_door", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","library_to_door.controllers", "library_to_door.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Library To Door" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_home = false ;
		$rootScope.hide_menu_categories = false ;
		$rootScope.hide_menu_products = false ;
		$rootScope.hide_menu_product_cart = false ;
		$rootScope.hide_menu_more = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "library_to_door",
				storeName : "library_to_door",
				description : "The offline datastore for Library To Door app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/library_to_door/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				if (ionic.Platform.isAndroid()){
					window.plugins.OneSignal.startInit("30d9c187-7be2-4bbf-9ab7-7a453ae5a71e","650370032346").handleNotificationOpened(notificationOpenedCallback).endInit();
				}else{
					window.plugins.OneSignal.startInit("30d9c187-7be2-4bbf-9ab7-7a453ae5a71e").handleNotificationOpened(notificationOpenedCallback).endInit();
				}
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("library_to_door.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})



.config(function($stateProvider,$urlRouterProvider,$sceDelegateProvider,$ionicConfigProvider,$httpProvider){
	/** tabs position **/
	$ionicConfigProvider.tabs.position("bottom"); 
	try{
	// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("library_to_door",{
		url: "/library_to_door",
		abstract: true,
		templateUrl: "templates/library_to_door-tabs.html",
	})

	.state("library_to_door.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"library_to_door-about_us" : {
						templateUrl:"templates/library_to_door-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.bookmarks", {
		url: "/bookmarks",
		views: {
			"library_to_door-bookmarks" : {
						templateUrl:"templates/library_to_door-bookmarks.html",
						controller: "bookmarksCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.categories", {
		url: "/categories",
		cache:false,
		views: {
			"library_to_door-categories" : {
						templateUrl:"templates/library_to_door-categories.html",
						controller: "categoriesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"library_to_door-dashboard" : {
						templateUrl:"templates/library_to_door-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.faqs", {
		url: "/faqs",
		cache:false,
		views: {
			"library_to_door-faqs" : {
						templateUrl:"templates/library_to_door-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.home", {
		url: "/home",
		cache:false,
		views: {
			"library_to_door-home" : {
						templateUrl:"templates/library_to_door-home.html",
						controller: "homeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.language", {
		url: "/language",
		cache:false,
		views: {
			"library_to_door-language" : {
						templateUrl:"templates/library_to_door-language.html",
						controller: "languageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.live_chat", {
		url: "/live_chat",
		cache:false,
		views: {
			"library_to_door-live_chat" : {
						templateUrl:"templates/library_to_door-live_chat.html",
						controller: "live_chatCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.menu_one", {
		url: "/menu_one",
		cache:false,
		views: {
			"library_to_door-menu_one" : {
						templateUrl:"templates/library_to_door-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.menu_two", {
		url: "/menu_two",
		views: {
			"library_to_door-menu_two" : {
						templateUrl:"templates/library_to_door-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.more", {
		url: "/more",
		cache:false,
		views: {
			"library_to_door-more" : {
						templateUrl:"templates/library_to_door-more.html",
						controller: "moreCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.new_products", {
		url: "/new_products",
		views: {
			"library_to_door-new_products" : {
						templateUrl:"templates/library_to_door-new_products.html",
						controller: "new_productsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.news", {
		url: "/news/:categories",
		cache:false,
		views: {
			"library_to_door-news" : {
						templateUrl:"templates/library_to_door-news.html",
						controller: "newsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.post_singles", {
		url: "/post_singles/:id",
		cache:false,
		views: {
			"library_to_door-news" : {
						templateUrl:"templates/library_to_door-post_singles.html",
						controller: "post_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.product_cart", {
		url: "/product_cart",
		cache:false,
		views: {
			"library_to_door-product_cart" : {
						templateUrl:"templates/library_to_door-product_cart.html",
						controller: "product_cartCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.product_checkout", {
		url: "/product_checkout",
		cache:false,
		views: {
			"library_to_door-product_checkout" : {
						templateUrl:"templates/library_to_door-product_checkout.html",
						controller: "product_checkoutCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.product_singles", {
		url: "/product_singles/:id",
		cache:false,
		views: {
			"library_to_door-products" : {
						templateUrl:"templates/library_to_door-product_singles.html",
						controller: "product_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.products", {
		url: "/products/:categories",
		cache:false,
		views: {
			"library_to_door-products" : {
						templateUrl:"templates/library_to_door-products.html",
						controller: "productsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.rentbook", {
		url: "/rentbook",
		cache:false,
		views: {
			"library_to_door-rentbook" : {
						templateUrl:"templates/library_to_door-rentbook.html",
						controller: "rentbookCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("library_to_door.setting", {
		url: "/setting",
		cache:false,
		views: {
			"library_to_door-setting" : {
						templateUrl:"templates/library_to_door-setting.html",
						controller: "settingCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/library_to_door/dashboard");
});
