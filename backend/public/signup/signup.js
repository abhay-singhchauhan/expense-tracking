const form = document.querySelector("form");
const data = document.querySelectorAll("input");
const p = document.querySelector("p");
require("dotenv").config();
form.addEventListener("submit", sendSignUpData);
async function sendSignUpData(e) {
  e.preventDefault();
  if (data[2].value.trim() === data[3].value.trim()) {
    try {
      let response = await fetch(
        `http://${process.env.SITE_HOST}:9000/signup`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: data[0].value,
            email: data[1].value,
            password: data[2].value,
          }),
        }
      );
      let jsonRes = await response.json();
      if (jsonRes.error) {
        p.innerText = "User already exists, please try to login";
        p.style.color = "red";
      } else {
        window.location = "../login/login.html";
      }
    } catch (err) {
      if (err.statusCode === 409) {
      }
    }
  } else {
    p.innerText = "Password mismatch";
    p.style.color = "red";
  }
}
