import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {checkLogin} from "../store/authSlice.tsx";
import apiClient from '../apiClient.tsx';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
} from 'mdb-react-ui-kit';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store.tsx";

const KAKAO_CLIENT_ID = "6a641f762b414c6a158a851863141608";  // 여기에 실제 REST API 키 입력
const KAKAO_REDIRECT_URI = "http://localhost:8081/oauth/kakao/callback"; // 카카오 개발자센터에서 등록한 리다이렉트 URI

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch<AppDispatch>(); //dispatch 훅으로 클라이언트 상태관리
    const navigate = useNavigate();

    const handleKaKaoLogin = () =>{
        window.location.href = KAKAO_AUTH_URL;
    }
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!email || !password){
            setError('이메일 , 비밀번호 모두 입력');
            return;
        }


        try {
            const requestData = {email ,password};
            const response = await apiClient.post('/login', requestData);
            console.log('로그인 응답:', response.data);
            console.log("삭제 여부:" , response.data.deletedAt);

            if(response.data.deletedAt != null) {
                alert("이미 탈퇴한 계정입니다.")
                return;
            }

            const userEmail = response.data.email;

            localStorage.setItem('email',userEmail);

            //Redux 상태 업데이트
            dispatch(checkLogin());

            alert("로그인이 성공했습니다!");
            navigate('/main');
        } catch (err: any) {
            if (err.response?.status == 400) {
                alert('이미 탈퇴한 계정입니다.');
                return;
            }
            const message = err.response?.data?.message || '로그인 중 오류가 발생했습니다.';
            setError(message);
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };


    return (
        <MDBContainer className="">
            <MDBRow className="d-flex justify-content-center align-items-center h-100">
                <MDBCol col="12">
                    <MDBCard className="bg-white my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                        <MDBCardBody className="p-5 w-100 d-flex flex-column">
                            <h2 className="fw-bold mb-2 text-center">로그인</h2>
                            <p className="text-muted mb-3">이메일과 비밀번호를 입력해주세요.</p>

                            {error && <div className="text-danger mb-3">{error}</div>}

                            <form onSubmit={handleLogin}>
                                <MDBInput
                                    wrapperClass="mb-4 w-100"
                                    label="Email"
                                    id="formControlLg"
                                    type="email"
                                    size="lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <MDBInput
                                    wrapperClass="mb-4 w-100"
                                    label="비밀번호"
                                    id="formControlLg1"
                                    type="password"
                                    size="lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span className="d-flex">
                                     <MDBCheckbox
                                         name="flexCheck"
                                         id="flexCheckDefault"
                                         className="mb-4"
                                         label="아이디 저장"
                                     />
                                     <Link to="/restore" style={{marginLeft:"240px"}}>
                                         계정 복구
                                     </Link>
                                </span>
                                <button type="submit" className="mt-0 btn btn-primary"
                                style={{width:'400px',}}>
                                    Login
                                </button>
                                <button
                                    onClick={handleRegisterClick}
                                    style={{width:"400px", marginTop:"5px"}}
                                    className="btn btn-primary"
                                >
                                    회원가입
                                </button>
                            </form>


                            <hr className="my-4" />

                            <img src="/images/kakao.png"  alt="카카오 로그인" style={{cursor:"pointer" , width:"250px"}} onClick={handleKaKaoLogin}/>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default LoginForm;
