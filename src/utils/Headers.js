import axios from "axios";

export const BASE_URL = "https://api.usderp.uz/consulting";

export const $api = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* ===============================
   GLOBAL REFRESH STATE
================================ */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/* ===============================
   REQUEST INTERCEPTOR
================================ */
$api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            // Если уже обновляем токен — добавляем в очередь
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = 'Bearer ' + token;
                            resolve($api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const userId = localStorage.getItem('user_id');

                if (!refreshToken || !userId) {
                    throw new Error('Refresh token yoki user ID yo‘q');
                }

                const { data } = await axios.post(
                    `${BASE_URL}/api/auth/refresh`,
                    { refreshToken, userId }
                );

                const newAccessToken = data.access_token;
                const newRefreshToken = data.refresh_token;

                localStorage.setItem('access_token', newAccessToken);
                localStorage.setItem('refresh_token', newRefreshToken);

                $api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

                // Continue CRUDs in process queue
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return $api(originalRequest);

            } catch (err) {
                // 🔴 Refresh failed → logout
                processQueue(err, null);

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('user');

                window.location.href = '/login';

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }

        }

        return Promise.reject(error);
    }
);