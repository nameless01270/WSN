// ********************* Connect socket.io ********************* //
var socket = io();

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

// ********************* Animation Circle Value ********************* //
var tempCircle = document.querySelector("main .insights .temp svg circle ");
var humidityCircle = document.querySelector(
  "main .insights .humidity svg circle"
);
var lightCircle = document.querySelector("main .insights .light svg circle");
var gasCircle = document.querySelector("main .insights .gas svg circle");

let tempValue = document.querySelector(".value__temp");
let humidityValue = document.querySelector(".value__humidity");
let lightValue = document.querySelector(".value__light");
let gasValue = document.querySelector(".value__gas");

let defaultValueTemp = document.querySelector(
  "main .insights .temp .defaultValue__temp"
);
let defaultValueHumidity = document.querySelector(
  "main .insights .humidity .defaultValue__humidity"
);
let defaultValueLight = document.querySelector(
  "main .insights .light .defaultValue__light"
);
let defaultValueGas = document.querySelector(
  "main .insights .gas .defaultValue__gas"
);

// Data Hightcharts
const tempLine = [];
const humidityLine = [];
const lightLine = [];
const gasLine = [];
const timeLine = [];

// Stroke value
var svgStrokeDashArrayTemp = parseInt(
  window
    .getComputedStyle(tempCircle)
    .getPropertyValue("stroke-dasharray")
    .replace("px", "")
);

var svgStrokeDashArrayHumidity = parseInt(
  window
    .getComputedStyle(humidityCircle)
    .getPropertyValue("stroke-dasharray")
    .replace("px", "")
);

var svgStrokeDashArrayLight = parseInt(
  window
    .getComputedStyle(lightCircle)
    .getPropertyValue("stroke-dasharray")
    .replace("px", "")
);

var svgStrokeDashArrayGas = parseInt(
  window
    .getComputedStyle(gasCircle)
    .getPropertyValue("stroke-dasharray")
    .replace("px", "")
);

var maxValue = 100;

var previousStrokeDashOffsetTemp = svgStrokeDashArrayTemp;
var previousStrokeDashOffsetHumidity = svgStrokeDashArrayHumidity;
var previousStrokeDashOffsetLight = svgStrokeDashArrayLight;
var previousStrokeDashOffsetGas = svgStrokeDashArrayGas;

var previousValueTemp = 0;
var previousValueHumidity = 0;
var previousValueLight = 0;
var previousValueGas = 0;

var animationDuration = 3000;

function renderDataUpdated(data) {
  let temp = data.temp;
  let humidity = data.humidity;
  let light = data.light;
  let gas = data.dust;

  // Change text
  function changeTempValue() {
    defaultValueTemp.innerHTML = temp + "°C";
  }
  changeTempValue();

  function changeHumidityValue() {
    defaultValueHumidity.innerHTML = humidity + "%";
  }
  changeHumidityValue();

  function changeLightValue() {
    defaultValueLight.innerHTML = light + "%";
  }
  changeLightValue();

  function changeGasValue() {
    defaultValueGas.innerHTML = gas + "%";
  }
  changeGasValue();

  var timeTest = data.created_at;
  var timeStamp = new Date(timeTest).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  var time = timeStamp.replace(", ", " - ");

  let tempLength = tempLine.length;
  let humidityLength = humidityLine.length;
  let lightLength = lightLine.length;
  let gasLength = gasLine.length;
  let timeLength = timeLine.length;

  if (
    tempLength < 5 ||
    humidityLength < 5 ||
    humidityLength < 5 ||
    lightLength < 5 ||
    gasLength < 5 ||
    timeLength < 5
  ) {
    tempLine.push(temp);
    humidityLine.push(humidity);
    lightLine.push(light);
    gasLine.push(gas);
    timeLine.push(time);
  }
  if (
    tempLength == 5 ||
    humidityLength == 5 ||
    humidityLength == 5 ||
    lightLength == 5 ||
    gasLength == 5 ||
    timeLength == 5
  ) {
    tempLine.shift();
    humidityLine.shift();
    lightLine.shift();
    gasLine.shift();
    timeLine.shift();
    tempLine.push(temp);
    humidityLine.push(humidity);
    lightLine.push(light);
    gasLine.push(gas);
    timeLine.push(time);
  }
  // ********************* Animation Circle ********************* //
  var a;
  var b;
  const animationCircle = (
    value,
    previousStrokeDashOffset,
    svgStrokeDashArray,
    svgCircle,
    numberInsideCircle,
    previousValue
  ) => {
    var offsetValue = Math.floor(
      ((maxValue - value) * svgStrokeDashArray) / maxValue
    );

    svgCircle.animate(
      [
        {
          strokeDashoffset: previousStrokeDashOffset,
        },
        {
          strokeDashoffset: offsetValue,
        },
      ],
      {
        duration: animationDuration,
      }
    );

    svgCircle.style.strokeDashoffset = offsetValue;
    a = offsetValue;
    b = value;

    if (value != previousValue) {
      var speed;
      if (value > previousValue) {
        speed = animationDuration / (value - previousValue);
      } else {
        speed = animationDuration / (previousValue - value);
      }
      var counter = previousValue;

      var intervalId = setInterval(() => {
        if (counter == value || counter == -1) {
          clearInterval(intervalId);
        } else {
          if (value > previousValue) {
            counter += 1;
          } else {
            counter -= 1;
          }

          numberInsideCircle.innerHTML = counter + "%";
        }
      }, speed);
    }
  };
  animationCircle(
    temp,
    previousStrokeDashOffsetTemp,
    svgStrokeDashArrayTemp,
    tempCircle,
    tempValue,
    previousValueTemp
  );
  previousStrokeDashOffsetTemp = a;
  previousValueTemp = b;
  animationCircle(
    humidity,
    previousStrokeDashOffsetHumidity,
    svgStrokeDashArrayHumidity,
    humidityCircle,
    humidityValue,
    previousValueHumidity
  );
  previousStrokeDashOffsetHumidity = a;
  previousValueHumidity = b;
  animationCircle(
    light,
    previousStrokeDashOffsetLight,
    svgStrokeDashArrayLight,
    lightCircle,
    lightValue,
    previousValueLight
  );
  previousStrokeDashOffsetLight = a;
  previousValueLight = b;
  animationCircle(
    gas,
    previousStrokeDashOffsetGas,
    svgStrokeDashArrayGas,
    gasCircle,
    gasValue,
    previousValueGas
  );
  previousStrokeDashOffsetGas = a;
  previousValueGas = b;

  // ********************* End Of Animation Circle Value ********************* //

  // ********************* Text muted ********************* //
  let tempLastTimeDisplay = document.querySelector(
    ".insights .temp .text-muted"
  );
  let humidityLastTimeDisplay = document.querySelector(
    ".insights .humidity .text-muted"
  );
  let lightLastTimeDisplay = document.querySelector(
    ".insights .light .text-muted"
  );
  let gasLastTimeDisplay = document.querySelector(".insights .gas .text-muted");

  function updateTime(time) {
    var dateString = new Date(time).toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });
    var formattedString = dateString.replace(", ", " - ");
    tempLastTimeDisplay.innerHTML = `Update at: ${formattedString}`;
    humidityLastTimeDisplay.innerHTML = `Update at: ${formattedString}`;
    lightLastTimeDisplay.innerHTML = `Update at: ${formattedString}`;
    gasLastTimeDisplay.innerHTML = `Update at: ${formattedString}`;
  }

  updateTime(timeTest);
  // ********************* End of text muted ********************* //

  // ********************* HighCharts ********************* //
  Highcharts.chart("container2", {
    chart: {
      height: 250,
      backgroundColor: "",
      type: "line",
    },

    title: {
      text: "",
    },

    yAxis: {
      title: {
        text: "",
      },
      labels: {
        style: {
          color: "#7d8da1",
        },
      },
    },

    xAxis: {
      categories: timeLine,
      labels: {
        style: {
          color: "#7d8da1",
        },
      },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: {
        color: "#7d8da1",
      },
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },

    series: [
      {
        name: "Temperature",
        data: tempLine,
        color: "#ff7782",
      },
      {
        name: "Humidity",
        data: humidityLine,
        color: "#7380ec",
      },
      {
        name: "Light",
        data: lightLine,
        color: "#ffbb55",
      },
      {
        name: "Gas",
        data: gasLine,
        color: "#5CC142",
      },
    ],

    credits: {
      enabled: false,
    },

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  });
}

// ********************* Early ********************* //
const renderDataEarly = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  renderDataUpdated(data.data[0]);
};

renderDataEarly("http://localhost:3000/get-last-data");

// ********************* Real-time ********************* //
socket.on("send-update-data-sensors", function (data) {
  if (data) {
    renderDataUpdated(data);
  }
});
// date time
var timeDisplay = document.getElementById("date-time");

function refreshDateTime() {
  var dateTimeString = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  var formatString = dateTimeString.replace(", ", " - ");
  timeDisplay.innerHTML = formatString;
}

setInterval(refreshDateTime, 1000);

// ********************* Popup on&off led ********************* //
let popup = document.getElementById("popup1");
let buttonLed1 = document.querySelector("main .table .led .led1 .button");
let checkBox1 = document.querySelector("main .table .led .led1 .button #led-1");
let questionPopup = document.querySelector(".overlay .middle-popup h2");
let btnYes = document.querySelector(".overlay .bottom-popup #btn-yes");

let buttonLed2 = document.querySelector("main .table .led .led2 .button");
let checkBox2 = document.querySelector("main .table .led .led2 .button #led-2");
let checkLed;

function openPopup(checkBox, number) {
  popup.classList.add("open-popup");
  document.querySelector(".container").classList.add("blur");
  if (checkBox.checked == true) {
    questionPopup.innerHTML = `Do you want to turn on led ${number}?`;
  } else {
    questionPopup.innerHTML = `Do you want to turn off led ${number}?`;
  }
}

function closePopup() {
  popup.classList.remove("open-popup");
  document.querySelector(".container").classList.remove("blur");
}

function confirmLed() {
  popup.classList.remove("open-popup");
  document.querySelector(".container").classList.remove("blur");
  if (checkBox1.checked == true && checkLed == 0) {
    socket.emit("Led1", "off");
    checkBox1.checked = false;
  } else if (checkBox1.checked == false && checkLed == 0) {
    socket.emit("Led1", "on");
    checkBox1.checked = true;
  } else if (checkBox2.checked == true && checkLed == 1) {
    socket.emit("Led2", "off");
    checkBox2.checked = false;
  } else if (checkBox2.checked == false && checkLed == 1) {
    socket.emit("Led2", "on");
    checkBox2.checked = true;
  }
}

buttonLed1.addEventListener("click", function (event) {
  event.preventDefault();
  openPopup(checkBox1, 1);
  checkLed = 0;
});

buttonLed2.addEventListener("click", function (event) {
  event.preventDefault();
  openPopup(checkBox2, 2);
  checkLed = 1;
});
