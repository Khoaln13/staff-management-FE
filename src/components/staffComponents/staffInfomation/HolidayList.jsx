import { useContext, useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, Grid, Box, Button, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, Fab,
    InputAdornment, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userInfoContext } from './staffInfo';
import { createHoliday, getHolidaysByEmployeeId, updateHolidayInfo, deleteHoliday } from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '../../../redux/createInstance';
import { loginSuccess } from '../../../redux/authSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const HolidayList = () => {
    const useUserInfo = useContext(userInfoContext);
    const employeeId = useUserInfo.staffFullInfo?._id;
    const holidays = useUserInfo.holidays.holidays;
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const [openDialog, setOpenDialog] = useState(false);
    const [currentHoliday, setCurrentHoliday] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [daysRequested, setDaysRequested] = useState(0);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteHolidayId, setDeleteHolidayId] = useState(null);

    const [isSaveDisabled, setIsSaveDisabled] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    const calculateDaysRequested = (start, end) => {
        const timeDiff = end.getTime() - start.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        return diffDays;
    };

    const handleOpenDialog = (holiday = null) => {
        setCurrentHoliday(holiday);
        setStartDate(holiday ? new Date(holiday.startDate) : new Date());
        setEndDate(holiday ? new Date(holiday.endDate) : new Date());
        setDescription(holiday?.description || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentHoliday(null);
        setStartDate(new Date());
        setEndDate(new Date());
        setDescription('');
        setWarningMessage('');
        setIsSaveDisabled(false);
    };

    const handleSave = async () => {
        const newHoliday = {
            employee_id: employeeId,
            startDate: startDate,
            endDate: endDate,
            description
        };

        if (currentHoliday) {
            await updateHolidayInfo(currentHoliday._id, newHoliday, user.accessToken, axiosJWT);
        } else {
            await createHoliday(employeeId, newHoliday, user.accessToken, axiosJWT);
        }

        const data = await getHolidaysByEmployeeId(employeeId, user.accessToken, axiosJWT);
        useUserInfo.setHolidays(data);
        handleCloseDialog();
    };

    const handleOpenDeleteDialog = (holidayId) => {
        setDeleteHolidayId(holidayId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeleteHolidayId(null);
    };

    const handleDelete = async () => {
        await deleteHoliday(deleteHolidayId, user.accessToken, axiosJWT);
        const data = await getHolidaysByEmployeeId(employeeId, user.accessToken, axiosJWT);
        useUserInfo.setHolidays(data);
        handleCloseDeleteDialog();
    };

    const handleStartDateChange = (date) => {
        if (date >= new Date()) {
            setStartDate(date);
            const newDaysRequested = calculateDaysRequested(date, endDate);
            setDaysRequested(newDaysRequested);
            validateDates(date, endDate, newDaysRequested);
        }
    };

    const handleEndDateChange = (date) => {
        if (date >= startDate) {
            setEndDate(date);
            const newDaysRequested = calculateDaysRequested(startDate, date);
            setDaysRequested(newDaysRequested);
            validateDates(startDate, date, newDaysRequested);
        }
    };

    const validateDates = (start, end, daysRequested) => {
        const maxDaysAllowed = 20;
        const totalDaysTaken = useUserInfo.holidays.totalDaysTaken;
        const totalDaysWaiting = useUserInfo.holidays.totalDaysWaiting;
        const availableDays = maxDaysAllowed - totalDaysTaken - totalDaysWaiting;
        const currentRequestDays = currentHoliday ? calculateDaysRequested(new Date(currentHoliday.startDate), new Date(currentHoliday.endDate)) : 0;

        if (daysRequested > availableDays + currentRequestDays) {
            setWarningMessage(`Số ngày yêu cầu vượt quá số ngày có thể tạo. Bạn chỉ có thể yêu cầu tối đa ${availableDays + currentRequestDays} ngày.`);
            setIsSaveDisabled(true);
        } else if (start < new Date()) {
            setWarningMessage('Ngày bắt đầu phải lớn hơn ngày hôm nay.');
            setIsSaveDisabled(true);
        } else {
            setWarningMessage('');
            setIsSaveDisabled(false);
        }
    };

    useEffect(() => {
        if (currentHoliday) {
            const currentRequestDays = calculateDaysRequested(new Date(currentHoliday.startDate), new Date(currentHoliday.endDate));
            validateDates(startDate, endDate, currentRequestDays);
        }
    }, [currentHoliday]);

    return (
        <Box sx={{ marginTop: 2 }}>
            <Box sx={{ marginBottom: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {user.user._id === employeeId && (
                    <Fab color="primary" aria-label="add" onClick={() => handleOpenDialog()} sx={{ marginLeft: 4 }} >
                        <AddIcon />
                    </Fab>
                )}
                <Box sx={{ width: '70%' }}>
                    <Typography variant="subtitle2" sx={{ color: 'red', fontWeight: 'bold' }}>Lưu ý</Typography>
                    <Typography variant="subtitle2">
                        <strong>Số ngày nghỉ tối đa:</strong> 20
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Số ngày nghỉ đã nghỉ: </strong>{useUserInfo.holidays.totalDaysTaken}
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Số ngày nghỉ khả dụng: </strong>{20 - useUserInfo.holidays.totalDaysTaken}
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Số ngày nghỉ đang chờ duyệt: </strong>{useUserInfo.holidays.totalDaysWaiting}
                    </Typography>
                    <Typography variant="subtitle2">
                        <strong>Số ngày nghỉ có thể tạo yêu cầu: </strong> {20 - useUserInfo.holidays.totalDaysTaken - useUserInfo.holidays.totalDaysWaiting}
                    </Typography>
                </Box>
            </Box>
            <Grid container spacing={2}
                sx={{
                    // maxHeight: 500,
                    // overflowY: 'auto',
                    width: '100%',
                }}>
                {holidays.map((holiday) => (
                    <Grid item xs={12} sm={6} md={6} key={holiday._id}>
                        <Card sx={{ height: '140px', border: '1px solid', mx: 0, borderColor: 'blue' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ color: holiday.status === 'Approved' ? '#81f08e' : holiday.status === 'Pending' ? '#2790f2' : '#ed6678' }}>
                                        {holiday.status === 'Approved' ? 'Đã duyệt' : holiday.status === 'Pending' ? 'Đang xét duyệt' : 'Đã bị hủy'}
                                    </Typography>
                                    <Box>
                                        {holiday.status === 'Pending' && (
                                            <IconButton onClick={() => handleOpenDialog(holiday)} sx={{ width: '25px', height: '25px', marginLeft: '5px', color: 'orange' }}>
                                                <EditIcon fontSize='small' />
                                            </IconButton>
                                        )}
                                        {holiday.status !== 'Approved' && (
                                            <IconButton onClick={() => handleOpenDeleteDialog(holiday._id)} sx={{ width: '25px', height: '25px', marginLeft: '5px', color: 'red' }}>
                                                <DeleteIcon fontSize='small' />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Box>
                                <Typography variant="subtitle2">
                                    {new Date(holiday.startDate).toLocaleDateString()} - {new Date(holiday.endDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    {holiday.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} >
                <DialogTitle>{currentHoliday ? 'Edit Holiday' : 'Create Holiday'}</DialogTitle>
                <DialogContent sx={{ width: 400, height: 600 }}>
                    {daysRequested && (<Typography>Số ngày bạn muốn nghỉ: {daysRequested}</Typography>)}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ marginBottom: '8px', display: 'block' }}>Start Date</label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            dateFormat="dd/MM/yyyy"
                            customInput={
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CalendarMonthIcon style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    margin="normal"
                                />
                            }
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ marginBottom: '8px', display: 'block' }}>End Date</label>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            dateFormat="dd/MM/yyyy"
                            customInput={
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CalendarMonthIcon style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    margin="normal"
                                />
                            }
                        />
                    </div>
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {warningMessage && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            {warningMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: 'red' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} color="primary" disabled={isSaveDisabled}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa kỳ nghỉ này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} sx={{ color: 'gray' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} sx={{ color: 'red' }}>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HolidayList;
