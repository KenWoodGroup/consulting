import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { Trash } from "lucide-react";
import { apiUser } from "../../../../utils/Controllers/User";
import { Alert } from "../../../../utils/Alert";

export default function Delete({ id, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleOpen = () => setOpen(!open);

    const DeleteAdmin = async () => {
        try {
            setLoading(true);
            await apiUser?.DeleteUser(id);
            toggleOpen();
            if (refresh) refresh();
            Alert("Muvaffaqiyatli", "success");
        } catch (error) {
            console.log(error);
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
            {/* Кнопка с мусоркой */}
            <Button color="red" className="p-2" onClick={toggleOpen}>
                <Trash size={16} />
            </Button>

            {/* Модалка */}
            <Dialog open={open} handler={toggleOpen} size="sm">
                <DialogHeader>O‘chirilsinmi?</DialogHeader>
                <DialogBody divider>
                    Siz rostdan ham ushbu adminni o‘chirmoqchimisiz?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={toggleOpen}
                        className="mr-2"
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        onClick={DeleteAdmin}
                        disabled={loading}
                    >
                        {loading ? "Yuklanmoqda..." : "O‘chirish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}