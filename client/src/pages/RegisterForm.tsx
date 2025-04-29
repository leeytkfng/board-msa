import { useState } from "react";
import apiClient from "../apiClient.tsx";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRadio,
} from "mdb-react-ui-kit";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthday, setBirthDay] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [sex, setSex] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [authCode, setAuthCode] = useState("");

    const handleSendAuthCode = async () => {
        try {
            const response = await apiClient.post("/auth/send-code", { email });
            alert("인증번호가 이메일로 발송되었습니다.");
        } catch (err: any) {
            alert("인증번호 전송 실패!");
        }
    };

    const handleVerifyAuthCode = async () => {
        try {
            const response = await apiClient.post("/auth/verify-code" ,{
                email,
                code: authCode,
            });
            alert("이메일 검증완료");
            setEmailVerified(true);
        } catch (err :any) {
            alert("인증번호가 틀렸습니다.");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailVerified) {
            setErrorMessage("이메일 인증을 완료해주세요.");
            return;
        }
        if (password.length < 7) {
            setErrorMessage("비밀번호는 6자리 이상이어야 합니다");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
        try {
            const response = await apiClient.post("/register", {
                email,
                password,
                sex,
                phoneNumber,
                birthday,
                firstName,
                lastName,
            });
            alert("회원가입이 정상적으로 완료되었습니다.");
            window.location.href = "/";
        } catch (error: any) {
            console.log("Registration failed", error);
        }
    };

    return (
        <MDBContainer className="py-5">
            <MDBRow className="justify-content-center">
                <MDBCol md="8">
                    <MDBCard>
                        <MDBCardBody className="px-4">
                            <h3 className="fw-bold mb-4">회원가입</h3>

                            {/* 기본 정보 */}
                            <h5 className="fw-bold">기본 정보</h5>
                            <MDBRow>
                                <MDBCol md="6">
                                    <MDBInput
                                        wrapperClass="mb-3"
                                        label="성"
                                        size="lg"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </MDBCol>
                                <MDBCol md="6">
                                    <MDBInput
                                        wrapperClass="mb-3"
                                        label="이름"
                                        size="lg"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow>
                                <MDBCol md="6">
                                    <MDBInput
                                        wrapperClass="mb-3"
                                        label="생년월일 (8자리)"
                                        size="lg"
                                        type="text"
                                        value={birthday}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                    />
                                </MDBCol>
                                <MDBCol md="6" className="d-flex align-items-center gap-4">
                                    <h6 className="fw-bold mb-0">성별</h6>
                                    <MDBRadio
                                        name="sex"
                                        label="여성"
                                        inline
                                        checked={sex === "여성"}
                                        onChange={() => setSex("여성")}
                                    />
                                    <MDBRadio
                                        name="sex"
                                        label="남성"
                                        inline
                                        checked={sex === "남성"}
                                        onChange={() => setSex("남성")}
                                    />
                                </MDBCol>
                            </MDBRow>

                            {/* 이메일 인증 */}
                            <h5 className="fw-bold mt-4">연락처</h5>
                            <MDBRow style={{marginBottom: "10px"}}>
                                <MDBCol md="8">
                                    <MDBInput
                                        wrapperClass="mb-3"
                                        label="이메일"
                                        size="lg"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <MDBCol md="4" className="d-flex align-items-end">
                                        <MDBBtn className="w-100" onClick={handleSendAuthCode}  disabled={emailVerified}>
                                            인증 요청
                                        </MDBBtn>
                                    </MDBCol>
                                </MDBCol>
                            </MDBRow>

                            {!emailVerified && (
                                <MDBRow style={{marginBottom: "10px"}}>
                                    <MDBCol md="8">
                                        <MDBInput
                                            wrapperClass="mb-3"
                                            label="인증번호 입력"
                                            size="lg"
                                            value={authCode}
                                            onChange={(e) => setAuthCode(e.target.value)}
                                        />
                                        <MDBCol md="4" className="d-flex align-items-end">
                                            <MDBBtn className="w-100" onClick={handleVerifyAuthCode}>
                                                인증 확인
                                            </MDBBtn>
                                        </MDBCol>
                                    </MDBCol>
                                </MDBRow>
                            )}

                            <MDBRow>
                                <MDBCol md="12">
                                    <MDBInput
                                        wrapperClass="mb-3"
                                        label="전화번호"
                                        size="lg"
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </MDBCol>
                            </MDBRow>

                            {/* 계정 정보 */}
                            <h5 className="fw-bold mt-4">계정 정보</h5>
                            <MDBRow>
                                <MDBCol md="6">
                                    <MDBInput
                                        wrapperClass="mb-3"
                                        label="비밀번호"
                                        size="lg"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </MDBCol>
                                <MDBCol md="6">
                                    <MDBInput
                                        wrapperClass="mb-3"
                                        label="비밀번호 확인"
                                        size="lg"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </MDBCol>
                            </MDBRow>

                            {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

                            <MDBBtn className="mt-3 w-100" size="lg" onClick={handleRegister}>
                                회원가입
                            </MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default RegisterForm;
