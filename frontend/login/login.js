const input = document.querySelectorAll("input");
const form = document.querySelector("form");
const p = document.querySelector("p");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("http://localhost:9000/login", {
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
      console.log(res.status);
      return res.json();
    })
    .then((res) => {
      console.log(res);
      if (res.problem === "UDE") {
        p.innerText = res.message;
        p.style.color = "red";
      } else if (res.problem === "Success") {
        p.innerText = res.message;
        p.style.color = "red";
      }
    });
});
