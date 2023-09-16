const input = document.querySelectorAll("input");
const form = document.querySelector("form");
const p = document.querySelector("p");
require("dotenv").config();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`http://${process.env.SITE_HOST}:9000/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: input[0].value,
      password: input[1].value,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.problem === "UDE") {
        p.innerText = res.message;
        p.style.color = "red";
      } else if (res.problem === "Success") {
        localStorage.setItem(
          "userDataExpenseTrackerApp",
          JSON.stringify({ auth: res.auth })
        );
        window.location = "../index/index.html";
      }
    });
});
