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
import { deleteBonus, fetchStaffsAPI, updateBonus } from '../../../api';

export default function BonusTab(props) {
    const { row, user, axiosJWT, setStaffs, setRows, setError } = props;
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [selectedBonus, setSelectedBonus] = useState(null);
    const [editedBonus, setEditedBonus] = useState({
        id: '',
        amount: 0,
        reason: '',
        date: '',
    });

    const handleEdit = (bonus) => {
        setSelectedBonus(bonus);
        setEditedBonus({
            id: bonus._id,
            amount: bonus.amount || 0,
            reason: bonus.reason || '',
            date: bonus.date || '',
        });
        setOpenEditDialog(true);
    };

    const handleDelete = (bonus) => {
        setSelectedBonus(bonus);
        setOpenConfirmationDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditedBonus({
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
        setEditedBonus((prevBonus) => ({
            ...prevBonus,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Gửi yêu cầu chỉnh sửa đến server và cập nhật UI
        await updateBonus(editedBonus.id, { amount: editedBonus.amount, reason: editedBonus.reason }, user.accessToken, axiosJWT);
        await fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);

            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);
            });

        handleCloseEditDialog();
    };

    const handleClose = () => {
        handleCloseEditDialog();
    };

    const handleConfirmDelete = async () => {
        // Gửi yêu cầu xác nhận xóa đến server và cập nhật UI
        await deleteBonus(selectedBonus._id, user.accessToken, axiosJWT)
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
                        <TableCell>Tiền thưởng</TableCell>
                        <TableCell>Lý do </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row.bonuses.map((bonus) => (
                        <TableRow key={bonus._id}>
                            <TableCell>
                                {new Date(bonus.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
                            </TableCell>
                            <TableCell>{bonus.amount}</TableCell>
                            <TableCell>{bonus.reason}</TableCell>
                            <TableCell align='right' colSpan={2}>
                                <Button variant="outlined" aria-label="edit" size="small" startIcon={<EditIcon />} sx={{ marginX: 2, color: 'orange' }} onClick={() => handleEdit(bonus)}>Edit</Button>
                                <Button variant="outlined" aria-label="delete" size="small" startIcon={<DeleteIcon />} sx={{ color: 'red' }} onClick={() => handleDelete(bonus)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openEditDialog} onClose={handleClose}>
                <DialogTitle>Chỉnh sửa tiền thưởng</DialogTitle>

                <DialogContent>
                    <Typography variant='subtitle1'><strong>Nhân viên: {row.name}</strong></Typography>
                    <Typography variant='subtitle2'>Ngày tạo: {new Date(editedBonus.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</Typography>
                    <TextField
                        name="amount"
                        label="Số tiền"
                        type="number"
                        value={editedBonus.amount}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="reason"
                        label="Lý do"
                        value={editedBonus.reason}
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
