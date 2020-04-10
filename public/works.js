function random() {
  let url = window.location.origin;
  url = url + "/random";
  window.location.assign(url);
}
function next() {
  let url = window.location.pathname;
  let [dash, path, number] = url.split("/");
  url = window.location.origin + "/next/" + number;
  window.location.assign(url);
}
function prev() {
  let url = window.location.pathname;
  let [dash, path, number] = url.split("/");
  url = window.location.origin + "/prev/" + number;
  window.location.assign(url);
}

function addHashtag() {
  let form = document.getElementById("dataField");
  let hash = document.createElement("span");
  hash.innerHTML = "<b>#</b>";
  let newElem = document.createElement("input");
  newElem.setAttribute("type", "text");
  newElem.setAttribute("class", "keywords");
  let br = document.createElement("br");
  form.appendChild(hash);
  form.appendChild(newElem);
  form.appendChild(br);
}

function show_new_add() {
  let div = document.getElementById("addnew");
  if (div.style.display != "none") {
    div.style.display = "none";
    div.childNodes[3].disabled = true;
    div.childNodes[5].disabled = true;
  } else {
    div.style.display = "block";
    div.childNodes[3].disabled = false;
    div.childNodes[5].disabled = false;
  }
}
function submit() {
  let quote = document.getElementById("quote");
  let author = document.getElementById("author");
  let hashes = document.getElementsByClassName("keywords");
  if (!quote.value) {
    alert("Cannot be empty quote");
    window.location.reload();
  } else {
    let obj = {
      quote: quote.value.trim(),
    };
    if (!author.value) {
      author.value = "Unknown";
    }
    obj.author = author.value.trim();
    let keywords = "";
    for (x of hashes) {
      let t = x.value.trim();
      keywords += " " + t;
    }
    obj.keywords = keywords;
    let data = JSON.stringify(obj);
    let url = window.location.origin + "/add";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let path = JSON.parse(this.response).url;
        let url = window.location.origin + path;
        window.location.assign(url);
      }
    };
    xhr.send(data);
  }
}
