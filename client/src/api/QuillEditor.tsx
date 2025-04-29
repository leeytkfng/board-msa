import  { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {useNavigate} from "react-router-dom";
import {Card, Col, Container, Row} from "react-bootstrap";
import {categories} from "../components/Categoty.tsx"
import "../style/edit.css"

export default function QuillEditor() {
    const [title,setTitle] =useState("");
    const [content, setContent] = useState("");
    const [selectedCategory , setSelectedCategory] = useState<String | null>(null); //카테고리 상태추가
    const navigate = useNavigate();

    const handleSave = async () => {
        if(!title.trim() || !content.trim() || !setSelectedCategory){
            alert("내용이나 제목,카테고리 칸이 비어있습니다,");
            return;
        }
        const postData = {title, content,category : selectedCategory};

        try {
            const response = await fetch("http://localhost:8080/api/posts" ,{
                method: "POST",
                headers: {"Content-Type" : "application/json"} ,
                credentials: "include" ,
                body:JSON.stringify(postData),
            });

            console.log(response);

            if(response.ok){
                alert("게시글이 저장되었습니다.");
                setTitle("");
                setContent("");
                setSelectedCategory(null) //저장되면 초기화
                navigate("/main");
            } else {
                alert("게시글 저장실패");
            }
        } catch (err:any){
            console.error("오류발생"+ err);
            alert("서버오류! 다시 시도하세요");
        }
    };

    return (  //최신 REact 와 어울리는 WYSIWYG
        <div>
            <h2>블로그 작성</h2>
            <input
             type="text"
             placeholder="제목을 작성해주세요."
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             style={{
                 width: "100%",
                 padding: "10px",
                 fontSize: "18px",
                 marginBottom: "10px",
                 border:"1px solid #ddd",
                 borderRadius: "5px"
             }}
            />
            <Container className="border category-container1" style={{borderRadius:"5px"}}>
                <h3 className="text-center mb-4" style={{marginTop:"7px"}}>카테고리를 선택해주세요.</h3>
                <Row className="custom-row1" style={{gap:"15px"}}>
                    {categories.map((category, index) => (
                        <Col key={index} lg={Math.floor(12/categories.length)}  className="p-1 custom-card1">
                            <Card className={`custom-card1 text-center ${selectedCategory === category.title ? "selected": ""}`}
                                  style={{height:'130px',width:'110px', cursor: "pointer"}}
                                  onClick={() => setSelectedCategory(category.title)} //카테고리 선택
                            >
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
            <ReactQuill
                value={content}
                onChange={setContent}
                modules={{
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        ["clean"],
                    ],
                }}
                formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "link",
                    "image",
                ]}
                style={{ height: "300px", marginBottom: "50px" , marginTop: "10px"}}
            />
            <button
            onClick={handleSave}
            style={{
                padding:"10px 15px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color:"white",
                border:"none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
            > 블로그 작성</button>
        </div>
    );
}
