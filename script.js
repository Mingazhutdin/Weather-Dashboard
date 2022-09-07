function getForecast(city) {
  const address = `https://api.weatherapi.com/v1/forecast.json?key=db71916baa1c46e797a154349220609&q=${city.replaceAll(
    " ",
    "%20"
  )}&days=5&aqi=no&alerts=no`;

  fetch(address)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      // city info ------->
      let cityName = document.querySelector("#forecast__city");
      // console.log(cityName);
      let locData = data.current.last_updated.split(" ");
      let locationData = locData[0].split("-");
      let dateResult =
        locationData[1] + "/" + locationData[2] + "/" + locationData[0];
      let datePlaceDate = data.location.name + " " + dateResult;
      cityName.innerText = datePlaceDate;
      // temperature ------>
      $("#forecast__temp").text(`Temp: ${data.current.temp_f} °F`);
      $("#forecast__wind").text(`Wind: ${data.current.wind_mph} MPH`);
      $("#forecast__humidity").text(`Humidity: ${data.current.humidity} %`);
      $("#forecast__UV").text(`UV: ${data.current.uv} %`);
      const uvIndex = document.querySelector("#forecast__UV");
      const uvScale = data.current.uv;
      if (uvScale <= 2) {
        document.querySelector(".uv__scale").style.backgroundColor = "green";
      } else if (uvScale >= 3 && uvScale <= 5) {
        document.querySelector(".uv__scale").style.backgroundColor = "yellow";
        console.log("less then 2");
      } else if (uvScale >= 6 && uvScale < 8) {
        document.querySelector(".uv__scale").style.backgroundColor = "orange";
      } else if (uvScale >= 8) {
        document.querySelector(".uv__scale").style.backgroundColor = "red";
        alert("Be careful UV Scale is VERY HIGH!");
      }

      $(".forecast__icon_top img").attr(
        "src",
        "https://" + data.current.condition.icon
      );
      // forecast ------->
      const allDays = data.forecast.forecastday;
      allDays.forEach((el, idx) => {
        $(`#f${idx} .forecast__date`).text(`${el.date}`);
        $(`#f${idx} .forecast__icon img`).attr(
          "src",
          "https://" + el.day.condition.icon
        );
        $(`#f${idx} .forecast__temp`).text(`Temp: ${el.day.avgtemp_f} °F`);
        $(`#f${idx} .forecast__wind`).text(`Wind: ${el.day.maxwind_mph} MPH`);
        $(`#f${idx} .forecast__hum`).text(`Humidity: ${el.day.avghumidity} %`);
      });
    })
    .catch((error) => {
      const array = JSON.parse(localStorage.getItem("city")) || [];
      const sliceValue = array.slice(1);
      localStorage.setItem("city", JSON.stringify(sliceValue));
      showCities();
      alert("Write correct city name!");
    });
}
getForecast("Buffalo grove");
// input button------->
const inpPlace = document.querySelector(".search__input");
inpPlace.addEventListener("input", (e) => {
  const inpPlace = e.target.value;
});
//  search button----->
showCities();
const searchBtn = document.querySelector(".search__button");
searchBtn.addEventListener("click", (e) => {
  console.log(inpPlace.value);
  const arr = JSON.parse(localStorage.getItem("city")) || [];
  if (inpPlace.value) {
    if (arr.includes(inpPlace.value.toLowerCase())) {
      const filterArr = arr.filter((el) => {
        if (el !== inpPlace.value.toLowerCase()) {
          return el;
        }
      });

      localStorage.setItem(
        "city",
        JSON.stringify([inpPlace.value.toLowerCase(), ...filterArr])
      );
      getForecast(inpPlace.value);
    } else if (arr.length > 7) {
      const newArr = arr.slice(0, -1);
      localStorage.setItem(
        "city",
        JSON.stringify([inpPlace.value.toLowerCase(), ...newArr])
      );
      getForecast(inpPlace.value);
    } else {
      localStorage.setItem(
        "city",
        JSON.stringify([inpPlace.value.toLowerCase(), ...arr])
      );
      getForecast(inpPlace.value);
    }
    inpPlace.value = "";
    showCities();
    city = inpPlace.value;
  }
});

function showCities() {
  let historyCities = document.createElement("div");
  let cities = JSON.parse(localStorage.getItem("city")) || [];

  const div = document.querySelector(".to__save_buttons");
  div.innerHTML = "";
  cities.forEach((el) => {
    div.children = null;
    const historyCities = document.createElement("button");
    historyCities.className = "city__button";
    historyCities.innerText = el;
    historyCities.addEventListener("click", () => {
      getForecast(el);
    });
    div.appendChild(historyCities);
  });
}
showCities();
