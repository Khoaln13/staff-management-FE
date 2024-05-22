import { useContext, useState } from 'react';
import {
    Card, CardContent, Typography, Grid, Box, Button, IconButton,
    TextField, Dialog, DialogActions, DialogContent, DialogTitle, Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { userInfoContext } from './staffInfo';
import { createHoliday, getHolidaysByEmployeeId, updateHolidayStatus } from '../../../api';

import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '../../../redux/createInstance';
import { loginSuccess } from '../../../redux/authSlice';

const HolidayList = () => {
    const useUserInfo = useContext(userInfoContext);
    const employeeId = useUserInfo.staffFullInfo?._id;
    const holidays = useUserInfo.holidays
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);


    const [openDialog, setOpenDialog] = useState(false);
    const [currentHoliday, setCurrentHoliday] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const today = new Date().toISOString().split('T')[0];



    const handleOpenDialog = (holiday = null) => {
        setCurrentHoliday(holiday);
        setStartDate(holiday?.startDate || '');
        setEndDate(holiday?.endDate || '');
        setDescription(holiday?.description || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentHoliday(null);
        setStartDate('');
        setEndDate('');
        setDescription('');
    };

    const handleSave = async () => {
        const newHoliday = {
            employee_id: employeeId,
            startDate,
            endDate,
            description
        };

        if (currentHoliday) {
            // Update existing holiday status
            await updateHolidayStatus(currentHoliday._id, newHoliday, user.accessToken, axiosJWT);
        } else {
            // Create new holiday
            await createHoliday(employeeId, newHoliday, user.accessToken, axiosJWT);
        }

        const data = await getHolidaysByEmployeeId(employeeId, user.accessToken, axiosJWT);
        useUserInfo.setHolidays(data);
        handleCloseDialog();
    };

    return (
        <Box sx={{ marginTop: 2 }}>
            {user.user._id === employeeId && (
                <Fab color="primary" aria-label="add" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
                    <AddIcon />
                </Fab>
            )}

            <Grid container spacing={2}>
                {holidays.map((holiday) => (
                    <Grid item xs={12} sm={6} md={4} key={holiday._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {new Date(holiday.startDate).toLocaleDateString()} - {new Date(holiday.endDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    {holiday.description}
                                </Typography>
                                <Typography variant="body2" sx={{ color: holiday.status === 'Approved' ? '#81f08e' : holiday.status === 'Pending' ? '#f0dd81' : '#ed6678' }}>
                                    {holiday.status === 'Approved' ? 'Đã duyệt' : holiday.status === 'Pending' ? 'Đang xét duyệt' : 'Đã bị hủy'}
                                </Typography>
                                {holiday.status === 'Pending' && (
                                    <IconButton onClick={() => handleOpenDialog(holiday)}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>


            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentHoliday ? 'Edit Holiday' : 'Create Holiday'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Start Date"
                        type="date"
                        fullWidth
                        value={startDate ? startDate : today}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="End Date"
                        type="date"
                        fullWidth
                        value={endDate ? endDate : today}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: 'red' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HolidayList;
