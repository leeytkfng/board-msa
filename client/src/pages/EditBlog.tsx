import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import apiClient from "../apiClient.tsx";
import {Button, Container, Form} from "react-bootstrap";


const EditBlog = () =>{
    const {blogId} = useParams<{blogId:string}>();
    const navigate = useNavigate();
    const [title, setTitle] =useState("");
    const [content, setContent] =useState("");

    useEffect(() => {
        apiClient
            .get(`blog/${blogId}`,{withCredentials:true})
            .then((response) =>{
                setTitle(response.data.title);
                setContent(response.data.content);
            })
            .catch((error) =>{
                console.log("불러오기 실패",error);
            })
    }, [blogId]);

    const handleupt = () =>{
        apiClient
            .put(`blog/${blogId}`,{title,content},{withCredentials:true})
            .then(()=>{
                alert("수정되었습니다.");
                navigate(`/blog/${blogId}`);
            })
            .catch((error) =>{
                console.log("수정실패,",error);
            })
    }
    return (
        <Container>
            <h2>블로그 수정</h2>
            <Form>
                <Form.Group>
                    <Form.Label>제목</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
            </Form>
            <Form.Group>
                <Form.Label>내용</Form.Label>
                <Form.Control as="textarea" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
            </Form.Group>
            <Button variant="success" onClick={handleupt}>수정 완료</Button>

        </Container>
    )
}

export default EditBlog;