var i = 0;
// var text = "Start typing to find your next favorite song!";
var text = "Start typing to find your next melody!";

var speed = 40;

function typeWriter() {
	if (i < text.length) {
		document.getElementById("typing-text").textContent += text.charAt(i);
		i++;
	}
	setTimeout(typeWriter, speed);
}

window.onload = function () {
	typeWriter();
};
