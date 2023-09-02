let form = document.querySelector("form");
let input = document.querySelector("input");

form.addEventListener("submit", async () => {
  let res = await axios.post("http://localhost:9000/password/forgotpassword", {
    email: input.value,
  });
  let res2 = await res.json();
  console.log(res2);
});
