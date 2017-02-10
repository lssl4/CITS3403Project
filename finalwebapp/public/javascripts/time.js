var currentTime;
function modTime(){
	var footer = document.getElementsByTagName("footer");
	var lastMod = document.createElement("p");
	lastMod.className = "mod";
	lastModDate = new Date(document.lastModified);
	lastMod.innerHTML = "last modified: " + lastModDate.toDateString();
	footer[0].appendChild(lastMod);
	
	currentTime = document.createElement("p");
	currentTime.className = "time";
	footer[0].appendChild(currentTime);
	timer();
	setInterval(timer,500);
}
function timer(){
		var today = new Date();
		currentTime.innerHTML = "Current Time: " + today.toLocaleTimeString();
}
