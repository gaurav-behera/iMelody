function likeSong(like_btn, refresh = false) {
    var req;
    if (like_btn.src.includes("heart")) {
        req = new Request(
            "/like?" +
            new URLSearchParams({
                songID: like_btn.getAttribute("songID"),
                like: 1,
            }),
            { method: "POST" }
        );
    } else if (like_btn.src.includes("liked")) {
        req = new Request(
            "/like?" +
            new URLSearchParams({
                songID: like_btn.getAttribute("songID"),
                like: 0,
            }),
            { method: "POST" }
        );
    }
    console.log(req);

    fetch(req)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data["status"] == "success") {
                if (refresh) {
                    location.reload();
                }
                if (like_btn.src.includes("heart")) {
                    like_btn.src = "../static/assets/liked.svg";
                }
                else if (like_btn.src.includes("liked")) {
                    like_btn.src = "../static/assets/heart.svg";
                }
            } else {
                alert("Error: " + data["message"]);
            }
        });

}