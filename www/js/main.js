//todo : vérifier en permanence que le mec est connecté
//var host = "http://localhost:8888/ITJCEFCarte/Site";
var host = "http://dev-app.jcef-shanghai.com/ITJCEFCarte/Site";
//var host = "../../../ITJCEFCarte/Site";


function init() {
	document.addEventListener("deviceready", deviceReady, true);
    deviceReady();
}

function checkPreAuth() {
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

//fonction qui se charge de reconnecter en toute situation (appelée uniquement par checkPreAuth)
function handleLogin(u,p) {
    if(u != '' && p!= '') {
        var bool = false;
        var current = $("#user_uuid");
        $.ajax({
               type:'POST',
               url: host+"/Controller/index.php",
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

function onGlobal(){
    
    $(document).on("pageshow", "#login", function() {
                   if(checkPreAuth()){openMenu();}
                   });
    

    $(document).on("pageshow",  "#settings", function(event, ui) {
                   $("#settings > #account").append(' '+window.localStorage["user_surname"]+window.localStorage["user_name"]+'.');
                   } );

    $(document).on("pageshow",  "#trombinoscope", function(event, ui) {
                   
                   } );

    $(document).on("pageshow",  "#user_profil", function(event, ui) {
                   //$("#user_profil > #user_surname").append(' '+window.localStorage["user_surname"]);
                   //$("#user_name").append(' '+window.localStorage["user_name"]);
                   //$("#user_jcef_function").append(' '+window.localStorage["user_jcef_function"]);
                   } );

    $(document).on("pageshow",  "#events_trombinoscope", function(event, ui) {
                   
                   } );

    $(document).on("pageshow",  "#commissions_trombinoscope", function(event, ui) {
                   
                   } );

                   
    $(document).on("pageshow", "#subscription", function() {
                   $("#subscriptionForm").on("submit",login);
                   });

}
//fonction appelée ailleurs pour ouvrir proprement la page login
function openLogin(){
    $.mobile.pageContainer.pagecontainer('change', "#login");   
}

function openMenu(){
	$.mobile.pageContainer.pagecontainer('change',"#menu");
}

function openUserProfilDirect(id){
    WSuser_profil(id);
    $.mobile.pageContainer.pagecontainer('change', "#user_profil");   
}

function openUserProfil(){
    WSuser_profil(JSON.parse(window.localStorage["selected_user_profil"]).user_uuid);
    drawUserDetails();
    $.mobile.pageContainer.pagecontainer('change', "#user_profil");   
}

function openEventProfil(){
    WSevent_profil();
    $.mobile.pageContainer.pagecontainer('change', "#event_profil");   
}

function openMyProfil(){
	WSuser_profil(window.localStorage["user_uuid"]);
    drawUserDetails();
	$.mobile.pageContainer.pagecontainer('change',"#user_profil");
}

function openCommissionProfil(){
    WScommission_profil();
    $.mobile.pageContainer.pagecontainer('change', "#commission_profil");   
}

function openEditUserProfil(){
    WSedit_user();
    $.mobile.pageContainer.pagecontainer('change', "#edit_user");   
}

//fonction appelée ailleurs pour ouvrir proprement la page trombinoscope
function openUsrTrombi() {
    WStrombinoscope_users();
    $.mobile.pageContainer.pagecontainer('change', "#users_trombinoscope");
    drawTrombiUsers();
}

//fonction appelée ailleurs pour ouvrir proprement la page events_trombinoscope
function openEvTrombi() {
    WStrombinoscope_events();
    $.mobile.pageContainer.pagecontainer('change', "#events_trombinoscope");
}

//fonction appelée ailleurs pour ouvrir proprement la page commissions_trombinoscope
function openComTrombi() {
  WStrombinoscope_commissions();
    $.mobile.pageContainer.pagecontainer('change', "#commissions_trombinoscope");
}

//fonction appelée ailleurs pour ouvrir proprement la page settings
function openSettings(){
    $("#settings > #account").append(' '+window.localStorage["user_surname"]+' '+window.localStorage["user_name"]+'.');
    $(':mobile-pagecontainer').pagecontainer('change', '#settings');
}

//fonction appelée ailleurs pour ouvrir proprement la page subscription
function openSubscription(){
    $(':mobile-pagecontainer').pagecontainer('change', '#subscription');
}

//fonction appelée par init qui vérifie si nous avons des identifiants, nous connecte le cas échéant ou nous propose de nous connecter
function deviceReady() {
    $(document).on("pageshow", "#launching", function(event, ui){
                   $("body").addClass("ios7");
                   onGlobal();
                 //  liveForm();
                   
                        openLogin();
                   
                   });
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
               url: host + "/Controller/index.php",
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
               openUserProfil; 
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
            beforeSend: setHeader,
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


function WSedit_user(){
    res = JSON.parse(window.localStorage["selected_user_profil"]);
    $('input[name=user_surname]').val(res.user_surname);
    $('input[name=user_name]').val(res.user_name);
    $('input[name=user_nation]').val(res.user_nation);
    $('input[name=user_company]').val(res.user_company);
    $('input[name=user_subscription_date]').val(res.user_subscription_date);
    $('input[name=user_email_jcef]').val(res.user_email_jcef);
    $('input[name=user_birth]').val(res.user_birth);
    $('input[name=user_sex]').val(res.user_sex);
    $('input[name=user_skype]').val(res.user_skype);
    $('input[name=user_weixin]').val(res.user_weixin);
    $('input[name=user_jcef_function]').val(res.user_jcef_function);
    
}

//A MODIF fonction qui récupère le contenu associé à un user_uuid appelée depuis user_profil.html
function WSuser_profil(user_uuid){
    var URL = host + "/Controller/WSuser_profil.php";
    var contentElem;
    //if(user != '') {
        $.ajax({
            type: 'GET',
            url: URL+"?user_uuid="+user_uuid,
            //contentType: "application/json",
            dataType: "json",
            beforeSend: setHeader,
            //data: data,
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


function WSevent_profil(){
    var URL = "http://localhost/ITJCEFCarte/Site/Controller/WSevent_profil.php";
    var contentElem;
    //if(user != '') {
        $.ajax({
            //type: 'POST',
            //url: URL +"?user="+user_uuid,
            url: URL,
            //contentType: "application/json",
            dataType: "json",
            beforeSend: setHeader,
            //data: data,
            async: false,
            statusCode: {
                200: function (res) {
                    


                   $("#event_profil > #event_picture").append('<img src="'+res.ev_picture+'"</img>');
                   $("#event_profil > #event_name").append(' '+res.ev_name);
                   $("#event_profil > #event_address").append(' '+res.ev_address);
                   $("#event_profil > #event_date").append(' '+res.ev_date);
                   $("#event_profil > #event_description").append(' '+res.ev_description);
                   $("#event_profil > #event_max_participants").append(' '+res.ev_max_participants);
                   $("#event_profil > #event_participants").append(' '+res.ev_participants);
                   $("#event_profil > #event_price").append(' '+res.ev_price);
                   $("#event_profil > #event_nb_subscribed").append(' '+res.ev_nb_subscribed);
                   $("#event_profil > #event_charged_member").append(' '+res.ev_charged_member);
                   $("#event_profil > #event_com_linked").append(' '+res.ev_com_linked);
                   

                   window.localStorage["selected_event_profil"] = JSON.stringify(res);


                    },
                400: function(){
                    self.showAlert(current, "L'event n'existe pas.", "erreur");
                    },
                401: function(){
                    self.showAlert(current, "Connexion impossible, Vous avez été déconnecté", "erreur");
                    if (checkPreAuth()) {
                        self.showAlert(current, "reconnecté ! réessayez", "information");
                    } else {
                        self.showAlert(current, "reconnexion impossible, vérifiez vos identifiants","erreur");
                        logout();
                        }
                    },
                404: function(){
                    
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



function WScommission_profil(){
    var URL = "http://localhost/ITJCEFCarte/Site/Controller/WScom_profil.php";
    var contentElem;
    //if(user != '') {
        $.ajax({
            //type: 'POST',
            //url: URL +"?user="+user_uuid,
            url: URL,
            //contentType: "application/json",
            dataType: "json",
            beforeSend: setHeader,
            //data: data,
            async: false,
            statusCode: {
                200: function (res) {
                    


                   $("#commission_profil > #commission_picture").append('<img src="'+res.com_picture+'"</img>');
                   $("#commission_profil > #commission_name").append(' '+res.com_name);
                   $("#commission_profil > #commission_description").append(' '+res.com_description);              

                   window.localStorage["selected_com_profil"] = JSON.stringify(res);


                    },
                400: function(){
                    self.showAlert(current, "La Commisssion n'existe pas.", "erreur");
                    },
                401: function(){
                    self.showAlert(current, "Connexion impossible, Vous avez été déconnecté", "erreur");
                    if (checkPreAuth()) {
                        self.showAlert(current, "reconnecté ! réessayez", "information");
                    } else {
                        self.showAlert(current, "reconnexion impossible, vérifiez vos identifiants","erreur");
                        logout();
                        }
                    },
                404: function(){
                    
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

//je place le header comme le veulent tous les WS sauf tags et sessions.
function setHeader(xhr){
    xhr.setRequestHeader('X-Paperus-Session', window.localStorage["token"]);
}
// header spécifique pour tags où j'ajoute que je veux une bae 64
function setHeaderTags(xhr){
    setHeader(xhr);
    xhr.setRequestHeader('Accept', 'image/png+base64');
}


//fonction qui envoie le formulaire d'inscription
function subscribe (){
    var name = $("#name").val();
    var firstname = $("#firstname").val();
    var email = $("#emailsubscribe").val();
    var phone = $("#phone").val();
    var bookstoreCommercialName = $("#bookstoreCommercialName").val();
    var bookstoreEntity = $("#bookstoreEntity").val();
    var RCSNumber = $("#RCSNumber").val();
    var bookstoreRIB = $("#bookstoreRIB").val();
    var current = $("#RCSNumber");
    if(name != '' && firstname != '' && email != '' && phone != '' && bookstoreCommercialName != '' &&  bookstoreEntity  != '' && RCSNumber != '') {
        $.ajax({
               type:'POST',
               url: host + "/2/Registers",
               data: {
                firstName:firstname,
                lastName:name,
                phoneNumber:phone,
                email:email,
                bookstoreName:bookstoreCommercialName,
                companyName:bookstoreEntity,
                rcsNumber:RCSNumber,
                iban:bookstoreRIB
                },
               async: false,
               statusCode:
               {
               200 : function(res){
               self.showAlert(current,"Nous avons bien reçu votre demande d'inscription, vous serez rencontactés très prochainnement","Merci,");
               },
               401 : function(){
               self.showAlert(current,"Connexion impossible, nous n'avons pas reçu toutes vos données, réessayez plus tard", "erreur");
               },
               400 : function(){
               self.showAlert(current,"Connexion impossible, nous n'avons pas reçu toutes vos données, réessayez plus tard", "erreur");               },
               500: function(){
               self.showAlert(current,"Connexion impossible, nous n'avons pas reçu toutes vos données, réessayez plus tard", "erreur");               },
               404: function(){
               self.showAlert(current,"Connexion impossible, nous n'avons pas reçu toutes vos données, réessayez plus tard", "erreur");               }
               },
               dataType: "JSON"
               });
    } else {
	    self.showAlert(current,"Tous les champs obligatoires n'ont pas été remplis","erreur");
    }
    return false;
}

//fontion pour revenir à l'accueil et effacer la vente actuelle TODO savoir où je suis
function backToHome(current){
    var bool = false;
    var activePage = $.mobile.activePage.attr("id");
    if (activePage == "visualizeTag") {
        self.showModal(current, "les codes ont-ils tous été scannés ? Sinon, annuler et rester sur cette page", "information", function () {
            sessionStorage.clear();
            //openScanBarcode();
        });
    } else {
        if (activePage == "scanBarcode") {
            self.showModal(current, "effacer les codes saisis et reprendre au début ?", "information", function (){
                           resetScanBarcode();
                           $.mobile.changePage(
                                               window.location.href,
                                               {
                                               allowSamePageTransition : true,
                                               transition              : 'none',
                                               showLoadMsg             : false,
                                               reloadPage              : true
                                               }
                                               );});
        } else {
        self.showModal(current, "annuler cette vente et reprendre du début ?", "information", function () {
            sessionStorage.clear();
            //openScanBarcode();
        });
        }
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

//fonction qui génère la page chooseContent.html
function drawContents() {
    $('#articleKOContent').html('');
    $('#articleOKContent').html('');
    if (window.sessionStorage["ISBNNoContentList"]!= undefined){
        $.get('js/template.html', function(template) {
              // charge le fichier templates et récupère le contenu de la
              var ISBNNoContent= {"ISBN":JSON.parse(window.sessionStorage["ISBNNoContentList"])};
              var template = $(template).filter('#tpl-noContent').html();
              var html = Mustache.to_html(template, ISBNNoContent);
              $('#articleKOContent').html(html);
              },'html'); }
    if (window.sessionStorage["ISBNContentList"]!= undefined){
        $.get('js/template.html', function(template) {
              // charge le fichier templates et récupère le contenu de la
              var ISBNContentList = [];
              var ISBNContent= {};
              var Contents = JSON.parse(window.sessionStorage["contenus"]);
              var ISBNList= JSON.parse(window.sessionStorage["ISBNContentList"]);
              for (var i=0, c=ISBNList.length; i<c; i++){
                ISBNContent.ISBN = ISBNList.pop();
                var content = JSON.parse(Contents.pop());
                for (var j=0, d=content.length; j<d; j++){
                    content[j] = { content : content[j], idCheckBox : Math.floor(Math.random() * 100000) + 1}
                }
                ISBNContent.content = content;
                ISBNContentList.push(ISBNContent);
                ISBNContent={};
                }
              var template = $(template).filter('#tpl-contentList').html();
              ISBNContentList={ISBNList: ISBNContentList};
              var html = Mustache.to_html(template, ISBNContentList);
              $('#articleOKContent').html(html).trigger('create');
              },'html');}
    
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

//fonction affichant le détail d'un utilisateur
function drawUserDetails() {
}