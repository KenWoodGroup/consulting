import { useEffect, useState } from "react"
import {
    Card,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Badge
} from "@material-tailwind/react"
import {
    ClockIcon,
    CheckCircleIcon,
    Cog6ToothIcon,
    XCircleIcon,
    DocumentTextIcon,
    CalendarIcon,
    UserIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline"
import { format } from "date-fns"
import { apiOffers } from "../../../utils/Controllers/Offers"
import Edit from "./__components/Edit"

export default function Order() {

    const [activeTab, setActiveTab] = useState("pending")
    const [orders, setOrders] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(false)

    // 8 STATUS
    const statusTabs = [
        { label: "Ariza qabul qilindi", value: "pending", icon: DocumentTextIcon },
        { label: "Hujjatlar tekshirilmoqda", value: "step_1", icon: ClockIcon },
        { label: "Yer ekspertizasi", value: "step_2", icon: Cog6ToothIcon },
        { label: "Loyiha ko‘rib chiqilmoqda", value: "step_3", icon: Cog6ToothIcon },

        { label: "Tasdiqlash jarayoni", value: "step_4", icon: Cog6ToothIcon },
        { label: "Ruxsatnoma tayyorlanmoqda", value: "step_5", icon: Cog6ToothIcon },
        { label: "Ruxsatnoma berildi", value: "done", icon: CheckCircleIcon },
        { label: "Rad etildi", value: "cancelled", icon: XCircleIcon },
    ]

    const GetAllorder = async (page = 1) => {
        try {
            setLoading(true)
            const response = await apiOffers.Get({ status: activeTab, page })
            setOrders(response.data?.data?.records || [])
            setPagination(response.data?.data?.pagination || {})
        } catch (error) {
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetAllorder(1)
    }, [activeTab])

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd.MM.yyyy HH:mm")
        } catch {
            return dateString
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-gray-100 text-gray-800"
            case "step_1": return "bg-yellow-100 text-yellow-800"
            case "step_2": return "bg-blue-100 text-blue-800"
            case "step_3": return "bg-indigo-100 text-indigo-800"
            case "step_4": return "bg-purple-100 text-purple-800"
            case "step_5": return "bg-teal-100 text-teal-800"
            case "done": return "bg-green-100 text-green-800"
            case "cancelled": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status) => {
        const found = statusTabs.find(s => s.value === status)
        return found ? found.label : status
    }

    return (
        <div className="w-full">

            <div className="mb-6">
                <Typography variant="h4" className="font-bold">
                    Buyurtmalar
                </Typography>
            </div>

            {/* ✅ 4x4 GRID TABS */}
            <Tabs value={activeTab} className="mb-8">
                <TabsHeader
                    className="bg-gray-100 p-2 rounded-lg"
                    indicatorProps={{ className: "bg-white shadow rounded-md" }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                        {statusTabs.map(({ label, value, icon: Icon }) => (
                            <Tab
                                key={value}
                                value={value}
                                onClick={() => setActiveTab(value)}
                                className="flex items-center justify-center gap-2 py-3 text-center"
                            >
                                <div className="flex items-center gap-[5px]">
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">{label}</span>
                                </div>
                            </Tab>
                        ))}
                    </div>
                </TabsHeader>
            </Tabs>

            {/* CONTENT */}
            <div className="space-y-4">
                {loading ? (
                    <Card className="p-6 animate-pulse">
                        Yuklanmoqda...
                    </Card>
                ) : orders.length > 0 ? (
                    orders.map(order => (
                        <Card key={order.id} className="p-6 hover:shadow-lg transition">
                            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">

                                <div className="space-y-3 flex-1">

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Badge className={getStatusColor(order.status)}>
                                            {getStatusText(order.status)}
                                        </Badge>

                                        <Typography variant="small" color="gray" className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4" />
                                            {formatDate(order.createdAt)}
                                        </Typography>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <Typography className="flex items-center gap-2 font-semibold">
                                            <UserIcon className="w-5 h-5" />
                                            {order.user?.full_name}
                                        </Typography>

                                        <Typography variant="small" color="gray" className="flex items-center gap-2 mt-1">
                                            <PhoneIcon className="w-4 h-4" />
                                            {order.user?.phone}
                                        </Typography>
                                    </div>

                                </div>

                                <Edit
                                    data={order}
                                    refresh={() => GetAllorder(pagination.page)}
                                />

                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-10 text-center">
                        Buyurtmalar topilmadi
                    </Card>
                )}
            </div>

        </div>
    )
}