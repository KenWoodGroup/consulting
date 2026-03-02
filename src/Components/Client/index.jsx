import { useEffect, useState, useRef } from "react";
import {
    Card,
    Typography,
    Button,
} from "@material-tailwind/react";
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
    Check,
    AlertCircle,
    FileCheck,
    FileSearch,
    MapPin,
    FileEdit,
    FileSignature,
    CheckCheck,
    X,
    Eye,
} from "lucide-react";
import { format } from "date-fns";
import { apiOffers } from "../../utils/Controllers/Offers";
import { ru } from "date-fns/locale";

export default function Client() {
    const [offers, setOffers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total_pages: 1,
        total_count: 0,
        hasNext: false,
        hasPrev: false,
    });
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState({});
    const [expandedNote, setExpandedNote] = useState(null);
    const scrollRef = useRef(null);

    const API_BASE_URL = "https://api.usderp.uz/consulting";

    // Статусы с иконками и цветами
    const statusSteps = [
        {
            key: "pending",
            label: "Yangi",
            icon: Clock,
            color: "gray",
            bgColor: "bg-gray-100",
            textColor: "text-gray-700",
            iconColor: "text-gray-500"
        },
        {
            key: "step_1",
            label: "Hujjatlar tekshirilmoqda",
            icon: FileSearch,
            color: "yellow",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-700",
            iconColor: "text-yellow-600"
        },
        {
            key: "step_2",
            label: "Yer ekspertizasi",
            icon: MapPin,
            color: "blue",
            bgColor: "bg-blue-100",
            textColor: "text-blue-700",
            iconColor: "text-blue-600"
        },
        {
            key: "step_3",
            label: "Loyiha ko‘rib chiqilmoqda",
            icon: FileEdit,
            color: "indigo",
            bgColor: "bg-indigo-100",
            textColor: "text-indigo-700",
            iconColor: "text-indigo-600"
        },
        {
            key: "step_4",
            label: "Tasdiqlash jarayoni",
            icon: FileSignature,
            color: "purple",
            bgColor: "bg-purple-100",
            textColor: "text-purple-700",
            iconColor: "text-purple-600"
        },
        {
            key: "step_5",
            label: "Ruxsatnoma tayyorlanmoqda",
            icon: FileCheck,
            color: "teal",
            bgColor: "bg-teal-100",
            textColor: "text-teal-700",
            iconColor: "text-teal-600"
        },
        {
            key: "done",
            label: "Bajarildi",
            icon: CheckCheck,
            color: "green",
            bgColor: "bg-green-100",
            textColor: "text-green-700",
            iconColor: "text-green-600"
        },
        {
            key: "cancelled",
            label: "Bekor qilingan",
            icon: XCircle,
            color: "red",
            bgColor: "bg-red-100",
            textColor: "text-red-700",
            iconColor: "text-red-600"
        },
    ];

    const GetMyOffers = async (page = 1) => {
        try {
            setLoading(true);
            const userData = JSON.parse(localStorage.getItem("user"));
            const response = await apiOffers.GetUserId({ userId: userData.id, page });
            if (response.data) {
                setOffers(response.data.data?.records || []);
                setPagination(response.data.data?.pagination || pagination);
            }
        } catch (error) {
            console.log(error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetMyOffers(1);
    }, []);

    const handlePageChange = (newPage) => {
        GetMyOffers(newPage);
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return {
                full: format(date, "dd.MM.yyyy HH:mm"),
                time: format(date, "HH:mm"),
                date: format(date, "dd.MM.yyyy"),
                relative: format(date, "dd MMM", { locale: ru }),
                timeAgo: formatDistanceToNow(date, { addSuffix: true, locale: ru })
            };
        } catch {
            return { full: dateString, time: dateString, date: dateString, relative: dateString };
        }
    };

    const downloadFile = async (filePath, fileNumber) => {
        if (!filePath) return;
        const fileId = `${filePath}-${fileNumber}`;
        setDownloading((prev) => ({ ...prev, [fileId]: true }));

        try {
            const fileName = filePath.split('/').pop() || 'file';
            const fileUrl = `${API_BASE_URL}/${filePath}`;
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Faylni yuklashda xatolik:", error);
            try {
                window.open(`${API_BASE_URL}/${filePath}`, "_blank");
            } catch (e) {
                alert("Faylni yuklashda xatolik yuz berdi");
            }
        } finally {
            setDownloading((prev) => ({ ...prev, [fileId]: false }));
        }
    };

    const getCurrentStatusInfo = (status) => {
        return statusSteps.find(s => s.key === status) || statusSteps[0];
    };

    const StatusBadge = ({ status }) => {
        const statusInfo = getCurrentStatusInfo(status);
        const Icon = statusInfo.icon;

        return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusInfo.bgColor}`}>
                <Icon className={`w-3.5 h-3.5 ${statusInfo.iconColor}`} />
                <span className={`text-[10px] font-medium ${statusInfo.textColor}`}>
                    {statusInfo.label}
                </span>
            </div>
        );
    };

    const ProgressSteps = ({ status }) => {
        const currentStep = statusSteps.findIndex(s => s.key === status);

        if (status === "cancelled") {
            return (
                <div className="w-full mt-4">
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                            <span className="text-xs font-medium text-red-700">Buyurtma bekor qilingan</span>
                            <p className="text-[10px] text-red-600 mt-0.5">Qayta buyurtma berishingiz mumkin</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full mt-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${currentStep >= 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-[10px] font-medium text-gray-500">
                        {currentStep + 1} / {statusSteps.length - 1} qadam
                    </span>
                </div>
                <div className="relative">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${(currentStep / (statusSteps.length - 2)) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        {statusSteps.slice(0, -1).map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index <= currentStep;
                            const isCurrent = index === currentStep;

                            return (
                                <div key={step.key} className="flex flex-col items-center relative">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                        ${isActive ? 'bg-blue-500 shadow-lg shadow-blue-200' : 'bg-gray-100'}
                                        ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                                    `}>
                                        {isActive ? (
                                            <Check className="w-4 h-4 text-white" />
                                        ) : (
                                            <Icon className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                    <span className={`
                                        text-[8px] mt-1.5 text-center max-w-[60px] font-medium
                                        ${isActive ? 'text-gray-700' : 'text-gray-400'}
                                    `}>
                                        {step.label.split(' ')[0]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const FileAttachment = ({ file, index, offerId }) => {
        const fileId = `${offerId}-${index}`;
        const isDownloading = downloading[`${file}-${index + 1}`];
        const fileExt = file?.split('.').pop()?.toUpperCase() || 'FILE';

        return (
            <button
                onClick={() => downloadFile(file, index + 1)}
                disabled={isDownloading}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <File className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">
                            {index === 0 ? 'Asosiy hujjat' : 'Qo\'shimcha hujjat'}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                            {fileExt} • {Math.floor(Math.random() * 1000 + 100)} KB
                        </p>
                    </div>
                </div>
                {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                    <Download className="w-4 h-4 text-gray-400" />
                )}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]" ref={scrollRef}>
            {/* Шапка */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <Typography variant="h6" className="font-bold text-gray-900 text-sm">
                                Mening buyurtmalarim
                            </Typography>
                            <Typography variant="small" className="text-[10px] text-gray-500">
                                {pagination.total_count} ta buyurtma
                            </Typography>
                        </div>
                    </div>
                    {pagination.total_count > 0 && (
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-3 py-1.5 rounded-xl shadow-sm">
                            <span className="text-xs font-bold text-white">
                                +{pagination.total_count}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Контент */}
            <div className="px-3 py-3">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                                <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : offers.length > 0 ? (
                    <div className="space-y-3">
                        {offers.map((offer) => {
                            const date = formatDate(offer.createdAt);
                            const statusInfo = getCurrentStatusInfo(offer.status);

                            return (
                                <Card key={offer.id} className="border-0 shadow-sm rounded-2xl overflow-hidden">
                                    {/* Заголовок заказа */}
                                    <div className="px-4 pt-4 pb-2 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-xs font-bold text-gray-600">
                                                        #{offer.id.slice(0, 4)}
                                                    </span>
                                                </div>
                                                <StatusBadge status={offer.status} />
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg">
                                                <Calendar className="w-3 h-3 text-gray-500" />
                                                <span className="text-[9px] font-medium text-gray-600">
                                                    {date.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Прогресс */}
                                    <div className="px-4 py-3 bg-gradient-to-b from-white to-gray-50/50">
                                        <ProgressSteps status={offer.status} />
                                    </div>

                                    {/* Заметка */}
                                    {offer.note && (
                                        <div className="mx-4 mb-3">
                                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-[10px] font-medium text-amber-700 mb-1">
                                                            Izoh
                                                        </p>
                                                        <Typography variant="small" className="text-gray-600 text-[11px] leading-relaxed">
                                                            {offer.note.length > 100 ? (
                                                                <>
                                                                    {expandedNote === offer.id ? offer.note : `${offer.note.slice(0, 100)}...`}
                                                                    <button
                                                                        onClick={() => setExpandedNote(expandedNote === offer.id ? null : offer.id)}
                                                                        className="text-amber-600 font-medium ml-1 text-[10px]"
                                                                    >
                                                                        {expandedNote === offer.id ? 'Yopish' : 'To\'liq'}
                                                                    </button>
                                                                </>
                                                            ) : offer.note}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Файлы */}
                                    {(offer.file1 || offer.file2) && (
                                        <div className="px-4 pb-4 space-y-2">
                                            <p className="text-[10px] font-medium text-gray-500 mb-2">
                                                Biriktirilgan fayllar
                                            </p>
                                            <div className="space-y-2">
                                                {[offer.file1, offer.file2].map((file, idx) =>
                                                    file ? (
                                                        <FileAttachment
                                                            key={idx}
                                                            file={file}
                                                            index={idx}
                                                            offerId={offer.id}
                                                        />
                                                    ) : null
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Дополнительная информация */}
                                    <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-[9px] text-gray-500">
                                                    {date.time}
                                                </span>
                                            </div>
                                            {offer.updatedAt && offer.updatedAt !== offer.createdAt && (
                                                <span className="text-[9px] text-gray-400">
                                                    Yangilangan: {formatDate(offer.updatedAt).date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <Typography variant="h6" className="font-bold text-gray-900 text-base mb-1">
                            Buyurtmalar topilmadi
                        </Typography>
                        <Typography variant="small" className="text-gray-500 text-xs">
                            Sizda hali buyurtmalar mavjud emas
                        </Typography>
                    </div>
                )}

                {/* Пагинация */}
                {!loading && offers.length > 0 && pagination.total_pages > 1 && (
                    <div className="mt-4 bg-white rounded-xl p-2 shadow-sm">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="text"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrev}
                                className="flex items-center gap-1 px-3 py-2 text-xs disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Oldingi</span>
                            </Button>

                            <div className="flex items-center gap-1">
                                {[...Array(Math.min(3, pagination.total_pages))].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`
                                                w-7 h-7 rounded-lg text-xs font-medium transition-all
                                                ${pagination.page === pageNum
                                                    ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }
                                            `}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {pagination.total_pages > 3 && (
                                    <>
                                        <span className="text-xs text-gray-400">...</span>
                                        <button
                                            onClick={() => handlePageChange(pagination.total_pages)}
                                            className="w-7 h-7 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
                                        >
                                            {pagination.total_pages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <Button
                                variant="text"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNext}
                                className="flex items-center gap-1 px-3 py-2 text-xs disabled:opacity-50"
                            >
                                <span>Keyingi</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}