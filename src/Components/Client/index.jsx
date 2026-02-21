import { useEffect, useState } from "react"
import {
    Card,
    Typography,
    Button,
    Badge
} from "@material-tailwind/react"
import {
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    File,
    Calendar,
    Download,
    ChevronLeft,
    ChevronRight,
    Package,
    Check
} from "lucide-react"
import { format } from "date-fns"
import { apiOffers } from "../../utils/Controllers/Offers"

export default function Client() {
    const [offers, setOffers] = useState([])
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

    // Статусы для прогресс-бара
    const progressSteps = [
        { key: 'pending', label: 'Yangi', icon: CheckCircle },
        { key: 'process', label: 'Jarayonda', icon: CheckCircle },
        { key: 'done', label: 'Bajarildi', icon: CheckCircle }
    ]

    const GetMyOffers = async (page = 1) => {
        try {
            setLoading(true)
            const userData = JSON.parse(localStorage.getItem("user"))

            const response = await apiOffers.GetUserId({
                userId: userData.id,
                page
            })

            if (response.data) {
                setOffers(response.data.data?.records || [])
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
            setOffers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetMyOffers(1)
    }, [])

    const handlePageChange = (newPage) => {
        GetMyOffers(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return {
                full: format(date, "dd.MM.yyyy HH:mm"),
                time: format(date, "HH:mm"),
                date: format(date, "dd.MM.yyyy"),
                relative: format(date, "dd MMM")
            }
        } catch {
            return {
                full: dateString,
                time: dateString,
                date: dateString,
                relative: dateString
            }
        }
    }

    const getFileName = (filePath) => {
        if (!filePath) return ""
        return filePath
    }

    // ✅ Добавленная функция для получения расширения файла
    const getFileExtension = (fileName) => {
        if (!fileName) return ''
        return fileName.split('.').pop()?.toLowerCase() || ''
    }

    const downloadFile = async (filePath, fileNumber) => {
        if (!filePath) return

        const fileId = `${filePath}-${fileNumber}`
        setDownloading(prev => ({ ...prev, [fileId]: true }))

        try {
            const fileName = getFileName(filePath)
            const fileUrl = `${API_BASE_URL}/${filePath}`

            const response = await fetch(fileUrl)
            const blob = await response.blob()

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()

            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Faylni yuklashda xatolik:', error)
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

    // Функция для определения прогресса
    const getProgressStep = (status) => {
        switch (status) {
            case 'pending': return 0
            case 'process': return 1
            case 'done': return 2
            case 'cancelled': return -1 // Отмененные заказы
            default: return 0
        }
    }

    // Компонент прогресс-бара
    const ProgressBar = ({ status }) => {
        const currentStep = getProgressStep(status)

        // Если заказ отменен
        if (status === 'cancelled') {
            return (
                <div className="w-full mt-3 mb-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            Bekor qilingan
                        </span>
                    </div>
                    <div className="relative">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1">
                            {progressSteps.map((step, index) => (
                                <div key={step.key} className="flex flex-col items-center">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="w-full mt-3 mb-2">
                {/* Прогресс линия */}
                <div className="relative">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${(currentStep / (progressSteps.length - 1)) * 100}%` }}
                        ></div>
                    </div>

                    {/* Точки статусов */}
                    <div className="flex justify-between absolute -top-1.5 w-full">
                        {progressSteps.map((step, index) => {
                            const isActive = index <= currentStep
                            const isCurrent = index === currentStep

                            return (
                                <div key={step.key} className="flex flex-col items-center">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}>
                                        {isActive && index === currentStep ? (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        ) : isActive ? (
                                            <Check className="w-3 h-3 text-white" />
                                        ) : null}
                                    </div>
                                    <span className={`text-[10px] mt-1 whitespace-nowrap ${isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-[80px]">
            {/* Заголовок */}
            <div className="sticky top-0 bg-white z-10 py-4 border-b border-gray-200 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-gray-800" />
                        <Typography variant="h5" className="font-bold text-gray-900">
                            Mening buyurtmalarim
                        </Typography>
                    </div>
                    {pagination.total_count > 0 && (
                        <Badge color="gray" className="bg-gray-100">
                            {pagination.total_count} ta
                        </Badge>
                    )}
                </div>
            </div>

            {/* Список заказов */}
            <div className="space-y-3">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <Card key={i} className="p-4 animate-pulse">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-2 bg-gray-200 rounded w-full"></div>
                                <div className="flex justify-between">
                                    <div className="h-2 bg-gray-200 rounded w-8"></div>
                                    <div className="h-2 bg-gray-200 rounded w-8"></div>
                                    <div className="h-2 bg-gray-200 rounded w-8"></div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : offers.length > 0 ? (
                    offers.map((offer) => {
                        const date = formatDate(offer.createdAt)

                        return (
                            <Card key={offer.id} className="p-4 hover:shadow-md transition-shadow">
                                {/* Заголовок с датой */}
                                <div className="flex items-center justify-between mb-2">
                                    <Typography variant="h6" className="text-gray-900 font-semibold text-base">
                                        Buyurtma #{offer.id.slice(0, 6)}
                                    </Typography>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-xs">{date.date}</span>
                                    </div>
                                </div>

                                {/* Прогресс бар */}
                                <ProgressBar status={offer.status} />

                                {/* Заметка если есть */}
                                {offer.note && offer.note !== "qwdqwdwqd" && offer.note !== "wqdwd" && (
                                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <Typography variant="small" className="text-gray-700 break-words text-xs">
                                                {offer.note}
                                            </Typography>
                                        </div>
                                    </div>
                                )}

                                {/* Файлы */}
                                {(offer.file1 || offer.file2) && (
                                    <div className="mt-8 flex flex-col gap-2">
                                        <Typography variant="small" className="text-gray-600 font-medium text-xs">
                                            Fayllar:
                                        </Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {offer.file1 && (
                                                <Button
                                                    variant="outlined"
                                                    size="sm"
                                                    onClick={() => downloadFile(offer.file1, '1')}
                                                    disabled={downloading[`${offer.file1}-1`]}
                                                    className="flex items-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 py-1 px-2 text-xs"
                                                >
                                                    {downloading[`${offer.file1}-1`] ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                            <span>Yuklanmoqda...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {getFileExtension(offer.file1) === 'pdf' ? (
                                                                <File className="w-3.5 h-3.5 text-red-500" />
                                                            ) : (
                                                                <File className="w-3.5 h-3.5 text-blue-500" />
                                                            )}
                                                            <span className="truncate max-w-[120px]">
                                                                {offer.file1.split('.').pop()?.toUpperCase()} fayl
                                                            </span>
                                                            <Download className="w-3.5 h-3.5" />
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            {offer.file2 && (
                                                <Button
                                                    variant="outlined"
                                                    size="sm"
                                                    onClick={() => downloadFile(offer.file2, '2')}
                                                    disabled={downloading[`${offer.file2}-2`]}
                                                    className="flex items-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 py-1 px-2 text-xs"
                                                >
                                                    {downloading[`${offer.file2}-2`] ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                            <span>Yuklanmoqda...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {getFileExtension(offer.file2) === 'pdf' ? (
                                                                <File className="w-3.5 h-3.5 text-red-500" />
                                                            ) : (
                                                                <File className="w-3.5 h-3.5 text-blue-500" />
                                                            )}
                                                            <span className="truncate max-w-[120px]">
                                                                {offer.file2.split('.').pop()?.toUpperCase()} fayl
                                                            </span>
                                                            <Download className="w-3.5 h-3.5" />
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )
                    })
                ) : (
                    // Пустое состояние
                    <Card className="p-8">
                        <div className="text-center">
                            <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <Typography variant="h6" color="gray" className="font-normal">
                                Buyurtmalar topilmadi
                            </Typography>
                            <Typography variant="small" color="gray" className="mt-1">
                                Sizda hali buyurtmalar mavjud emas
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* Пагинация */}
                {!loading && offers.length > 0 && pagination.total_pages > 1 && (
                    <div className="mt-6 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrev}
                            className="border-gray-300 flex items-center gap-1 py-1 px-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs">Oldingi</span>
                        </Button>
                        <Typography variant="small" color="gray" className="text-xs">
                            {pagination.page} / {pagination.total_pages}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNext}
                            className="border-gray-300 flex items-center gap-1 py-1 px-2"
                        >
                            <span className="text-xs">Keyingi</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}