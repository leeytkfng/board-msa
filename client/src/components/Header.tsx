import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.tsx";
import { useEffect, useState } from "react";
import { logout } from "../store/authSlice.tsx";
import ProfileDropdown from "./ProfileDown.tsx"; // 추가된 컴포넌트

export default function Header() {
    const user = useSelector((state: RootState) => state.auth.email); //redux 스토어에 저장된 상태값 읽기
    const exp = useSelector((state: RootState) => state.auth.exp);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        if (!exp) return;

        const updateTime = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const remainingTime = exp - currentTime;

            if (remainingTime <= 0) {
                setTimeLeft("토큰시간 만료");
            } else {
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                setTimeLeft(`${minutes}:${seconds}`);
            }
        };

        updateTime(); // 최초 실행
        const interval = setInterval(updateTime, 1000); // 1초마다 갱신

        return () => clearInterval(interval);
    }, [exp]);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            alert("로그아웃 되었습니다.");
            navigate("/main");
        } catch (err: any) {
            console.error("로그아웃 오류", err);
        }
    };

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark px-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* 왼쪽 메뉴 */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link active">Analog</Link>
                    </li>
                    {isAuthenticated && (
                        <li className="nav-item">
                            <Link to="/myBlog" className="nav-link">내 블로그</Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <span className="nav-link disabled">탐색</span>
                    </li>
                </ul>

                {/* 오른쪽 로그인 / 회원가입 / My page / 로그아웃 / 프로필 */}
                <div className="d-flex align-items-center">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="custom-hover-link">로그인</Link>
                            <Link to="/register" className="btn btn-secondary mx-2"
                                  style={{ borderRadius: "20px" }}>회원가입</Link>
                        </>
                    ) : (
                        <>
                            <span className="text-light mx-2">{timeLeft}</span>
                            <span className="text-light mx-2">{user}님 환영합니다.</span>
                            <Link to="/user" className="btn btn-success mx-2">My page</Link>
                            <span className="custom-hover-link text-white mx-2" onClick={handleLogout}
                            style={{cursor:"pointer"}}>로그아웃</span>

                            {/* 프로필 드롭다운 */}
                            <div
                                className="position-relative mx-3"
                                onMouseEnter={() => setIsProfileOpen(true)}
                                onMouseLeave={() => setIsProfileOpen(false)}
                            >
                                <span className="custom-hover-link text-white"
                                style={{cursor:"pointer"}}>프로필</span>
                                {isProfileOpen && <ProfileDropdown />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
