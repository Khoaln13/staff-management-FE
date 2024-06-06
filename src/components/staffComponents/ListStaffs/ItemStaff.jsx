import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TimesheetTab from './timesheetTab';
import { Tooltip } from '@mui/material';
import BonusTab from './bonusTab';
import DeductionTab from './deductionTab';
import AllowanceTab from './allowanceTab';
import PayrollTab from './payrollTab';

export default function Row(props) {
    const { row, isSelected, onSelect, user, axiosJWT, setStaffs, setRows, setError } = props;
    const [open, setOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={isSelected}
                        onChange={() => onSelect(row._id)}
                    />
                </TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ width: 400, whiteSpace: 'nowrap' }} component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell sx={{ width: 400, whiteSpace: 'nowrap' }}>
                    {row.email}
                </TableCell>
                <TableCell sx={{ width: 400, whiteSpace: 'nowrap' }}>
                    {row.position_id.title}
                </TableCell>
                <TableCell sx={{ width: 600, whiteSpace: 'nowrap' }}>
                    {row.department_id.name}
                </TableCell>
                <TableCell sx={{ width: 100 }} align="left">
                    <Link to={`/staff/${row._id}`}>
                        <button
                            style={{
                                width: "50px",
                                height: "25px",
                                backgroundColor: "#03bafc",
                                border: "none",
                                borderRadius: "4px",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            Xem
                        </button>
                    </Link>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Tabs value={selectedTab} onChange={handleTabChange}>
                                <Tooltip title='Chấm công 7 ngày gần đây'><Tab sx={{ fontSize: '12px' }} label="Chấm công" /></Tooltip>
                                <Tooltip title='Bảng lương tháng này'><Tab sx={{ fontSize: '12px' }} label="Bảng lương" /></Tooltip>
                                <Tooltip title='Thưởng tháng này'><Tab sx={{ fontSize: '12px' }} label="Bảng thưởng" /></Tooltip>
                                <Tooltip title='Khấu trừ tháng này'><Tab sx={{ fontSize: '12px' }} label="Bảng khấu trừ" /></Tooltip>
                                <Tooltip title='Các phụ cấp hiện có'><Tab sx={{ fontSize: '12px' }} label="Phụ cấp" /></Tooltip>


                            </Tabs>
                            {selectedTab === 0 && (
                                <TimesheetTab row={row} />
                            )}
                            {selectedTab === 1 && (
                                <Box>
                                    <PayrollTab row={row} />
                                    {/* Hiển thị bảng lương tháng hiện tại */}
                                </Box>
                            )}
                            {selectedTab === 2 && (
                                <Box>
                                    <BonusTab
                                        row={row}
                                        user={user}
                                        axiosJWT={axiosJWT}
                                        setStaffs={setStaffs}
                                        setRows={setRows}
                                        setError={setError}
                                    />
                                    {/* Hiển thị bảng thưởng tháng hiện tại */}
                                </Box>
                            )}
                            {selectedTab === 3 && (
                                <Box>
                                    <DeductionTab
                                        row={row}
                                        user={user}
                                        axiosJWT={axiosJWT}
                                        setStaffs={setStaffs}
                                        setRows={setRows}
                                        setError={setError}
                                    />
                                    {/* Hiển thị bảng khấu trừ tháng hiện tại */}
                                </Box>
                            )}
                            {selectedTab === 4 && (
                                <Box>
                                    <AllowanceTab
                                        row={row}
                                        user={user}
                                        axiosJWT={axiosJWT}
                                        setStaffs={setStaffs}
                                        setRows={setRows}
                                        setError={setError}
                                    />
                                    {/* Hiển thị bảng phụ cấp */}
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
