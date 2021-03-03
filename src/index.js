let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  getToys();
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function getToys() {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach((toy) => addToyToPage(toy)));
}

function addToyToPage(toy) {

  let newDiv = document.createElement("div")
  newDiv.setAttribute("class", "card");

  let newToyHeader = document.createElement("h2");
  newToyHeader.textContent = toy.name;
  newDiv.appendChild(newToyHeader);

  let newToyImg = document.createElement("img");
  newToyImg.setAttribute("src", toy.image);
  newToyImg.setAttribute("class", "toy-avatar");
  newDiv.appendChild(newToyImg);

  let newLikeCounter = document.createElement("p");
  newLikeCounter.textContent = formatLikes(toy.likes);
  newDiv.appendChild(newLikeCounter);

  let newLikeButton = document.createElement("button");
  newLikeButton.setAttribute("class", "like-btn");
  newLikeButton.textContent = "Like <3";
  newLikeButton.addEventListener("click", () => {
    increaseLikes(toy.id);
  })
  newDiv.appendChild(newLikeButton);

  newDiv.setAttribute("id", toy.id);
  document.getElementById("toy-collection").appendChild(newDiv);
}

document.getElementsByClassName("add-toy-form")[0].addEventListener("submit", e => {
  e.preventDefault();
  let inputToy = document.getElementsByClassName("input-text")[0];
  let inputImageURL = document.getElementsByClassName("input-text")[1];
  submitToy(inputToy.value, inputImageURL.value);
});

function submitToy(toy, imageURL) {

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: toy,
      image: imageURL,
      likes: 0
    })
  }).then(res => res.json())
    .then(obj => addToyToPage(obj));
}

function increaseLikes(toyID) {
  let currLikes = parseInt(document.getElementById(toyID).childNodes[2].textContent.split(" ")[0]);
  fetch(`http://localhost:3000/toys/${toyID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: currLikes + 1
    })
  }).then(res => res.json())
    .then(obj => {
      let updatedLikes = obj.likes;
      document.getElementById(toyID).childNodes[2].textContent = formatLikes(updatedLikes);
    });
}

function formatLikes(likes) {
  let likeStr = "";
  if (likes != 1) {
    likeStr = `${likes} Likes`;
  }
  else {
    likeStr = `${likes} Like`;
  }
  return likeStr;
}