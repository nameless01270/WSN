// ********************* Dark mode or light mode ********************* //
const themeToggler = document.querySelector(".theme-toggler");

themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
});

// ********************* Animation Circle Value ********************* //
var tempCircle = document.querySelector("main .insights .temp svg circle ")
var humidityCircle = document.querySelector("main .insights .humidity svg circle");
var lightCircle = document.querySelector("main .insights .light svg circle");
var gasCircle = document.querySelector("main .insights .gas svg circle");

let tempValue = document.querySelector('.value__temp');
let humidityValue = document.querySelector('.value__humidity');
let lightValue = document.querySelector('.value__light');
let gasValue = document.querySelector('.value__gas');

let defaultValueTemp = document.querySelector("main .insights .temp .defaultValue__temp");
let defaultValueHumidity = document.querySelector("main .insights .humidity .defaultValue__humidity");
let defaultValueLight = document.querySelector("main .insights .light .defaultValue__light");
let defaultValueGas = document.querySelector("main .insights .gas .defaultValue__gas");

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

// ********************* Real-time chart ********************* //
setInterval(() => {
  if (tempLine.length < 1){
    const loadingTemp = document.querySelector("main .insights .temp .fa-3x");
    const loadingHumidity = document.querySelector("main .insights .humidity .fa-3x");
    const loadingLight = document.querySelector("main .insights .light .fa-3x");
    const loadingGas = document.querySelector("main .insights .gas .fa-3x");
    const loadingChart = document.querySelector("main .table .chart .fa-3x");

    loadingTemp.remove();
    loadingHumidity.remove();
    loadingLight.remove();
    loadingGas.remove();
    loadingChart.remove();
  }
// Random
  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  let temp = getRandom(1, 100);
  let humidity = getRandom(1, 100);
  let light = getRandom(1, 100);
  let gas = getRandom(1, 100);
  let ss_id = getRandom(1, 5);

// Push data into database 
  const insertData = () => {
    fetch('http://localhost:3300/insert', {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        ss_id: ss_id,
        temp: temp,
        humidity: humidity,
        light: light,
        dust: gas
      })

    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        location.reload();
      }
    });
  }

  insertData();

// Change text 
  function changeTempValue() {
    defaultValueTemp.innerHTML = temp + "°C";
  }
  changeTempValue()
  
  function changeHumidityValue() {
    defaultValueHumidity.innerHTML = humidity + "%";
  }
  changeHumidityValue()

  function changeLightValue() {
    defaultValueLight.innerHTML = light + "%";
  }
  changeLightValue()

  function changeGasValue() {
    defaultValueGas.innerHTML = gas + "%";
  }
  changeGasValue()

  var time = new Date().toLocaleString();
  
  let tempLength = tempLine.length;
  let humidityLength = humidityLine.length;
  let lightLength = lightLine.length;
  let gasLength = gasLine.length;
  let timeLength = timeLine.length;

  if (tempLength < 5 || humidityLength < 5 || humidityLength < 5 || lightLength < 5 || gasLength < 5 || timeLength < 5) {
    tempLine.push(temp);
    humidityLine.push(humidity);
    lightLine.push(light);
    gasLine.push(gas);
    timeLine.push(time);
  }
  if (tempLength == 5 || humidityLength == 5 || humidityLength == 5 || lightLength == 5 || gasLength == 5 || timeLength == 5) {
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
  const animationCircle = (value, previousStrokeDashOffset, svgStrokeDashArray, svgCircle, numberInsideCircle, previousValue) => {
    
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
    b = value

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

  }
  animationCircle(temp, previousStrokeDashOffsetTemp, svgStrokeDashArrayTemp, tempCircle, tempValue, previousValueTemp);
  previousStrokeDashOffsetTemp = a;
  previousValueTemp = b;
  animationCircle(humidity, previousStrokeDashOffsetHumidity, svgStrokeDashArrayHumidity, humidityCircle, humidityValue, previousValueHumidity);
  previousStrokeDashOffsetHumidity = a;
  previousValueHumidity = b;
  animationCircle(light, previousStrokeDashOffsetLight, svgStrokeDashArrayLight, lightCircle, lightValue, previousValueLight);
  previousStrokeDashOffsetLight = a;
  previousValueLight = b;
  animationCircle(gas, previousStrokeDashOffsetGas, svgStrokeDashArrayGas, gasCircle, gasValue, previousValueGas);
  previousStrokeDashOffsetGas = a;
  previousValueGas = b;

  // ********************* End Of Animation Circle Value ********************* //

// ********************* HighCharts ********************* //
Highcharts.chart('container2', {
  chart: {
    height: 250,
    backgroundColor: '',
    type: 'line',
  },

  title: {
    text: '',
  },

  yAxis: {
    title: {
      text: ''
    },
    labels: {
      style: {
        color: '#7d8da1',
      },
    },
  },

  xAxis: {
    categories: timeLine,
    labels: {
      style: {
        color: '#7d8da1',
      }
    },
  },

  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    itemStyle: {
      color: '#7d8da1'
    },
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
    }
  },

  series: [{
    name: 'Temperature',
    data: tempLine,
    color: '#ff7782',
  }, {
    name: 'Humidity',
    data: humidityLine,
    color: '#7380ec',
  }, {
    name: 'Light',
    data: lightLine,
    color: '#ffbb55',
  }, { 
    name: 'Gas',
    data: gasLine,
    color: '#5CC142',
  },],

  credits: {
    enabled: false
  },

  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }

});
}, 6000)