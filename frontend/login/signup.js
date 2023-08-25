const form = document.querySelector("form");
const data = document.querySelectorAll("input");

form.addEventListener("submit", sendSignUpData);
async function sendSignUpData(e) {
  e.preventDefault();
  try {
    let response = await fetch("http://localhost:9000/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: data[0].value,
        email: data[1].value,
        password: data[2].value,
      }),
    });
    let jsonRes = await response.json();
    console.log(jsonRes);
  } catch (err) {
    console.log(err);
  }
}
