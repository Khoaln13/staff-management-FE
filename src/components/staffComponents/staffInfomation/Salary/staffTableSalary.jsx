import { useState, useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';

import { getPayrollDetailsWithTime } from '../../../../api';
import SalaryDetailsDialog from './SalaryDetailsDialog';
import { userInfoContext } from '../staffInfo';
import { useSelector, useDispatch } from 'react-redux';
import { createAxios } from '../../../../redux/createInstance';
import { loginSuccess } from '../../../../redux/authSlice';
const StaffTableSalary = () => {

    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [bonuses, setBonuses] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [allowances, setAllowances] = useState([]);
    const useUserInfo = useContext(userInfoContext);
    const payrolls = useUserInfo.payrolls;

    const employeeId = useUserInfo.staffFullInfo?._id;
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);



    const handleDialogOpen = (payroll) => {
        setSelectedPayroll(payroll);
        getPayrollDetailsWithTime(employeeId, payroll.month, payroll.year, user.accessToken, axiosJWT)
            .then((response) => {
                setBonuses(response.bonuses);
                setDeductions(response.deductions);
                setAllowances(response.allowances);
            })
            .catch((error) => {
                console.error('Error fetching bonuses : ', error);
            });

        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setSelectedPayroll(null);
        setBonuses([]);
        setDeductions([]);
        setAllowances([]);
        setDialogOpen(false);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {/* <TableCell>Employee ID</TableCell> */}
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Lương cơ bản</TableCell>
                        <TableCell>Phụ cấp</TableCell>
                        <TableCell>Thưởng</TableCell>
                        <TableCell>Khấu trừ</TableCell>
                        <TableCell>Tổng </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {payrolls.map((payroll) => (
                        <TableRow key={payroll._id}>
                            {/* <TableCell>{payroll.employee_id}</TableCell> */}
                            <TableCell>Tháng {payroll.month}/{payroll.year}</TableCell>
                            <TableCell>{payroll.basic_salary}</TableCell>
                            <TableCell>{payroll.allowance}</TableCell>
                            <TableCell>{payroll.bonus}</TableCell>
                            <TableCell>{payroll.deduction}</TableCell>
                            <TableCell>{payroll.total_salary}</TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={() => handleDialogOpen(payroll)}>
                                    Chi tiết
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {selectedPayroll && (
                <SalaryDetailsDialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    payroll={selectedPayroll}
                    bonuses={bonuses}
                    deductions={deductions}
                    allowances={allowances}
                />
            )}
        </TableContainer>
    );
};

export default StaffTableSalary;
