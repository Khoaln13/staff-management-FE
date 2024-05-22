import { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogActions,
    DialogContent, DialogTitle
} from '@mui/material';
import { getHolidaysRequest, updateHolidayStatus } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '../../redux/createInstance';
import { loginSuccess } from '../../redux/authSlice';

const AdminHolidayList = () => {
    const [holidays, setHolidays] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentHoliday, setCurrentHoliday] = useState(null);

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
        setHolidays(data);
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
                                <Typography variant="body2" color="textSecondary">
                                    Status: {holiday.status}
                                </Typography>
                                <Button onClick={() => handleOpenDialog(holiday)}>
                                    Review
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {currentHoliday && (
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Review Holiday</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {currentHoliday.description}
                        </Typography>
                        <Typography>
                            From: {new Date(currentHoliday.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography>
                            To: {new Date(currentHoliday.endDate).toLocaleDateString()}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleUpdateStatus('Approved')} sx={{ color: '#81f08e' }}>
                            Approve
                        </Button>
                        <Button onClick={() => handleUpdateStatus('Rejected')} sx={{ color: '#ed6678' }}>
                            Reject
                        </Button>
                        <Button onClick={handleCloseDialog} sx={{ color: 'red' }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default AdminHolidayList;
