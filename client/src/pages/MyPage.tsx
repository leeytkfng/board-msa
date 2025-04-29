import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiClient from "../apiClient.tsx";
import { useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../store/store.tsx";
import {useNavigate} from "react-router-dom";
import {logout} from "../store/authSlice.tsx";

const MyPage: React.FC = () => {
    // Redux에서 로그인한 유저 정보 가지고 오기
    const email = useSelector((state: any) => state.auth?.email);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] =useState( {
        firstName: '',
        lastName: '' ,
        phoneNumber: '',
        content: '',
    })

    useEffect(() => {
        if (!email || !isAuthenticated) {
            setError("로그인필요!");
            return;
        }

        apiClient.get(`/${email}`)
            .then(response => {
                setUser(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNumber: response.data.phoneNumber,
                    content: response.data.content || ''
                });
            })
            .catch(error => setError("사용자 정보 불러오기 실패" + error));
    }, [email, isAuthenticated]);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleUpdate = () => {
        if (window.confirm("수정하시겠습니까?")) {
            apiClient.patch(`/user/${email}`, formData)
                .then(response => {
                    setUser(response.data);
                    setIsEditing(false);
                    alert("수정되었습니다.");
                })
                .catch(error => setError("업데이트 실패:" + error.message));
        }
    }

    const handleDelete = async () =>{
        if(window.confirm("정말로 회원 탈퇴하시겠습니까?")) {
            try{
                await apiClient.delete(`/user/${email}`);
                dispatch(logout()); //redux 상태 초기화

                document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                navigate("/"); //메인페이지로 이동
                alert("회원탈퇴 완료");
            } catch (error) {
                setError(("회원 탈퇴 실패:" + error));
            }
        }
    };


    if (!user) {
        return <div>{error || "로딩 중..."}</div>;
    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm p-4">
                        <h2 className="text-center mb-4">마이 페이지</h2>
                        <table className="table table-bordered table-responsive" style={{ fontSize: '1.2em' }}>
                            <tbody>
                            <tr>
                                <th>이름</th>
                                <td>{user.firstName} {user.lastName}</td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <th>성별</th>
                                <td>{user.sex}</td>
                            </tr>
                            <tr>
                                <th>생년월일</th>
                                <td>{user.birthday}</td>
                            </tr>
                            <tr>
                                <th>전화번호</th>
                                <td>{user.phoneNumber}</td>
                            </tr>
                            <tr>
                                <th>자기소개</th>
                                <td>{user.content}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="text-center">
                            <button className="btn btn-primary me-2" onClick={()=> setIsEditing(true)}>정보 수정</button>
                            <button className="btn btn-danger" onClick={handleDelete}>회원 탈퇴</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*수정 창*/}
            {isEditing && (
                <div className="modal show d-block" tabIndex={-1}>
                 <div className="modal-dialog">
                     <div className="modal-content">
                         <div className="modal-header">
                             <h5 className="modal-title">정보 수정</h5>
                             <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
                         </div>
                         <div className="modal-body">
                             <input
                                type="text"
                                className="form-control mb-2"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="이름"
                             />
                             <input
                                 type="text"
                                 className="form-control mb-2"
                                 name="firstName"
                                 value={formData.firstName}
                                 onChange={handleChange}
                                 placeholder="성"
                             />
                             <input
                                 type="text"
                                 className="form-control mb-2"
                                 name="phonenumber"
                                 value={formData.phoneNumber}
                                 onChange={handleChange}
                                 placeholder="전화번호"
                             />
                             <textarea
                                 className="form-control mb-2"
                                 name="content"
                                 value={formData.content}
                                 onChange={handleChange}
                                 placeholder="자기소개"
                             />
                         </div>
                         <div className="modal-footer">
                             <button className="btn btn-secondary " onClick={() => setIsEditing(false)}>취소</button>
                             <button className="btn btn-primary" onClick={handleUpdate}>저장</button>
                         </div>
                     </div>
                 </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;
