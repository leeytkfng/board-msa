import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap 스타일 적용

interface GitHubProfile {
    avatar_url : string;
    name: string;
    login: string;
    bio: string;
    html_url: string;
}

const Weather: React.FC = () => {
    const [weather, setWeather] = useState({
        temp: 0,
        temp_max: 0,
        temp_min: 0,
        humidity: 0,
        desc: "",
        icon: "",
        city: "Seoul",
    });
    const [githubData, setGithubData] = useState< GitHubProfile | null>(null);

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const cityName = "Seoul";

    useEffect(() => {
        fetch("https://api.github.com/users/leeytkfng")
            .then((res) => res.json())
            .then((data) => setGithubData(data))
            .catch((error) => console.error("깃허브 데이터 오류" + error));
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
                );
                const data = response.data;
                setWeather({
                    temp: data.main.temp,
                    temp_max: data.main.temp_max,
                    temp_min: data.main.temp_min,
                    humidity: data.main.humidity,
                    desc: data.weather[0].description,
                    icon: data.weather[0].icon,
                    city: data.name,
                });
            } catch (error) {
                console.error("날씨 정보를 가져오는 중 오류 발생", error);
            }
        };

        fetchWeather();
    }, []);

    return (
        <section className="container-fluid py-5">
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center">
                    {/* GitHub 프로필 카드 */}
                    <div className="col-md-6 d-flex justify-content-center mb-4 mb-md-0">
                        <div className="card bg-dark text-white border-0 p-4" style={{ borderRadius: "40px", maxWidth: "400px", width: "100%" }}>
                            <h4 className="text-center">GitHub Profile</h4>
                            <img src={githubData?.avatar_url} className="img-fluid rounded-circle mx-auto d-block" alt="GitHub Avatar" style={{ width: "100px" }} />
                            <h5 className="text-center mt-3">{githubData?.name}</h5>
                            <p className="text-center">@{githubData?.login}</p>
                            <p className="text-center">끈기 있는 개발자</p>
                            <p className="text-center">{githubData?.bio}</p>
                            <a href={githubData?.html_url} className="btn btn-primary w-100" target="_blank" rel="noopener noreferrer">방문</a>
                        </div>
                    </div>

                    {/* 날씨 카드 */}
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="card bg-dark text-white border-0 p-4" style={{ borderRadius: "40px", maxWidth: "400px", width: "100%" }}>
                            <h4 className="text-center">{weather.city} </h4>
                            <img src={`https://openweathermap.org/img/w/${weather.icon}.png`} alt="weather icon" className="mx-auto d-block" style={{ width: "80px" }} />
                            <p className="display-2 text-center">{weather.temp.toFixed(1)}°C</p>
                            <p className="text-center">
                                체감온도: <strong>{(weather.temp - 1).toFixed(1)}°C</strong>
                            </p>
                            <h5 className="text-center">{weather.desc}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Weather;
