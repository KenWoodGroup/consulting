import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Auth } from "../../utils/Controllers/Auth";
import { Alert } from "../../utils/Alert";

const Login = () => {
  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { data } = await Auth.Login({
        phone,
        password,
      });

      const user = data?.user;
      const tokens = data?.tokens;

      if (!tokens?.access_token || !tokens?.refresh_token) {
        throw new Error("Token topilmadi");
      }

      // ✅ Сохраняем токены
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Проверка ролей
      const allowedRoles = ["super_admin", "admin", "customer"];

      if (!allowedRoles.includes(user?.role)) {
        Alert("Sizga ruxsat yo‘q", "error");
        return;
      }

      Alert("Muvaffaqiyatli", "success");

      if (user.role === "super_admin") {
        navigate("/super-admin/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/order");
      } else if (user.role === "customer") {
        navigate("/client/order");
      }

    } catch (error) {
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Login
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        <div className="space-y-6">

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon raqam
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998901234567"
              className="!border-gray-300 focus:!border-black"
              crossOrigin={undefined}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parol
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Parolni kiriting"
                className="!border-gray-300 focus:!border-black pr-10"
                crossOrigin={undefined}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="h-5 w-5" />
                ) : (
                  <VisibilityIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-white font-semibold py-3 rounded-xl shadow-md hover:bg-gray-800 transition"
          >
            {loading ? "Yuklanmoqda..." : "Kirish"}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Login;