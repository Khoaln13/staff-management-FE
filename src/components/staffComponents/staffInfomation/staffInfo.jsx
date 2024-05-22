import { useEffect, useState, createContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditNoteIcon from '@mui/icons-material/EditNote';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffInfoAPI, fetchWorkHistoryByEmployeeId, fetchStaffFullInfoAPI, fetchTimesheetByEmployeeId, getHolidaysByEmployeeId } from '../../../api';
import InfoContent from './infoContent';
import ArrowHeader from '../../appBar/arrowHeader';
import Profile from '../profile';
import Typography from '@mui/material/Typography';
import { createAxios } from '../../../redux/createInstance';
import { loginSuccess } from '../../../redux/authSlice';


const options = [
    { value: 'timesheet', label: 'Chấm công', icon: <EditCalendarIcon /> },
    { value: 'salary', label: 'Bảng lương', icon: <AttachMoneyIcon /> },
    { value: 'holiday', label: 'Nghỉ phép', icon: <PostAddIcon /> },
    { value: 'work_history', label: 'Công việc', icon: <WorkHistoryIcon /> },
    { value: 'edit_profile', label: 'Chỉnh sửa thông tin ', icon: <EditNoteIcon /> },
];

export const userInfoContext = createContext();

function UserInformation() {
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const { id } = useParams(); // Lấy giá trị của tham số id từ URL
    const [staffInfo, setStaffInfo] = useState({});
    const [staffFullInfo, setStaffFullInfo] = useState({});
    const [workHistories, setWorkHistories] = useState([]);
    const [timesheets, setTimesheets] = useState([]);
    const [holidays, setHolidays] = useState([]);

    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        fetchStaffInfoAPI(id, user.accessToken, axiosJWT)
            .then((response) => {
                setStaffInfo(response);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching staff info: ', error);
            });

        fetchStaffFullInfoAPI(id, user.accessToken, axiosJWT)
            .then((response) => {
                setStaffFullInfo(response);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching staff full info: ', error);
            });

        fetchWorkHistoryByEmployeeId(id)
            .then((response) => {
                setWorkHistories(response);
            }).catch((error) => {
                console.error('Error fetching work-history info: ', error);
            });
        fetchTimesheetByEmployeeId(id, user.accessToken, axiosJWT)
            .then((response) => {
                setTimesheets(response);
            }).catch((error) => {
                console.error('Error fetching timesheets : ', error);
            });

        getHolidaysByEmployeeId(id, user.accessToken, axiosJWT)
            .then((response) => {
                setHolidays(response);
            })
            .catch((error) => {
                console.error('Error fetching holidays: ', error);
            });
    }, [id]);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };




    return (
        <userInfoContext.Provider value={{ workHistories, setWorkHistories, staffFullInfo, setStaffFullInfo, timesheets, setTimesheets, holidays, setHolidays }}>
            <ArrowHeader text="Thông tin nhân viên" />
            {loading ? (
                <Typography variant="h5" gutterBottom>
                    Đang lấy dữ liệu nhân viên
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 4 }}>
                    <Paper sx={{ width: '90%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, border: "1px solid" }}>
                        {/* Left section */}
                        <Profile staffInfo={staffInfo} />
                        <Divider orientation="vertical" variant="middle" flexItem light={true} />
                        {/* Right section */}
                        <Box sx={{ px: 4, width: "70%", paddingTop: 4 }}>
                            <Select
                                value={selectedOption}
                                onChange={handleChange}
                                renderValue={(selected) => {
                                    const selectedOption = options.find(option => option.value === selected);
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ListItemIcon sx={{ minWidth: 'unset', marginRight: 1 }}>{selectedOption.icon}</ListItemIcon>
                                            <ListItemText primary={selectedOption.label} />
                                        </Box>
                                    );
                                }}
                                sx={{ width: 250 }}
                            >
                                {options.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                        sx={{ display: 'flex', alignItems: 'center', marginLeft: "4px", borderRadius: "4px" }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 'unset', marginRight: 1 }}>{option.icon}</ListItemIcon>
                                        <ListItemText primary={option.label} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {InfoContent(selectedOption)}
                        </Box>
                    </Paper>
                </Box>
            )}
        </userInfoContext.Provider>
    );
}

export default UserInformation;
