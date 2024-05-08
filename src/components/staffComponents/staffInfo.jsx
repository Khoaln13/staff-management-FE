import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchStaffInfoAPI, fetchWorkHistoryByEmployeeId } from '../../api';
import InfoContent from './infoContent';
import ArrowHeader from '../appBar/arrowHeader';
import Profile from './profile';
import Typography from '@mui/material/Typography';

const options = [
    { value: 'edit_profile', label: 'Profile', icon: <AccountBoxIcon /> },
    { value: 'salary', label: 'Bảng lương', icon: <AttachMoneyIcon /> },
    { value: 'work_history', label: 'Lịch sử công việc', icon: <WorkHistoryIcon /> },
];


function UserInformation() {
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const { id } = useParams(); // Lấy giá trị của tham số id từ URL
    const [staffInfo, setStaffInfo] = useState({});
    const [workHistories, setWorkHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.login.currentUser)

    useEffect(() => {

        fetchStaffInfoAPI(id, user.accessToken)
            .then((response) => {
                setStaffInfo(response);
                setLoading(false)

            })
            .catch((error) => {
                console.error('Error fetching staff info: ', error);
            });

    }, [id]);

    useEffect(() => {
        fetchWorkHistoryByEmployeeId(id)
            .then((response) => {
                setWorkHistories(response)
            }).catch((error) => {
                console.error('Error fetching work-history info: ', error);
            });
    }, [id])

    const handleChange = (option) => {
        setSelectedOption(option.value);
    };



    return (
        <>
            <ArrowHeader text="Thông tin nhân viên" />
            {loading ? <Typography variant="h5" gutterBottom>
                Đang lấy dữ liệu nhân viên
            </Typography> : (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 4 }}>
                    <Paper sx={{ width: '80%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, border: "1px solid" }}>
                        {/* Left section */}

                        <Profile staffInfo={staffInfo} />
                        <Divider orientation="vertical" variant="middle" flexItem light={true} />
                        {/* Right section */}
                        <Box sx={{ p: 4, width: "70%" }}>

                            <List sx={{ p: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {options.map((option) => (
                                    <ListItem
                                        key={option.value}
                                        button
                                        selected={selectedOption === option.value}
                                        onClick={() => handleChange(option)}
                                        sx={{ width: "fit-content", borderBottom: "1px solid", borderRight: "1px solid", marginLeft: "4px", borderRadius: "4px" }}
                                    >
                                        <ListItemIcon>{option.icon}</ListItemIcon>
                                        <ListItemText primary={option.label} sx={{ marginLeft: "-20px" }} />
                                    </ListItem>
                                ))}
                            </List>
                            {InfoContent(selectedOption, workHistories)}
                        </Box>
                    </Paper>
                </Box>
            )}

        </>
    );
}

export default UserInformation;
