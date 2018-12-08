// Création d'une requête HTTP avec AJAX

function getHour(){
	
	var req = new XMLHttpRequest();
	// Requête HTTP GET synchrone vers le site des heures de lever du soleil
	req.open("GET", "https://www.leshorairesdusoleil.com/default.aspx?v=Gap%20(France)&d=08-12-2018", false);
	// Envoi de la requête
	req.send(null);
	// Affiche la réponse reçue pour la requête
	console.log(req.responseText);
	return req.responseText;
}
exports.getHour = getHour
