import {matchPath, Route, Routes, useLocation} from "react-router-dom";
import './style/App.css';
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import LoginForm from "./pages/LoginForm.tsx";
import RegisterForm from "./pages/RegisterForm.tsx";
import MainMa from "./components/MainMain.tsx";
import MyPage from "./pages/MyPage.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-summernote/dist/react-summernote.css";
import QuillEditor from "./api/QuillEditor.tsx";
import {useEffect} from "react";
import { checkLogin } from "./store/authSlice.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store.tsx";
import BlogAll from "./components/AllBlogs.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import EditBlog from "./pages/EditBlog.tsx";
import ShowWorking from "./components/ShowWorking.tsx";
import Categoty from "./components/Categoty.tsx";
import SearchBar from "./components/SearchBar.tsx";
import SearchResults from "./components/SearchResults.tsx";
import Restore from "./pages/Restore.tsx";
import ChatWidget from "./components/ChatWidget.tsx";


function App() {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkLogin());
    }, []);

    // 특정 경로에서는 전체 화면을 차지하도록 설정
    const isFullPage = ["/login", "/register", "/user", "/edit" ,"/myBlog","/search" ,"/restore"].includes(location.pathname)
        || matchPath("/blog/:blogId", location.pathname) !== null
        || matchPath("/edit/:blogId", location.pathname) !==null;

    return (
        <div className="App">
            <Header/> {/* 특정 경로가 아닐 때만 Header 표시 */}

            <div className={`container my-5 ${isFullPage ? "full-page" : ""}`}>
                <Routes>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/register" element={<RegisterForm/>}/>
                    <Route path="/user" element={<MyPage/>}/>
                    <Route path="/edit" element={<QuillEditor/>}/>
                    <Route path="/myBlog" element={<BlogAll/>}/>
                    <Route path="/blog/:blogId" element={<BlogDetail/>}/>
                    <Route path="/edit/:blogId" element={<EditBlog/>}/>
                    <Route path="/search" element={<SearchResults/>}/>
                    <Route path="/restore" element={<Restore/>}/>
                </Routes>
            </div>
            {!isFullPage && (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <SearchBar/> {/* 검색바 추가 */}
            </div>
            )}
            {!isFullPage && (
                <div className="main-content-container">
                    {/* MainMa: 가운데 정렬 */}
                    <div className="main-content">
                        <MainMa />
                    </div>
                </div>
            )}

            {!isFullPage && (
                <div>
                    <ShowWorking/>
                </div>
            )}
            {!isFullPage && (
                <div style={{marginTop: "20px"}}>
                    <Categoty/>
                </div>
            )}


            {!isFullPage && (
                <div>
                </div>
            )}
            <ChatWidget/>

            <Footer/>
        </div>
    );
}

export default App;
