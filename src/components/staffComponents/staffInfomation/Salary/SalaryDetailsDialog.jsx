import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const SalaryDetailsDialog = ({ open, onClose, payroll, bonuses, deductions, allowances }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Chi tiết lương</DialogTitle>
            <DialogContent>
                <Typography variant="body1"><strong>Tháng:</strong> {payroll.month}</Typography>
                <Typography variant="body1"><strong>Năm:</strong> {payroll.year}</Typography>
                <Typography variant="body1"><strong>Lương cơ bản:</strong> {payroll.basic_salary}</Typography>

                <Typography variant="subtitle2" sx={{ py: 2 }}>Phụ cấp:</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Loại phụ cấp</TableCell>
                                <TableCell align="right">Số tiền</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allowances.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3}>Không có</TableCell>
                                </TableRow>
                            )}
                            {allowances.map((allowance, index) => (
                                <TableRow key={index}>
                                    <TableCell>{allowance.reason}</TableCell>
                                    <TableCell align="right">{allowance.amount}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="subtitle2" sx={{ py: 2 }}>Thưởng:</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Lý do</TableCell>
                                <TableCell align="right">Số tiền</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bonuses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3}>Không có</TableCell>
                                </TableRow>
                            )}
                            {bonuses.map((bonus, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(bonus.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{bonus.reason}</TableCell>
                                    <TableCell align="right">{bonus.amount}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="subtitle2" sx={{ py: 2 }}>Khấu trừ:</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Lý do</TableCell>
                                <TableCell align="right">Số tiền</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deductions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3}>Không có</TableCell>
                                </TableRow>
                            )}
                            {deductions.map((deduction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(deduction.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{deduction.reason}</TableCell>
                                    <TableCell align="right">{deduction.amount}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                    }
                }>
                    <Typography variant="body1" ><strong>Tổng lương:</strong> </Typography>
                    <Typography variant="body1" sx={{ color: 'blue' }}> {payroll.total_salary}</Typography>
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: "red" }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SalaryDetailsDialog;
