import { Outlet } from "react-router-dom";
import Header from "../Components/UI/Header/Header";

export default function MainLayout() {
    return (
        <div className="px-[15px]">
            <Header />
            <Outlet />
        </div>
    )
}