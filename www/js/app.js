//déclaration des variables globales
var host = "http://dev-app.jcef-shanghai.com/ITJCEFCarte/Site";
var resultDiv;
var clickTouch;
var debug = true;
var device = true;


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
                if (checkPreAuth()) {openMenu();}
                   });

    $(document).on("pageshow",  "#settings", function(event, ui) {
                   $("#settings > #account").append(' '+window.localStorage["user_surname"]+window.localStorage["user_name"]+'.');
                   });

    $(document).on("pageshow",  "#trombinoscope", function(event, ui) {
                   
                   } );

    $(document).on("pageshow",  "#user_profil", function(event, ui) {

                   } );

    $(document).on("pageshow",  "#events_trombinoscope", function(event, ui) {
                   
                   } );

    $(document).on("pageshow",  "#commissions_trombinoscope", function(event, ui) {
                   
                   } );
             
    $(document).on("pageshow", "#subscription", function(event, ui) {
                   $("#subscriptionForm").on("submit",login);
                   });
    
    $(document).on("pageshow","#scan", function(event, ui){
                    
    });

}

//fonction appelée ailleurs pour ouvrir proprement la page login
function openLogin(){
    $.mobile.pageContainer.pagecontainer('change', "#loginPage");   
}

//fonction appelée ailleurs pour ouvrir proprement la page menu
function openMenu(){
	$.mobile.pageContainer.pagecontainer('change',"#menuPage");
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
               //j'enregistre l'id, le mot de passe, le token et la date de fin
               window.localStorage["token"]=res.token;
               window.localStorage["expireAt"]=res.expireAt;
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
               window.localStorage["token"]=res.token;
               window.localStorage["expireAt"]=res.expireAt;
               openMenu(); 
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

//!!!!!! SECTION Mise en forme des pages