import axios from "axios";
import { loginFailed, loginStart, loginSuccess, registerStart, registerSuccess, registerFailed, logoutStart, logoutSuccess, logoutFailed } from "./authSlice";
import { getDepartmentsStart, getDepartmentsSuccess, getDepartmentsFailed, getPositionsStart, getPositionsSuccess, getPositionsFailed } from './companySlice'
import { API_ROOT } from "../util/constants";
import { format } from "date-fns";

export const loginAccount = async (account, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${API_ROOT}/auth/login`, account,
            { withCredentials: true });
        const staff = res.data;

        // Xử lý ngày thành chuỗi "dd/mm/yyyy"
        const formattedData = {
            ...staff,
            user: {
                ...staff.user,
                dateOfBirth: format(new Date(staff.user.dateOfBirth), 'dd/MM/yyyy')
            }
        };
        dispatch(loginSuccess(formattedData));
        navigate("/")
    } catch (error) {
        console.log(error.message);
        dispatch(loginFailed())
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post(`${API_ROOT}/auth/register`, user);
        dispatch(registerSuccess(res.data));
        navigate("/login")
    } catch (error) {
        dispatch(registerFailed())
    }
};

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post(`${API_ROOT}/auth/logout`, id, {
            withCredentials: true,
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(logoutSuccess());
        navigate("/login")
    } catch (error) {
        console.log(error);
        dispatch(logoutFailed());

    }
}

export const getAllDepartment = async (dispatch) => {
    dispatch(getDepartmentsStart());
    try {
        const res = await axios.get(`${API_ROOT}/departments`);
        dispatch(getDepartmentsSuccess(res.data));
    } catch (error) {
        console.log(error.message);
        dispatch(getDepartmentsFailed())
    }
}

export const getAllPosition = async (dispatch) => {
    dispatch(getPositionsStart());
    try {
        const res = await axios.get(`${API_ROOT}/positions`);
        dispatch(getPositionsSuccess(res.data));
    } catch (error) {
        console.log(error.message);
        dispatch(getPositionsFailed())
    }
}