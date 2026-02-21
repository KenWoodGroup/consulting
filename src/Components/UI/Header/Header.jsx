import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from '../../../Images/Logo.png'
export default function Header() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Закрытие меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`fixed top-[10px] z-30 flex justify-between items-center 
                       mb-6 px-6 py-2 rounded-2xl border shadow-lg 
                       transition-all duration-500 bg-white backdrop-blur-md border-gray-200 w-[98.5%] left-[10px]`}
        >
            {/* Правая часть - профиль */}
                <div>
                    <img className="w-[50px]" src={Logo} alt="" />
                </div>
            <div className="flex items-center gap-4">
                <div className="relative flex items-center gap-4" ref={menuRef}>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex items-center gap-3 px-4 py-1 rounded-xl border shadow transition-all duration-300 text-sm font-medium bg-white hover:bg-gray-100 border-gray-300 text-gray-800"
                    >
                        <div className="p-2 rounded-full bg-gray-200">
                            <User className="w-4 h-4" />
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openMenu ? "rotate-180" : ""}`} />
                    </button>

                    {/* Выпадающее меню */}
                    {openMenu && (
                        <div className="absolute right-0 top-16 w-48 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 overflow-hidden transition-all duration-300">
                            {/* Декоративная полоска */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>

                            <div className="h-px my-1 bg-gray-200"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center gap-2 text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}