// const axios = require("axios");
let form = document.querySelector("form");
let input = document.querySelector("input");
let main = document.querySelector("#main");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(">>>>hihi");
  let res1 = await fetch("http://localhost:9000/password/forgotpassword", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: input.value,
    }),
  });
  console.log(">>>>hihi");
  let res = await res1.json();
  console.log(res);
  if (res.success === true) {
    form.style.display = "none";
    let p = document.createElement("h4");
    main.style.textAlign = "center";
    p.style.color = "green";

    p.innerText = "We have sent you an Email to change password...";
    main.appendChild(p);
  } else {
    console.log(res);

    document.querySelector("p").innerText =
      "User dosen't exist, please register yourself";
    document.querySelector("p").style.color = "red";
  }
});
