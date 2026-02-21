import { $api } from "../Headers"

class apiUser {
    // Get
    static CreateUser = async (data) => {
        const response = await $api.post(`/user`, data);
        return response;
    }
    static GetUser = async (data) => {
        const response = await $api.get(`/user/page?role=${data?.role}&page=${data?.page}`);
        return response;
    }
    static DeleteUser = async (id) => {
        const response = await $api.delete(`/user/${id}`);
        return response;
    }
    static EditUser = async (id, data) => {
        const response = await $api.put(`/user/${id}`, data);
        return response;
    }

}

export { apiUser }