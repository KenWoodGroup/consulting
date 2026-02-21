import { useEffect, useState } from "react"
import {
    Card,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Button,
    IconButton,
    Tooltip,
    Badge
} from "@material-tailwind/react"
import {
    ClockIcon,
    CheckCircleIcon,
    Cog6ToothIcon,
    XCircleIcon,
    DocumentTextIcon,
    DocumentIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserIcon,
    CalendarIcon,
    PhoneIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline"
import { format } from "date-fns"
import { apiOffers } from "../../../utils/Controllers/Offers"
import Edit from "./__components/Edit"

export default function Order() {
    const [activeTab, setActiveTab] = useState("pending")
    const [orders, setOrders] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total_pages: 1,
        total_count: 0,
        hasNext: false,
        hasPrev: false
    })
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState({})

    const API_BASE_URL = "https://api.usderp.uz/consulting"

    const statusTabs = [
        {
            label: "Kutilmoqda",
            value: "pending",
            icon: ClockIcon,
            color: "text-yellow-600"
        },
        {
            label: "Jarayonda",
            value: "process",
            icon: Cog6ToothIcon,
            color: "text-blue-600"
        },
        {
            label: "Bajarildi",
            value: "done",
            icon: CheckCircleIcon,
            color: "text-green-600"
        },
        {
            label: "Bekor qilingan",
            value: "cancelled",
            icon: XCircleIcon,
            color: "text-red-600"
        },
    ]

    const GetAllorder = async (page = 1) => {
        try {
            setLoading(true)
            const response = await apiOffers.Get({ status: activeTab, page })
            if (response.data) {
                setOrders(response.data.data?.records || [])
                setPagination(response.data.data?.pagination || {
                    page: 1,
                    limit: 20,
                    total_pages: 1,
                    total_count: 0,
                    hasNext: false,
                    hasPrev: false
                })
            }
        } catch (error) {
            console.log(error)
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetAllorder(1)
    }, [activeTab])

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const handlePageChange = (newPage) => {
        GetAllorder(newPage)
    }

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd.MM.yyyy HH:mm")
        } catch {
            return dateString
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "process": return "bg-blue-100 text-blue-800"
            case "done": return "bg-green-100 text-green-800"
            case "cancelled": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "pending": return "Kutilmoqda"
            case "process": return "Jarayonda"
            case "done": return "Bajarildi"
            case "cancelled": return "Bekor qilingan"
            default: return status
        }
    }

    const getFileName = (filePath) => {
        if (!filePath) return ""
        // Если filePath уже содержит имя файла (например, "27080446-f37e-4473-95c3-7f12078b6038.docx")
        return filePath
    }

    const downloadFile = async (filePath, fileNumber) => {
        if (!filePath) return

        const fileId = `${filePath}-${fileNumber}`
        setDownloading(prev => ({ ...prev, [fileId]: true }))

        try {
            const fileName = getFileName(filePath)
            // Формируем полный URL для скачивания
            const fileUrl = `${API_BASE_URL}/${filePath}`

            const response = await fetch(fileUrl)
            const blob = await response.blob()

            // Создаем URL для blob и скачиваем
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()

            // Очищаем
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Faylni yuklashda xatolik:', error)

            // Альтернативный способ: открыть в новой вкладке
            try {
                const fileUrl = `${API_BASE_URL}/${filePath}`
                window.open(fileUrl, '_blank')
            } catch (e) {
                alert('Faylni yuklashda xatolik yuz berdi')
            }
        } finally {
            setDownloading(prev => ({ ...prev, [fileId]: false }))
        }
    }

    // Определяем тип файла по расширению
    const getFileIcon = (fileName) => {
        if (!fileName) return DocumentIcon

        const extension = fileName.split('.').pop()?.toLowerCase()

        switch (extension) {
            case 'pdf':
                return DocumentIcon // Можно заменить на специальную иконку для PDF
            case 'doc':
            case 'docx':
                return DocumentIcon // Можно заменить на иконку Word
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return DocumentIcon // Можно заменить на иконку изображения
            default:
                return DocumentIcon
        }
    }

    return (
        <div className="">
            {/* Заголовок */}
            <div className="mb-8">
                <Typography variant="h3" color="blue-gray" className="font-bold">
                    Buyurtmalar
                </Typography>
            </div>

            {/* Табы статусов */}
            <Tabs value={activeTab} className="mb-8">
                <TabsHeader
                    className="bg-gray-100 p-1 rounded-lg"
                    indicatorProps={{ className: "bg-white shadow-md rounded-md" }}
                >
                    {statusTabs.map(({ label, value, icon: Icon, color }) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => handleTabChange(value)}
                            className={`flex items-center gap-2 py-3 px-4 font-medium transition-all ${activeTab === value ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-[5px]">
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span>{label}</span>
                            </div>
                        </Tab>
                    ))}
                </TabsHeader>
            </Tabs>

            {/* Контент с заказами */}
            <div className="space-y-4">
                {loading ? (
                    // Скелетон загрузки
                    [...Array(3)].map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="w-20 h-8 bg-gray-200 rounded"></div>
                            </div>
                        </Card>
                    ))
                ) : orders.length > 0 ? (
                    orders.map((order) => (
                        <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Основная информация */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Badge color="gray" className={getStatusColor(order.status)}>
                                            {getStatusText(order.status)}
                                        </Badge>
                                        <Typography variant="small" color="gray" className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4" />
                                            {formatDate(order.createdAt)}
                                        </Typography>
                                    </div>

                                    {/* Информация о пользователе */}
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-gray-600" />
                                            {order.user.full_name}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="flex items-center gap-2">
                                            <PhoneIcon className="w-4 h-4" />
                                            <a href={`tel:${order.user.phone}`} className="hover:text-blue-600">
                                                {order.user.phone}
                                            </a>
                                        </Typography>
                                    </div>

                                    {/* Заметка */}
                                    {order.note && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <Typography variant="small" color="gray" className="flex items-start gap-2">
                                                <DocumentTextIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{order.note}</span>
                                            </Typography>
                                        </div>
                                    )}

                                    {/* Файлы */}
                                    {(order.file1 || order.file2) && (
                                        <div className="flex gap-2 flex-wrap">
                                            {order.file1 && (
                                                <Tooltip content={getFileName(order.file1)}>
                                                    <Button
                                                        variant="outlined"
                                                        size="sm"
                                                        onClick={() => downloadFile(order.file1, '1')}
                                                        disabled={downloading[`${order.file1}-1`]}
                                                        className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {downloading[`${order.file1}-1`] ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                                Yuklanmoqda...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <DocumentIcon className="w-4 h-4" />
                                                                <span className="truncate max-w-[150px]">
                                                                    {getFileName(order.file1)}
                                                                </span>
                                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </Tooltip>
                                            )}
                                            {order.file2 && (
                                                <Tooltip content={getFileName(order.file2)}>
                                                    <Button
                                                        variant="outlined"
                                                        size="sm"
                                                        onClick={() => downloadFile(order.file2, '2')}
                                                        disabled={downloading[`${order.file2}-2`]}
                                                        className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {downloading[`${order.file2}-2`] ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                                Yuklanmoqda...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <DocumentIcon className="w-4 h-4" />
                                                                <span className="truncate max-w-[150px]">
                                                                    {getFileName(order.file2)}
                                                                </span>
                                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ID заказа */}
                                <div className="lg:text-right">
                                    <Edit
                                        data={order}
                                        refresh={() => GetAllorder(pagination.page)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    // Пустое состояние
                    <Card className="p-12">
                        <div className="text-center">
                            <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <Typography variant="h6" color="gray" className="font-normal">
                                Buyurtmalar topilmadi
                            </Typography>
                            <Typography variant="small" color="gray" className="mt-2">
                                "{statusTabs.find(t => t.value === activeTab)?.label}" statusida buyurtmalar yo'q
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* Пагинация */}
                {!loading && orders.length > 0 && (
                    <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                        <Typography variant="small" color="gray">
                            Jami buyurtmalar: {pagination.total_count}
                        </Typography>
                        <div className="flex items-center gap-2">
                            <IconButton
                                variant="outlined"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrev}
                                className="border-gray-300"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </IconButton>
                            <Typography variant="small" color="gray" className="px-4">
                                Sahifa {pagination.page} / {pagination.total_pages}
                            </Typography>
                            <IconButton
                                variant="outlined"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNext}
                                className="border-gray-300"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </IconButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}