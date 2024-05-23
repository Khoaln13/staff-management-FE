import { useContext, useState } from 'react';
import {
    Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogActions,
    DialogContent, DialogTitle
} from '@mui/material';
import { getHolidaysRequest, updateHolidayStatus } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '../../redux/createInstance';
import { loginSuccess } from '../../redux/authSlice';
import { AdminTaskContext } from './RequestSolution';

const AdminHolidayList = () => {

    const useAdminTask = useContext(AdminTaskContext)
    const holidays = useAdminTask.holidays
    const [openDialog, setOpenDialog] = useState(false);
    const [currentHoliday, setCurrentHoliday] = useState(null);

    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleOpenDialog = (holiday) => {
        setCurrentHoliday(holiday);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentHoliday(null);
    };

    const handleUpdateStatus = async (status) => {
        await updateHolidayStatus(currentHoliday._id, status, user.accessToken, axiosJWT);
        const data = await getHolidaysRequest(user.accessToken, axiosJWT);
        useAdminTask.setHolidays(data);
        handleCloseDialog();
    };

    if (holidays.length == 0) {
        return (
            <Box sx={{ marginTop: 2 }}>
                <Typography variant='h5'>Không có yêu cầu xin nghỉ nào!</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ marginTop: 2 }}>
            <Grid container spacing={2} sx={{ margin: "10px" }}>
                {holidays.map((holiday) => (
                    <Grid item xs={6} sm={4} md={2} key={holiday._id}>
                        <Card sx={{ border: '1px solid', borderColor: 'darkblue' }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "darkblue" }}>
                                    {holiday.employee_id.name}
                                </Typography>

                                <Typography variant="body2">
                                    {holiday.description}
                                </Typography>
                                <Button onClick={() => handleOpenDialog(holiday)}>
                                    Xử lý
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {currentHoliday && (
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Yêu cầu nghỉ phép</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "darkblue" }}>
                            {currentHoliday.employee_id.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "blue" }}>
                            {currentHoliday.employee_id.department_id?.name}
                        </Typography>
                        <Typography>
                            <strong>Từ:</strong> {new Date(currentHoliday.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography>
                            <strong>Đến:</strong> {new Date(currentHoliday.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography>
                            <strong>Lý do:</strong> {currentHoliday.description}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleUpdateStatus('Approved')} sx={{ color: '#81f08e' }}>
                            Duyệt
                        </Button>
                        <Button onClick={() => handleUpdateStatus('Rejected')} sx={{ color: '#ed6678' }}>
                            Từ chối
                        </Button>
                        <Button onClick={handleCloseDialog} sx={{ color: 'red' }}>
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default AdminHolidayList;
