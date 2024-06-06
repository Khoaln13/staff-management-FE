import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { createStaff } from '../../api';
import { createAxios } from '../../redux/createInstance';
import { loginSuccess } from '../../redux/authSlice';
import { InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import '../Forms/staffEditForm.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const StaffCreateForm = () => {
    const [newStaffInfo, setNewStaffInfo] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        address: '',
        gender: 'male',
        phone: '',
        department_id: '',
        position: 'id',
        username: '',
        password: '',
        basicSalary: 0
    });
    const [basicSalary, setBasicSalary] = useState(0)
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [editedStaffWork, setEditedStaffWork] = useState({
        employee_id: '',
        position_id: '',
        department_id: '',
    });

    const departments = useSelector((state) => state.company.departments.departments);
    const positions = useSelector((state) => state.company.positions.positions);
    const [department, setDepartment] = useState(departments[0]);
    const [position, setPosition] = useState(positions[0]);
    const [isChangeInfo, setIsChangeInfo] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmData, setConfirmData] = useState(null);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleChangeInfo = (event) => {
        const { name, value } = event.target;
        setNewStaffInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsChangeInfo(true);
    };
    const handleChangBasicSalary = (event) => {
        setBasicSalary(event.target.value);
        setNewStaffInfo((prevState) => ({
            ...prevState,
            basicSalary: event.target.value,
        }));
        setIsChangeInfo(true);
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setIsChangeInfo(true);
    };

    const handleFilterDepartmentChange = (event) => {
        const changeValue = departments.find(department => department._id === event.target.value);
        setDepartment(changeValue);
        setNewStaffInfo((prevState) => ({
            ...prevState,
            department_id: changeValue,
        }));
        setEditedStaffWork((prevState) => ({
            ...prevState,
            department_id: changeValue,
        }));
        setIsChangeInfo(true);
    };

    const handleFilterPositionChange = (event) => {
        const changeValue = positions.find(position => position._id === event.target.value);
        setPosition(changeValue);
        setNewStaffInfo((prevState) => ({
            ...prevState,
            position_id: changeValue,
        }));
        setEditedStaffWork((prevState) => ({
            ...prevState,
            position_id: changeValue,
        }));
        setIsChangeInfo(true);
    };

    const handleDateChange = (date) => {
        setNewStaffInfo((prevState) => ({
            ...prevState,
            dateOfBirth: format(date, 'dd/MM/yyyy'),
        }));
        setIsChangeInfo(true);
    };

    const handleConfirm = () => {
        if (!validateFields()) {
            return;
        }
        setConfirmData(newStaffInfo);
        console.log(newStaffInfo);
        setIsConfirmOpen(true);
    };

    const validateFields = () => {
        const { username, password, name, email, dateOfBirth, address, phone, basicSalary } = newStaffInfo;
        if (!username || !password || !name || !email || !dateOfBirth || !address || !phone || !basicSalary) {
            setValidationError('Cần nhập tất cả các thông tin.  Giá trị lương cơ bản phải lớn hơn 0. ');
            return false;
        }
        if (password !== confirmPassword) {
            setValidationError('Mật khẩu không khớp.');
            return false;
        }
        if (username.length < 6 || password.length < 6) {
            setValidationError('Tài khoản và mật khẩu phải từ 6 kí tự trở lên.');
            return false;
        }
        setValidationError('');
        return true;
    };

    const handleCancelConfirm = () => {
        setIsConfirmOpen(false);
        setConfirmData(null);
    };

    const handleSubmitConfirm = async () => {
        try {
            const accountData = {
                username: confirmData.username,
                password: confirmData.password,
            };
            const staffData = {
                ...confirmData,
            };

            await createStaff(accountData, staffData, editedStaffWork, basicSalary, user.accessToken, axiosJWT);

            setIsChangeInfo(false);
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Error creating staff:", error);
        }
    };

    const isAdmin = user.user.role_id.name === 'admin';
    if (!isAdmin) {
        return <Typography variant="h6">Bạn không có quyền truy cập trang này.</Typography>;
    }

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
                Thêm tài khoản
            </Typography>
            <TextField
                label="Tên tài khoản"
                name="username"
                value={newStaffInfo.username}
                onChange={handleChangeInfo}
                sx={{ width: "400px" }}
                margin="normal"
                size='small'
            />
            <TextField
                label="Mật khẩu"
                type="password"
                name="password"
                value={newStaffInfo.password}
                onChange={handleChangeInfo}
                sx={{ width: "400px" }}
                margin="normal"
                size='small'
            />
            <TextField
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                sx={{ width: "400px" }}
                margin="normal"
                size='small'
            />

            <Typography variant="h5" component="h2" sx={{ my: "20px", fontWeight: "bold" }}>
                Nhập thông tin
            </Typography>
            <Avatar
                sx={{ width: 150, height: 150, marginBottom: 2 }}
                alt="User Avatar"
                src="/static/images/avatar.jpg"
            />
            <form onSubmit={(e) => e.preventDefault()}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <TextField
                    label="Họ và Tên"
                    name="name"
                    value={newStaffInfo.name}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px", }}
                    margin="normal"
                    size='small'
                />
                <div style={{ width: "400px" }}>
                    <label style={{ marginBottom: "-15px", marginLeft: "15px", display: 'block', color: 'rgba(0, 0, 0, 0.6)', fontSize: '12px' }}>Ngày sinh</label>
                    <DatePicker
                        selected={newStaffInfo.dateOfBirth ? parse(newStaffInfo.dateOfBirth, 'dd/MM/yyyy', new Date()) : null}
                        onChange={handleDateChange}
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
                <FormControl component="fieldset" sx={{ marginLeft: "-250px" }}>
                    <label style={{ marginBottom: "-5px", marginTop: "5px", marginLeft: "15px", display: 'block', color: 'rgba(0, 0, 0, 0.6)', fontSize: '12px' }}>Giới tính</label>
                    <RadioGroup
                        row
                        aria-label="gender"
                        name="gender"
                        value={newStaffInfo.gender}
                        onChange={handleChangeInfo}
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Nam" />
                        <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    label="Địa chỉ"
                    name="address"
                    value={newStaffInfo.address}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <TextField
                    label="Email"
                    name="email"
                    value={newStaffInfo.email}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <TextField
                    label="Điện thoại"
                    name="phone"
                    value={newStaffInfo.phone}
                    onChange={handleChangeInfo}
                    sx={{ width: "400px" }}
                    margin="normal"
                    size='small'
                />
                <Typography variant="h5" component="h2" sx={{ my: "20px", fontWeight: "bold" }}>
                    Thêm chức vụ
                </Typography>
                <Box sx={{ my: 2 }}>
                    <FormControl sx={{ width: 400 }} size='small' >
                        <InputLabel sx={{ backgroundColor: "white", }} id="department-label">Phòng ban</InputLabel>
                        <Select
                            labelId="department-label"
                            value={department._id}
                            onChange={handleFilterDepartmentChange}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id} sx={{ color: 'black' }}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ my: 2 }}>
                    <FormControl sx={{ width: 400 }} size='small' >
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
                <Box>
                    <TextField
                        label="Lương cơ bản"
                        name="basicSalary"
                        value={newStaffInfo.basicSalary}
                        onChange={handleChangBasicSalary}
                        sx={{ width: "400px", }}
                        margin="normal"
                        size='small'
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    disabled={!isChangeInfo}
                    onClick={handleConfirm}
                    sx={{ width: "200px", marginTop: "20px", alignSelf: "center" }}>
                    Xác nhận
                </Button>
                {validationError && (
                    <Typography color="error" variant="body2">
                        {validationError}
                    </Typography>
                )}
            </form>
            <Dialog
                open={isConfirmOpen}
                onClose={handleCancelConfirm}
            >
                <DialogTitle>Xác nhận thông tin</DialogTitle>
                <DialogContent>
                    <Typography>Tên tài khoản: <strong>{confirmData?.username}</strong> </Typography>
                    <Typography>Họ và tên: <strong>{confirmData?.name}</strong> </Typography>
                    <Typography>Ngày sinh: <strong> {confirmData?.dateOfBirth}</strong></Typography>
                    <Typography>Giới tính: <strong>{confirmData?.gender}</strong></Typography>
                    <Typography>Địa chỉ: <strong>{confirmData?.address}</strong> </Typography>
                    <Typography>Email: <strong>{confirmData?.email}</strong> </Typography>
                    <Typography>Điện thoại: <strong>{confirmData?.phone}</strong> </Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelConfirm} color="primary">Hủy</Button>
                    <Button onClick={handleSubmitConfirm} color="primary">Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StaffCreateForm;
