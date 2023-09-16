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
const hoverdiv = document.getElementById("hoverdiv");
require("dotenv").config();

//Site functionality

//for checking if the user is premium user or not...
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
    document.getElementById("main2").setAttribute("class", "");
  } else {
    document.getElementById("main2").setAttribute("class", "hidden");
  }
};
//for checking if the user is premium user or not...

//setting the default item per page
if (localStorage.getItem("pageAtATime") === null) {
  localStorage.setItem("pageAtATime", "10");
}
//setting the default item per page

//write icon clicking functionality
image.addEventListener("click", () => {
  image.setAttribute("class", "hidden");
  form2.setAttribute("class", "");
  cover.setAttribute("class", "");
});
//write icon clicking functionality

//form close icon clicking functionality
cross.addEventListener("click", () => {
  image.setAttribute("class", "");
  form2.setAttribute("class", "hidden");
  cover.setAttribute("class", "hidden");
});
//form close icon clicking functionality

//overlay icon clicking functionality
cover.addEventListener("click", () => {
  image.setAttribute("class", "");
  form2.setAttribute("class", "hidden");
  cover.setAttribute("class", "hidden");
});
//overlay icon clicking functionality

//account info section mouse hover functionality
document.getElementById("accountinfo").addEventListener("mouseover", () => {
  hoverdiv.setAttribute("class", "");
});
document.getElementById("accountinfo").addEventListener("mouseout", () => {
  hoverdiv.setAttribute("class", "hidden");
});
hoverdiv.addEventListener("mouseover", () => {
  hoverdiv.setAttribute("class", "");
});
hoverdiv.addEventListener("mouseout", () => {
  hoverdiv.setAttribute("class", "hidden");
});
//account info section mouse hover functionality

//redirection to login page if the user token dosent exists
let token = JSON.parse(localStorage.getItem("userDataExpenseTrackerApp"));
if (token === null) {
  window.location = "../login/login.html";
}
//redirection to login page if the user token dosent exists

//redirecting to home when clicked on logo
document.getElementById("logoImage").addEventListener("click", () => {
  window.location.reload();
});
//redirecting to home when clicked on logo

//signout button
document.getElementById("signout").addEventListener("click", () => {
  localStorage.removeItem("userDataExpenseTrackerApp");
  location.reload();
});
//signout button

function display(element) {
  console.log(">>>> Inside this function hmm");
  // document.querySelector("table").setAttribute("class", "");
  document.querySelector("h2").innerText = "Your Expenses";
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
  
<td>${element[i].createdAt.split("T")[0]} ${
      element[i].createdAt.split("T")[1].split(".")[0]
    }</td>
<td>${element[i].price}</td>
<td>${element[i].description}</td>
<td>${element[i].category}</td>
<td class="delete" style="background-color:rgb(250, 64, 64); cursor: pointer" >Delete</td>
</tr>`;
  }
  tbody.innerHTML = str2;
  document.querySelector("table").innerHTML = "";
  document.querySelector("table").append(thead, tbody);
}

premium.addEventListener("click", () => {
  fetch(`http://plum-mysterious-pike.cyclic.cloud/payforpremium`, {
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
              `http://plum-mysterious-pike.cyclic.cloud/updatestatus`,
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
  page = page || 1;
  const pageAtATime = localStorage.getItem("pageAtATime");
  console.log(pageAtATime);
  fetch(
    `http://plum-mysterious-pike.cyclic.cloud/getexpenses/${pageAtATime}?page=${page}`,
    {
      headers: {
        Authorization: token.auth,
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      display(res.data);
      document.getElementById("pagination").style.display = "flex";
      if (!res.obj.hasNext) {
        pbutton[2].setAttribute("class", "hidden pbutton");
      } else {
        pbutton[2].classList.remove("hidden");
      }
      console.log(res.obj);
      if (!res.obj.hasPrevious) {
        pbutton[0].setAttribute("class", "hidden pbutton");
      } else {
        pbutton[0].classList.remove("hidden");
      }

      pbutton[1].innerText = +res.obj.current;
      pbutton[0].innerText = +res.obj.current - 1;
      pbutton[2].innerText = +res.obj.current + 1;
    })
    .catch((err) => {
      res.json({ message: err });
    });
}

fetchData();
document.querySelector("#pagination").addEventListener("click", (e) => {
  console.log(e.target.classList);
  if (e.target.classList.contains("pbutton")) {
    console.log(">>> its here");
    fetchData(e.target.innerText);
  }
});

document.querySelector("#content").addEventListener("change", () => {
  console.log(document.querySelector("#content").value);
  localStorage.setItem("pageAtATime", document.querySelector("#content").value);
  location.reload();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const obj = {
    price: input[0].value,
    category: input[2].value,
    description: input[1].value,
  };
  fetch(`http://plum-mysterious-pike.cyclic.cloud/addexpense`, {
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
  if (e.target.classList.contains("delete")) {
    const id = e.target.parentElement.id;
    if (confirm("Are you sure, you want to delete this item")) {
      fetch(`http://plum-mysterious-pike.cyclic.cloud/delete/${id}`, {
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
    const data = await fetch(
      `http://plum-mysterious-pike.cyclic.cloud/premium/leaderboard`,
      {
        method: "GET",
        headers: {
          Authorization: token.auth,
          "Content-type": "application/json",
        },
      }
    );
    const mainData = await data.json();
    console.log(mainData);
    document.getElementById("pagination").style.display = "none";
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
    .get(`http://plum-mysterious-pike.cyclic.cloud/premium/download`, {
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
      .get(`http://plum-mysterious-pike.cyclic.cloud/premium/filehistory`, {
        headers: { Authorization: token.auth },
      })
      .then((res) => {
        if (res.status === 200) {
          document.getElementById("pagination").style.display = "none";
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
