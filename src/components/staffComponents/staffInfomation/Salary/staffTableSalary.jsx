import React, { useState, useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab, Box
} from '@mui/material';
import _ from 'lodash';

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
    const [tabValue, setTabValue] = useState(0);
    const useUserInfo = useContext(userInfoContext);
    const payrolls = useUserInfo.payrolls;
    const allBonusesData = useUserInfo.allBonuses;
    const allDeductionsData = useUserInfo.allDeductions;
    const allAllowancesData = useUserInfo.allAllowances;

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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });
    };

    const groupByMonth = (data) => {
        return _.groupBy(data, item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        });
    };

    const renderGroupedData = (groupedData) => {
        return Object.keys(groupedData).map((monthYear) => (
            <React.Fragment key={monthYear}>
                <TableRow>
                    <TableCell colSpan={3} size='small' sx={{ fontWeight: 'bold', backgroundColor: '#e3e2e1', }}> Tháng {monthYear}</TableCell>
                </TableRow>
                {groupedData[monthYear].map((item) => (
                    <TableRow key={item._id}>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                    </TableRow>
                ))}
            </React.Fragment>
        ));
    };

    return (
        <Box sx={{ marginTop: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
                <Tab label="Bảng Lương" />
                <Tab label="Thưởng" />
                <Tab label="Khấu trừ" />
                <Tab label="Phụ cấp" />
            </Tabs>
            {tabValue === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#545453', }}>
                                <TableCell sx={{ color: 'white' }}>Thời gian</TableCell>
                                <TableCell sx={{ color: 'white' }}>Lương cơ bản</TableCell>
                                <TableCell sx={{ color: 'white' }}>Phụ cấp</TableCell>
                                <TableCell sx={{ color: 'white' }}>Thưởng</TableCell>
                                <TableCell sx={{ color: 'white' }}>Khấu trừ</TableCell>
                                <TableCell sx={{ color: 'white' }}>Tổng</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payrolls?.map((payroll) => (
                                <TableRow key={payroll._id}>
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
                </TableContainer>
            )}
            {tabValue === 1 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#545453', }}>
                                <TableCell sx={{ color: 'white' }}>Ngày</TableCell>
                                <TableCell sx={{ color: 'white' }}>Số tiền</TableCell>
                                <TableCell sx={{ color: 'white' }}>Lý do</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderGroupedData(groupByMonth(allBonusesData))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {tabValue === 2 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#545453', }}>
                                <TableCell sx={{ color: 'white' }}>Ngày</TableCell>
                                <TableCell sx={{ color: 'white' }}>Số tiền</TableCell>
                                <TableCell sx={{ color: 'white' }}>Lý do</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderGroupedData(groupByMonth(allDeductionsData))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {tabValue === 3 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#545453', }}>
                                <TableCell sx={{ color: 'white' }}>Ngày</TableCell>
                                <TableCell sx={{ color: 'white' }}>Số tiền</TableCell>
                                <TableCell sx={{ color: 'white' }}>Lý do</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderGroupedData(groupByMonth(allAllowancesData))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
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
        </Box>
    );
};

export default StaffTableSalary;
