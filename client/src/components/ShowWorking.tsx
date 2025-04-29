import {Card, Col, Container, Row} from "react-bootstrap";


const ShowWorking = () =>{

    return (
        <Container className="border p-4 mt-4 text-center">
            {/* 큰제목칸 */}
            <h1 className="mb-3">블로그 소개</h1>
            {/*작은 소제목 칸*/}
            <h3 className="mb-4 text-muted">다양함 속에 개발자들의 마음을 Build 합니다.</h3>
            {/**/}
            <Row className="g-4">
                <Col md = {4}>
                    <Col className="p-3 shadow-sm">
                        <Card.Body>
                           <Card.Title>자기 개발</Card.Title>
                            <Card.Img variant="top" className="custom-card-img" src="images/show3.png"></Card.Img>
                           <Card.Text>다양한 정보를 탐색하여 develop 하세요.</Card.Text>
                        </Card.Body>
                    </Col>
                </Col>
                <Col md = {4}>
                    <Col className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>나의 다이어리</Card.Title>
                            <Card.Img src="/images/show2.png" className="custom-card-img"></Card.Img>
                            <Card.Text>당신의 멋진 기록하는 일상</Card.Text>
                        </Card.Body>
                    </Col>
                </Col>
                <Col md = {4}>
                    <Col className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>커뮤니케이션</Card.Title>
                            <Card.Img src="/images/show1.png" className="custom-card-img"></Card.Img>
                            <Card.Text>많은 사람들과 정보를 나눠보세요.</Card.Text>
                        </Card.Body>
                    </Col>
                </Col>
            </Row>
        </Container>
    )
}

export default ShowWorking;