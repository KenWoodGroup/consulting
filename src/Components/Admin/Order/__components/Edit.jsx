import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Option, Select } from "@material-tailwind/react";
import { Pen } from "lucide-react";
import { useState } from "react";
import { apiOffers } from "../../../../utils/Controllers/Offers";
import { Alert } from "../../../../utils/Alert";

export default function Edit({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(data?.status || "pending");
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const statusOptions = [
        { value: "pending", label: "Kutilmoqda", color: "yellow" },
        { value: "process", label: "Jarayonda", color: "blue" },
        { value: "done", label: "Bajarildi", color: "green" },
        { value: "cancelled", label: "Bekor qilingan", color: "red" },
    ];

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Здесь ваш API запрос для обновления статуса
            const response = await apiOffers.Edit(data.id, { status: selectedStatus });

            // Имитация запроса
            await new Promise(resolve => setTimeout(resolve, 1000));
            Alert("Muvaffaqiyatli", "success");
            // Обновляем список заказов
            if (refresh) {
                refresh();
            }

            // Закрываем модалку
            handleOpen();
        } catch (error) {
            console.error("Statusni o'zgartirishda xatolik:", error);
            Alert("Xato", "error");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "text-yellow-600 bg-yellow-50";
            case "process": return "text-blue-600 bg-blue-50";
            case "done": return "text-green-600 bg-green-50";
            case "cancelled": return "text-red-600 bg-red-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <>
            <Button
                className="p-2"
                color="yellow"
                onClick={handleOpen}
            >
                <Pen size={16} color="white" />
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader className="flex flex-col items-start gap-1">
                    <span>Statusni o'zgartirish</span>
                    <span className="text-sm font-normal text-gray-600">
                        Buyurtma ID: {data?.id.slice(0, 8)}...
                    </span>
                </DialogHeader>

                <DialogBody className="space-y-4">
                    {/* Текущий статус */}
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Joriy status:</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data?.status)}`}>
                            {statusOptions.find(s => s.value === data?.status)?.label || data?.status}
                        </div>
                    </div>

                    {/* Выбор нового статуса */}
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Yangi status:</p>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            label="Statusni tanlang"
                            className="w-full"
                        >
                            {statusOptions.map((option) => (
                                <Option
                                    key={option.value}
                                    value={option.value}
                                    className="flex items-center gap-2"
                                >
                                    <span className={`w-2 h-2 rounded-full bg-${option.color}-500`}></span>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outlined"
                        color="gray"
                        onClick={handleOpen}
                        className="border-gray-300"
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        color="blue"
                        onClick={handleSubmit}
                        disabled={loading || selectedStatus === data?.status}
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saqlanmoqda...
                            </>
                        ) : (
                            "Saqlash"
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}