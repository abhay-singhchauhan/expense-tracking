const table = document.querySelector("table");
const form = document.querySelector("form");
const input = document.querySelectorAll("input");
const outer = document.getElementById("outer");
const image = document.getElementById("iconImage");
const form2 = document.getElementById("form");
const cross = document.getElementById("cross");
const cover = document.getElementById("cover");
const premium = document.getElementById("Premium");
const lb_button = document.getElementById("lb-button");
const sr_button = document.getElementById("sr-button");
const sdf_button = document.getElementById("sdf-button");
const premiumContent = document.getElementById("premiumContent");
const th = document.querySelectorAll("th");
const pbutton = document.querySelectorAll(".pbutton");
console.log(pbutton);
//Site functionality

window.onload = () => {
  let token = JSON.parse(localStorage.getItem("userDataExpenseTrackerApp"));
  token = token.auth;

  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  let authtoken = JSON.parse(jsonPayload);
  console.log(authtoken);
  if (authtoken.isPremium) {
    document.getElementById("premiumInfo").innerHTML =
      "<button id='isPremium'>Premium Account</button>";
    document.getElementById("main2").setAttribute("class", "");
  } else {
    document.getElementById("main2").setAttribute("class", "hidden");
  }
};

if (localStorage.getItem("pageAtATime") === null) {
  localStorage.setItem("pageAtATime", "10");
}

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
  console.log(">>>> Inside this function hmm");
  document.querySelector("table").setAttribute("class", "");
  let thead = document.createElement("thead");
  let str = `<tr><th>Date Created</th>
<th>Ammount</th>
<th>Description</th>
<th>Category</th>
<th>Delete</th></tr>`;
  thead.innerHTML = str;
  let tbody = document.createElement("tbody");
  let str2 = "";
  for (let i = element.length - 1; i >= 0; i--) {
    str2 += ` <tr id="${element[i].id}">
    <td>${element[i].id}</td>
<td>${element[i].createdAt}</td>
<td>${element[i].price}</td>
<td>${element[i].description}</td>
<td>${element[i].category}</td>
<td class="delete">Delete</td>
</tr>`;
  }
  tbody.innerHTML = str2;
  document.querySelector("table").innerHTML = "";
  document.querySelector("table").append(thead, tbody);
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
          await axios
            .post(
              "http://localhost:9000/updatestatus",
              {
                response,
              },
              {
                headers: {
                  Authorization: token.auth,
                },
              }
            )
            .then((responseLast) => {
              console.log(responseLast);
              localStorage.setItem(
                "userDataExpenseTrackerApp",
                JSON.stringify({ auth: responseLast.data.auth })
              );
              location.reload();
            });
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

function fetchData(page) {
  console.log(page);
  page = page || 1;
  const pageAtATime = localStorage.getItem("pageAtATime");
  console.log(pageAtATime);
  fetch(`http://localhost:9000/getexpenses/${pageAtATime}?page=${page}`, {
    headers: {
      Authorization: token.auth,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      display(res.data);
      pbutton[1].innerText = res.obj.current;
      if (res.obj.hasPrevious) {
        pbutton[0].classList.remove("hidden");
        pbutton[2].innerText = +res.obj.current - 1;
      } else {
        pbutton[0].className = "hidden pbutton";
      }
      if (res.obj.hasNext) {
        pbutton[2].classList.remove("hidden");
        pbutton[2].innerText = +res.obj.current + 1;
      } else {
        pbutton[2].className = "hidden pbutton";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

fetchData();
document.querySelector("#pagination").addEventListener("click", (e) => {
  if (e.target.classList.contains("pbutton")) {
    console.log(">>> its here");
    fetchData(e.target.innerText);
  }
});

document.querySelector("#content").addEventListener("change", () => {
  console.log(document.querySelector("#content").value);
  localStorage.setItem("pageAtATime", document.querySelector("#content").value);
});
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

table.addEventListener("click", (e) => {
  console.log(e);
  if (e.target.classList.contains("delete")) {
    console.log("yes");
    const id = e.target.parentElement.id;
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
          e.target.parentElement.remove();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

lb_button.addEventListener("click", async () => {
  if (lb_button.innerText == "Show Leaderboard") {
    document.querySelector("table").setAttribute("class", "");
    const data = await fetch(`http://localhost:9000/premium/leaderboard`, {
      method: "GET",
      headers: {
        Authorization: token.auth,
        "Content-type": "application/json",
      },
    });
    const mainData = await data.json();
    console.log(mainData);
    document.querySelector("table").setAttribute("class", "");
    let thead = document.createElement("thead");
    let str = `<tr>
  <th>Rank</th>
  <th>Name</th>
  <th>Total</th>
</tr>`;
    thead.innerHTML = str;
    let tbody = document.createElement("tbody");
    let str2 = "";
    for (let i = 0; i < mainData.length; i++) {
      str2 += ` <tr>
  <td>${i + 1}</td>
  <td>${mainData[i].name}</td>
  <td>${mainData[i].total}</td>
  </tr>`;
    }
    tbody.innerHTML = str2;
    document.querySelector("table").innerHTML = "";
    document.querySelector("table").append(thead, tbody);
    lb_button.innerText = "Hide Leaderboard";
  } else {
    lb_button.innerText = "Show Leaderboard";
    fetchData();
  }
});

sr_button.addEventListener("click", async () => {
  axios
    .get("http://localhost:9000/premium/download", {
      headers: { Authorization: token.auth },
    })
    .then((res) => {
      console.log(res);
      if (res.status == 200) {
        console.log(res);
        let a = document.createElement("a");
        (a.href = res.data.fileURL), (a.download = "myexpense.csv");
        a.click();
      } else {
        alert("failed to downlode, please try again later");
      }
    });
});

sdf_button.addEventListener("click", () => {
  if (sdf_button.innerText === "Show file History") {
    console.log("yes");
    const tbody = document.querySelector("tbody");
    axios
      .get("http://localhost:9000/premium/filehistory", {
        headers: { Authorization: token.auth },
      })
      .then((res) => {
        if (res.status === 200) {
          document.querySelector("table").setAttribute("class", "");
          let thead = document.createElement("thead");
          let str = `<tr>
        <th>Create At</th>
        <th>Download Link</th>
        
      </tr>`;
          thead.innerHTML = str;
          let tbody = document.createElement("tbody");
          let str2 = "";
          for (let i = 0; i < res.data.length; i++) {
            str2 += ` <tr>
        <td>${res.data[i].createdAt}</td>
        <td><a href="${res.data[i].fileURL}">Clink here to Download</a></td>
        </tr>`;
          }
          tbody.innerHTML = str2;
          document.querySelector("table").innerHTML = "";
          document.querySelector("table").append(thead, tbody);
          sdf_button.innerText = "Hide file History";
        } else {
          alert("There is some problem, please try again latter");
        }
      });
  } else {
    fetchData();
    sdf_button.innerText = "Show file History";
  }
});
