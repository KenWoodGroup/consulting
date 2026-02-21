import { Outlet } from "react-router-dom";
import Sidebar from "../Components/UI/Sidebar/Sidebar";
import AdminHeader from "../Components/UI/Header/AdminHeader";
import { useState } from "react";

export default function SuperAdminLayout() {
    const [active, setActive] = useState(false);

    const Items = [
        {
            section: "Asosiy",
            items: [
                {
                    id: 1,
                    title: "Adminlar",
                    path: "/super-admin/dashboard",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.175 10.825Q8 9.65 8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12t-2.825-1.175M4 20v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" /></svg>
                    ),
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
