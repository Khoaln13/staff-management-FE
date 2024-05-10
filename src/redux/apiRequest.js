import axios from "axios";
import { loginFailed, loginStart, loginSuccess, registerStart, registerSuccess, registerFailed, logoutStart, logoutSuccess, logoutFailed } from "./authSlice";
import { API_ROOT } from "../util/constants";

export const loginAccount = async (account, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${API_ROOT}/auth/login`, account,
            { withCredentials: true });
        dispatch(loginSuccess(res.data));
        navigate("/")
    } catch (error) {
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