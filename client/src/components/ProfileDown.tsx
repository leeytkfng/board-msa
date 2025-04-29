import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileDropdown: React.FC = () => {
    const [weather, setWeather] = useState({
        temp: 0,
        temp_max: 0,
        temp_min: 0,
        humidity: 0,
        desc: "",
        icon: "",
        city: "Seoul",
    });
    const [githubData, setGithubData] = useState<any>(null);
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const cityName = "Seoul";

    useEffect(() => {
        fetch("https://api.github.com/users/leeytkfng")
            .then((res) => res.json())
            .then((data) => setGithubData(data))
            .catch((error) => console.error("깃허브 데이터 오류", error));
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
        <div
            className="dropdown-menu show position-absolute bg-dark text-white p-3 rounded shadow"
            style={{
                right: 0,
                top: "100%",
                minWidth: "250px",
                zIndex: 9999,  // z-index를 9999로 크게 설정해서 다른 요소들보다 우선순위 높이기
            }}
        >
            <div className="text-center mb-3">
                <h5>GitHub Profile</h5>
                <img
                    src={githubData?.avatar_url}
                    className="img-fluid rounded-circle mx-auto"
                    alt="GitHub Avatar"
                    style={{ width: "80px" }}
                />
                <p className="mb-1" >{githubData?.name}</p>
                <p className="text-white">@{githubData?.login}</p>
                <a
                    href={githubData?.html_url}
                    className="btn btn-primary btn-sm w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    방문
                </a>
            </div>

            <div className="text-center mb-3">
                <h5>GitHub Profile</h5>
                <img
                    src="https://github.com/jeongraewon.png"
                    className="img-fluid rounded-circle mx-auto"
                    alt="Jeongraewon Avatar"
                    style={{ width: "80px" }}
                />
                <p className="text-white">@jeongraewon</p>
                <a
                    href="https://github.com/jeongraewon"
                    className="btn btn-primary btn-sm w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    방문
                </a>
            </div>

            {/* 날씨 정보 */}
            <div className="text-center">
                <h5>{weather.city} 날씨</h5>
                <img
                    src={`https://openweathermap.org/img/w/${weather.icon}.png`}
                    alt="weather icon"
                    className="mx-auto d-block"
                    style={{ width: "50px" }}
                />
                <p className="mb-0">{weather.temp.toFixed(1)}°C</p>
                <small className="text-muted">{weather.desc}</small>
            </div>
        </div>
    );
};

export default ProfileDropdown;
