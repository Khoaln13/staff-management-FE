import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Link } from 'react-router-dom';
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
                <Link to={`/staff/${staff._id}`}>
                    <button
                        style={{
                            width: "50px",
                            height: "25px",
                            backgroundColor: "#03bafc",
                            border: "none",
                            borderRadius: "4px",
                            color: "white"
                        }}
                    >
                        Xem
                    </button>
                </Link>
            </TableCell>

        </TableRow>
    )

}
export default StaffItem;