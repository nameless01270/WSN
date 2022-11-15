// ********************* dark mode ********************* //
const themeToggler = document.querySelector(".theme-toggler");

const container = document.body;
if (localStorage.getItem("data-theme")) {
  container.setAttribute("data-theme", localStorage.getItem("data-theme"));
  console.log(localStorage.getItem("data-theme"));
  if (localStorage.getItem("data-theme") === "dark") {
    document.body.classList.toggle("dark-theme-variables");
    themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
    themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
  }
  toggleDark(0);
}

function toggleDark(r) {
  const dataTheme = localStorage.getItem("data-theme");
  let theme_switch;
  if (dataTheme === "light") {
    theme_switch = 1;
  } else {
    theme_switch = 0;
  }
  if (r) {
    console.log(theme_switch);
    theme_switch = !theme_switch;
    console.log(theme_switch);
  }
  if (theme_switch) {
    localStorage.setItem("data-theme", "light");
    console.log("light");
  } else {
    localStorage.setItem("data-theme", "dark");
    console.log("dark");
  }
}

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
  toggleDark(1);
});
// ********************* Format date ********************* //
function formatDate(date) {
  const timeStamp = new Date(date).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  const time = timeStamp.replace(", ", " - ");
  return time;
}

// ********************* Display data ********************* //
let checkBtnShow = 0;
function createButton(rowElement, data) {
  const containerButton = document.createElement("div");

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.innerHTML = "Edit";
  editButton.setAttribute("data-id", data.ss_id);
  editButton.setAttribute("onclick", "openPopup()");
  containerButton.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("data-id", data.id);
  containerButton.appendChild(deleteButton);
  containerButton.classList.add("flex-row");

  rowElement.appendChild(containerButton);
}
let checkData;
async function loadIntoTable(url, table) {
  const tableBody = table.querySelector("tbody");

  const response = await fetch(url);
  const { data } = await response.json();
  checkData = data;
  if (data.length > 10) {
    for (let i = 0; i < 10; i++) {
      const rowElement = document.createElement("tr");

      const cellElement1 = document.createElement("td");
      cellElement1.textContent = data[i].name;
      rowElement.appendChild(cellElement1);

      const cellElement2 = document.createElement("td");
      cellElement2.textContent = data[i].temp;
      rowElement.appendChild(cellElement2);

      const cellElement3 = document.createElement("td");
      cellElement3.textContent = data[i].humidity;
      rowElement.appendChild(cellElement3);

      const cellElement4 = document.createElement("td");
      cellElement4.textContent = data[i].light;
      rowElement.appendChild(cellElement4);

      const cellElement5 = document.createElement("td");
      cellElement5.textContent = data[i].dust;
      rowElement.appendChild(cellElement5);

      const cellElement6 = document.createElement("td");
      cellElement6.textContent = data[i].location;
      rowElement.appendChild(cellElement6);

      const cellElement7 = document.createElement("td");
      cellElement7.textContent = formatDate(data[i].created_at);
      rowElement.appendChild(cellElement7);

      createButton(rowElement, data[i]);

      tableBody.appendChild(rowElement);
    }
  } else if (data.length < 10) {
    for (let i = 0; i < data.length; i++) {
      const rowElement = document.createElement("tr");

      const cellElement1 = document.createElement("td");
      cellElement1.textContent = data[i].name;
      rowElement.appendChild(cellElement1);

      const cellElement2 = document.createElement("td");
      cellElement2.textContent = data[i].temp;
      rowElement.appendChild(cellElement2);

      const cellElement3 = document.createElement("td");
      cellElement3.textContent = data[i].humidity;
      rowElement.appendChild(cellElement3);

      const cellElement4 = document.createElement("td");
      cellElement4.textContent = data[i].light;
      rowElement.appendChild(cellElement4);

      const cellElement5 = document.createElement("td");
      cellElement5.textContent = data[i].dust;
      rowElement.appendChild(cellElement5);

      const cellElement6 = document.createElement("td");
      cellElement6.textContent = data[i].location;
      rowElement.appendChild(cellElement6);

      const cellElement7 = document.createElement("td");
      cellElement7.textContent = formatDate(data[i].created_at);
      rowElement.appendChild(cellElement7);

      createButton(rowElement, data[i]);

      tableBody.appendChild(rowElement);
    }
  }
}

loadIntoTable(
  "http://localhost:3000/get-all-data",
  document.querySelector("table")
);

// ********************* Search data ********************* //
let search = document.querySelector(".search");

search.onclick = function () {
  document.querySelector(".search-bar").classList.toggle("active");
};

let input = document.getElementById("search");

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let tbodyElement = document.querySelector("tbody");
    tbodyElement.innerHTML = "";

    loadIntoTable(
      `http://localhost:3000/search/${input.value}`,
      document.querySelector("table")
    );
    checkBtnShow = 1;
  }
});

// ********************* Delete and update data ********************* //
function deleteRowById(id) {
  fetch(`http://localhost:3000/delete/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "delete-button") {
      event.preventDefault();
      deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-button") {
      event.preventDefault();
      handleEditData(event.target.dataset.id);
    }
  });

let popup = document.getElementById("popup1");

function openPopup() {
  popup.classList.add("open-popup");
  document.querySelector(".container").classList.add("blur");
}

function closePopup() {
  popup.classList.remove("open-popup");
  document.querySelector(".container").classList.remove("blur");
}

function handleEditData(id) {
  document.querySelector("#name-data").dataset.id = id;
  document.querySelector("#location-data").dataset.id = id;
}

function updateData() {
  const updatePlaceInput = document.querySelector("#name-data");
  const updateLocationInput = document.querySelector("#location-data");

  console.log(updatePlaceInput, updateLocationInput);
  fetch("http://localhost:3000/update", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: updatePlaceInput.dataset.id,
      name: updatePlaceInput.value,
      location: updateLocationInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

// ********************* Button show all ********************* //
async function loadIntoAllTable(table) {
  const tableBody = table.querySelector("tbody");
  
  if (tableBody.rows.length < checkData.length) {
    for (let i = 10; i < checkData.length; i++) {
      const rowElement = document.createElement("tr");

      const cellElement1 = document.createElement("td");
      cellElement1.textContent = checkData[i].name;
      rowElement.appendChild(cellElement1);

      const cellElement2 = document.createElement("td");
      cellElement2.textContent = checkData[i].temp;
      rowElement.appendChild(cellElement2);

      const cellElement3 = document.createElement("td");
      cellElement3.textContent = checkData[i].humidity;
      rowElement.appendChild(cellElement3);

      const cellElement4 = document.createElement("td");
      cellElement4.textContent = checkData[i].light;
      rowElement.appendChild(cellElement4);

      const cellElement5 = document.createElement("td");
      cellElement5.textContent = checkData[i].dust;
      rowElement.appendChild(cellElement5);

      const cellElement6 = document.createElement("td");
      cellElement6.textContent = checkData[i].location;
      rowElement.appendChild(cellElement6);

      const cellElement7 = document.createElement("td");
      cellElement7.textContent = formatDate(checkData[i].created_at);
      rowElement.appendChild(cellElement7);

      createButton(rowElement, checkData[i]);

      tableBody.appendChild(rowElement);
    }
  } else if (tableBody.rows.length === checkData.length) {
    for (let i = 10; i < checkData.length; i++) {
      tableBody.rows[tableBody.rows.length - 1].remove();
    }
  }
}

let btnShowAll = document.querySelector(".submit");

btnShowAll.addEventListener("click", function (event) {
  if (checkBtnShow === 0) {
    event.preventDefault();
    loadIntoAllTable(
      document.querySelector("table")
    );
  } else if (checkBtnShow === 1) {
    event.preventDefault();
    loadIntoAllTable(
      document.querySelector("table")
    );
  }
});
