import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, TextField } from '@mui/material';
import { createAllowanceMultiEmployees, createBonusMultiEmployees, createDeDuctionMultiEmployees, fetchStaffsAPI } from '../../../api';
const SalaryCreateOptions = (props) => {

    const { selected, user, axiosJWT, setStaffs, setRows, setError } = props
    const [openAllowanceDialog, setOpenAllowanceDialog] = useState(false);
    const [openBonusDialog, setOpenBonusDialog] = useState(false);
    const [openDeductionDialog, setOpenDeductionDialog] = useState(false);

    const [allowanceData, setAllowanceData] = useState({
        amount: 0,
        reason: '',

    });
    const [bonusData, setBonusData] = useState({
        amount: 0,
        reason: '',

    });
    const [deductionData, setDeductionData] = useState({
        amount: 0,
        reason: '',

    });

    const handleDialogClose = () => {
        setOpenAllowanceDialog(false); // Đóng dialog
        setOpenBonusDialog(false);
        setOpenDeductionDialog(false);
    };

    const handleCreateAllowance = () => {
        setOpenAllowanceDialog(true); // Mở dialog khi tạo allowance
    };

    const handleCreateBonus = () => {
        setOpenBonusDialog(true); // Mở dialog khi tạo bonus
    };

    const handleCreateDeduction = () => {
        setOpenDeductionDialog(true); // Mở dialog khi tạo deduction
    };
    const handleAllowanceInputChange = (event) => {
        const { name, value } = event.target;
        setAllowanceData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBonusInputChange = (event) => {
        const { name, value } = event.target;
        setBonusData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDeductionInputChange = (event) => {
        const { name, value } = event.target;
        setDeductionData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAllowanceSubmit = async () => {
        await createAllowanceMultiEmployees(selected, allowanceData, user.accessToken, axiosJWT);
        await fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);

            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);
            });
        setAllowanceData({
            amount: 0,
            reason: '',

        })
        handleDialogClose()

    };

    const handleBonusSubmit = async () => {

        await createBonusMultiEmployees(selected, bonusData, user.accessToken, axiosJWT);

        await fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);

            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);

            });

        setBonusData({
            amount: 0,
            reason: '',

        })
        // Đóng dialog sau khi tạo
        handleDialogClose();

    };

    const handleDeductionSubmit = async () => {
        await createDeDuctionMultiEmployees(selected, deductionData, user.accessToken, axiosJWT);
        await fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);

            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);

            });
        setDeductionData({
            amount: 0,
            reason: '',

        })
        handleDialogClose()

    };
    return (


        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Button variant="contained" onClick={handleCreateAllowance} disabled={selected.length === 0} sx={{ marginRight: 1 }}>
                Thêm Phụ cấp
            </Button>
            <Button variant="contained" onClick={handleCreateBonus} disabled={selected.length === 0} sx={{ marginRight: 1 }}>
                Thêm thưởng
            </Button>
            <Button variant="contained" onClick={handleCreateDeduction} disabled={selected.length === 0} sx={{ marginRight: 1 }}>
                Thêm khấu trừ
            </Button>

            <Dialog open={openAllowanceDialog} onClose={handleDialogClose}>
                <DialogTitle>Tạo phụ cấp</DialogTitle>
                <DialogContent>
                    <TextField
                        name="amount"
                        label="Số tiền"
                        type="number"
                        value={allowanceData.amount}
                        onChange={handleAllowanceInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="reason"
                        label="Lý do"
                        value={allowanceData.reason}
                        onChange={handleAllowanceInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleAllowanceSubmit} color="primary">
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openBonusDialog} onClose={handleDialogClose}>
                <DialogTitle>Tạo thưởng </DialogTitle>
                <DialogContent>
                    <TextField
                        name="amount"
                        label="Số tiền"
                        type="number"
                        value={bonusData.amount}
                        onChange={handleBonusInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="reason"
                        label="Lý do"
                        value={bonusData.reason}
                        onChange={handleBonusInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleBonusSubmit} color="primary">
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeductionDialog} onClose={handleDialogClose}>
                <DialogTitle>Tạo khấu trừ</DialogTitle>
                <DialogContent>
                    <TextField
                        name="amount"
                        label="Số tiền"
                        type="number"
                        value={deductionData.amount}
                        onChange={handleDeductionInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="reason"
                        label="Lý do"
                        value={deductionData.reason}
                        onChange={handleDeductionInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleDeductionSubmit} color="primary">
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
}

export default SalaryCreateOptions