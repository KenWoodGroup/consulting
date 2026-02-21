import { useState, useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import { apiUser } from "../../../../utils/Controllers/User";
import { Alert } from "../../../../utils/Alert";
import { Pen } from "lucide-react";

export default function Edit({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "+998",
    });

    // При открытии модалки заполняем форму данными пользователя
    useEffect(() => {
        if (data) {
            setFormData({
                full_name: data.full_name || "",
                phone: data.phone || "+998",
            });
        }
    }, [data]);

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Если password пустой — не отправляем его
            const payload = { ...formData };
            if (!payload.password) delete payload.password;

            await apiUser.EditUser(data.id, payload);
            handleOpen(); // закрываем модалку
            Alert("Muvaffaqiyatli yangilandi", "success");
            if (refresh) refresh(); // обновляем таблицу
        } catch (error) {
            console.log("Adminni yangilashda xatolik:", error);
            Alert(
                error?.response?.data?.message ||
                error.message ||
                "Xatolik yuz berdi",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button className="p-2" color="yellow" onClick={handleOpen}>
                <Pen color="white" size={16} />
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Admin ma'lumotlarini tahrirlash</DialogHeader>

                <DialogBody divider className="flex flex-col gap-4">
                    <Input
                        label="To'liq ism"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <Input
                        label="Telefon (+998...)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </DialogBody>

                <DialogFooter className="space-x-2">
                    <Button variant="text" color="red" onClick={handleOpen} disabled={loading}>
                        Bekor qilish
                    </Button>
                    <Button color="green" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Yangilanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}