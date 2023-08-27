const form = document.querySelector("form");
const input = document.querySelectorAll("input");
const outer = document.getElementById("outer");

let token = JSON.parse(localStorage.getItem("userDataExpenseTrackerApp"));
console.log(token);
if (token === null) {
  window.location = "../login/login.html";
}

function display(element) {
  let outer = document.getElementById("outer");
  let str = "";
  for (let i = element.length - 1; i >= 0; i--) {
    str += ` <div id="${element[i].id}">
    <div><h4>${element[i].createdAt}</h4></div>
    <div >
      <div><p>${element[i].price}</p></div>
      <div><p>${element[i].description}</p></div>
      <div><p>${element[i].category}</p></div>
    </div>
    <div class="delete"><p>Delete</p></div>
  </div>`;
  }

  outer.innerHTML = str;
}

function fetchData() {
  fetch("http://localhost:9000/getexpenses", {
    headers: {
      Authorization: token.auth,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      display(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

fetchData();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const obj = {
    price: input[0].value,
    category: input[2].value,
    description: input[1].value,
  };
  fetch("http://localhost:9000/addexpense", {
    method: "POST",
    headers: {
      Authorization: token.auth,
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      fetchData();
    });
});

outer.addEventListener("click", (e) => {
  console.log(e);
  if (e.target.parentElement.classList.contains("delete")) {
    const id = e.target.parentElement.parentElement.id;
    if (confirm("Are you sure, you want to delete this item")) {
      fetch(`http://localhost:9000/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token.auth,
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.message === "OK") {
            e.target.parentElement.parentElement.remove();
          } else {
            alert(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});
