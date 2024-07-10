import { useEffect, useState, createContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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
import {
    fetchStaffInfoAPI, fetchWorkHistoryByEmployeeId,
    fetchStaffFullInfoAPI, fetchTimesheetByEmployeeId,
    getHolidaysByEmployeeId, getPayrollsByEmployeeId, getAllTypeSalariesForEmployee
} from '../../../api';
import InfoContent from './infoContent';
import ArrowHeader from '../../appBar/arrowHeader';
import Profile from './profile';
import Typography from '@mui/material/Typography';
import { createAxios } from '../../../redux/createInstance';
import { loginSuccess } from '../../../redux/authSlice';

const options = [
    { value: 'timesheet', label: 'Chấm công', icon: <EditCalendarIcon /> },
    { value: 'salary', label: 'Lương', icon: <AttachMoneyIcon /> },
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
    const [payrolls, setPayrolls] = useState([]);
    const [basicSalary, setBasicSalary] = useState(0);
    const [allBonuses, setBonuses] = useState([]);
    const [allAllowances, setAllowances] = useState([]);
    const [allDeductions, setDeductions] = useState([]);

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
                console.error('Error fetching timesheets: ', error);
            });

        getHolidaysByEmployeeId(id, user.accessToken, axiosJWT)
            .then((response) => {
                setHolidays(response);
            })
            .catch((error) => {
                console.error('Error fetching holidays: ', error);
            });
        getPayrollsByEmployeeId(id, user.accessToken, axiosJWT)
            .then((response) => {
                setPayrolls(response);
            })
            .catch((error) => {
                console.error('Error fetching payrolls of staff: ', error);
            });

        getAllTypeSalariesForEmployee(id, user.accessToken, axiosJWT)
            .then((response) => {
                setBonuses(response.bonuses);
                setDeductions(response.deductions);
                setAllowances(response.allowances);
                setBasicSalary(response.basicSalary);
            })
            .catch((error) => {
                console.error('Error fetching payrolls of staff: ', error);
            });
    }, [id]);


    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <userInfoContext.Provider
            value={{
                workHistories, setWorkHistories,
                staffFullInfo, setStaffFullInfo,
                timesheets, setTimesheets,
                holidays, setHolidays,
                staffInfo, setStaffInfo,
                payrolls, allAllowances, allBonuses, allDeductions, basicSalary
            }}>
            <ArrowHeader text="Thông tin nhân viên" />
            {loading ? (
                <Typography variant="h5" gutterBottom>
                    Đang lấy dữ liệu nhân viên
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 4, overflowY: 'auto', paddingRight: '17px' }}>
                    <Paper sx={{ minWidth: '90%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, }}>
                        {/* Left section */}

                        <Box sx={{ width: { xs: '100%', md: '40%' }, position: 'fixed' }}>
                            <Profile staffInfo={staffInfo} />

                        </Box>

                        {/* Right section */}
                        <Box sx={{ p: 4, width: { xs: '100%', md: '60%' }, minHeight: 600, marginLeft: { xs: '40%' }, border: "1px solid", borderRadius: '8px', }}>
                            <Select

                                value={selectedOption}
                                onChange={handleChange}
                                renderValue={(selected) => {
                                    const selectedOption = options.find(option => option.value === selected);
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                            <ListItemIcon sx={{ marginRight: 1 }}>{selectedOption.icon}</ListItemIcon>
                                            <ListItemText primary={selectedOption.label} />
                                        </Box>
                                    );
                                }}
                                sx={{
                                    width: 250,
                                    padding: 0,
                                    '& .MuiSelect-select': {
                                        padding: '8px 14px'
                                    }
                                }}
                            >
                                {options.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                        sx={{ display: 'flex', alignItems: 'center', borderRadius: "4px", width: 250 }}
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
