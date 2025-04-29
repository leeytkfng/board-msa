export default function Footer() {
    return (
        <div>
            {/*sub footer*/}
            <div className="mt-5 w-full p-3 text-center text-white text-sm" style={{ backgroundColor: "#7e7573" }}>
                <p>이 웹사이트는 개인 개발 프로젝트로 제작되었습니다.</p>
                <div className="mt-1">
                </div>
            </div>
            {/* main footer */}
            <footer className="p-4 bg-secondary text-white text-center" style={{ backgroundColor: "salmon" }}>
                <div>이용약관 | 개인정보 처리방침 | 문의사항</div>
                <div></div>
                © 2025 Goodnight123. All rights reserved.
            </footer>
        </div>
    );
}
