import { useEffect, useState } from "react";
import "./Weather.css";

export default function Weather() {

  const [weather,setWeather] = useState(null);

  useEffect(()=>{

    const fetchWeather = async () => {

      try{

        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-0.22&longitude=-78.51&current_weather=true"
        );

        const data = await res.json();

        setWeather(data.current_weather);

      }catch(err){
        console.error("weather error",err);
      }

    };

    fetchWeather();

  },[]);

  if(!weather) return <p>Cargando clima...</p>;

  return(

    <div className="weather">

      <div className="weatherTemp">
        {weather.temperature}°C
      </div>

      <div className="weatherWind">
        Viento {weather.windspeed} km/h
      </div>

    </div>

  );

}