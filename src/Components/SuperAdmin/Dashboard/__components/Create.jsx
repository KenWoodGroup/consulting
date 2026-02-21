import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import { apiUser } from "../../../../utils/Controllers/User";
import { Alert } from "../../../../utils/Alert";

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "+998",
        password: "",
        role: "admin",
    });

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true); // boshlash
        try {
            const response = await apiUser.CreateUser(formData);
            handleOpen(); // modalni yopish
            setFormData({
                full_name: "",
                phone: "",
                password: "",
                role: "admin",
            });
            Alert("Muvaffaqiyatli yaratildi", "success");
            refresh()
        } catch (error) {
            console.log("Admin yaratishda xatolik:", error);
            Alert(
                error?.response?.data?.message ||
                error.message ||
                "Xatolik yuz berdi",
                "error"
            );
        } finally {
            setLoading(false); // tugatish
        }
    };

    return (
        <>
            <Button color="blue" onClick={handleOpen}>
                Yaratish
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Yangi Admin yaratish</DialogHeader>

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
                    <Input
                        label="Parol"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </DialogBody>

                <DialogFooter className="space-x-2">
                    <Button variant="text" color="red" onClick={handleOpen} disabled={loading}>
                        Bekor qilish
                    </Button>
                    <Button color="green" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Yaratilmoqda..." : "Yaratish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}