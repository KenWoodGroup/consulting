import { $api } from "../Headers"

class apiOffers {
    // Get
    static Get = async (data) => {
        const response = await $api.get(`/offers/page?status=${data?.status}&page=${data?.page}&limit=20`);
        return response;
    }
    static GetUserId = async (data) => {
        const response = await $api.get(`/offers/user?userId=${data?.userId}&page=${data?.page}&limit=20`);
        return response;
    }
    static Edit = async (id, data) => {
        const response = await $api.put(`/offers/status/${id}`, data);
        return response;
    }

}

export { apiOffers }