[![webapp.png](https://i.postimg.cc/PJMNwY9q/webapp.png)](https://postimg.cc/2LVzpbzp) <br>
# GEO Climate - Capstone Project
Welcome to **Geo Climate**. This is a website that its main purpose are for **showing weather forcast** in a certain area. This project reviews the **fundamental skills** needed for interacting with an API *(Application Programming Interface)*

---
## Main Features
- Showing current weather 
- Showing Today's Forecast
- Showing Weekly's Forecast
- Searching Places for weather condition

---
## Getting Started
This Steps contain all the necessary task to run the project locally

---
### Pre-requisites 
User needs to require personal API key from the following website

> Please make sure that NodeJS is installed in your system. If not, Click this <a href= "https://nodejs.org/en/download">Link</a> for **installation Guide**

- <a href = "https://openweathermap.org/guide">OpenMapWeather (free)</a> - For showing weather condition
- <a href = "https://docs.locationiq.com/docs/introduction">LocationIQ (free)</a> to interact with OpenMapWeatherAPI

---
### Setup Instruction
- use any terminal you like - `bash, powershell, etc.`
- `cd to/your/path` - locate file project 
- `git clone <Link>` - download all project files
- `code . ` - open project using VSCode
- In the terminal from VSCode, type `npm i` to install all necessary dependencies
- Make sure nodemon is installed for rendering web automatically. If not, download it globally by typing `npm i -g nodemon`
- Make sure `LOCATION_IQ_ACCESS_TOKEN=` and `OPEN_MAP_WEATHER_KEY=` in `.env.example` is Filled with valid **Credential**, then rename it to `.env`
- After everything is finished, type `nodemon index.js` to start the web App manually


> If you already installed all the dependencies by typing `npm i` and it still doesn't work, here are all the npm packages **i used** for the project

#### Dependencies List
1. `Axios` - making API Calls
2. `body-parser` - rendering body data from request
3. `dotenv` -  storing private credentials
4. `ejs` - rendering website
5. `express-rate-limit` - limiting API calls to prevent abuse calls
6. `express` - website controllers

---
### Final Words
*I hope by viewing this capstone project may help other students who want to understand implementing other API on any upcoming Projects.* 

*Warm Regards,* <br> 
*Howard - Universitas Multimedia Nusantara Informatics Student*


