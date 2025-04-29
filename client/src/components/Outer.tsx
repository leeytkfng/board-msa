import { Outlet } from "react-router-dom";
export default function Outer() {
    return (
        <div className="container my5">
            <Outlet></Outlet>
        </div>
    );
}
