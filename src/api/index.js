import axios from "axios";
import { API_ROOT } from "../util/constants";

export const fetchStaffsPaginationAPI = async (page, limit) => {


    const response = await axios.get(`${API_ROOT}/staffs`, {
        params: {
            page: page,
            limit: limit
        }
    })

    return response.data;
};

export const fetchStaffsFilterAPI = async (page, limit, filterValue) => {


    const response = await axios.get(`${API_ROOT}/staffs/filter`, {
        params: {
            page: page,
            limit: limit,
            name: filterValue.name,
            department: filterValue.department,
            // position: position
        }
    })
    return response.data;
};

export const fetchDepartmentsAPI = async () => {
    const response = await axios.get(`${API_ROOT}/departments`)
    return response.data;
};



