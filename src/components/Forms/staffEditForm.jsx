import { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import FormControl from '@mui/material/FormControl';
import { updateStaff } from '../../api';
import { createAxios } from '../../redux/createInstance';
import { loginSuccess } from '../../redux/authSlice';
import { userInfoContext } from '../staffComponents/staffInfomation/staffInfo';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import '../Forms/staffEditForm.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { InputAdornment } from '@mui/material';


const StaffEditForm = () => {
    const useUserInfo = useContext(userInfoContext);
    const staffInfo = useUserInfo.staffFullInfo;
    const [editedStaffInfo, setEditedStaffInfo] = useState(staffInfo);
    const [isChangeInfo, setIsChangeInfo] = useState(false);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleChangeInfo = (event) => {
        const { name, value } = event.target;
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsChangeInfo(true)
    };


    const handleDateChange = (date) => {
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            dateOfBirth: format(date, 'dd/MM/yyyy'),
        }));
        setIsChangeInfo(true)
    };






    const handleSubmitInfo = async (event) => {
        event.preventDefault();
        try {
            const response = await updateStaff(editedStaffInfo, editedStaffInfo._id, user.accessToken, axiosJWT);
            setIsChangeInfo(false)
            window.location.href = `/staff/${response.updatedStaff._id}`;
        } catch (error) {
            console.error("Error updating staff:", error);
        }
    };


    const isAdmin = user.user.role_id.name === 'admin';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 0,
                marginBottom: 2,
            }}
        >
            <Typography variant="h5" component="h2" sx={{ my: "20px", fontWeight: "bold" }}>
                Thông tin cá nhân
            </Typography>
            <Avatar
                sx={{ width: 150, height: 150, marginBottom: 2 }}
                alt="User Avatar"
                src="/static/images/avatar.jpg"
            />
            <form onSubmit={handleSubmitInfo}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <TextField
                    label="Họ và Tên"
                    name="name"
                    value={editedStaffInfo.name}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px", }}
                    margin="normal"
                    size='small'
                    disabled={!isAdmin}
                />


                <div style={{ width: "400px" }}>
                    <label style={{ marginBottom: "-15px", marginLeft: "15px", display: 'block', color: isAdmin ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.38)', fontSize: '12px' }}>Ngày sinh</label>
                    <DatePicker
                        selected={parse(editedStaffInfo.dateOfBirth, 'dd/MM/yyyy', new Date())}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        disabled={!isAdmin}
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
                <FormControl component="fieldset" disabled={!isAdmin} sx={{ marginLeft: "-250px" }}>
                    <label style={{ marginBottom: "-5px", marginTop: "5px", marginLeft: "15px", display: 'block', color: isAdmin ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.38)', fontSize: '12px' }}>Giới tính</label>
                    <RadioGroup
                        row
                        aria-label="gender"
                        name="gender"
                        value={editedStaffInfo.gender}
                        onChange={handleChangeInfo}
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Nam" />
                        <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    label="Địa chỉ"
                    name="address"
                    value={editedStaffInfo.address}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <TextField
                    label="Email"
                    name="email"
                    value={editedStaffInfo.email}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <TextField
                    label="Điện thoại"
                    name="phone"
                    value={editedStaffInfo.phone}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />


                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isChangeInfo}
                    sx={{ width: "200px", marginTop: "20px", alignSelf: "center" }}>
                    Lưu thay đổi
                </Button>
            </form>

        </Box>
    );
};

export default StaffEditForm;
