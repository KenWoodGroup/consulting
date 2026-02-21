import { Outlet } from "react-router-dom";
import Sidebar from "../Components/UI/Sidebar/Sidebar";
import AdminHeader from "../Components/UI/Header/AdminHeader";
import { useState } from "react";

export default function AdminLayout() {
    const [active, setActive] = useState(false); 

    const Items = [
        {
            section: "Asosiy",
            items: [
                {
                    id: 1,
                    title: "Zakazlar",
                    path: "/admin/order",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M5.5 1a.5.5 0 0 0-.477.65l.11.35H3.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-1.632l.11-.35A.5.5 0 0 0 10.5 1zm.68 1h3.64l-.313 1H6.493zM11 7H5V6h6zm0 2.5H5v-1h6zM5 12h4v-1H5z" clip-rule="evenodd" /></svg>),
                },
                {
                    id: 2,
                    title: "Mijozlar",
                    path: "/admin/customer",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="currentColor" d="M9.5 14a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9m7.6 7.619c.763.235 1.714.381 2.9.381c6 0 6-3.75 6-3.75A2.25 2.25 0 0 0 23.75 16h-6.656a3.24 3.24 0 0 1 .904 2.25v.555l-.003.083a5.5 5.5 0 0 1-.154.99a6.1 6.1 0 0 1-.74 1.74M23.5 10.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0M2 18.25A2.25 2.25 0 0 1 4.25 16h10.5A2.25 2.25 0 0 1 17 18.25v.5S17 24 9.5 24S2 18.75 2 18.75z" /></svg>
                    )
                },

            ],
        },
    ];

    return (
        <div className="flex w-full overflow-hidden bg-[#FAFAFA] relative">
            <Sidebar Items={Items} open={active} onClose={() => setActive(false)} />
            <div
                className={`mt-[80px] pb-[30px] px-[15px] min-h-screen transition-all duration-300`}
                style={{
                    marginLeft: !active ? "250px" : "110px",
                    width: !active ? "calc(100% - 250px)" : "100%",
                }}
            >
                <AdminHeader active={() => setActive(!active)} sidebarOpen={!active} />
                <Outlet />
            </div>
        </div>
    );
}
