import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient1 from "../apiClient.tsx";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    category?: {
        id: number;
        name: string;
    }
}

const SearchResults = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const { category: routeCategory } = useParams();

    const keyword = params.get("keyword") || "";
    const category = params.get("category") || routeCategory || "";

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        let apiUrl = '';
        if (keyword) {
            apiUrl = `/search?keyword=${keyword}&page=${page}&size=12`;
        } else if (category) {
            apiUrl = `/search?category=${category}&page=${page}&size=12`;
        }

        if (apiUrl) {
            apiClient1.get(apiUrl)
                .then(response => {
                    setBlogs(response.data.content);
                    setTotalPages(response.data.totalPages);
                })
                .catch(err => console.error(err));
        }
    }, [keyword, category, page]);

    return (
        <Container className="mt-4">
            <h2>{keyword ? `검색결과: "${keyword}"` : `카테고리: "${category}"`}</h2>

            <div className="pagination" style={{ marginBottom: "10px" }}>
                <Button disabled={page === 0} onClick={() => setPage(page - 1)}>이전</Button>
                <span className="mx-2">{page + 1} / {totalPages}</span>
                <Button disabled={page + 1 === totalPages} onClick={() => setPage(page + 1)}>다음</Button>
            </div>

            <Row>
                {blogs.map(blog => (
                    <Col key={blog.id} md={4} className="mb-4">
                        <Card className="custom-card" onClick={() => navigate(`/blog/${blog.id}`)}>
                            <Card.Header>{blog.category?.name}</Card.Header>
                            <Card.Body>
                                <Card.Title>{blog.title}</Card.Title>
                                <Card.Text dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 100) + "..." }} />
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">{new Date(blog.createdAt).toLocaleDateString()}</small>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SearchResults;
