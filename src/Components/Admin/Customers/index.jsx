import { useEffect, useState } from "react"
import {
    Card,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Badge
} from "@material-tailwind/react"
import {
    UserIcon,
    PhoneIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    IdentificationIcon,
    ClockIcon,
    UsersIcon
} from "@heroicons/react/24/outline"
import { format } from "date-fns"
import { apiUser } from "../../../utils/Controllers/User"

export default function Customer() {
    const [customers, setCustomers] = useState([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total_pages: 1,
        total_count: 0
    })
    const [loading, setLoading] = useState(false)

    const GetAllCustomer = async (page = 1) => {
        try {
            setLoading(true)
            const response = await apiUser.GetUser({ role: 'customer', page })
            if (response.data) {
                setCustomers(response.data.data?.records || [])
                setPagination(response.data.data?.pagination || {
                    currentPage: 1,
                    total_pages: 1,
                    total_count: 0
                })
            }
        } catch (error) {
            console.log(error)
            setCustomers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetAllCustomer(1)
    }, [])

    const handlePageChange = (newPage) => {
        GetAllCustomer(newPage)
    }

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd.MM.yyyy HH:mm")
        } catch {
            return dateString
        }
    }

    const maskPhone = (phone) => {
        if (!phone) return ""
        const cleaned = phone.replace(/\D/g, '')
        const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/)
        if (match) {
            return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`
        }
        return phone
    }

    return (
        <div className="">
            {/* Заголовок */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <Typography variant="h3" color="blue-gray" className="font-bold">
                        Mijozlar
                    </Typography>
                    <Typography variant="paragraph" color="gray" className="mt-2">
                        Barcha mijozlar ro'yxati
                    </Typography>
                </div>
                <Badge content={pagination.total_count} color="blue">
                    <Button
                        variant="outlined"
                        className="flex items-center gap-2 border-gray-300"
                    >
                        <UsersIcon className="w-4 h-4" />
                        Jami mijozlar
                    </Button>
                </Badge>
            </div>

            {/* Сетка клиентов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    // Скелетон загрузки
                    [...Array(6)].map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : customers.length > 0 ? (
                    customers.map((customer) => (
                        <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                {/* Иконка вместо аватара */}
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-6 h-6 text-blue-600" />
                                </div>

                                {/* Информация о клиенте */}
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <Typography variant="h6" color="blue-gray" className="font-bold">
                                            {customer.full_name}
                                        </Typography>
                                        
                                    </div>

                                    <div className="space-y-1">
                                        {/* Телефон */}
                                        <Tooltip content="Telefon raqam">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <PhoneIcon className="w-4 h-4" />
                                                <Typography variant="small">
                                                    <a href={`tel:${customer.phone}`} className="hover:text-blue-600">
                                                        {maskPhone(customer.phone)}
                                                    </a>
                                                </Typography>
                                            </div>
                                        </Tooltip>


                                        {/* Дата регистрации */}
                                        <Tooltip content="Ro'yxatdan o'tgan vaqt">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <CalendarIcon className="w-4 h-4" />
                                                <Typography variant="small">
                                                    {formatDate(customer.createdAt)}
                                                </Typography>
                                            </div>
                                        </Tooltip>

                                        {/* Последнее обновление */}
                                        {customer.updatedAt !== customer.createdAt && (
                                            <Tooltip content="Oxirgi yangilanish">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <ClockIcon className="w-4 h-4" />
                                                    <Typography variant="small">
                                                        {formatDate(customer.updatedAt)}
                                                    </Typography>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    // Пустое состояние
                    <Card className="p-12 col-span-full">
                        <div className="text-center">
                            <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <Typography variant="h6" color="gray" className="font-normal">
                                Mijozlar topilmadi
                            </Typography>
                            <Typography variant="small" color="gray" className="mt-2">
                                Hozircha tizimda mijozlar mavjud emas
                            </Typography>
                        </div>
                    </Card>
                )}
            </div>

            {/* Пагинация */}
            {!loading && customers.length > 0 && (
                <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                    <Typography variant="small" color="gray">
                        Jami: {pagination.total_count} ta mijoz
                    </Typography>
                    <div className="flex items-center gap-2">
                        <IconButton
                            variant="outlined"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage <= 1}
                            className="border-gray-300"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </IconButton>
                        <Typography variant="small" color="gray" className="px-4">
                            Sahifa {pagination.currentPage} / {pagination.total_pages}
                        </Typography>
                        <IconButton
                            variant="outlined"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.total_pages}
                            className="border-gray-300"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </IconButton>
                    </div>
                </div>
            )}
        </div>
    )
}