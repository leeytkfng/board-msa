import {Card, Col, Container, Row} from "react-bootstrap";
import {useState} from "react";
import ApiClient from "../apiClient.tsx";
const Restore = () => {
    const [email,setEmail] = useState("");
    const [selectedTab, setSelectedTab] = useState("id");

    const undoEmail = async () =>{
        try{
            await ApiClient.put(`/user/restore/${email}`);
            alert("이메일 복구 요청이 완료되었습니다.");
        } catch (err: any) {
            console.log("에러발생" + err);
        }
    }

    return (
        <Container className="border p-4 mt-4 text-center">
            {/* 큰제목칸 */}
            <h1 className="mb-3">계정 복구 페이지</h1>
            {/**/}
            <Row className="g-4">
                <Col md = {4}>
                    <Col className={`p-3 shadow-sm custom-card1 ${selectedTab === "id" ? "selected": ""}`}
                     onClick={() => setSelectedTab("id")}
                         style={{cursor:"pointer"}}// 클릭가능.
                    >
                        <Card.Body>
                            <Card.Title>아이디 찾기</Card.Title>
                            <Card.Img variant="top" className="custom-card-img" src="images/ex1.png"></Card.Img>
                        </Card.Body>
                    </Col>
                </Col>
                <Col md = {4}>
                    <Col className={`p-3 shadow-sm custom-card1 ${selectedTab === "pw" ? "selected": ""}`}
                         onClick={() => setSelectedTab("pw")}
                         style={{cursor:"pointer"}}
                    >
                        <Card.Body>
                            <Card.Title>비밀번호 찾기</Card.Title>
                            <Card.Img src="/images/ex2.png" className="custom-card-img"></Card.Img>
                        </Card.Body>
                    </Col>
                </Col>
                <Col md = {4}>
                    <Col className={`p-3 shadow-sm custom-card1 ${selectedTab === "email" ? "selected": ""}`}
                         onClick={() => setSelectedTab("email")}
                         style={{cursor:"pointer"}}
                    >
                        <Card.Body>
                            <Card.Title>이메일 복구</Card.Title>
                            <Card.Img src="/images/ex3.png" className="custom-card-img" ></Card.Img>
                        </Card.Body>
                    </Col>
                </Col>
            </Row>
            <div className="mt-4 p-4 border rounded">
                {selectedTab === "id" && (
                    <div>
                        <h3>아이디 찾기</h3>
                        <p>아이디를 찾으려면 가입한 이메일을 입력하세요.</p>
                        <input type="email" placeholder="가입한 이메일을 입력하세요." />
                        <button className="btn btn-primary mt-3">찾기</button>
                    </div>
                )}
                {selectedTab === "pw" && (
                    <div>
                        <h3>비밀번호 찾기</h3>
                        <p>아이디를 찾으려면 가입한 이메일을 입력하세요.</p>
                        <input type="email" placeholder="가입한 이메일을 입력하세요." />
                        <button className="btn btn-primary mt-3">찾기</button>
                    </div>
                )}
                {selectedTab === "email" && (
                    <div>
                        <h3>이메일 복구</h3>
                        <p>복구하시려는 이메일을 입력하세요</p>
                        <input type="email" placeholder="이메일을 입력하세요." onChange={(e) => setEmail(e.target.value)} />
                        <button className="btn btn-primary mt-3" onClick={undoEmail}>찾기</button>
                    </div>

                )}
            </div>
        </Container>
    );
}

export default Restore;