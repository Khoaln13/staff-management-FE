import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { updateStaff, updateStaffWork, fetchStaffFullInfoAPI, fetchStaffInfoAPI, fetchWorkHistoryByEmployeeId } from '../../api';
import { createAxios } from '../../redux/createInstance';
import { loginSuccess } from '../../redux/authSlice';
import { userInfoContext } from '../staffComponents/staffInfomation/staffInfo';

const PositionEditForm = () => {
    const useUserInfo = useContext(userInfoContext);
    const staffInfo = useUserInfo.staffFullInfo;// thông tin nhân viên đang làm việc
    const [editedStaffInfo, setEditedStaffInfo] = useState(staffInfo);
    const [editedStaffWork, setEditedStaffWork] = useState({
        employee_id: staffInfo._id,
        position_id: staffInfo.position_id,
        department_id: staffInfo.department_id,
    });
    const [department, setDepartment] = useState(staffInfo.department_id);
    const [position, setPosition] = useState(staffInfo.position_id);
    const [isChangeInfo, setIsChangeInfo] = useState(false);
    const [isChangeWork, setIsChangeWork] = useState(false)
    const departments = useSelector((state) => state.company.departments.departments);
    const positions = useSelector((state) => state.company.positions.positions);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleFilterDepartmentChange = (event) => {
        const changeValue = departments.find(department => department._id === event.target.value);
        setDepartment(changeValue);
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            department_id: changeValue,
        }));
        setEditedStaffWork((prevState) => ({
            ...prevState,
            department_id: changeValue,
        }));
        setIsChangeWork(true)
        setIsChangeInfo(true)

    };

    const handleFilterPositionChange = (event) => {
        const changeValue = positions.find(position => position._id === event.target.value);
        setPosition(changeValue);
        setEditedStaffInfo((prevState) => ({
            ...prevState,
            position_id: changeValue,
        }));
        setEditedStaffWork((prevState) => ({
            ...prevState,
            position_id: changeValue,
        }));
        setIsChangeWork(true)
        setIsChangeInfo(true)

    };

    const handleSubmitInfo = async (event) => {
        event.preventDefault();
        try {
            await updateStaff(editedStaffInfo, editedStaffInfo._id, user.accessToken, axiosJWT);
            if (isChangeWork) {
                await updateStaffWork(editedStaffWork, editedStaffInfo._id, user.accessToken, axiosJWT);
                setIsChangeWork(false)
            }
            setIsChangeInfo(false)
            await fetchStaffInfoAPI(staffInfo._id, user.accessToken, axiosJWT)
                .then((response) => {
                    useUserInfo.setStaffInfo(response);
                }).catch((error) => {
                    console.error('Error fetching timesheets : ', error);
                });
            await fetchStaffFullInfoAPI(staffInfo._id, user.accessToken, axiosJWT)
                .then((response) => {
                    useUserInfo.setStaffFullInfo(response);
                }).catch((error) => {
                    console.error('Error fetching timesheets : ', error);
                });
            await fetchWorkHistoryByEmployeeId(staffInfo._id)
                .then((response) => {
                    useUserInfo.setWorkHistories(response);
                }).catch((error) => {
                    console.error('Error fetching work-history info: ', error);
                });
        } catch (error) {
            console.error("Error updating staff:", error);
        }
    };


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

            <form onSubmit={handleSubmitInfo}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>


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

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isChangeInfo}
                    sx={{ width: "200px", marginTop: "20px" }}>
                    Lưu thay đổi
                </Button>
            </form>
        </Box>
    );
};

export default PositionEditForm;
