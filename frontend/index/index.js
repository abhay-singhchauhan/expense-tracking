const form = document.querySelector("form");
const input = document.querySelectorAll("input");
const outer = document.getElementById("outer");
const image = document.getElementById("iconImage");
const form2 = document.getElementById("form");
const cross = document.getElementById("cross");
const cover = document.getElementById("cover");
const premium = document.getElementById("Premium");
//Site functionality
image.addEventListener("click", () => {
  image.setAttribute("class", "hidden");
  form2.setAttribute("class", "");
  cover.setAttribute("class", "");
});

cross.addEventListener("click", () => {
  image.setAttribute("class", "");
  form2.setAttribute("class", "hidden");
  cover.setAttribute("class", "hidden");
});

cover.addEventListener("click", () => {
  image.setAttribute("class", "");
  form2.setAttribute("class", "hidden");
  cover.setAttribute("class", "hidden");
});

//api functionality

let token = JSON.parse(localStorage.getItem("userDataExpenseTrackerApp"));

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

premium.addEventListener("click", () => {
  fetch("http://localhost:9000/payforpremium", {
    headers: {
      Authorization: token.auth,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      const options = {
        key: res.key,
        order_id: res.order.id,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Abhays Store",
        handler: async function (response) {
          await axios.post(
            "http://localhost:9000/updatestatus",
            {
              response,
            },
            {
              headers: {
                Authorization: token.auth,
              },
            }
          );
        },
      };
      console.log(options);
      const rpObject = new Razorpay(options);

      rpObject.open();
      e.preventDefault();

      rpObject.on("payment.failed", (e) => {
        alert("failed");
      });
    })
    .catch((err) => {});
});

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
      display(res.data);
      if (res.isPremium) {
        premium.innerText = "Premium User";
      }
    })
    .catch((err) => {});
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
      fetchData();
    })
    .catch((err) => {});
});

outer.addEventListener("click", (e) => {
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
        .catch((err) => {});
    }
  }
});
