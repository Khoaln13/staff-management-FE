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
import { deleteAllowance, fetchStaffsAPI, updateAllowance } from '../../../api';

export default function AllowanceTab(props) {
    const { row, user, axiosJWT, setStaffs, setRows, setError } = props;
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [selectedAllowance, setSelectedAllowance] = useState(null);
    const [editedAllowance, setEditedAllowance] = useState({
        id: '',
        amount: 0,
        reason: '',
        date: '',
    });

    const handleEdit = (allowance) => {
        setSelectedAllowance(allowance);
        setEditedAllowance({
            id: allowance._id,
            amount: allowance.amount || 0,
            reason: allowance.reason || '',
            date: allowance.date || '',
        });
        setOpenEditDialog(true);
    };

    const handleDelete = (allowance) => {
        setSelectedAllowance(allowance);
        setOpenConfirmationDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditedAllowance({
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
        setEditedAllowance((prevAllowance) => ({
            ...prevAllowance,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Gửi yêu cầu chỉnh sửa đến server và cập nhật UI
        await updateAllowance(editedAllowance.id, { amount: editedAllowance.amount, reason: editedAllowance.reason }, user.accessToken, axiosJWT);
        await fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);

            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);
            });
        console.log('Edited allowance:', editedAllowance);
        handleCloseEditDialog();
    };

    const handleClose = () => {
        handleCloseEditDialog();
    };

    const handleConfirmDelete = async () => {
        await deleteAllowance(selectedAllowance._id, user.accessToken, axiosJWT)
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
                    {row.allowances.map((allowance) => (
                        <TableRow key={allowance._id}>
                            <TableCell>
                                {new Date(allowance.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
                            </TableCell>
                            <TableCell>{allowance.amount}</TableCell>
                            <TableCell>{allowance.reason}</TableCell>
                            <TableCell align='right' colSpan={2}>
                                <Button variant="outlined" aria-label="edit" size="small" startIcon={<EditIcon />} sx={{ marginX: 2, color: 'orange' }} onClick={() => handleEdit(allowance)}>Edit</Button>
                                <Button variant="outlined" aria-label="delete" size="small" startIcon={<DeleteIcon />} sx={{ color: 'red' }} onClick={() => handleDelete(allowance)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openEditDialog} onClose={handleClose}>
                <DialogTitle>Chỉnh sửa phụ cấp</DialogTitle>

                <DialogContent>
                    <Typography variant='subtitle1'><strong>Nhân viên: {row.name}</strong></Typography>
                    <Typography variant='subtitle2'>Ngày tạo: {new Date(editedAllowance.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</Typography>
                    <TextField
                        name="amount"
                        label="Số tiền"
                        type="number"
                        value={editedAllowance.amount}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="reason"
                        label="Lý do"
                        value={editedAllowance.reason}
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
