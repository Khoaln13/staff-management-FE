import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Typography } from '@mui/material';
import { deleteDeduction, fetchStaffsAPI, updateDeduction } from '../../../api';

export default function DeductionTab(props) {
    const { row, user, axiosJWT, setStaffs, setRows, setError } = props;
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [selectedDeduction, setSelectedDeduction] = useState(null);
    const [editedDeduction, setEditedDeduction] = useState({
        id: '',
        amount: 0,
        reason: '',
        date: '',
    });

    const handleEdit = (deduction) => {
        setSelectedDeduction(deduction);
        setEditedDeduction({
            id: deduction._id,
            amount: deduction.amount || 0,
            reason: deduction.reason || '',
            date: deduction.date || '',
        });
        setOpenEditDialog(true);
    };

    const handleDelete = (deduction) => {
        setSelectedDeduction(deduction);
        setOpenConfirmationDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditedDeduction({
            id: '',
            amount: 0,
            reason: '',
            date: '',
        });
    };

    const handleCloseConfirmationDialog = () => {
        setOpenConfirmationDialog(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedDeduction((prevDeduction) => ({
            ...prevDeduction,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Gửi yêu cầu chỉnh sửa đến server và cập nhật UI
        await updateDeduction(editedDeduction.id, { amount: editedDeduction.amount, reason: editedDeduction.reason }, user.accessToken, axiosJWT);
        await fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);

            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);
            });
        console.log('Edited deduction:', editedDeduction);
        handleCloseEditDialog();
    };

    const handleClose = () => {
        handleCloseEditDialog();
    };

    const handleConfirmDelete = async () => {
        await deleteDeduction(selectedDeduction._id, user.accessToken, axiosJWT)
        await fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);

            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);
            });
        setOpenConfirmationDialog(false);
    };

    return (
        <Box sx={{ marginTop: '4px', textAlign: 'center' }}>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d7dadb', }}>
                        <TableCell>Ngày tạo</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Lý do </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row.deductions.map((deduction) => (
                        <TableRow key={deduction._id}>
                            <TableCell>
                                {new Date(deduction.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
                            </TableCell>
                            <TableCell>{deduction.amount}</TableCell>
                            <TableCell>{deduction.reason}</TableCell>
                            <TableCell align='right' colSpan={2}>
                                <Button variant="outlined" aria-label="edit" size="small" startIcon={<EditIcon />} sx={{ marginX: 2, color: 'orange' }} onClick={() => handleEdit(deduction)}>Edit</Button>
                                <Button variant="outlined" aria-label="delete" size="small" startIcon={<DeleteIcon />} sx={{ color: 'red' }} onClick={() => handleDelete(deduction)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openEditDialog} onClose={handleClose}>
                <DialogTitle>Chỉnh sửa khấu trừ</DialogTitle>

                <DialogContent>
                    <Typography variant='subtitle1'><strong>Nhân viên: {row.name}</strong></Typography>
                    <Typography variant='subtitle2'>Ngày tạo: {new Date(editedDeduction.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</Typography>
                    <TextField
                        name="amount"
                        label="Số tiền"
                        type="number"
                        value={editedDeduction.amount}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="reason"
                        label="Lý do"
                        value={editedDeduction.reason}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa mục này?</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmationDialog}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} color="primary">Xóa</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
