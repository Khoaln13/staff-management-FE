import { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
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
    const [department, setDepartment] = useState(staffInfo.department_id);
    const [position, setPosition] = useState(staffInfo.position_id);

    const departments = useSelector((state) => state.company.departments.departments);
    const positions = useSelector((state) => state.company.positions.positions);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            dateOfBirth: format(date, 'dd/MM/yyyy'),
        }));
    };

    const handleFilterDepartmentChange = (event) => {
        const changeValue = departments.find(department => department._id === event.target.value);
        setDepartment(changeValue);
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            department_id: changeValue,
        }));
    };
    const handleFilterPositionChange = (event) => {
        const changeValue = positions.find(position => position._id === event.target.value);
        setPosition(changeValue);
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            position_id: changeValue,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await updateStaff(editedStaffInfo, editedStaffInfo._id, user.accessToken, axiosJWT);
            console.log(response);
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
                marginTop: 8,
                marginBottom: 8,
            }}
        >
            <Avatar
                sx={{ width: 150, height: 150, marginBottom: 2 }}
                alt="User Avatar"
                src="/static/images/avatar.jpg"
            />
            <form onSubmit={handleSubmit}
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
                    onChange={handleChange}
                    sx={{ width: "400px", }}
                    margin="normal"
                    size='small'
                    disabled={!isAdmin}
                />
                <Box sx={{ my: 2 }}>
                    <FormControl sx={{ width: 400 }} size='small' disabled={!isAdmin}>
                        <InputLabel sx={{ backgroundColor: "white", }} id="department-label">Phòng ban</InputLabel>
                        <Select
                            labelId="department-label"
                            value={department._id}
                            onChange={handleFilterDepartmentChange}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ my: 2 }}>
                    <FormControl sx={{ width: 400 }} size='small' disabled={!isAdmin}>
                        <InputLabel sx={{ backgroundColor: "white", }} id="position-label">Chức vụ</InputLabel>
                        <Select
                            labelId="position-label"
                            value={position._id}
                            onChange={handleFilterPositionChange}
                        >
                            {positions.map((position) => (
                                <MenuItem key={position._id} value={position._id}>
                                    {position.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
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
                        onChange={handleChange}
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Nam" />
                        <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    label="Địa chỉ"
                    name="address"
                    value={editedStaffInfo.address}
                    onChange={handleChange}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <TextField
                    label="Email"
                    name="email"
                    value={editedStaffInfo.email}
                    onChange={handleChange}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <TextField
                    label="Điện thoại"
                    name="phone"
                    value={editedStaffInfo.phone}
                    onChange={handleChange}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <Button type="submit" variant="contained" color="primary" sx={{ width: "200px", marginTop: "20px", alignSelf: "center" }}>
                    Lưu thay đổi
                </Button>
            </form>
        </Box>
    );
};

export default StaffEditForm;
