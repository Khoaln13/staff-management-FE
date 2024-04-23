import axios from "axios";
import { API_ROOT } from "../util/constants";
import { format } from 'date-fns';

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

export const fetchStaffInfoAPI = async (staffId) => {
    const response = await axios.get(`${API_ROOT}/staffs/${staffId}`);
    const staff = response.data;

    // Xử lý ngày thành chuỗi "dd/mm/yyyy"
    const formattedData = {
        ...staff,
        dateOfBirth: format(new Date(staff.dateOfBirth), 'dd/MM/yyyy')
    }

    return formattedData;
};

export const fetchWorkHistoryByEmployeeId = async (staffId) => {

    const response = await axios.get(`${API_ROOT}/position-histories/${staffId}`);
    const workHistoryData = response.data;

    // Xử lý ngày thành chuỗi "dd/mm/yyyy"
    const formattedWorkHistory = workHistoryData.map(history => ({
        ...history,
        start_date: format(new Date(history.start_date), 'dd/MM/yyyy'),
        end_date: history.end_date ? format(new Date(history.end_date), 'dd/MM/yyyy') : 'Đang tiến hành',
    }));

    return formattedWorkHistory;

}

