import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useParams } from 'react-router-dom';
import { fetchStaffInfoAPI, fetchWorkHistoryByEmployeeId } from '../../api';
import InfoContent from './infoContent';


const options = [
    { value: 'edit_profile', label: 'Profile', icon: <AccountBoxIcon /> },
    { value: 'salary', label: 'Bảng lương', icon: <AttachMoneyIcon /> },
    { value: 'work_history', label: 'Lịch sử công việc', icon: <WorkIcon /> },


];

function UserInformation() {
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const { id } = useParams(); // Lấy giá trị của tham số id từ URL
    const [staffInfo, setStaffInfo] = useState({});
    const [workHistories, setWorkHistories] = useState([])

    useEffect(() => {

        fetchStaffInfoAPI(id)
            .then((response) => {
                setStaffInfo(response);

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
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <Paper sx={{ width: '80%', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Left section */}
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: "30%" }}>
                    <Avatar alt={staffInfo.name} src={staffInfo.avatar} sx={{ width: 150, height: 150 }} />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        {staffInfo.name}
                    </Typography>
                    <Typography variant="subtitle1">
                        {staffInfo.email}
                    </Typography>
                    <Typography variant="subtitle2">
                        Ngày sinh: {staffInfo.dateOfBirth}
                    </Typography>
                </Box>
                {/* Right section */}
                <Box sx={{ p: 4, width: "70%" }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Thông tin
                    </Typography>
                    <Divider sx={{ width: "100%" }} />
                    <List sx={{ p: 4, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
    );
}

export default UserInformation;
