var myTextarea = document.querySelector("textarea[name='Description']");
var charCount = document.getElementsByClassName("char-count")[0];

function displayCharsLeft() {
	var remainingChars = 1000 - myTextarea.value.length;
	charCount.innerHTML = remainingChars + " characters remaining";
}

myTextarea.addEventListener("input", function () {
	displayCharsLeft();
});

let review_template_html = `
<div class="review-item">
    <div style=" width: 25%; max-width: 300px; min-width: 250px; text-align: center; padding-bottom: 10px">
        <p class="review-user-name">Random Name</p>
        <div>
            <div class="rating-container">
                <label class="fas fa-star"></label>
                <label class="fas fa-star"></label>
                <label class="fas fa-star"></label>
                <label class="fas fa-star"></label>
                <label class="fas fa-star"></label>
            </div>
        </div>
    </div>
    <div>
        <p class="review-text"></p>
    </div>
</div>
`;


let reset_stars = `
<input type="radio" name="star" id="star-5" />
<label for="star-5" class="fas fa-star"></label>
<input type="radio" name="star" id="star-4" />
<label for="star-4" class="fas fa-star"></label>
<input type="radio" name="star" id="star-3" />
<label for="star-3" class="fas fa-star"></label>
<input type="radio" name="star" id="star-2" />
<label for="star-2" class="fas fa-star"></label>
<input type="radio" name="star" id="star-1" />
<label for="star-1" class="fas fa-star"></label>`

function storeReview() {
	let input_name = document.querySelector("input[name='Name']").value;
	let input_rating = document.querySelector("input[name='star']:checked");
	let input_desc = document.querySelector(
		"textarea[name='Description']"
	).value;

	let review = {
		name: input_name,
		rating: input_rating ? parseInt(input_rating.id.split("-")[1]) : null,
		description: input_desc.slice(0, 1000),
	};

	console.log(review);
	return review;
}

function displayReview(review) {
	let list_of_reviews = document.getElementsByClassName("list-of-reviews")[0];
	let new_review_element = document.createElement("div");
	new_review_element.innerHTML = review_template_html;

	new_review_element.getElementsByClassName(
		"review-user-name"
	)[0].textContent = review.name;
	stars = new_review_element.getElementsByClassName("fas fa-star");
	for (let index = 0; index < 5; index++) {
		if (index < review.rating) {
			stars[index].style.color = "#c2daef";
		}
	}
	new_review_element.getElementsByClassName("review-text")[0].textContent =
		review.description;

	list_of_reviews.insertBefore(
		new_review_element,
		list_of_reviews.firstChild
	);
}

function resetFields() {
	document.querySelector("input[name='Name']").value = "";
	stars = document.getElementsByClassName("fas fa-star");
	document.getElementsByClassName("radio-buttons")[0].innerHTML = reset_stars;
	document.querySelector("textarea[name='Description']").value = "";
	displayCharsLeft();
}

function showSubmittedText(){
    document.getElementById("review-submitted-text").style.opacity = 1;
    setTimeout(function() {document.getElementById("review-submitted-text").style.opacity = "0"}, 2000)
}

let submit_button = document.getElementById("submit-button");
submit_button.addEventListener("click", () => {
	let review = storeReview();

	if (review.name == "") {
		alert("Cannot add review! \nPlease enter your name");
		return;
	}
	if (review.rating == null) {
		alert("Cannot add review! \nPlease select a rating");
		return;
	}
	displayReview(review);
	resetFields();
    showSubmittedText();
});
