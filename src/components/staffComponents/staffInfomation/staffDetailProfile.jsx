import { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { List, ListItem, ListItemText } from '@mui/material';
import StaffEditForm from '../../Forms/staffEditForm';
import { userInfoContext } from './staffInfo';

const StaffDetailProfile = () => {
    const useUserInfo = useContext(userInfoContext);
    const staffInfo = useUserInfo?.staffFullInfo
    const [mode, setMode] = useState('view');

    const handleChangeMode = (newMode) => {
        setMode(newMode);
    };

    return (
        staffInfo && (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 8,
                    marginBottom: 8,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        width: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        marginBottom: 4,
                    }}
                >
                    <List sx={{ p: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "right" }}>
                        <ListItem
                            button
                            selected={mode === 'view'}
                            onClick={() => handleChangeMode('view')}
                            sx={{
                                width: "115px",
                                textAlign: "center",
                                borderBottom: mode === 'view' ? "4px solid" : "1px solid",
                                borderBottomColor: mode === 'view' ? "#71f093" : "#32a852",
                                marginLeft: "4px",
                            }}
                        >
                            <ListItemText primary="Chỉ xem" />
                        </ListItem>
                        <ListItem
                            button
                            selected={mode === 'edit'}
                            onClick={() => handleChangeMode('edit')}
                            sx={{
                                width: "115px",
                                textAlign: "center",
                                borderBottom: mode === 'edit' ? "4px solid" : "1px solid",
                                borderBottomColor: mode === 'edit' ? "#71f093" : "#32a852",
                                marginLeft: "4px",
                            }}
                        >
                            <ListItemText primary="Chỉnh sửa" />
                        </ListItem>
                    </List>

                    {
                        mode === 'view' ? (
                            <>
                                <Avatar
                                    sx={{ width: 120, height: 120, marginBottom: 2 }}
                                    alt="User Avatar"
                                    src="/static/images/avatar.jpg"
                                />
                                <Typography variant="h6">{staffInfo.name}</Typography>
                                <Typography>Phòng: {staffInfo.department_id?.name}</Typography>
                                <Typography>Chức vụ: {staffInfo.position_id?.title}</Typography>
                                <Typography>Ngày sinh: {staffInfo.dateOfBirth}</Typography>
                                <Typography>Giới tính: {staffInfo.gender === 'male' ? 'nam' : 'nữ'}</Typography>
                                <Typography>Địa chỉ: {staffInfo.address}</Typography>

                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="subtitle2">Contact Information</Typography>
                                    <Typography variant="body2">Email: {staffInfo.email}</Typography>
                                    <Typography variant="body2">Sđt: {staffInfo.phone}</Typography>
                                </Box>
                            </>
                        ) :
                            <StaffEditForm />
                    }

                </Paper>
            </Box>
        )
    );
};

export default StaffDetailProfile;
