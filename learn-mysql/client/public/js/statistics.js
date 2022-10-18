
const themeToggler = document.querySelector(".theme-toggler");

themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
});

// ********************* Display data ********************* //
function createButton(rowElement, data) {
    const containerButton = document.createElement("div")

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

async function loadIntoTable(url, table) {
    const tableBody = table.querySelector("tbody");

    const response = await fetch(url);
    const { data } = await response.json();
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
            cellElement7.textContent = data[i].created_at;
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
            cellElement7.textContent = data[i].created_at;
            rowElement.appendChild(cellElement7);

            createButton(rowElement, data[i]);

            tableBody.appendChild(rowElement);
        }
    }
}

loadIntoTable('http://localhost:3300/get-all-data', document.querySelector("table"));

// ********************* Search data ********************* //
let search = document.querySelector(".search");

search.onclick = function () {
    document.querySelector(".search-bar").classList.toggle('active');
}

let input = document.getElementById("search");

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let tbodyElement = document.querySelector("tbody");
        tbodyElement.innerHTML = "";
        
        loadIntoTable(`http://localhost:3300/search/${input.value}`, document.querySelector("table"));
    }
});

function deleteRowById(id) {
    fetch(`http://localhost:3300/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
};

document.querySelector("table tbody").addEventListener("click", function(event) {
    event.preventDefault();
    if (event.target.className === "delete-button") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-button") {
        handleEditData(event.target.dataset.id);
    }
});

async function loadIntoAllTable(url, table) {
    const tableBody = table.querySelector("tbody");

    const response = await fetch(url);
    const { data } = await response.json();
    console.log(data);
    if (tableBody.rows.length < data.length) {
    for (let i = 10; i < data.length; i++) {
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
        cellElement7.textContent = data[i].created_at;
        rowElement.appendChild(cellElement7);

        createButton(rowElement, data[i]);

        tableBody.appendChild(rowElement);
    }
    }
}

let btnShowAll = document.querySelector(".submit");

btnShowAll.addEventListener("click", function(event) {
    event.preventDefault();
    loadIntoAllTable('http://localhost:3300/get-all-data', document.querySelector("table"));
});

let popup = document.getElementById("popup1");

function openPopup() {
    popup.classList.add("open-popup");
}

function closePopup() {
    popup.classList.remove("open-popup");
}

function handleEditData(id) {
    document.querySelector("#name-data").dataset.id = id;
    document.querySelector("#location-data").dataset.id = id;
}

function updateData() {
    const updatePlaceInput = document.querySelector("#name-data");
    const updateLocationInput = document.querySelector("#location-data");

    console.log(updatePlaceInput, updateLocationInput);
    fetch('http://localhost:3300/update', {
        method: 'PUT',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updatePlaceInput.dataset.id,
            name: updatePlaceInput.value,
            location: updateLocationInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}