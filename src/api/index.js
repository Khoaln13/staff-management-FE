import axios from "axios";
import { API_ROOT } from "../util/constants";
import { parse, format } from 'date-fns';


export const fetchStaffsPaginationAPI = async (page, limit, accessToken, axiosJWT) => {


    const response = await axiosJWT.get(`${API_ROOT}/staffs`, {
        params: {
            page: page,
            limit: limit
        },
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        }
    })

    return response.data;
};

export const fetchStaffsFilterAPI = async (page, limit, filterValue, accessToken, axiosJWT) => {


    const response = await axiosJWT.get(`${API_ROOT}/staffs/filter`, {
        params: {
            page: page,
            limit: limit,
            name: filterValue.name,
            department: filterValue.department,
            // position: position
        },
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return response.data;
};

export const fetchDepartmentsAPI = async () => {
    const response = await axios.get(`${API_ROOT}/departments`)
    return response.data;
};

export const fetchStaffInfoAPI = async (staffId, accessToken, axiosJWT) => {
    const response = await axiosJWT.get(`${API_ROOT}/staffs/${staffId}`, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        }
    }
    );
    const staff = response.data;

    // Xử lý ngày thành chuỗi "dd/mm/yyyy"
    const formattedData = {
        ...staff,
        dateOfBirth: format(new Date(staff.dateOfBirth), 'dd/MM/yyyy')
    }

    return formattedData;
};
//get staff with full ìnomation
export const fetchStaffFullInfoAPI = async (staffId, accessToken, axiosJWT) => {
    const response = await axiosJWT.get(`${API_ROOT}/staffs/info/${staffId}`, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        }
    }
    );
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
export const updateStaff = async (editedStaffInfo, staffId, accessToken, axiosJWT) => {
    // Loại bỏ các trường không cần thiết và chỉ giữ lại giá trị _id
    const updatedStaffInfo = {
        ...editedStaffInfo,
        department_id: editedStaffInfo.department_id._id,
        position_id: editedStaffInfo.position_id._id,
        account_id: editedStaffInfo.account_id._id,
        role_id: editedStaffInfo.role_id._id
    };
    delete updatedStaffInfo._id;
    // Chuyển đổi trường dateOfBirth từ chuỗi sang kiểu Date
    updatedStaffInfo.dateOfBirth = parse(editedStaffInfo.dateOfBirth, 'dd/MM/yyyy', new Date());

    const response = await axiosJWT.put(`${API_ROOT}/staffs/${staffId}`, { updatedStaffInfo }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

export const refreshToken = async () => {
    try {
        const res = await axios.post(`${API_ROOT}/auth/refresh`, {}, {
            withCredentials: true,

        });

        return res.data
    } catch (error) {
        console.log(error);
    }
}
