import Customer from "../Components/Admin/Customers";
import Order from "../Components/Admin/Order";

export const AdminRoutes = [
    {
        name: 'Home',
        path: '/admin/order',
        component: <Order />
    },
    {
        name: 'Customer',
        path: '/admin/customer',
        component: <Customer />
    },

]