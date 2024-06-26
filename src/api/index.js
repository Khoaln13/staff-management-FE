import axios from "axios";
import { API_ROOT } from "../util/constants";
import { parse, format } from 'date-fns';

//===================================================account API => auth
export const createAccount = async (newAccount, accessToken, axiosJWT) => {

    const response = await axiosJWT.post(`${API_ROOT}/auth/register`, { newAccount }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};
//==================================================staff API
export const createStaff = async (newAccount, newStaff, newPositionHistory, newBasicSalary, accessToken, axiosJWT) => {

    // Chuyển đổi trường dateOfBirth từ chuỗi sang kiểu Date
    newStaff.dateOfBirth = parse(newStaff.dateOfBirth, 'dd/MM/yyyy', new Date());

    const response = await axiosJWT.post(`${API_ROOT}/staffs/create`, { newAccount, newStaff, newPositionHistory, newBasicSalary }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

export const fetchStaffsPaginationAPI = async (page, limit, accessToken, axiosJWT) => {

    const response = await axiosJWT.get(`${API_ROOT}/staffs/paginate`, {
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

export const fetchStaffsAPI = async (accessToken, axiosJWT) => {

    const response = await axiosJWT.get(`${API_ROOT}/staffs`, {
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

    const response = await axiosJWT.put(`${API_ROOT}/staffs/info/${staffId}`, { updatedStaffInfo }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

export const updateStaffWork = async (editedStaffWork, staffId, accessToken, axiosJWT) => {
    const updatedStaffWork = {
        ...editedStaffWork,
        department_id: editedStaffWork.department_id._id,
        position_id: editedStaffWork.position_id._id,
    };

    const response = await axiosJWT.put(`${API_ROOT}/staffs/work/${staffId}`, { updatedStaffWork }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};
// =================================================Position_history API
export const fetchWorkHistoryByEmployeeId = async (staffId) => {

    const response = await axios.get(`${API_ROOT}/position-histories/${staffId}`);
    const workHistoryData = response.data;

    // Xử lý ngày thành chuỗi "dd/mm/yyyy"
    const formattedWorkHistory = workHistoryData.map(history => ({
        ...history,
        start_date: format(new Date(history.start_date), 'dd/MM/yyyy'),
        end_date: history.end_date ? format(new Date(history.end_date), 'dd/MM/yyyy') : null,
    }));

    return formattedWorkHistory;

}
// ===========================================================Department API
export const fetchDepartmentsAPI = async () => {
    const response = await axios.get(`${API_ROOT}/departments`)
    return response.data;
};
// ==========================================================Timesheet API
export const fetchTimesheetByEmployeeId = async (staffId, accessToken, axiosJWT) => {


    const response = await axiosJWT.get(`${API_ROOT}/timesheets/staff/${staffId}`, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        }
    }
    );
    const timesheets = response.data;
    return timesheets;

}
export const createTimesheets = async (newTimesheet, accessToken, axiosJWT) => {


    const response = await axiosJWT.post(`${API_ROOT}/timesheets/`, { newTimesheet }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

export const updateTimesheet = async (editedTimesheet, timesheetId, accessToken, axiosJWT) => {


    const response = await axiosJWT.put(`${API_ROOT}/timesheets/${timesheetId}`, { editedTimesheet }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

export const updateTimesheetCheckout = async (endTime, timesheetId, accessToken, axiosJWT) => {


    const response = await axiosJWT.put(`${API_ROOT}/timesheets/checkout/${timesheetId}`, { endTime }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

//=================================================================holidays API

export const createHoliday = async (employeeId, holiday, accessToken, axiosJWT) => {
    const response = await axiosJWT.post(`${API_ROOT}/holidays/${employeeId}`, holiday, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });

    return response.data;
};

export const getHolidaysByEmployeeId = async (employeeId, accessToken, axiosJWT) => {
    const response = await axiosJWT.get(`${API_ROOT}/holidays/${employeeId}`, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });
    return response.data;
};

export const getHolidaysRequest = async (accessToken, axiosJWT) => {
    const response = await axiosJWT.get(`${API_ROOT}/holidays/pending/`, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });
    return response.data;
};
export const updateHolidayStatus = async (holidayId, status, accessToken, axiosJWT) => {
    const response = await axiosJWT.put(`${API_ROOT}/holidays/${holidayId}/status`, { status }, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });
    return response.data;
};
export const updateHolidayInfo = async (holidayId, statusInfo, accessToken, axiosJWT) => {
    const response = await axiosJWT.put(`${API_ROOT}/holidays/${holidayId}/update`, statusInfo, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });
    return response.data;
};

export const deleteHoliday = async (holidayId, accesstoken, axiosJWT) => {
    try {
        const response = await axiosJWT.delete(`${API_ROOT}/holidays/${holidayId}`, {
            withCredentials: true,
            headers: {
                token: `Bearer ${accesstoken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting holiday:', error);
        throw error;
    }
};
//============================================salary API
export const getPayrollsByEmployeeId = async (employeeId, accessToken, axiosJWT) => {
    const response = await axiosJWT.get(`${API_ROOT}/payrolls/employee/${employeeId}`, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });
    return response.data;
};

export const getPayrollDetailsWithTime = async (employeeId, month, year, accessToken, axiosJWT) => {
    const response = await axiosJWT.get(`${API_ROOT}/payrolls/time/employee/`, {
        params: {
            employee_id: employeeId,
            month: month,
            year: year,

        },
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });
    return response.data;
};
export const createBonusMultiEmployees = async (employee_ids, data, accessToken, axiosJWT) => {
    const response = await axiosJWT.post(`${API_ROOT}/bonuses/multi-create`, { employee_ids, data }, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });

    return response.data;
};
export const createDeDuctionMultiEmployees = async (employee_ids, data, accessToken, axiosJWT) => {
    const response = await axiosJWT.post(`${API_ROOT}/deductions/multi-create`, { employee_ids, data }, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });

    return response.data;
};
export const createAllowanceMultiEmployees = async (employee_ids, data, accessToken, axiosJWT) => {
    const response = await axiosJWT.post(`${API_ROOT}/allowances/multi-create`, { employee_ids, data }, {
        withCredentials: true,
        headers: { token: `Bearer ${accessToken}` }
    });

    return response.data;
};

export const updateBonus = async (id, dataBody, accessToken, axiosJWT) => {


    const response = await axiosJWT.put(`${API_ROOT}/bonuses/${id}`, { dataBody }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

export const updateAllowance = async (id, dataBody, accessToken, axiosJWT) => {


    const response = await axiosJWT.put(`${API_ROOT}/allowances/${id}`, { dataBody }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};
export const updateDeduction = async (id, dataBody, accessToken, axiosJWT) => {


    const response = await axiosJWT.put(`${API_ROOT}/deductions/${id}`, { dataBody }, {
        withCredentials: true,
        headers: {
            token: `Bearer ${accessToken}`
        },
    })

    return response.data;
};

export const deleteBonus = async (id, accesstoken, axiosJWT) => {
    try {
        const response = await axiosJWT.delete(`${API_ROOT}/bonuses/${id}`, {
            withCredentials: true,
            headers: {
                token: `Bearer ${accesstoken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting bonus:', error);
        throw error;
    }
};
export const deleteAllowance = async (id, accesstoken, axiosJWT) => {
    try {
        const response = await axiosJWT.delete(`${API_ROOT}/allowances/${id}`, {
            withCredentials: true,
            headers: {
                token: `Bearer ${accesstoken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting allowance:', error);
        throw error;
    }
};

export const deleteDeduction = async (id, accesstoken, axiosJWT) => {
    try {
        const response = await axiosJWT.delete(`${API_ROOT}/deductions/${id}`, {
            withCredentials: true,
            headers: {
                token: `Bearer ${accesstoken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting deduction:', error);
        throw error;
    }
};

//========================================================
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
