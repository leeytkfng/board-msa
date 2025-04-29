import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function MainMa() {
    useEffect(() => {
        document.body.style.overflowX = "hidden"; // 수평 스크롤 제거
    }, []);

    return (
        <div style={{
            width: "100vw",
            height: "auto",
            marginBottom: "20px",
            overflow: "hidden",
            padding: "0",
            margin: "0",
            position: "relative",
            top: "-45px"
        }}>
            {/* Carousel */}
            <Carousel style={{ width: "100vw", margin: "0", padding: "0" }}>
                <Carousel.Item>
                    <img
                        src="./images/pic4.jpg"
                        alt="Carousel 1"
                        style={{ width: "100vw", height: "400px", objectFit: "cover", margin: "0", padding: "0" }}
                    />
                    <Carousel.Caption style={{ bottom: "10px" }}>
                        <h3>블로그의 혁신</h3>
                        <p>다양한 정보를 탐색하여 자기개발을 이루세요.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src="./images/pic02.jpg"
                        alt="Carousel 2"
                        style={{ width: "100vw", height: "400px", objectFit: "cover", margin: "0", padding: "0" }}
                    />
                    <Carousel.Caption style={{ bottom: "10px" }}>
                        <h3>일기장같은 편안함</h3>
                        <p>사소한 일상이라도 이웃과 나누어보세요</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src="./images/pic03.jpg"
                        alt="Carousel 3"
                        style={{ width: "100vw", height: "400px", objectFit: "cover", margin: "0", padding: "0" }}
                    />
                    <Carousel.Caption style={{ bottom: "10px" }}>
                        <h3>블로그 탐색</h3>
                        <p>유용한 정보는 네이버후드의 글을 찾아보세요.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <div className="mt-3 text-center">
                <Link to="/edit" className="btn btn-primary px-4 py-2"
                      style={{ borderRadius: "10px" }}>블로그 작성</Link>
            </div>
        </div>
    );
}
