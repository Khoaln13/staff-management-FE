import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
function StaffItem({ staff }) {

    return (
        <TableRow >
            <TableCell sx={{ width: 400, whiteSpace: 'nowrap' }} component="th" scope="row">
                {staff.name}
            </TableCell>
            <TableCell sx={{ width: 400, whiteSpace: 'nowrap' }} >
                {staff.email}
            </TableCell>
            <TableCell sx={{ width: 400, whiteSpace: 'nowrap' }} >
                {staff.position_id.title}
            </TableCell>
            <TableCell sx={{ width: 600, whiteSpace: 'nowrap' }} >
                {staff.department_id.name}
            </TableCell>

            <TableCell sx={{ width: 100 }} align="left">
                <button>view</button>
            </TableCell>

        </TableRow>
    )

}
export default StaffItem;