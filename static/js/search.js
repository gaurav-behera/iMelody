let result_template_html = `
<div class="result-item">
<div style="width: 120px; text-align: center; justify-content:center">
		<button class="start-song-button">
			<img src="static/assets/play-icon.svg" width="30px" height="30px"/>
		</button>
	</div>
	<div>
		<img src="" class="song-image" />
	</div>

	<div style="width: 400px">
		<p class="song-name"></p>
		<p class="song-artist"></p>
	</div>

	<div style="width: 300px; text-align: center">
		<div style="max-width: 300px;" class="song-genre-div" >
			<p class="song-genre"></p>
		</div>
	</div>

	<div style="width=300px; display=flex; justify-content:center; align-items:center; padding-right:100px">
		<p class="song-duration"></p>
	</div>

	<div style="display:none">
		<p class="song-url"></p>
	</div>
</div>
`;

let empty_result_template_html = `
<div class="result-item" id="empty-result" style="display: block;">
<div
	style="
		width: 100%;
		text-align: center;
		justify-content: center;
		align-content: center;
		padding: 1px;
	"
>
	<p class="song-name">
		<img
			src="static/assets/oops.png"
			style="
				vertical-align: middle;
				width: 50px;
				height: 50px;
				margin: 10px;
			"
		/>
		Uh Oh! No items matched your search.
	</p>
</div>
</div>
`;

const filterButton = document.getElementsByClassName("filter-button")[0];
const filterContainer = document.getElementsByClassName("filter-container")[0];
const applyButton = document.getElementById("apply-button");
const durationSlider = document.getElementById("duration");
const durationValueElement = document.getElementById("duration-value");
const explicitRadioButton = document.getElementsByName("explicit")[0];
const clearButton = document.getElementById("clear-button");
var explicit = "No";


let SearchBar = document.querySelector("input[name='search-bar']");
let SearchSuggestion = document.getElementById("search-bar-suggestion");
SearchSuggestion.onclick = function () {
	SearchSuggestion.style.zIndex = "-1";
	SearchBar.focus();
};


filterButton.addEventListener("click", function () {
	if (filterContainer.style.display === "block") {
		filterContainer.style.display = "none";
		setTimeout(function () {
			filterContainer.style.opacity = "0%";
		}, 200);
	} else {
		filterContainer.style.display = "block";
		setTimeout(function () {
			filterContainer.style.opacity = "100%";
		}, 200);
	}
});

durationSlider.addEventListener("input", function () {
	const durationValue = durationSlider.value;
	const minutes = Math.floor(durationValue / 60);
	const seconds = durationValue % 60;
	durationValueElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""
		}${seconds}`;
	inputChange(50);
});

applyButton.addEventListener("click", function () {
	const durationValue = durationSlider.value;
	filterContainer.style.opacity = "0%";
	inputChange(50);

	setTimeout(function () {
		filterContainer.style.display = "none";
	}, 200);
});

clearButton.addEventListener("click", function () {
	durationSlider.value = 600;
	durationValueElement.textContent = "10:00";
	explicitRadioButton.checked = false;
	explicit = "No";
	inputChange(50);
	filterContainer.style.opacity = "0%";
	setTimeout(function () {
		filterContainer.style.display = "none";
	}, 200);
});

function displayResult(result) {
	let list_of_results = document.getElementsByClassName("list-of-results")[0];
	let new_result_element = document.createElement("div");
	new_result_element.innerHTML = result_template_html;

	new_result_element.getElementsByClassName("song-image")[0].src =
		result.artworkUrl100;
	new_result_element.getElementsByClassName("song-name")[0].textContent =
		result.trackCensoredName;
	new_result_element.getElementsByClassName("song-artist")[0].textContent =
		result.artistName;
	new_result_element.getElementsByClassName("song-genre")[0].textContent =
		result.primaryGenreName;
	new_result_element.getElementsByClassName("song-url")[0].textContent =
		result.previewUrl;
	var minutes = Math.floor(result.trackTimeMillis / 1000 / 60);
	var seconds = Math.floor((result.trackTimeMillis / 1000) % 60);
	new_result_element.getElementsByClassName(
		"song-duration"
	)[0].textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	list_of_results.append(new_result_element);
}

function clearResults() {
	let list_of_results = document.getElementsByClassName("list-of-results")[0];
	list_of_results.innerHTML = "";
	player.style.visibility = "hidden";
}

function processResult(data) {
	newList = [];

	for (let result of data.results) {
		if (result.trackTimeMillis / 1000 <= durationSlider.value) {
			newList.push(result);
		}
	}

	if (!explicitRadioButton.checked) {
		newList = newList.filter(
			(newList) => newList.trackExplicitness === "notExplicit"
		);
	}

	return newList;
}


let player = document.getElementsByClassName("music-player")[0];

function suggest(results, searchText) {
	for (let result of results) {
		if (result.trackCensoredName.toLowerCase().startsWith(searchText, 0))
			return result.trackCensoredName.toLowerCase().slice(0, 30);
	}
	return "";
}

function inputChange(limit) {
	const searchText = SearchBar.value.toLowerCase();
	if (explicitRadioButton.checked) {
		explicit = "Yes";
	}
	let url = new URL("https://itunes.apple.com/search");
	let params = {
		term: searchText,
		media: "music",
		explicit: explicit,
		limit: limit,
	};
	url.search = new URLSearchParams(params);
	console.log(url);

	if (searchText != "") {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				let results = processResult(data);
				if (results.length != 0) {
					let sugTxt = suggest(results, searchText);
					SearchSuggestion.textContent = sugTxt;
					SearchSuggestion.style.zIndex = "1";
					if (results.length < 10 && limit < 200)
						inputChange(limit + 50);
					clearResults();
					for (let i = 0; i < results.length && i < 10; i++)
						displayResult(results[i]);
					setTrackOnClick();
					player.style.visibility = "visible";
				} else {
					clearResults();
					SearchSuggestion.textContent = "";
					let list_of_results =
						document.getElementsByClassName("list-of-results")[0];
					let empty_result_element = document.createElement("div");
					empty_result_element.innerHTML = empty_result_template_html;
					list_of_results.append(empty_result_element);
				}
			})
			.catch((error) => console.error(error));
	} else
		SearchSuggestion.textContent = "";
}

function setTrackOnClick() {
	var resultItems = document.querySelectorAll(".result-item");
	songListUrl = [];
	let i = 0;
	let firstSong;
	resultItems.forEach((resultItem) => {
		songListUrl.push(
			resultItem.getElementsByClassName("song-url")[0].textContent
		);
		if (i == 0)
			firstSong = resultItem;
		resultItem
			.getElementsByClassName("start-song-button")[0]
			.addEventListener("click", () => {
				playSong(resultItem);
			});
		i++;
	});
	playSong(firstSong);
	audioPlayer.pause();
	document.getElementById("play-pause-icon").src = "static/assets/play-icon.svg";
	player.style.visibility = "visible";
}

SearchBar.addEventListener("input", () => {
	inputChange(50);
});

SearchBar.addEventListener("change", () => {
	inputChange(50);
});


var songListUrl = [];
var currentSongIndex = 0;

var audioPlayer = document.getElementById("audio-player");
var playPauseButton = document.getElementById("play-pause-button");
var prevButton = document.getElementById("prev-button");
var nextButton = document.getElementById("next-button");

var volumeControl = document.getElementById("volume-slider");
var seekBar = document.getElementById("seek-bar");

function playSong(resultItem) {
	currentSongIndex = findResultIndex(resultItem);
	var songUrl = resultItem.getElementsByClassName("song-url")[0].textContent;
	var audioPlayer = document.getElementById("audio-player");
	audioPlayer.src = songUrl;
	audioPlayer.load();
	document.getElementsByClassName("player-image")[0].src =
		resultItem.getElementsByClassName("song-image")[0].src.replace("100x100", "1200x1200");
	document.getElementById("play-pause-icon").src = "static/assets/play-icon.svg";

	audioPlayer.addEventListener("loadedmetadata", () => {
		var minutes = Math.floor(audioPlayer.duration / 60);
		var seconds = Math.floor(audioPlayer.duration % 60);
		document.getElementById("total-time").textContent = `${minutes}:${seconds < 10 ? "0" : ""
			}${seconds}`;
	});

	audioPlayer.play();
	document.getElementById("play-pause-icon").src = "static/assets/pause-icon.svg";
}

function findResultIndex(item) {
	for (let index = 0; index < songListUrl.length; index++) {
		if (
			songListUrl[index] ==
			item.getElementsByClassName("song-url")[0].textContent
		)
			return index;
	}
}

playPauseButton.addEventListener("click", () => {
	if (audioPlayer.paused) {
		document.getElementById("play-pause-icon").src =
			"static/assets/pause-icon.svg";
		if (audioPlayer.src != "") audioPlayer.play();
	} else {
		document.getElementById("play-pause-icon").src = "static/assets/play-icon.svg";
		if (audioPlayer.src != "") audioPlayer.pause();
	}
});

volumeControl.addEventListener("input", () => {
	audioPlayer.volume = volumeControl.value / 100;
});

seekBar.addEventListener("input", () => {
	audioPlayer.currentTime = audioPlayer.duration * (seekBar.value / 100);
});

audioPlayer.addEventListener("timeupdate", () => {
	var minutes = Math.floor(audioPlayer.currentTime / 60);
	var seconds = Math.floor(audioPlayer.currentTime % 60);
	document.getElementById("current-time").textContent = `${minutes}:${seconds < 10 ? "0" : ""
		}${seconds}`;
	setInterval(() => {
		seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
	}, 250);
});

audioPlayer.addEventListener("ended", () => {
	seekBar.value = 0;
	document.getElementById("play-pause-icon").src = "static/assets/play-icon.svg";
});

prevButton.addEventListener("click", () => {
	currentSongIndex =
		(currentSongIndex - 1 + songListUrl.length) % songListUrl.length;

	let resultItem =
		document.getElementsByClassName("result-item")[currentSongIndex];
	playSong(resultItem);
});

nextButton.addEventListener("click", () => {
	currentSongIndex = (currentSongIndex + 1) % songListUrl.length;

	let resultItem =
		document.getElementsByClassName("result-item")[currentSongIndex];
	playSong(resultItem);
});

document.getElementById("volume-button").addEventListener("click", () => {
	if (
		document.getElementsByClassName("volume-slider")[0].style.display ===
		"block"
	)
		document.getElementsByClassName("volume-slider")[0].style.display =
			"none";
	else
		document.getElementsByClassName("volume-slider")[0].style.display =
			"block";
});
