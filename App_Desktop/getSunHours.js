// Création d'une requête HTTP avec AJAX
var results;

function getHour(){
	
	var req = new XMLHttpRequest();
	// Requête HTTP GET synchrone vers le site des heures de lever du soleil
	req.open("GET", "https://api.sunrise-sunset.org/json?lat=45.782405&lng=4.865907&date=today", false);
	//coordonnées de Nautibus : 45.782405, 4.865907 &callback=mycallback
	// Envoi de la requête
	req.send(null);
	// Affiche la réponse reçue pour la requête
	console.log("résulat de la requête : ", req.responseText);
	results = JSON.parse(req.responseText).results;
}

function getSunRise(){
	return results.sunrise;
}

function getSunSet(){
	return results.nautical_twilight_end;
}

exports.getSunRise = getSunRise
exports.getSunSet = getSunSet
exports.getHour = getHour
