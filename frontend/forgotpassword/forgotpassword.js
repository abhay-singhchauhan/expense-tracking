let form = document.querySelector("form");
let input = document.querySelector("input");
let main = document.querySelector("#main");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let res = await axios.post("http://localhost:9000/password/forgotpassword", {
    email: input.value,
  });

  console.log(res);
  if (res.data.success === true) {
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
