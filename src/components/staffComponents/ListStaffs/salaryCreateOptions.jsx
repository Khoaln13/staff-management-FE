import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, TextField } from '@mui/material';
import { createAllowanceMultiEmployees, createBonusMultiEmployees, createDeDuctionMultiEmployees, createPayrollForAllEmployees, fetchStaffsAPI } from '../../../api';

const SalaryCreateOptions = (props) => {
    const { selected, user, axiosJWT, staffs, setStaffs, setRows, setError } = props;
    const [openAllowanceDialog, setOpenAllowanceDialog] = useState(false);
    const [openBonusDialog, setOpenBonusDialog] = useState(false);
    const [openDeductionDialog, setOpenDeductionDialog] = useState(false);
    const [openCreatePayrollDialog, setOpenCreatePayrollDialog] = useState(false);
    const [allowanceData, setAllowanceData] = useState({ amount: 0, reason: '' });
    const [bonusData, setBonusData] = useState({ amount: 0, reason: '' });
    const [deductionData, setDeductionData] = useState({ amount: 0, reason: '' });
    const [isPayrollButtonEnabled, setIsPayrollButtonEnabled] = useState(false);

    useEffect(() => {
        const today = new Date();
        const isPayrollDay = today.getDate() === 14;
        if (staffs[0]?.payroll) {
            setIsPayrollButtonEnabled(false);
        } else {
            setIsPayrollButtonEnabled(isPayrollDay);
        }

    }, [staffs]);

    const handleDialogClose = () => {
        setOpenAllowanceDialog(false);
        setOpenBonusDialog(false);
        setOpenDeductionDialog(false);
        setOpenCreatePayrollDialog(false);
    };

    const handleCreateAllowance = () => setOpenAllowanceDialog(true);
    const handleCreateBonus = () => setOpenBonusDialog(true);
    const handleCreateDeduction = () => setOpenDeductionDialog(true);
    const handleCreatePayroll = () => setOpenCreatePayrollDialog(true);

    const handleAllowanceInputChange = (event) => {
        const { name, value } = event.target;
        setAllowanceData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleBonusInputChange = (event) => {
        const { name, value } = event.target;
        setBonusData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleDeductionInputChange = (event) => {
        const { name, value } = event.target;
        setDeductionData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAllowanceSubmit = async () => {
        await createAllowanceMultiEmployees(selected, allowanceData, user.accessToken, axiosJWT);
        await fetchStaffData();
        setAllowanceData({ amount: 0, reason: '' });
        handleDialogClose();
    };

    const handleBonusSubmit = async () => {
        await createBonusMultiEmployees(selected, bonusData, user.accessToken, axiosJWT);
        await fetchStaffData();
        setBonusData({ amount: 0, reason: '' });
        handleDialogClose();
    };

    const handleDeductionSubmit = async () => {
        await createDeDuctionMultiEmployees(selected, deductionData, user.accessToken, axiosJWT);
        await fetchStaffData();
        setDeductionData({ amount: 0, reason: '' });
        handleDialogClose();
    };

    const fetchStaffData = async () => {
        try {
            const response = await fetchStaffsAPI(user.accessToken, axiosJWT);
            setStaffs(response.staffs);
            setRows(response.staffs);
        } catch (error) {
            console.error('Error fetching staff data: ', error);
            setError('' + error);
        }
    };

    const handleCreatePayrollSubmit = async () => {
        const today = new Date();
        const month = today.getMonth() === 0 ? 12 : today.getMonth() // Tháng trước
        const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

        await createPayrollForAllEmployees(month, year, user.accessToken, axiosJWT);
        await fetchStaffData();
        handleDialogClose();
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Button variant="contained" onClick={handleCreateAllowance} disabled={selected.length === 0} sx={{ marginRight: 1 }}>
                Thêm Phụ cấp
            </Button>
            <Button variant="contained" onClick={handleCreateBonus} disabled={selected.length === 0} sx={{ marginRight: 1 }}>
                Thêm Thưởng
            </Button>
            <Button variant="contained" onClick={handleCreateDeduction} disabled={selected.length === 0} sx={{ marginRight: 1 }}>
                Thêm Khấu trừ
            </Button>
            <Button variant="contained" onClick={handleCreatePayroll} disabled={!isPayrollButtonEnabled} sx={{ marginRight: 1 }}>
                Tạo Lương
            </Button>

            <Dialog open={openAllowanceDialog} onClose={handleDialogClose}>
                <DialogTitle>Tạo Phụ cấp</DialogTitle>
                <DialogContent>
                    <TextField name="amount" label="Số tiền" type="number" value={allowanceData.amount} onChange={handleAllowanceInputChange} fullWidth margin="dense" />
                    <TextField name="reason" label="Lý do" value={allowanceData.reason} onChange={handleAllowanceInputChange} fullWidth margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleAllowanceSubmit} color="primary">Tạo</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openBonusDialog} onClose={handleDialogClose}>
                <DialogTitle>Tạo Thưởng</DialogTitle>
                <DialogContent>
                    <TextField name="amount" label="Số tiền" type="number" value={bonusData.amount} onChange={handleBonusInputChange} fullWidth margin="dense" />
                    <TextField name="reason" label="Lý do" value={bonusData.reason} onChange={handleBonusInputChange} fullWidth margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleBonusSubmit} color="primary">Tạo</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeductionDialog} onClose={handleDialogClose}>
                <DialogTitle>Tạo Khấu trừ</DialogTitle>
                <DialogContent>
                    <TextField name="amount" label="Số tiền" type="number" value={deductionData.amount} onChange={handleDeductionInputChange} fullWidth margin="dense" />
                    <TextField name="reason" label="Lý do" value={deductionData.reason} onChange={handleDeductionInputChange} fullWidth margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleDeductionSubmit} color="primary">Tạo</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCreatePayrollDialog} onClose={handleDialogClose}>
                <DialogTitle>Xác nhận Tạo Lương</DialogTitle>
                <DialogContent>
                    <Box>Bạn có chắc chắn muốn tính lương cho tất cả nhân viên cho tháng trước không?</Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleCreatePayrollSubmit} color="primary">Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SalaryCreateOptions;
