import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

// Limit to 1 requests per second 
const placeLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 1, // limit each IP to 1 requests per second
  message: { error: "Too many requests. Please slow down." },
});

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;
const openWeatherKey = process.env.OPEN_MAP_WEATHER_KEY;
const locationIQKey = process.env.LOCATION_IQ_ACCESS_TOKEN;

// set default location to batam
const BatamLat = 1.1030815;
const BatamLon = 104.0383696;
const locationIQURL = `https://api.locationiq.com/v1/autocomplete?key=${locationIQKey}`;
const openWeatherURLCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${BatamLat}&lon=${BatamLon}&appid=${openWeatherKey}`;
const openWeatherURLHourlyForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${BatamLat}&lon=${BatamLon}&appid=${openWeatherKey}`;


// pada halaman awal, akan menrampilkan kondisi cuaca di batam menggunakan openmapWeatherApi
app.get("/", placeLimiter, async (req, res) => {
  try {
    // current weather
    const response = await axios.get(openWeatherURLCurrentWeather);
    const humidity = response.data.main.humidity;
    const celcius = (response.data.main.temp - 273.15).toFixed(2);
    const weatherCondition = response.data.weather[0].main;
    
    // hourly weather
    const hourlyresponse = await axios.get(openWeatherURLHourlyForecast);
    // console.log(hourlyresponse.data);
    
    // today's date
    const localDate = new Date(); 
    const localYear = localDate.getFullYear();
    const localMonth = String(localDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(localDate.getDate()).padStart(2, '0');
    const formattedLocalDate = `${localYear}-${localMonth}-${localDay}`;

    // tomorrow's date
    const tomorrow_date = new Date(localDate.getTime() + 24 * 60 * 60 * 1000);
    const tomorrow_year = tomorrow_date.getFullYear();
    const tomorrow_month = String(tomorrow_date.getMonth() + 1).padStart(2, '0');
    const tomorrow_day = String(tomorrow_date.getDate()).padStart(2, '0');
    const formattedTomorrowLocalDate = `${tomorrow_year}-${tomorrow_month}-${tomorrow_day}`;

    // hourly forecast by 3
    const time_txt = [formattedLocalDate + ' 09:00:00', formattedLocalDate + ' 12:00:00', formattedLocalDate + ' 15:00:00', formattedLocalDate + ' 18:00:00', formattedLocalDate + ' 21:00:00', formattedTomorrowLocalDate + ' 00:00:00'];
    const temp_hourly = [];
    hourlyresponse.data.list.forEach((el) => {
      if (time_txt.includes(el.dt_txt)) {
        temp_hourly.push({
          date: el.dt_txt,
          temp: (el.main.temp - 273.15).toFixed(2),
          weather: el.weather[0].main
        })
      }
    });

    const day_3_date = new Date(localDate.getTime() + 48 * 60 * 60 * 1000);
    const day_3_year = day_3_date.getFullYear();
    const day_3_month = String(day_3_date.getMonth() + 1).padStart(2, '0');
    const day_3_day = String(day_3_date.getDate()).padStart(2, '0');
    const formattedDay3 = `${day_3_year}-${day_3_month}-${day_3_day}`;

    const day_4_date = new Date(localDate.getTime() + 72 * 60 * 60 * 1000);
    const day_4_year = day_4_date.getFullYear();
    const day_4_month = String(day_4_date.getMonth() + 1).padStart(2, '0');
    const day_4_day = String(day_4_date.getDate()).padStart(2, '0');
    const formattedDay4 = `${day_4_year}-${day_4_month}-${day_4_day}`;

    const day_5_date = new Date(localDate.getTime() + 96 * 60 * 60 * 1000);
    const day_5_year = day_5_date.getFullYear();
    const day_5_month = String(day_5_date.getMonth() + 1).padStart(2, '0');
    const day_5_day = String(day_5_date.getDate()).padStart(2, '0');
    const formattedDay5 = `${day_5_year}-${day_5_month}-${day_5_day}`;

    function dateToDay(date) {
      const weekofDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const newDay = new Date(date);
      const dayOfweek = weekofDays[newDay.getDay()];

      return dayOfweek;
    }

    // weekly forecast
    // today
    let day1 = formattedLocalDate + ' 12:00:00';
    let day2 = formattedTomorrowLocalDate + ' 12:00:00';
    let day3 = formattedDay3 + ' 12:00:00';
    let day4 = formattedDay4 + ' 12:00:00';
    let day5 = formattedDay5 + ' 12:00:00';
    const ThisweekForecast = [day1, day2, day3, day4, day5];
    const temp_weekly = [];
    hourlyresponse.data.list.forEach((el) => {
      if (ThisweekForecast.includes(el.dt_txt)) {
        temp_weekly.push({
          date: el.dt_txt,
          temp: (el.main.temp - 273.15).toFixed(2),
          weather: el.weather[0].main,
          hari: dateToDay(el.dt_txt.slice(0, 10))
        })
      }
      
    });
    // console.log(temp_weekly);

    res.render("Page/index.ejs", {
      place: ["Batam", '1.1030815', '104.0383696'],
      weatherInfo: [humidity, celcius, weatherCondition],
      hourlyForecast: temp_hourly,
      weeklyForecast: temp_weekly
  });

  } catch (error) {
    console.error(error.response?.data);
    res.render("Page/index.ejs", {
      place: [],
      weatherInfo: [],
      hourlyForecast: [],
      weeklyForecast: []
    
  });
  }
});


app.post("/check-weather", placeLimiter, async (req, res) => {
  const { city, latitude, longitude } = req.body;
  const URL1 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}`;
  const URL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}`;
  
  try {
    // current weather
    const response = await axios.get(URL1);
    const humidity = response.data.main.humidity;
    const celcius = (response.data.main.temp - 273.15).toFixed(2);
    const weatherCondition = response.data.weather[0].main;
    
    // hourly weather
    const hourlyresponse = await axios.get(URL2);
    
    // today's date
    const localDate = new Date(); 
    const localYear = localDate.getFullYear();
    const localMonth = String(localDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(localDate.getDate()).padStart(2, '0');
    const formattedLocalDate = `${localYear}-${localMonth}-${localDay}`;

    // tomorrow's date
    const tomorrow_date = new Date(localDate.getTime() + 24 * 60 * 60 * 1000);
    const tomorrow_year = tomorrow_date.getFullYear();
    const tomorrow_month = String(tomorrow_date.getMonth() + 1).padStart(2, '0');
    const tomorrow_day = String(tomorrow_date.getDate()).padStart(2, '0');
    const formattedTomorrowLocalDate = `${tomorrow_year}-${tomorrow_month}-${tomorrow_day}`;

    // hourly forecast by 3
    const time_txt = [formattedLocalDate + ' 09:00:00', formattedLocalDate + ' 12:00:00', formattedLocalDate + ' 15:00:00', formattedLocalDate + ' 18:00:00', formattedLocalDate + ' 21:00:00', formattedTomorrowLocalDate + ' 00:00:00'];
    const temp_hourly = [];
    hourlyresponse.data.list.forEach((el) => {
      if (time_txt.includes(el.dt_txt)) {
        temp_hourly.push({
          date: el.dt_txt,
          temp: (el.main.temp - 273.15).toFixed(2),
          weather: el.weather[0].main
        })
      }
    });

    const day_3_date = new Date(localDate.getTime() + 48 * 60 * 60 * 1000);
    const day_3_year = day_3_date.getFullYear();
    const day_3_month = String(day_3_date.getMonth() + 1).padStart(2, '0');
    const day_3_day = String(day_3_date.getDate()).padStart(2, '0');
    const formattedDay3 = `${day_3_year}-${day_3_month}-${day_3_day}`;

    const day_4_date = new Date(localDate.getTime() + 72 * 60 * 60 * 1000);
    const day_4_year = day_4_date.getFullYear();
    const day_4_month = String(day_4_date.getMonth() + 1).padStart(2, '0');
    const day_4_day = String(day_4_date.getDate()).padStart(2, '0');
    const formattedDay4 = `${day_4_year}-${day_4_month}-${day_4_day}`;

    const day_5_date = new Date(localDate.getTime() + 96 * 60 * 60 * 1000);
    const day_5_year = day_5_date.getFullYear();
    const day_5_month = String(day_5_date.getMonth() + 1).padStart(2, '0');
    const day_5_day = String(day_5_date.getDate()).padStart(2, '0');
    const formattedDay5 = `${day_5_year}-${day_5_month}-${day_5_day}`;

    function dateToDay(date) {
      const weekofDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const newDay = new Date(date);
      const dayOfweek = weekofDays[newDay.getDay()];

      return dayOfweek;
    }

    // weekly forecast
    // today
    let day1 = formattedLocalDate + ' 12:00:00';
    let day2 = formattedTomorrowLocalDate + ' 12:00:00';
    let day3 = formattedDay3 + ' 12:00:00';
    let day4 = formattedDay4 + ' 12:00:00';
    let day5 = formattedDay5 + ' 12:00:00';
    const ThisweekForecast = [day1, day2, day3, day4, day5];
    const temp_weekly = [];
    hourlyresponse.data.list.forEach((el) => {
      if (ThisweekForecast.includes(el.dt_txt)) {
        temp_weekly.push({
          date: el.dt_txt,
          temp: (el.main.temp - 273.15).toFixed(2),
          weather: el.weather[0].main,
          hari: dateToDay(el.dt_txt.slice(0, 10))
        })
      }
      
    });
    // console.log(temp_weekly);

    res.render("Page/index.ejs", {
      place: [city, latitude, longitude],
      weatherInfo: [humidity, celcius, weatherCondition],
      hourlyForecast: temp_hourly,
      weeklyForecast: temp_weekly
  });

  } catch (error) {
    console.error(error.response?.data);
    res.render("Page/index.ejs", {
      place: [],
      weatherInfo: [],
      hourlyForecast: [],
      weeklyForecast: []
    
  });
  }
  
})

// untuk fitur autocomplete pada search place
app.post("/place", placeLimiter, async (req, res) => {
  const inputValue = (req.body.inputValue || "").trim();
  console.log(inputValue);

  if (inputValue.length === 0) {
    return res.status(400).send({ error: "Input cannot be empty" });
  }
  try {
    const response = await axios.get(
      locationIQURL + `&q=${inputValue}&limit=3&dedupe=1`
    );
    res.json({
      place1: [response.data[0].display_place, response.data[0].lat, response.data[0].lon],
      place2: [response.data[1].display_place, response.data[1].lat, response.data[1].lon],
      place3: [response.data[2].display_place, response.data[2].lat, response.data[2].lon]
    });
  } catch (error) {
    console.log(error.response?.data);
    res.json({
      error: error.response?.data,
    });
  }
});


app.listen(port, () => {
  console.log(`app is running in port ${port}`);
});
