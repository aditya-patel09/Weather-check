
let search = document.querySelector("input");
let cityName = document.querySelector(".name");
let day_change = document.querySelector(".date");
let tempValue = document.querySelector(".temp-value")
console.log(tempValue.innerHTML);
let humidityClass = document.querySelector(".humidity-value");
let windValue = document.querySelector(".wind-value");
let weatherIcon = document.querySelector(".weather");
let remove = document.querySelectorAll(".remove");
let err = document.querySelector(".error")
let search_icon = document.querySelector(".search-icon");
let weather_name = document.querySelector(".name-weather");
const slider = document.querySelector(".slider");
let tempe_slider = document.querySelectorAll(".tempe")
let slider_img = document.querySelectorAll(".box img")
let p = document.querySelectorAll(".box .day");
let box = document.querySelectorAll(".box");
let loader = document.querySelector(".loader")

console.log(remove)
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const iconMAp = {
    Haze: "Assets/atmosphere.svg",
    Smoke: "Assets/atmosphere.svg",
    Clouds: "Assets/clouds.svg",
    Clear: "Assets/clear.svg",
    Drizzle: "Assets/drizzle.svg",
    Snow: "Assets/snow.svg",
    Thunderstorm: "Assets/thunderstorm.svg",
    Rain: "Assets/rain.svg",
};

search.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        if (search.value.trim() != "") {
            ApiGet()
        }
        else {
            ShowError("Plz type the city!");
        }
    }
})
search_icon.addEventListener("click", function () {

    if (search.value.trim() != "") {
        ApiGet();
    }
    else {
        ShowError("Plz type the city!")
    }
})
function ShowError(erMsg) {
    remove.forEach((rem) => {
        rem.classList.add("display");
    });
    err.classList.remove("display")
    err.classList.add("animation")
    err.innerText = erMsg;

    console.log("wrong city")
}
async function ApiGet() {
    try {
        err.classList.remove("animation");
        err.classList.add("display");
        remove.forEach((rem) => {
            rem.classList.add("display");
        });
        loader.classList.remove("display");
        const req = await get()
        loader.classList.add("display")
        remove.forEach((rem) => {
            rem.classList.remove("display");
        });
        const dailyData = req.data.list.filter(function (item) {
            return item.dt_txt.includes("12:00:00")

        })
        const today = dailyData[0]
        console.log(dailyData)
        const weather = today.weather[0].main
        let link;
        link = iconMAp[weather] || "assets/clouds.svg";
        let temp = Math.round((today.main.temp));
        let humidity = today.main.humidity;
        let wind_speed = today.wind.speed
        let city_name = req.data.city.name
        updateAll(city_name, temp, humidity, wind_speed, link, weather);
        slider_icon(dailyData.slice(1));
        slider.classList.remove("display");
    }
    catch (error) {
        loader.classList.add("display");
        ShowError("Wrong City !")
        return;
    }

}
function updateAll(city, temp, humidity, wind_speed, link, weather) {
    const now = new Date();
    cityName.innerText = city;
    day_change.innerText = `${days[now.getDay()]},${now.getDate()} ${months[now.getMonth()]}`;
    weatherIcon.src = link
    tempValue.innerHTML = `${temp} <sup>o</sup>C`;
    humidityClass.innerText = `${humidity}%`;
    windValue.innerText = `${wind_speed} m/s`;
    weather_name.innerText = `${weather}`;
    remove.forEach((rem) => {
        rem.classList.remove("display");
    });
}
async function get() {
    let city = search.value;
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=0bad556391230f2c930462b17baa2f0a`;
    return await axios.get(url);
}
function slider_icon(d) {
    d.forEach(function (data, i) {
        tempe_slider[i].innerHTML = `${Math.round(data.main.temp)}°C`;
        let dateObj = new Date(data.dt_txt);
        p[i].innerText = `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
        slider_img[i].src = `${iconMAp[data.weather[0].main]}`
    })

}
