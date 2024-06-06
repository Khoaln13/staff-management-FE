
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';


export default function PayrollTab(props) {

    const { row } = props;
    return (
        <Box sx={{ marginTop: '4px', textAlign: 'center' }}>
            {row.payroll ?
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#d7dadb', }}>
                            <TableCell>Tháng</TableCell>
                            <TableCell>Lương cơ bản</TableCell>
                            <TableCell>Tổng phụ cấp</TableCell>
                            <TableCell>Tổng thưởng</TableCell>
                            <TableCell>Tổng khấu trừ</TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>

                        <TableRow key={row.payroll._id}>
                            <TableCell>
                                {row.payroll.month}/{row.payroll.year}
                            </TableCell>
                            <TableCell>{row.payroll.basic_salary}</TableCell>
                            <TableCell>{row.payroll.allowance}</TableCell>
                            <TableCell>{row.payroll.bonus}</TableCell>
                            <TableCell>{row.payroll.deduction}</TableCell>

                        </TableRow>

                    </TableBody>

                </Table>
                :
                <Typography variant='subtitle2' sx={{ backgroundColor: '#d7dadb' }}>Chưa có bảng lương tháng này</Typography>
            }
        </Box>
    )
}