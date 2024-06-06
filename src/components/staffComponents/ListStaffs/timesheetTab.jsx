
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';


export default function TimesheetTab(props) {

    const { row } = props;
    return (
        <Box sx={{ marginTop: '4px' }}>
            {/* <Typography variant="subtitle1" gutterBottom component="div">
                <strong> Chấm công 7 ngày gần đây</strong>
            </Typography> */}
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d7dadb', }}>
                        <TableCell>Ngày công</TableCell>
                        <TableCell>Giờ vào</TableCell>
                        <TableCell>Giờ ra</TableCell>
                        <TableCell>Công việc</TableCell>
                        <TableCell>Latest update time </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row.timesheets.map((timesheet) => (
                        <TableRow key={timesheet._id}>
                            <TableCell>
                                {new Date(timesheet.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
                            </TableCell>
                            <TableCell>{timesheet.startTime}</TableCell>
                            <TableCell>{timesheet.endTime ? timesheet.endTime : 'chưa checkout'}</TableCell>
                            <TableCell>{timesheet.description}</TableCell>
                            <TableCell>
                                {new Date(timesheet.updatedAt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    )
}