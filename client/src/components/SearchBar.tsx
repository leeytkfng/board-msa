import { useState } from "react";
import Input from "./UI/Input.tsx";
import { Button } from "react-bootstrap";
import { Search } from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if(query.trim()){
            navigate(`/search?keyword=${query}`);
        }
    };

    return (
        <div
            className="search-bar-container"
            style={{
                position: "relative",   // 고정되지 않게, 화면 스크롤을 내릴 때 따라가지 않음
                top: "-45px",            // 상단에서 60px 떨어져서 시작
                left: "0",              // 왼쪽에 붙게 설정
                width: "100%",          // 전체 화면 너비
                display: "flex",        // 플렉스 박스 적용
                alignItems: "center",   // 세로 중앙 정렬
                padding: "10px",        // 패딩 추가
                backgroundColor: "white", // 배경색
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 그림자 효과
                zIndex: 1000,           // 다른 요소들보다 위에 배치
            }}
        >
            <Search className="search-icon" style={{ marginRight: "8px" }} />
            <Input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="search-input"
                style={{
                    flex: 1,            // 입력 필드가 남은 공간을 차지하도록 설정
                    border: "none",     // 테두리 없음
                    outline: "none",    // 테두리 강조 없음
                    padding: "8px",     // 패딩 추가
                    fontSize: "16px"    // 글자 크기
                }}
            />
            <Button
                onClick={handleSearch}
                className="search-button"
                style={{
                    marginLeft: "8px", // 입력 필드와 버튼 사이에 여백 추가
                    padding: "8px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background 0.3s ease"
                }}
            >
                검색
            </Button>
        </div>
    );
}
