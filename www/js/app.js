//déclaration des variables globales
var host = "http://dev-app.jcef-shanghai.com/ITJCEFCarte/Site";
var resultDiv;
var clickTouch;
var debug = true;
var device = false;


//!!!!!! SECTION Initialisation

//affichage des logs dans la console uniquement en debug 
function log(str) {
    if (debug) {
        console.log(str);
    }
}

//changement de comportement lorsque nous sommes en présence de Cordova et sur mobile
if (device) {
    document.addEventListener("deviceready", init, false);
    clickTouch = "touchend";
} else {
    init();
    clickTouch = "click";
}

function init() {
	log("dans init");
	document.querySelector("#startScan").addEventListener(clickTouch, startScan, false);
	resultDiv = document.querySelector("#results");
    onGlobal();
    openLogin();
}

//Chargement des bonnes méthodes au lancement
function onGlobal() {
    log("dans on Global");
    $(document).on("pageshow", "#login", function () {
                window.localStorage["currentPage"]="login";
                if (checkPreAuth()) {openEvTrombi();}
                afficheMenu();
                   });

    $(document).on("pageshow",  "#settings", function(event, ui) {
                    window.localStorage["currentPage"]="settings";
                   $("#settings > #account").append(' '+window.localStorage["user_surname"]+window.localStorage["user_name"]+'.');
                    afficheMenu();
                   });

    $(document).on("pageshow",  "#trombinoscope", function(event, ui) {
                    window.localStorage["currentPage"]="trombinoscope";
                    afficheMenu();
                   } );

    $(document).on("pageshow",  "#user_profil", function(event, ui) {
                    window.localStorage["currentPage"]="user_profil";
                    afficheMenu();
                   } );

    $(document).on("pageshow",  "#events_trombinoscope", function(event, ui) {
                   window.localStorage["currentPage"]="events_trombinoscope";
                    afficheMenu();

                   } );

    $(document).on("pageshow",  "#commissions_trombinoscope", function(event, ui) {
                   window.localStorage["currentPage"]="commission_trombinoscope";
                    afficheMenu();

                   } );
             
    $(document).on("pageshow", "#subscription", function(event, ui) {
                    window.localStorage["currentPage"]="subscription";
                   $("#subscriptionForm").on("submit",login);
                        afficheMenu();

                   });
    
    $(document).on("pageshow","#scan", function(event, ui){
                    window.localStorage["currentPage"]="scan";
                    afficheMenu();

    });

}

//fonction appelée ailleurs pour ouvrir proprement la page login
function openLogin(){
    window.localStorage["currentPage"]="login";
    $.mobile.pageContainer.pagecontainer('change', "#loginPage");
    afficheMenu();
}

//fonction appelée ailleurs pour ouvrir proprement la page menu
function openMenu(){
    log("dansOpenMenu");
    window.localStorage["currentPage"]="menuPage";
    afficheMenu();
	$.mobile.pageContainer.pagecontainer('change',"#menuPage");
}

//fonction appelée ailleurs pour ouvrir proprement la page trombinoscope des utilisateurs
function openUsrTrombi(){
    WStrombinoscope_users();
    window.localStorage["currentPage"]="userTrombiPage";
    $.mobile.pageContainer.pagecontainer('change', "#users_trombinoscope");
    afficheMenu();
    drawTrombiUsers();
}

//fonction appelée ailleurs pour ouvrir proprement la page trombinoscope des prochains events
function openEvTrombi(){
    WStrombinoscope_events();
    window.localStorage["currentPage"]="eventTrombiPage";
    $.mobile.pageContainer.pagecontainer('change', "#eventTrombiPage");
    afficheMenu();
    drawTrombiEvents();
}

//fonction appelée ailleurs pour ouvrir proprement la page trombi des commissions
function openComTrombi(){
    WStrombinoscope_commissions();
    window.localStorage["currentPage"]="commissionTrombiPage";
    $.mobile.pageContainer.pagecontainer('change', "#comTrombiPage");
    afficheMenu();
    drawTrombiCom();
}

//fonction appelée ailleurs pour ouvrir proprement la page de détail de mon profil
function openMyProfil(){
    WSuser_profil(window.localStorage["user_uuid"]);
    window.localStorage["currentPage"]="myProfilPage";
	$.mobile.pageContainer.pagecontainer('change',"#user_profil");
    afficheMenu();
}

//fonction appelée ailleurs pour ouvrir proprement la page de détail d'un profil utilisateur
function openUserProfilDirect(uuid){
    WSuser_profil(uuid);
    window.localStorage["currentPage"]="myProfilPage";
	$.mobile.pageContainer.pagecontainer('change',"#user_profil");
    afficheMenu();
}

//fonction appelée ailleurs pour ouvrir proprement la page de détails d'un event
function openEventDetails(pk){
    WSevent_profil(pk);
    window.localStorage["currentPage"]="eventDetailsPage";
	$.mobile.pageContainer.pagecontainer('change',"#event_profil");
    res = JSON.parse(window.localStorage["selected_event_profil"]);
    $('#eventVisuSurname').html(res.ev_name).enhanceWithin();
    if (window.localStorage["admin"]==1){
        $('#startscan').html("<button id='startScan' onclick='startScan()'>Start Scan</button>").enhanceWithin();
    }
}

//fonction appelée ailleurs pour ouvrir la page de Scan des membres
function openScan(){
}

//fontion appelée ailleurs de validation du scan d'un membre
function openValidateCheck(){
}

//!!!!!! SECTION Requêtes AJAX
//fonction qui se charge de reconnecter en toute situation (appelée uniquement par checkPreAuth)
function handleLogin(u,p) {
    if(u != '' && p!= '') {
        var bool = false;
        var current = $("#user_uuid");
        $.ajax({
               type:'POST',
               url: host+"/Controller/WSlogin.php",
               data: {user_uuid:u,user_password:p},
               async: false,
               statusCode:
               {
               200 : function (res){
               window.localStorage["admin"]=res;
               bool = true;
               },
               401 : function(){
               self.showAlert(current, "Connexion impossible, le couple identifiant/mot de passe n'a pas été reconnu", "erreur");
               },
               400 : function(){
               self.showAlert(current, "votre champs email ne contient pas un email valide", "erreur");
               },
               500: function(){
               self.showAlert(current, "Le serveur vient de rencontrer une erreur inattendue, nous avons enregistré le problème.", "erreur");
               },
               404: function(){
               self.showAlert(current, "le serveur ne répond pas, il semble y avoir un problème...", "erreur");
               }
               },
               dataType: "JSON"
               });
    } else {
        self.showAlert(current, "L'un des champs est resté vide", "erreur");
    }
    return (bool);
}

//fonction de connection appelée depuis index.html
//fonction qui récupère le token et le mot de passe
function login(){
    //disable the button so we can't resubmit while we wait :
    var u = $("#user_uuid").val();
    var p = $("#user_password").val();
    //var a = $("#user_is_admin").val();
    var current = $("#user_uuid");
    if(u != '' && p!= '') {
        $.ajax({
               type:'POST',
               //url: host + "/2/sessions",
               url: host + "/Controller/WSlogin.php",
               data: {user_uuid:u,user_password:p},
               async: false,
               statusCode:
               {
               200 : function(res){
               //j'enregistre l'id, le mot de passe, le token et la date de fin
               window.localStorage["user_uuid"] = u;
               window.localStorage["user_password"] = p;
               //window.localStorage["user_is_admin"] = a;
               window.localStorage["admin"]=res;
               openEvTrombi(); 
               },
               401 : function(){
               self.showAlert(current,"Connexion impossible, le couple identifiant/mot de passe n'a pas été reconnu", "erreur");
               },
               400 : function(){
               self.showAlert(current,"Votre champ identifiant ne contient pas un identifiant valide", "erreur");
               },
               500: function(){
               self.showAlert(current,"Le serveur vient de rencontrer une erreur inattendue, nous avons enregistré le problème.", "erreur");
               },
               404: function(){
               self.showAlert(current,"Le serveur ne répond pas, il semble y avoir un problème...", "erreur");
               }
               },
               dataType: "JSON"
               });
    } else {
	    self.showAlert(current,"Le login et mot de passe sont obligatoire","erreur");    
	   //		$('#popupLogin').popup("open");

	    }
    return false;
}

//A MODIF. Affiche trombi user.
function WStrombinoscope_users(){
    var URL = host +"/Controller/WStrombinoscope.php";
    var contentElem;
    
        $.ajax({
            type: 'GET',
            url: URL,
            contentType: "application/json",
            dataType: "json",
            async: false,
            statusCode: {
                200: function (res) {
                    var strObj = JSON.stringify(res);
                    window.localStorage["users"] = strObj;        
                    },
                404: function(){
                    self.showAlert(current, "serveur introuvable, le serveur est hors ligne", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    }
            });
    return false;
}

//A MODIF. Affiche trombi commissions.
function WStrombinoscope_commissions(){
    var URL = host +"/Controller/WStrombinoscope_commissions.php";
    var contentElem; 
        $.ajax({
            type: 'GET',
            url: URL,
            contentType: "application/json",
            dataType: "json",
            async: false,
            statusCode: {
                200: function (res) {
                    var strObj = JSON.stringify(res);
                    window.localStorage["commissions"] = strObj;        
                    },
                404: function(){
                    self.showAlert(current, "serveur introuvable, le serveur est hors ligne", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    }
            });
    return false; 
}

//A MODIF. Affiche trombi events.
function WStrombinoscope_events(){
    var URL = host +"/Controller/WStrombinoscope_events.php";
    var contentElem;
    
        $.ajax({
            type: 'GET',
            url: URL,
            contentType: "application/json",
            dataType: "json",
            async: false,
            statusCode: {
                200: function (res) {
                    var strObj = JSON.stringify(res);
                    window.localStorage["events"] = strObj;        
                    },
                404: function(){
                    self.showAlert(current, "serveur introuvable, le serveur est hors ligne", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    }
            });
    return false; 
}

//A MODIF fonction qui récupère le contenu associé à un user_uuid appelée depuis user_profil.html
function WSuser_profil(user_uuid){
    var URL = host + "/Controller/WSuser_profil.php";
    var contentElem;
    //if(user != '') {
        $.ajax({
            type: 'GET',
            url: URL+"?user_uuid="+user_uuid,
            dataType: "json",
            async: false,
            statusCode: {
                200: function (res) {
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    $('#userVisuSurname').html( res.user_surname ).enhanceWithin();
                    window.localStorage["selected_user_profil"] = JSON.stringify(res);
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    }
            });
    //} else {
      //  $("#submit").removeAttr("disabled");
    //}
    return false;
}

//Affiche les détails d'un event 
function WSevent_profil(event_pk){
    var URL = host + "/Controller/WSevent_profil.php";
    var contentElem;
    //if(user != '') {
        $.ajax({
            type: 'GET',
            url: URL+"?event_pk="+event_pk,
            dataType: "json",
            async: false,
            statusCode: {
                200: function (res) {
                    window.localStorage["selected_event_profil"] = JSON.stringify(res);
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    }
            });
    //} else {
      //  $("#submit").removeAttr("disabled");
    //}
    return false;
}

//!!!!!! SECTION Fonction métier
// lancement du scan depuis le plugin
function startScan() {
    log("dans startscan");
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			var s = "Result: " + result.text + "<br/>" +
			"Format: " + result.format + "<br/>" +
			"Cancelled: " + result.cancelled;
			resultDiv.innerHTML = s;
		},
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

}

//Check de l'autentification préalable dans l'app
function checkPreAuth() {
    log("checkPreAuth");
    if(window.localStorage["user_uuid"] != undefined && window.localStorage["user_password"] != undefined) {
        var u= window.localStorage["user_uuid"];
        var p= window.localStorage["user_password"];
        var expire = new Date (window.localStorage["expireAt"]);
        var maintenant = new Date ();
        if (expire < maintenant) {
            var okbool = handleLogin(u, p);
            if (okbool) {
                window.localStorage["user_uuid"]=u;
                window.localStorage["user_password"]=p;
            } else {
                window.localStorage.removeItem("user_uuid");
                window.localStorage.removeItem("user_password");
            }
            return (okbool);
        } else {
            return (true);
        }
        } else {
            return (false);
    }
}

//fonction de déconnexion !TODO : savoir où je suis
function logout() {
	var current=$("#account");
    self.showModal(current, "Souhaitez-vous vraiment vous déconnecter ?", "information", function () {
        self.showAlert(current, "Déconnexion en cours", "information");
        sessionStorage.clear();
        localStorage.clear();
        openLogin();
    });
}

//!!!!!! SECTION Mise en forme des pages
//Ajout du header et du menu commun à toutes les pages
$(function () {
        $("[data-role=header],[data-role=footer]").toolbar().enhanceWithin();
        $("[data-role=panel]").panel().enhanceWithin();
});

$(document).on("pagecreate", function () {
        $("[data-role=panel]").one("panelbeforeopen", function () {
            var height = $.mobile.pageContainer.pagecontainer("getActivePage").outerHeight();
            $(".ui-panel-wrapper").css("height", height + 1);
        });
});

// Fonction qui sélectionne remplis le bon menu
function afficheMenu(){
    log("dans afficheMenu");
    if (window.localStorage["currentPage"]=="login"){
        $("#menu_contents").empty();
        $("#menu_contents").append('<li><a data-theme="a" href="#" data-role="none">Mot de passe oublié</a></li>').listview().listview('refresh');
    }else{
         ul = $("#menu_contents");
        ul.empty();
        items = '<li><a data-theme="a" onclick="openUsrTrombi();" data-role="none">Trombinoscope</a></li><li><a data-theme="a" onclick="openMyProfil();" data-role="none">Mon profil</a></li><li><a data-theme="a" onclick="openEvTrombi();" data-role="none">Évènements</a></li><li><a data-theme="a" onclick="openComTrombi();" data-role="none">Commissions</a></li><li><a href="#locale" onclick="logout()" class="f-cogs">Déconnexion</a></li>';
        ul.append(items);
        ul.listview().listview('refresh');
    }
}

//fonction qui permet d'afficher une alerte même si le système natif n'est pas accessible
function showAlert(current, message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
   	//var popup= $("#popupBasic");
   	var popup = current.parents('div[data-role="page"]').find(".popupBasic");
   	popup.find("h2").html(title);
   	popup.find("p").html(message);
   	popup.popup();
   	popup.popup("open", null);
    }
}

function showModal(current, message, title,confirm, cancel) {
    if (navigator.notification) {
        navigator.notification.confirm(
                                       message,
                                       onconfirm,
                                       title,
                                       'OK, annuler');
        
    } else {
    	var initpopup = current.parents('div[data-role="page"]').find(".modalBasic");
        var popup = initpopup.clone();
        initpopup.after(popup);
        var id = "m_" + Math.floor(Math.random() * 20000);
        popup.attr("id", id);
        popup.attr("class","");

        $("#" + id).find("h2").html(title);
        $("#" + id).find("p").html(message);
        $("#" + id).popup();
        $("#" + id + " #okbutton").on("click", function () {
            if (confirm) {
                confirm();
            }
        });
        $("#" + id + " #kobutton").on("click", function () {
            $("#" + id).popup('close');
            if (cancel) {
                cancel();
            }
        });
        $("#" + id).popup("open", { role: "dialog"});
    }
}

//Fonction chargée de dessiner le trombinoscope
// TODO : rendre propre la mise en forme et choisir les éléments à afficher.
// à faire dans le fichier template.html
function drawTrombiUsers() {
    $('#trombiUsers').html('');
    if (window.localStorage["users"]!= undefined){
        $.get('js/template.html', function(template) {
              // charge le fichier templates et récupère le contenu de la
              var users = JSON.parse(window.localStorage["users"]);
              var template = $(template).filter('#tpl-trombiUsers').html();
              var html = Mustache.to_html(template, users);
              $('#trombiUsers').html(html).trigger('create');
              },'html');}
    
}

//Fonction chargée de dessiner le trombi des events à venir
function drawTrombiEvents() {
    log("dans trombiEvents");
        $('#trombiEvents').html('');
    if (window.localStorage["events"]!= undefined){
        log("events trouvés");
        $.get('js/template.html', function(template) {
            log("fichier trouvé");
              // charge le fichier templates et récupère le contenu de la
              var users = JSON.parse(window.localStorage["events"]);
              var template = $(template).filter('#tpl-trombiEvents').html();
              var html = Mustache.to_html(template, users);
              $('#trombiEvents').html(html).trigger('create');
              },'html');}
}

//Fonction chargée de dessiner le trombi des commissions
function drawTrombiCom(){
    log("dans trombiCom");
        $('#trombiCommissions').html('');
    if (window.localStorage["commissions"]!= undefined){
        log("commissions trouvées");
        $.get('js/template.html', function(template) {
            log("fichier trouvé");
              // charge le fichier templates et récupère le contenu de la
              var users = JSON.parse(window.localStorage["commissions"]);
              var template = $(template).filter('#tpl-trombiCom').html();
              var html = Mustache.to_html(template, users);
              $('#trombiCommissions').html(html).trigger('create');
              },'html');}
}