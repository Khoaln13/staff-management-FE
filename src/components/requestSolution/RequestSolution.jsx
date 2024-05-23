import { createContext } from "react";
import { useEffect, useState } from "react";
import { getHolidaysRequest } from "../../api";
import { useSelector, useDispatch } from "react-redux";
import { createAxios } from "../../redux/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import AdminHolidayList from "./AdminHolidayList";

export const AdminTaskContext = createContext();

function RequestSolution() {

    const [holidays, setHolidays] = useState([]);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    useEffect(() => {
        const fetchHolidays = async () => {
            const data = await getHolidaysRequest(user.accessToken, axiosJWT);
            setHolidays(data);
        };
        fetchHolidays();
    }, []);
    return (
        <AdminTaskContext.Provider value={{ holidays, setHolidays }}>
            <>

                <AdminHolidayList />


            </>
        </AdminTaskContext.Provider>
    )
}
export default RequestSolution