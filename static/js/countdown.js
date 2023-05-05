var date = new Date("Sep 21, 2023 12:00:00").getTime();

function updateCountdown() {
	var until = date - new Date().getTime();
	until = Math.floor(until / 1000);
	const txt = document.getElementById("cntdwnTxt");
	if (until < 0) {
		if (txt) {
			txt.textContent = "The countdown is over!";
		}
	} else {
		var days = Math.floor(until / (3600 * 24));
		var hours = Math.floor((until - days * 3600 * 24) / 3600);
		var minutes = Math.floor(
			(until - days * 3600 * 24 - hours * 3600) / 60
		);
		var seconds = Math.floor(until % 60);
		if (txt) {
			txt.textContent =
				days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
		}
	}
}

setInterval(updateCountdown, 1000);

const img = document.getElementsByClassName("artist-details")[0];

window.onload = () => {
	setTimeout(() => {
		img.style.transform = "scale(1.1)";
		img.style.shadow = "0 0 8px 8px white inset";

		img.style.transition = "transform 0.3s";
	}, 500);

	setTimeout(() => {
		img.style.transform = "scale(1)";
		img.style.shadow = "0 0 8px 8px white inset";

		img.style.transition = "transform 0.3s";
	}, 1000);
};
