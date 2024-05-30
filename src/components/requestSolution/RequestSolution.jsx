import { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAxios } from "../../redux/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { getHolidaysRequest } from "../../api";
import AdminHolidayList from "./AdminHolidayList";
import StaffCreateForm from "../Forms/staffCreateForm";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
} from '@mui/material';

export const AdminTaskContext = createContext();

const functionsList = [
    {
        name: 'Xử lý yêu cầu nghỉ phép',
        component: AdminHolidayList
    },
    {
        name: 'Cấp tài khoản nhân viên',
        component: StaffCreateForm
    }
    // Thêm các chức năng khác nếu cần
];

function Menu({ setSelectedComponent }) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', top: '72px' },
            }}
        >
            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {functionsList.map((func, index) => (
                        <ListItem button key={index} onClick={() => setSelectedComponent(index)}>
                            <ListItemText primary={func.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

function RequestSolution() {
    const [holidays, setHolidays] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(0);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        const fetchHolidays = async () => {
            const data = await getHolidaysRequest(user.accessToken, axiosJWT);
            setHolidays(data);
        };
        fetchHolidays();
    }, [user]);

    const SelectedComponent = functionsList[selectedComponent].component;

    return (
        <AdminTaskContext.Provider value={{ holidays, setHolidays }}>


            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 30, mt: 8 }}>
                <Menu setSelectedComponent={setSelectedComponent} />
                <SelectedComponent />
            </Box>
        </AdminTaskContext.Provider>
    );
}

export default RequestSolution;
