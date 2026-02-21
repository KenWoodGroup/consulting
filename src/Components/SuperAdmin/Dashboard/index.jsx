import { useEffect, useState } from "react";
import { apiUser } from "../../../utils/Controllers/User";
import Create from "./__components/Create";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyData from "../../UI/NoData/EmptyData";
import Loading from "../../UI/Loadings/Loading";
import Delete from "./__components/Delete";
import Edit from "./__components/Edit";

export default function Dashboard() {
    const [admins, setAdmins] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const GetAllAdmin = async (page = 1) => {
        try {
            setLoading(true);
            const response = await apiUser?.GetUser({ role: "admin", page });
            const records = response?.data?.data?.records || [];
            const pagination = response?.data?.data?.pagination || {};
            setAdmins(records);
            setCurrentPage(pagination.currentPage || 1);
            setTotalPages(pagination.total_pages || 1);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetAllAdmin(currentPage);
    }, [currentPage]);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[25px] font-bold">Adminlar</h1>
                <Create refresh={() => GetAllAdmin(currentPage)} />
            </div>
            {admins?.length === 0 ? (
                <EmptyData text={'Ma`lumot yo`q'} />
            ) : (
                <>
                    <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        №
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ism
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefon
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yaratilgan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {admins.map((admin, index) => (
                                    <tr key={admin.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * 10 + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(admin.createdAt).toLocaleString("uz-UZ")}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-[10px]">
                                                <Delete id={admin?.id} refresh={() => GetAllAdmin(currentPage)} />
                                                <Edit data={admin} refresh={() => GetAllAdmin(currentPage)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" /> Avvalgi
                        </button>
                        <span className="text-gray-700">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center gap-1"
                        >
                            Keyingi <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}