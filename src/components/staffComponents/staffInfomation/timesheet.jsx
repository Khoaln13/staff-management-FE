import { useContext, useState, useEffect } from 'react';
import { userInfoContext } from './staffInfo';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import Divider from '@mui/material/Divider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { groupBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '../../../redux/createInstance';
import { loginSuccess } from '../../../redux/authSlice';
import { createTimesheets, updateTimesheet, updateTimesheetCheckout } from '../../../api';
import { useParams } from 'react-router-dom';
import { fetchTimesheetByEmployeeId } from '../../../api';

const TimesheetList = () => {

    const { id } = useParams();
    const useUserInfo = useContext(userInfoContext);
    const staffId = useUserInfo.staffFullInfo._id;
    const timesheets = useUserInfo.timesheets;
    const [openDialog, setOpenDialog] = useState(false);
    const [isTimesheetChange, setIsTimesheetChange] = useState(false);
    const [currentTimesheet, setCurrentTimesheet] = useState(null);
    const [description, setDescription] = useState('');
    const [todayTimesheet, setTodayTimesheet] = useState(null);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        const todayTs = timesheets.find(ts => ts.date.split('T')[0] === today);
        setTodayTimesheet(todayTs);
    }, [timesheets, today]);

    const handleOpenDialog = (timesheet = null) => {
        setCurrentTimesheet(timesheet);
        setDescription(timesheet?.description || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsTimesheetChange(false);
        setCurrentTimesheet(null);
        setDescription('');
    };

    const handleSave = async () => {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const startTime = now.toTimeString().split(' ')[0];
        const newTimesheet = {
            employee_id: staffId,
            date: date,
            startTime: startTime,
            endTime: null,
            description: description
        };

        if (currentTimesheet) {
            // Update existing timesheet
            await updateTimesheet({ description }, currentTimesheet._id, user.accessToken, axiosJWT);
        } else {
            // Create new timesheet for today
            await createTimesheets(newTimesheet, user.accessToken, axiosJWT);
        }
        await fetchTimesheetByEmployeeId(id, user.accessToken, axiosJWT)
            .then((response) => {
                useUserInfo.setTimesheets(response);
            }).catch((error) => {
                console.error('Error fetching timesheets : ', error);
            });

        handleCloseDialog();
        // Reload data or update state to reflect changes
    };

    const handleCheckout = async () => {
        const now = new Date();
        const endTime = now.toTimeString().split(' ')[0];
        await updateTimesheetCheckout(endTime, todayTimesheet._id, user.accessToken, axiosJWT);
        await fetchTimesheetByEmployeeId(id, user.accessToken, axiosJWT)
            .then((response) => {
                useUserInfo.setTimesheets(response);
            }).catch((error) => {
                console.error('Error fetching timesheets : ', error);
            });
    };

    // Group timesheets by month
    const groupedTimesheets = groupBy(timesheets, (timesheet) => {
        const date = new Date(timesheet.date);
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
    });

    return (
        <Box sx={{ marginTop: 2 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                {user.user._id === staffId && (
                    <div>
                        <Typography
                            variant='h5'
                            sx={{
                                fontWeight: 'bold',
                                marginBottom: 1,
                                color: todayTimesheet ? (todayTimesheet.endTime ? '#3be34f' : '#ff7259') : '#ff7259'
                            }}
                        >
                            {todayTimesheet ? (todayTimesheet.endTime ? 'Bạn đã chấm công hôm nay!' : 'Bạn đã check-in hôm nay, hãy check-out!') : 'Hôm nay bạn chưa chấm công!'}
                        </Typography>
                        {!todayTimesheet && (
                            <Fab
                                color="primary"
                                aria-label="add"
                                onClick={() => handleOpenDialog()}
                                sx={{ marginBottom: 2 }}
                            >
                                <AddIcon />
                            </Fab>
                        )}
                        {todayTimesheet && !todayTimesheet.endTime && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCheckout}
                                sx={{ marginBottom: 2 }}
                            >
                                Checkout
                            </Button>
                        )}
                    </div>
                )}
                {Object.keys(groupedTimesheets).map((month) => (
                    <Box key={month} mb={4}>
                        <Typography variant="subtitle2" gutterBottom>
                            {new Date(month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </Typography>
                        <Grid container spacing={1.5}>
                            {groupedTimesheets[month].map((timesheet) => {
                                const isEditable = (new Date() - new Date(timesheet.date)) / (1000 * 60 * 60 * 24) <= 7;

                                return (
                                    <Grid item xs={12} sm={6} md={2} key={timesheet._id}>
                                        <Card sx={{ height: '160px', border: '1px solid', mx: 0, borderColor: 'blue' }}>
                                            <CardContent>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', color: 'darkblue' }}>
                                                    <Typography variant="subtitle2">
                                                        {new Date(timesheet.date).toLocaleDateString()}
                                                    </Typography>
                                                    {isEditable && (
                                                        <IconButton onClick={() => handleOpenDialog(timesheet)} sx={{ width: '25px', height: '25px', marginLeft: '5px', marginTop: '-8px', color: 'orange' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', marginLeft: '-8px' }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ color: "#0496c7", marginRight: '4px' }} />
                                                    <Typography variant="subtitle2" sx={{ color: "#0496c7" }}>
                                                        {timesheet.startTime}
                                                    </Typography>
                                                </div>
                                                <div style={{ display: 'flex', marginLeft: '-8px' }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ color: '#9604c7', marginRight: '4px' }} />
                                                    <Typography variant='subtitle2' sx={{ color: '#9604c7', }}>
                                                        {timesheet.endTime ? timesheet.endTime : '-----'}
                                                    </Typography>
                                                </div>

                                                <Divider fullwidth="true" sx={{ my: 1, fontSize: '12px', mx: '-10px' }}>
                                                    Công việc
                                                </Divider>
                                                <Typography variant="body2" sx={{
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                }}>
                                                    {timesheet.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                ))}

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{currentTimesheet ? 'Chỉnh sửa chấm công' : 'Chấm công hôm nay'}</DialogTitle>
                    <DialogContent>
                        {currentTimesheet && (
                            <>
                                <Typography variant="subtitle2" gutterBottom>
                                    Ngày: {new Date(currentTimesheet.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Giờ vào: {currentTimesheet.startTime}
                                </Typography>

                            </>
                        )}
                        <TextField
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setIsTimesheetChange(true);
                            }}
                            sx={{ width: 'calc(100% + 32px)', marginX: '-16px', marginBottom: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} sx={{ color: 'red' }}>
                            Hủy
                        </Button>
                        <Button onClick={handleSave} disabled={!isTimesheetChange} color="primary">
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
};

export default TimesheetList;
