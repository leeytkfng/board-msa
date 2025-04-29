import {Card, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


export const categories = [
    {title:"음식" ,image:"/images/food.png"},
    {title:"여행" ,image:"/images/trip.png"},
    {title:"인테리어" ,image:"/images/interior.png"},
    {title:"건강" ,image:"/images/health.png"},
    {title:"문화생활" ,image:"/images/read.png"},
    {title:"자기개발" ,image:"/images/self.png"},
    {title:"IT" ,image:"/images/IT.png"},
    {title:"일상" ,image:"/images/day.png"},
]
const Categoty = () =>{
    const navigate = useNavigate();



    return (
        <Container className="border category-container">
            <h1 className="text-center mb-4" style={{marginTop:"7px"}}>주제 탐색</h1>
            <Row className="custom-row">
                {categories.map((category, index) => (
                    <Col key={index} lg={Math.floor(12/categories.length)}  className="p-1">
                        <Card className="custom-card1 text-center" style={{height:'130px',width:'110px'}}
                        onClick={() => navigate(`search?category=${category.title}`)}>
                            <Card.Img variant="top" className="custom-card-img1" src={category.image}
                            style={{marginTop:"5px"}}/>
                            <Card.Body>
                                <Card.Title>{category.title}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>

    )
}

export default Categoty;