import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import apiClient1 from "../apiClient.tsx";
import {Container, Button ,Form} from "react-bootstrap";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.tsx";

interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    viewCount: number;
    user: {
        name: string;
        email:string;
    };
    category:{
        id:string;
        name:string;
    }
}

interface Comment {
    id:number;
    content:string;
    createdAt: string;
    user:{
        name:string,
    email:string};
}

const BlogDetail :React.FC = () =>{
    const {blogId} = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userEmail = useSelector((state:RootState) => state.auth.email);


    const [blog, setBlog] = useState<Blog | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewCommnent] = useState("");
    const [editingCommentId, setEditingCommentId] =useState<number | null>(null);
    const [updateContent, setUpdatedContent] = useState("");


    useEffect(() => {
        apiClient1
            .get(`blog/${blogId}`, {withCredentials:true})
            .then((response) => {
                setBlog(response.data);
            })
            .catch((error) =>{
                console.log("블로그 불러오기 실패", error);
            })
    }, [blogId]);

    useEffect(() => {
        apiClient1.get(`comments/post/${blogId}`)
            .then((response) => setComments(response.data))
            .catch((error) => console.error("댓글을 불러올수가없습니다."+ error));
    }, [blogId]);

    if (!blog) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        navigate(`/edit/${blogId}`); // 수정 페이지로 이동
    }

    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            apiClient.delete(`/blog/${blogId}`, {withCredentials:true})
                .then(() => {
                    alert("삭제 완료!");
                    navigate("/");
                })
                .catch((error) => {
                    console.log("삭제 실패", error);
                });
        }
    };

    const handleCommentCreate = () =>{
        if(!newComment.trim()) {
            alert("댓글 내용을 입력하세요!");
            return;
        }

        console.log("🔍 댓글 전송 데이터:", { postId: blogId, email: userEmail, comment: newComment });

        apiClient.post("comments/create",{postId: blogId,email:userEmail, content: newComment}, {withCredentials:true})
            .then((response) =>{
                setComments([...comments,response.data]);
                setNewCommnent("");
            })
            .catch((error :string) => console.log("댓글 작성 실패: " + error));
    };

    //기존의 댓글 내용 불러오는 파트
    const startEditing =(comment : Comment) =>{
        setEditingCommentId(comment.id);
        setUpdatedContent(comment.content);
    };

    //댓글 수정 취소
    const cancelEditing = () =>{
        setEditingCommentId(null);
        setUpdatedContent("");
    }

    const handleUpdateComment = (commentId:number) =>{
        apiClient.put(`/comments/update/${commentId}`,{content:updateContent})
            .then((_response) =>{
                setComments(comments.map(comment =>(
                    comment.id === commentId ? {...comment, content: updateContent} : comment
                )))
                setEditingCommentId(null);
            })
            .catch((error) => console.log("댓글 수정 실패" ,error));
    }

    const handleDeleteComment = (commentId:number) => {
        if(!window.confirm("댓글을 삭제하시겠습니까?")) return;

        apiClient.delete(`comments/${commentId}`)
            .then(() => {
                setComments(comments.filter(comment => comment.id !== commentId));
            })
            .catch((error:any) => console.log("댓글 삭제 실패" + error));
    };

    return (
        <Container className="mt-4">
            <div className="blog-detail-container">
                <h1 className="blog-title">{blog.title}</h1>
                <p className="text-black">{blog.category.name}</p>
                <div className="blog-meta">
                    <span className="author">{blog.user.name}</span>
                    <span className="date">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="view-count">조회수: {blog.viewCount}</span>
                </div>
                <div className="blog-content">
                    <p dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
                <div className="blog-actions">
                    {isAuthenticated && blog.user.email == userEmail && ( //로그인상태 + 본인글만.
                        <>
                            <Button variant="warning" onClick={handleEdit}>
                                수정하기
                            </Button>
                            <Button variant="danger" className="ms-2" onClick={handleDelete}>
                                삭제하기
                            </Button>
                        </>
                    )}
                </div>
                <h3 className="mt-4">댓글</h3>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="border p-2 my-2">
                            <strong>{comment.user.email}</strong>
                            <div>
                                {comment.content}
                            </div>
                            <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>

                            {isAuthenticated && comment.user.email === userEmail && (
                                <div>
                                    {editingCommentId === comment.id ?(
                                        <>
                                            <Form.Control
                                                as="textarea"
                                                value={updateContent}
                                                onChange={(e) => setUpdatedContent(e.target.value)}
                                            />
                                        <Button variant="success" size="sm" onClick={() => handleUpdateComment(comment.id)}>
                                            저장
                                        </Button>
                                        <Button variant="secondary" size="sm" className="ms-2" onClick={cancelEditing}>
                                            취소
                                        </Button>
                                        </>
                                    ): (
                                        <>
                                            <Button variant="warning" size="sm" onClick={() => startEditing(comment)}>
                                                수정
                                            </Button>
                                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteComment(comment.id)}>
                                                삭제
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>아직 댓글이 존재치 않습니다.</p>
                )}
                {/* 댓글 입력하는 부분 */}
                <div className="comment-input mt-4">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewCommnent(e.target.value)}
                        placeholder="댓글 입력하세요.">

                    </Form.Control>
                    <button className="mt-2" onClick={handleCommentCreate} disabled={!newComment.trim()} style={{cursor: "pointer"}}>
                        작성
                    </button>
                </div>
            </div>
        </Container>
        //블로그 댓글 창 부분

    );
}

export default BlogDetail;
