import {useEffect, useState} from "react";
import apiClient1 from "../apiClient.tsx";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "../style/common.css"

interface AllBlogs {
    id:number;
    title: string;
    content: string;
    createdAt : string;
    category: {
        id:number;
        name:string; //02-25 추가
    }
}

const BlogAll : React.FC = () => {
    const [blogs,setBlogs] =useState<AllBlogs[]>([]);
    const [page,setPage] =useState(0); //현재 페이지 시작 0.
    const [totalPages, setTotalPages] = useState(0); //전체 페이지 개수
    const navigate = useNavigate();
    const truncateText = (text:string,maxLength:number) =>{
        return text.length > maxLength ? text.slice(0,maxLength) + "..." :text;
        ///삼항연산자로 최대 길이 보다 길면 그뒤는 축약
    }

    useEffect(() => {
         apiClient1
             .get(`my-blogs?page=${page}&size=12`, { withCredentials: true })
             .then((response) =>{
                 console.log("API 응답 데이터" , response.data);
                 setBlogs(response.data.content); //content 배열만 저장
                 setTotalPages(response.data.totalPages); //전체 페이지 개수 저장
             })
             .catch((error : string) => {
                 console.log("블로그데이터 불러오기 실패", error);
             })
    }, [page]); //페이지가 변경될때마다 요청

    return (
        <div>
            <h2 className="custom-h2">My-Blogs</h2>
        <Container className="mt-5">
            <div className="pagination" style={{marginBottom:"10px"}}>
                <Button disabled={page === 0} onClick={() => setPage(page - 1)} style={{marginRight:"5px"}}>
                    이전
                </Button>
                <span> {page + 1} / {totalPages} </span>
                <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} style={{marginLeft:"5px"}}>
                    다음
                </Button>
            </div>

            <Row>
                {blogs.map((blog) => (
                    <Col key={blog.id} md={4} className="mb-4">
                        <Card className="custom-card" onClick={() => navigate(`/blog/${blog.id}`)} style={{cursor:"pointer"}}>
                            <Card.Header>
                                {blog.category?.name || "카테고리 없음"}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{blog.title.length > 20 ? blog.title.substring(0, 20) + "..." : blog.title}
                                </Card.Title>
                                <Card.Text dangerouslySetInnerHTML={{__html:truncateText(blog.content,100)}} />
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </small>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </div>
    )
}

export default BlogAll;