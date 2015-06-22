//déclaration des variables globales
//var host = "http://dev-app.jcef-shanghai.com/ITJCEFCarte/Site";
var host = "http://localhost/ITJCEFCarte/Site";
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
    if (checkPreAuth()) {
        openEvTrombi();
    } else {
    window.localStorage["currentPage"]="login";
    $.mobile.pageContainer.pagecontainer('change', "#loginPage");
    afficheMenu();
    }
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


//fonction appelée ailleurs pour ouvrir proprement la page de stats
function openStatistiques(){
    WSstats();
    window.localStorage["currentPage"]="statsPage";
  $.mobile.pageContainer.pagecontainer('change',"#statistiques");
    afficheMenu();
}


//fonction appelée ailleurs pour ouvrir proprement la page d'ajout d'un user
function openAddUser(){
    $('#user_browse_picture').html("<input type='file' name='user_picture' id='user_picture'>").enhanceWithin();
    $('#userVisuSurname').html("<input type='text' name='user_surname' id='user_surname'>").enhanceWithin();
    $('#userVisuName').html("<input type='text' name='user_name' id='user_name'>").enhanceWithin();
    $('#userVisuFonction').html("<input type='text' name='user_jcef_function' id='user_jcef_function'>").enhanceWithin();
    $('#userVisuPays').html( "<input type='text' name='user_nation' id='user_nation'>" ).enhanceWithin();
    $('#userVisuEntreprise').html( "<input type='text' name='user_company' id='user_company'>" ).enhanceWithin();
    $('#userVisuTitreEntreprise').html( "<input type='text' name='user_company_title' id='user_company_title'>" ).enhanceWithin();
    $('#userVisuInscription').html( "<input type='text' name='user_subscription_date' id='user_subscription_date'>" ).enhanceWithin();
    $('#userVisuEmailJCEF').html( "<input type='text' name='user_email_jcef' id='user_email_jcef'>" ).enhanceWithin();
    $('#userVisuNaissance').html( "<input type='text' name='user_birth' id='user_birth'>" ).enhanceWithin();
    $('#userVisuSexe').html( "<input type='text' name='user_sex' id='user_sex'>" ).enhanceWithin();
    $('#userVisuSkype').html( "<input type='text' name='user_skype' id='user_skype'>" ).enhanceWithin();
    $('#userVisuWechat').html( "<input type='text' name='user_weixin' id='user_weixin'>" ).enhanceWithin();
    $('#userVisuTelMobile').html( "<input type='text' name='user_cell_phone' id='user_cell_phone'>" ).enhanceWithin();
    $('#userVisuTelFixe').html( "<input type='text' name='user_land_phone' id='user_land_phone'>" ).enhanceWithin();
    $('#userVisuEmailEntrep').html( "<input type='text' name='user_email_company' id='user_email_company'>" ).enhanceWithin();
    $('#userVisuEmailPerso').html( "<input type='text' name='user_email_perso' id='user_email_perso'>" ).enhanceWithin();
    $('#userVisuAdresse').html( "<input type='text' name='user_address' id='user_address'>" ).enhanceWithin();
    $('#userVisuCommentaire').html( "<input type='text' name='user_comment' id='user_comment'>" ).enhanceWithin();
    $('#userVisuTypeAdhesion').html( "<input type='text' name='user_member_type' id='user_member_type'>" ).enhanceWithin();
    $('#userVisuDerniereCotisation').html( "<input type='text' name='user_renew_date' id='user_renew_date'>" ).enhanceWithin();
    $('#userVisuDernierMontant').html( "<input type='text' name='user_last_amount' id='user_last_amount'>" ).enhanceWithin();
    $('#userVisuQRCode').attr("src","").enhanceWithin();
    $('#userVisuAddButton').html("<button data-theme='a' data-form='ui-btn-up-a' class=' ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='WSadd_user()' data-role='none'>Ajouter</button>" ).enhanceWithin();
    //WSadd_user();
    window.localStorage["currentPage"]="addUserPage";
  $.mobile.pageContainer.pagecontainer('change',"#user_profil");
    afficheMenu();
}


//fonction appelée ailleurs pour ouvrir proprement la page d'ajout d'un user
function openEditUser(){
    usr = JSON.parse(window.localStorage["selected_user_profil"]);
    $('#user_browse_picture').html("<input type='file' name='user_picture' id='user_picture'>").enhanceWithin();
    $('#userVisuSurname').html("<input type='text' name='user_surname' id='user_surname' value='"+usr.user_surname+"'>").enhanceWithin();
    $('#userVisuName').html("<input type='text' name='user_name' id='user_name' value='"+usr.user_name+"'>").enhanceWithin();
    $('#userVisuFonction').html("<input type='text' name='user_jcef_function' id='user_jcef_function' value='"+usr.user_jcef_function+"'>").enhanceWithin();
    $('#userVisuPays').html( "<input type='text' name='user_nation' id='user_nation' value='"+usr.user_nation+"'>" ).enhanceWithin();
    $('#userVisuEntreprise').html( "<input type='text' name='user_company' id='user_company' value='"+usr.user_company+"'>" ).enhanceWithin();
    $('#userVisuTitreEntreprise').html( "<input type='text' name='user_company_title' id='user_company_title' value='"+usr.user_company_title+"'>" ).enhanceWithin();
    $('#userVisuInscription').html( "<input type='text' name='user_subscription_date' id='user_subscription_date' value='"+usr.user_subscription_date+"'>" ).enhanceWithin();
    $('#userVisuEmailJCEF').html( "<input type='text' name='user_email_jcef' id='user_email_jcef' value='"+usr.user_email_jcef+"'>" ).enhanceWithin();
    $('#userVisuNaissance').html( "<input type='text' name='user_birth' id='user_birth' value='"+usr.user_birth+"'>" ).enhanceWithin();
    $('#userVisuSexe').html( "<input type='text' name='user_sex' id='user_sex' value='"+usr.user_sex+"'>" ).enhanceWithin();
    $('#userVisuSkype').html( "<input type='text' name='user_skype' id='user_skype' value='"+usr.user_skype+"'>" ).enhanceWithin();
    $('#userVisuWechat').html( "<input type='text' name='user_weixin' id='user_weixin' value='"+usr.user_weixin+"'>" ).enhanceWithin();
    $('#userVisuTelMobile').html( "<input type='text' name='user_cell_phone' id='user_cell_phone' value='"+usr.user_cell_phone+"'>" ).enhanceWithin();
    $('#userVisuTelFixe').html( "<input type='text' name='user_land_phone' id='user_land_phone' value='"+usr.user_land_phone+"'>" ).enhanceWithin();
    $('#userVisuEmailEntrep').html( "<input type='text' name='user_email_company' id='user_email_company' value='"+usr.user_email_company+"'>" ).enhanceWithin();
    $('#userVisuEmailPerso').html( "<input type='text' name='user_email_perso' id='user_email_perso' value='"+usr.user_email_perso+"'>" ).enhanceWithin();
    $('#userVisuAdresse').html( "<input type='text' name='user_address' id='user_address' value='"+usr.user_address+"'>" ).enhanceWithin();
    $('#userVisuCommentaire').html( "<input type='text' name='user_comment' id='user_comment' value='"+usr.user_comment+"'>" ).enhanceWithin();
    $('#userVisuTypeAdhesion').html( "<input type='text' name='user_member_type' id='user_member_type' value='"+usr.user_member_type+"'>" ).enhanceWithin();
    $('#userVisuDerniereCotisation').html( "<input type='text' name='user_renew_date' id='user_renew_date' value='"+usr.user_renew_date+"'>" ).enhanceWithin();
    $('#userVisuDernierMontant').html( "<input type='text' name='user_last_amount' id='user_last_amount' value='"+usr.user_last_amount+"'>" ).enhanceWithin();
    $('#userVisuQRCode').attr("src","").enhanceWithin();
    $('#userVisuAddButton').html("" ).enhanceWithin();
    $('#userVisuEditButton').html("<button data-theme='a' data-form='ui-btn-up-a' class=' ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='WSuser_update()' data-role='none'>Valider</button>" ).enhanceWithin();

    //WSadd_user();
    window.localStorage["currentPage"]="addUserPage";
  $.mobile.pageContainer.pagecontainer('change',"#user_profil");
    afficheMenu();
}


//fonction appelée ailleurs pour ouvrir proprement la page d'ajout d'un event
function openAddEvent(){
    $('#event_browse_picture').html("<input type='file' name='ev_picture' id='ev_picture'>").enhanceWithin();
    $('#eventVisuName').html("<input type='text' name='ev_name' id='ev_name'>").enhanceWithin();
    $('#eventVisuLieu').html("<input type='text' name='ev_address' id='ev_address'>").enhanceWithin();
    $('#eventVisuDate').html( "<input type='text' name='ev_date' id='ev_date'>" ).enhanceWithin();
    $('#eventVisuDescription').html( "<input type='text' name='ev_description' id='ev_description'>" ).enhanceWithin();
    $('#eventVisuParticipantsMax').html( "<input type='text' name='ev_max_participants' id='ev_max_participants'>" ).enhanceWithin();
    $('#eventVisuParticipants').html( "<input type='text' name='ev_participants' id='ev_participants'>" ).enhanceWithin();
    $('#eventVisuPrix').html( "<input type='text' name='ev_price' id='ev_price'>" ).enhanceWithin();
    $('#eventVisuNbInscrits').html( "<input type='text' name='ev_nb_subscribed' id='ev_nb_subscribed'>" ).enhanceWithin();
    $('#eventVisuResponsable').html( "<input type='text' name='ev_charged_member' id='ev_charged_member'>" ).enhanceWithin();
    $('#eventVisuLienCom').html( "<input type='text' name='ev_com_linked' id='ev_com_linked'>" ).enhanceWithin();
    $('#eventVisuListeParticipants').html("").enhanceWithin();
    $('#eventVisuAddButton').html("<button data-theme='a' data-form='ui-btn-up-a' class=' ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='WSadd_event()' data-role='none'>Ajouter</button>" ).enhanceWithin();
    window.localStorage["currentPage"]="addEventPage";
  $.mobile.pageContainer.pagecontainer('change',"#event_profil");
    afficheMenu();
}


//fonction appelée ailleurs pour ouvrir proprement la page d'ajout d'un event
function openEditEvent(){
    ev = JSON.parse(window.localStorage["selected_event_profil"]);
    $('#event_browse_picture').html("<input type='file' name='ev_picture' id='ev_picture' value='"+ev.ev_picture+"'>").enhanceWithin();
    $('#eventVisuName').html("<input type='text' name='ev_name' id='ev_name' value='"+ev.ev_name+"'>").enhanceWithin();
    $('#eventVisuLieu').html("<input type='text' name='ev_address' id='ev_address' value='"+ev.ev_address+"'>").enhanceWithin();
    $('#eventVisuDate').html( "<input type='text' name='ev_date' id='ev_date' value='"+ev.ev_date+"'>" ).enhanceWithin();
    $('#eventVisuDescription').html( "<input type='text' name='ev_description' id='ev_description' value='"+ev.ev_description+"'>" ).enhanceWithin();
    $('#eventVisuParticipantsMax').html( "<input type='text' name='ev_max_participants' id='ev_max_participants' value='"+ev.ev_max_participants+"'>" ).enhanceWithin();
    $('#eventVisuParticipants').html( "<input type='text' name='ev_participants' id='ev_participants' value='"+ev.ev_participants+"'>" ).enhanceWithin();
    $('#eventVisuPrix').html( "<input type='text' name='ev_price' id='ev_price' value='"+ev.ev_price+"'>" ).enhanceWithin();
    $('#eventVisuNbInscrits').html( "<input type='text' name='ev_nb_subscribed' id='ev_nb_subscribed' value='"+ev.ev_nb_subscribed+"'>" ).enhanceWithin();
    $('#eventVisuResponsable').html( "<input type='text' name='ev_charged_member' id='ev_charged_member' value='"+ev.ev_charged_member+"'>" ).enhanceWithin();
    $('#eventVisuLienCom').html( "<input type='text' name='ev_com_linked' id='ev_com_linked' value='"+ev.ev_com_linked+"'>" ).enhanceWithin();
    $('#eventVisuListeParticipants').html("").enhanceWithin();
    $('#eventVisuAddButton').html("" ).enhanceWithin();
    $('#eventVisuEditButton').html("<button data-theme='a' data-form='ui-btn-up-a' class=' ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='WSevent_update()' data-role='none'>Valider</button>" ).enhanceWithin();

    window.localStorage["currentPage"]="editEventPage";
  $.mobile.pageContainer.pagecontainer('change',"#event_profil");
    afficheMenu();
}


//fonction appelée ailleurs pour ouvrir proprement la page d'ajout d'un event
function openAddCom(){
    $('#com_browse_picture').html("<input type='file' name='com_picture' id='com_picture'>").enhanceWithin();
    $('#comVisuName').html("<input type='text' name='com_name' id='com_name'>").enhanceWithin();
    $('#comVisuDescription').html( "<input type='text' name='com_description' id='com_description'>" ).enhanceWithin();
    $('#comVisuAddButton').html("<button data-theme='a' data-form='ui-btn-up-a' class=' ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='WSadd_commission()' data-role='none'>Ajouter</button>" ).enhanceWithin();
    window.localStorage["currentPage"]="addComPage";
  $.mobile.pageContainer.pagecontainer('change',"#commission_profil");
    afficheMenu();
}


//fonction appelée ailleurs pour ouvrir proprement la page d'ajout d'un event
function openEditCom(){
    com = JSON.parse(window.localStorage["selected_com_profil"]);
    $('#com_browse_picture').html("<input type='file' name='com_picture' id='com_picture' value='"+com.com_picture+"'>").enhanceWithin();
    $('#comVisuName').html("<input type='text' name='com_name' id='com_name' value='"+com.com_name+"'>").enhanceWithin();
    $('#comVisuDescription').html( "<input type='text' name='com_description' id='com_description' value='"+com.com_description+"'>" ).enhanceWithin();
    $('#comVisuAddButton').html("" ).enhanceWithin();
    $('#comVisuEditButton').html("<button data-theme='a' data-form='ui-btn-up-a' class=' ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='WScommission_update()' data-role='none'>Valider</button>" ).enhanceWithin();

    window.localStorage["currentPage"]="editComPage";
  $.mobile.pageContainer.pagecontainer('change',"#commission_profil");
    afficheMenu();
}


//fonction appelée ailleurs pour ouvrir proprement la page d'ajout d'un user
function openUsersAttente(){
    //WSuser_profil(window.localStorage["user_uuid"]);
    window.localStorage["currentPage"]="usersAttentePage";
  $.mobile.pageContainer.pagecontainer('change',"#users_attente");
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
    if (window.localStorage["admin"]==1){
        $('#startscan').html("<button id='startScan' onclick='openScan()'>Commencer le pointage</button>").enhanceWithin();
    }
}

//fonction appelée ailleurs pour ouvrir proprement la page de détails d'une commission
function openComDetails(pk){
    WScom_profil(pk);
    window.localStorage["currentPage"]="comDetailsPage";
  $.mobile.pageContainer.pagecontainer('change',"#com_profil");
    
    
}

//fonction appelée ailleurs pour ouvrir la page de Scan des membres
function openScan(){
    window.localStorage["currentPage"]="ScanPage";
    $.mobile.pageContainer.pagecontainer('change',"#event_profil");      
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
               var str =  JSON.stringify(res);
               window.localStorage["user_uuid"] = u;
               window.localStorage["user_password"] = p;
               window.localStorage["user_is_admin"] = res.user_is_admin;
               window.localStorage["active_user"]=str;
               
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
                    window.localStorage["selected_user_profil"] = JSON.stringify(res);
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    $('#user_browse_picture').html("").enhanceWithin();
                    $('#userVisuImage').attr("src",host+"/"+res.user_picture).enhanceWithin();
                    $('#userVisuSurname').html( res.user_surname ).enhanceWithin();
                    $('#userVisuName').html( res.user_name ).enhanceWithin();
                    $('#userVisuFonction').html( res.user_jcef_function ).enhanceWithin();
                    $('#userVisuPays').html( res.user_nation ).enhanceWithin();
                    $('#userVisuEntreprise').html( res.user_company ).enhanceWithin();
                    $('#userVisuTitreEntreprise').html( res.user_company_title ).enhanceWithin();
                    $('#userVisuInscription').html( res.user_subscription_date ).enhanceWithin();
                    $('#userVisuEmailJCEF').html( res.user_email_jcef ).enhanceWithin();
                    $('#userVisuNaissance').html( res.user_birth ).enhanceWithin();
                    $('#userVisuSexe').html( res.user_sex ).enhanceWithin();
                    $('#userVisuSkype').html( res.user_skype ).enhanceWithin();
                    $('#userVisuWechat').html( res.user_weixin ).enhanceWithin();
                    $('#userVisuTelMobile').html( res.user_cell_phone ).enhanceWithin();
                    $('#userVisuTelFixe').html( res.user_land_phone ).enhanceWithin();
                    $('#userVisuEmailEntrep').html( res.user_email_company ).enhanceWithin();
                    $('#userVisuEmailPerso').html( res.user_email_perso ).enhanceWithin();
                    $('#userVisuAdresse').html( res.user_address ).enhanceWithin();
                    $('#userVisuCommentaire').html( res.user_comment ).enhanceWithin();
                    $('#userVisuTypeAdhesion').html( res.user_weixin ).enhanceWithin();
                    $('#userVisuDerniereCotisation').html( res.user_weixin ).enhanceWithin();
                    $('#userVisuDernierMontant').html( res.user_weixin ).enhanceWithin();
                    $('#userVisuQRCode').attr("src","https://chart.googleapis.com/chart?cht=qr&chl="+res.user_qr_code_url+"&chs=100x100&choe=UTF-8&chld=L|2").enhanceWithin();
                    $('#userVisuAddButton').html("").enhanceWithin();
                    selUsr = res;
                    actUsr = JSON.parse(window.localStorage["active_user"]);
                    if(selUsr.user_uuid==actUsr.user_uuid || actUsr.user_is_admin==1)
                    {
                      $('#userVisuEditButton').html("<button data-theme='a' data-form='ui-btn-up-a' class=' ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='openEditUser()' data-role='none'>Editer</button>" ).enhanceWithin();
                    }
                    
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





//A MODIF fonction qui permet l'ajout d'un user en append des champs de texte sur la page type de profil user
function WSadd_user(){
var URL = host + "/Controller/WSadd_user.php";
    var contentElem;
    
    
    var user_browse_picture = $("#user_browse_picture").val();
    var user_surname = $("#user_surname").val();
    var user_name = $("#user_name").val();
    var user_picture = $("#user_picture").val();
    var user_jcef_function = $("#user_jcef_function").val();
    var user_company = $("#user_company").val();
    var user_company_title = $("#user_company").val();
    var user_subscription_date = $("#user_subscription_date").val();
    var user_email_jcef = $("#user_email_jcef").val();
    var user_birth = $("#user_birth").val();
    var user_sex = $("#user_sex").val();
    var user_skype = $("#user_skype").val();
    var user_weixin = $("#user_weixin").val();



    //if(user != '') {
        $.ajax({
            type: 'POST',
            url: URL,
            data: {user_browse_picture:user_picture,user_surname:user_surname,user_name:user_name,user_jcef_function:user_jcef_function,user_company:user_company,user_subscription_date:user_subscription_date,user_email_jcef:user_email_jcef,user_birth:user_birth,user_sex:user_sex,user_skype:user_skype,user_weixin:user_weixin},
            async: false,
            statusCode: {
                200: function (res) {    
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    },
                    dataType: "JSON"
            });
    //} else {
      //  $("#submit").removeAttr("disabled");
    //}
    return false;
}






//A MODIF fonction qui permet l'ajout d'un user en append des champs de texte sur la page type de profil user
function WSuser_update(){
var URL = host + "/Controller/WSuser_update.php";
    var contentElem;
    
    var user_uuid = (JSON.parse(window.localStorage["selected_user_profil"])).user_uuid;
    var user_picture = $("#user_browse_picture").val();
    var user_surname = $("#user_surname").val();
    var user_name = $("#user_name").val();
    var user_picture = $("#user_picture").val();
    var user_jcef_function = $("#user_jcef_function").val();
    var user_company = $("#user_company").val();
    var user_company_title = $("#user_company_title").val();
    var user_subscription_date = $("#user_subscription_date").val();
    var user_email_jcef = $("#user_email_jcef").val();
    var user_birth = $("#user_birth").val();
    var user_sex = $("#user_sex").val();
    var user_skype = $("#user_skype").val();
    var user_weixin = $("#user_weixin").val();
    var user_cell_phone = $('#userVisuTelMobile').val();
    var user_land_phone = $('#userVisuTelFixe').val();
    var user_email_company = $('#userVisuEmailEntrep').val();
    var user_email_perso = $('#userVisuEmailPerso').val();
    var user_address = $('#userVisuAdresse').val();
    var user_comment = $('#userVisuCommentaire').val();
    var user_member_type = $('#userVisuTypeAdhesion').val();
    var user_renew_date = $('#userVisuDerniereCotisation').val();
    var user_last_amount = $('#userVisuDernierMontant').val();
    

    //if(user != '') {
        $.ajax({
            type: 'POST',
            url: URL,
            data: {user_uuid:user_uuid,user_picture:user_picture,user_surname:user_surname,user_name:user_name,user_jcef_function:user_jcef_function,
              user_company:user_company,user_company_title:user_company_title,user_subscription_date:user_subscription_date,user_email_jcef:user_email_jcef,
              user_birth:user_birth,user_sex:user_sex,user_skype:user_skype,user_weixin:user_weixin,user_cell_phone:user_cell_phone,
              user_land_phone:user_land_phone,user_email_company:user_email_company,user_email_perso:user_email_perso,user_address:user_address,
              user_comment:user_comment,user_member_type:user_member_type,user_renew_date:user_renew_date,user_last_amount:user_last_amount},
            async: false,
            statusCode: {
                200: function (res) {    
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    },
                    dataType: "JSON"
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
                    $('#eventVisuImage').attr("src",host+"/"+res.ev_picture).enhanceWithin();
                    $('#eventVisuName').html(res.ev_name).enhanceWithin();
                    $('#eventVisuLieu').html(res.ev_address).enhanceWithin();
                    $('#eventVisuDate').html(res.ev_date).enhanceWithin();
                    $('#eventVisuParticipantsMax').html(res.ev_max_participants).enhanceWithin();
                    $('#eventVisuParticipants').html(res.ev_participants).enhanceWithin();
                    $('#eventVisuPrix').html(res.ev_price).enhanceWithin();
                    $('#eventVisuNbInscrits').html(res.ev_nb_subscribed).enhanceWithin();
                    $('#eventVisuResponsable').html(res.ev_charged_member).enhanceWithin();
                    $('#eventVisuLienCom').html(res.ev_com_linked).enhanceWithin();
                    //$('#eventVisuListeParticipants').html(res.).enhanceWithin();
                    
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




//A MODIF fonction qui permet l'ajout d'un user en append des champs de texte sur la page type de profil user
function WSadd_event(){
var URL = host + "/Controller/WSadd_event.php";
    var contentElem;
    
    
    var ev_browse_picture = $("#ev_browse_picture").val();
    var ev_name = $("#ev_name").val();
    var ev_picture = $("#ev_picture").val();
    var ev_date = $("#ev_date").val();
    var ev_address = $("#ev_address").val();
    var ev_price = $("#ev_price").val();
    var ev_participants = $("#ev_participants").val();
    var ev_max_participants = $("#ev_max_participants").val();
    var ev_charged_member = $("#ev_charged_member").val();
    var ev_com_linked = $("#ev_com_linked").val();
    



    //if(user != '') {
        $.ajax({
            type: 'POST',
            url: URL,
            data: {ev_browse_picture:ev_picture,ev_name:ev_name,ev_date:ev_date,ev_address:ev_address,ev_price:ev_price,ev_participants:ev_participants,ev_max_participants:ev_max_participants,ev_charged_member:ev_charged_member,ev_com_linked:ev_com_linked},
            async: false,
            statusCode: {
                200: function (res) {    
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    },
                    dataType: "JSON"
            });
    //} else {
      //  $("#submit").removeAttr("disabled");
    //}
    return false;
}






//A MODIF fonction qui permet l'ajout d'un user en append des champs de texte sur la page type de profil user
function WSevent_update(){
var URL = host + "/Controller/WSuser_update.php";
    var contentElem;
    
    var ev_pk = (JSON.parse(window.localStorage["selected_event_profil"])).ev_pk;
    var ev_browse_picture = $("#ev_browse_picture").val();
    var ev_name = $("#ev_name").val();
    var ev_picture = $("#ev_picture").val();
    var ev_date = $("#ev_date").val();
    var ev_address = $("#ev_address").val();
    var ev_price = $("#ev_price").val();
    var ev_participants = $("#ev_participants").val();
    var ev_max_participants = $("#ev_max_participants").val();
    var ev_charged_member = $("#ev_charged_member").val();



    //if(user != '') {
        $.ajax({
            type: 'POST',
            url: URL,
            data: {ev_pk:ev_pk,ev_browse_picture:ev_picture,ev_name:ev_name,ev_date:ev_date,ev_address:ev_address,ev_price:ev_price,ev_participants:ev_participants,ev_max_participants:ev_max_participants,ev_charged_member:ev_charged_member},
            async: false,
            statusCode: {
                200: function (res) {    
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    },
                    dataType: "JSON"
            });
    //} else {
      //  $("#submit").removeAttr("disabled");
    //}
    return false;
}





//Affiche les détails d'une commission 
function WScom_profil(com_pk){
    var URL = host + "/Controller/WScom_profil.php";
    var contentElem;
    //if(user != '') {
        $.ajax({
            type: 'GET',
            url: URL+"?com_pk="+com_pk,
            dataType: "json",
            async: false,
            statusCode: {
                200: function (res) {
                    $('#comVisuImage').attr("src",host+"/"+res.com_picture).enhanceWithin();
                    $('#comVisuName').html(res.com_name).enhanceWithin();
                    $('#comVisuDescription').html(res.com_description).enhanceWithin();
                    window.localStorage["selected_com_profil"] = JSON.stringify(res);
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




//A MODIF fonction qui permet l'ajout d'un user en append des champs de texte sur la page type de profil user
function WSadd_commission(){
var URL = host + "/Controller/WSadd_commission.php";
    var contentElem;
    
    
    var com_browse_picture = $("#com_browse_picture").val();
    var com_name = $("#com_name").val();
    var com_picture = $("#com_picture").val();
    var com_description = $("#com_description").val();


    //if(user != '') {
        $.ajax({
            type: 'POST',
            url: URL,
            data: {com_browse_picture:com_picture,com_name:com_name,com_description:com_description},
            async: false,
            statusCode: {
                200: function (res) {    
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    },
                    dataType: "JSON"
            });
    //} else {
      //  $("#submit").removeAttr("disabled");
    //}
    return false;
}






//A MODIF fonction qui permet l'ajout d'un user en append des champs de texte sur la page type de profil user
function WScommission_update(){
var URL = host + "/Controller/WScommission_update.php";
    var contentElem;
    
    var com_pk = (JSON.parse(window.localStorage["selected_com_profil"])).com_pk;
    var com_browse_picture = $("#com_browse_picture").val();
    var com_name = $("#com_name").val();
    var com_picture = $("#com_picture").val();
    var com_description = $("#com_description").val();
    



    //if(user != '') {
        $.ajax({
            type: 'POST',
            url: URL,
            data: {com_pk:com_pk,com_browse_picture:com_picture,com_name:com_name,com_description:com_description},
            async: false,
            statusCode: {
                200: function (res) {    
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    },
                    dataType: "JSON"
            });
    //} else {
      //  $("#submit").removeAttr("disabled");
    //}
    return false;
}





//A MODIF fonction qui permet l'ajout d'un user en append des champs de texte sur la page type de profil user
function WSstats(){
var URL = host + "/Controller/WSstats.php";
    var contentElem;
    
        $.ajax({
            type: 'POST',
            dataType: "html",
            url: URL,
            async: false,
            statusCode: {
                200: function (res) {    
                    //TODO : Ajouter tous les autres champs pertinents. Attention les id doivent être uniques, ils ne l'étaient pas.
                    $('#div_stats_membres').html(res).enhanceWithin();
                    },
                404: function(){
                    self.showAlert(current, "Le serveur ne répond pas.", "erreur");
                    },
                500: function(){
                    self.showAlert(current, "erreur interne au serveur, veuillez réessayer plus tard", "erreur");
                    }
                    }
              
            });
    
    return false;
}






//!!!!!! SECTION Fonction métier
// lancement du scan depuis le plugin
function startScan() {
    log("dans startscan");
    //event_actif = JSON.parse(window.localStorage["selected_event_profil"]);
    //event_pk = event_actif.event_pk;
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
    log("dans logout");
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
    if(window.localStorage["user_is_admin"]==1)
        {
            $("#menuPage").append("<button data-theme='a' data-form='ui-btn-up-a' class='ui-btn ui-btn-a ui-btn-icon-left ui-shadow ui-corner-all ui-icon-check' onclick='openAdminMenu();' data-role='none'>Panel Admin</button>");
        }
    if (window.localStorage["currentPage"]=="login"){
        $("#menu_contents").empty();
        $("#menu_contents").append('<li><a data-theme="a" href="#" data-role="none">Mot de passe oublié</a></li>').listview().listview('refresh');
    }else{
        ul = $("#menu_contents");
        ul.empty();
        adminItem = '<li><a data-theme="a" onclick="openAdminMenu();" data-role="none">Panel Admin</a></li>';
        items = '<li><a data-theme="a" onclick="openUsrTrombi();" data-role="none">Trombinoscope</a></li><li><a data-theme="a" onclick="openMyProfil();" data-role="none">Mon profil</a></li><li><a data-theme="a" onclick="openEvTrombi();" data-role="none">Évènements</a></li><li><a data-theme="a" onclick="openComTrombi();" data-role="none">Commissions</a></li><li><a href="#locale" onclick="logout()" class="f-cogs">Déconnexion</a></li>';
        if(window.localStorage["user_is_admin"]==1)
        {
          
          ul.append(adminItem);
        }
        ul.append(items);
        ul.listview().listview('refresh');
    }
}


// Fonction qui sélectionne remplis le bon menu
function openAdminMenu(){
    log("dans AdminafficheMenu");
          window.localStorage["currentPage"]="menuAdmin";
          $.mobile.pageContainer.pagecontainer('change', "#adminPage");
          afficheMenu();     
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
  log("dans trombiUsr");
    $('#trombiUsers').html('');
    if (window.localStorage["users"]!= undefined){
      log("users trouvés");
        $.get('js/template.html', function(template) {
              // charge le fichier templates et récupère le contenu de la
              log("fichier trouvé");
              var users = JSON.parse(window.localStorage["users"]);
              //log(users[1].user_name);
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
              var events = JSON.parse(window.localStorage["events"]);
              var template = $(template).filter('#tpl-trombiEvents').html();
              var html = Mustache.to_html(template, events);
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
              var coms = JSON.parse(window.localStorage["commissions"]);
              var template = $(template).filter('#tpl-trombiCom').html();
              var html = Mustache.to_html(template, coms);
              $('#trombiCommissions').html(html).trigger('create');
              },'html');}
}