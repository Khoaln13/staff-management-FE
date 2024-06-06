import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ArrowHeader from '../../appBar/arrowHeader';
import { TableFooter, InputLabel } from '@mui/material';
import { fetchStaffsAPI } from '../../../api';
import { loginSuccess } from '../../../redux/authSlice';
import { createAxios } from '../../../redux/createInstance';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../pagination/paginationAction';
import Row from './ItemStaff';
import SalaryCreateOptions from './salaryCreateDialog';

export default function ListStaff() {
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [rows, setRows] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const totalRows = rows.length


    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const departments = useSelector((state) => state.company.departments.departments);

    useEffect(() => {
        fetchStaffsAPI(user.accessToken, axiosJWT)
            .then((response) => {
                setStaffs(response.staffs);
                setRows(response.staffs);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching staff data: ', error);
                setError('' + error);
                setLoading(false);
            });
    }, []);

    const handleSelect = (_id) => {
        setSelected((prevSelected) =>
            prevSelected.includes(_id)
                ? prevSelected.filter((item) => item !== _id)
                : [...prevSelected, _id]
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value);
        applyFilters(event.target.value, filterDepartment);
    };

    const handleFilterDepartmentChange = (event) => {
        setFilterDepartment(event.target.value);
        applyFilters(filterName, event.target.value);
    };

    const applyFilters = (nameFilter, departmentFilter) => {
        const filteredRows = staffs.filter(
            (row) =>
                row.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
                row.department_id.name.toLowerCase().includes(departmentFilter.toLowerCase())
        );
        setRows(filteredRows);
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows?.length - page * rowsPerPage);



    if (error) {
        return (
            <div>
                {error === 'AxiosError: Request failed with status code 404' ? (
                    <p>Không tìm thấy dữ liệu.</p>
                ) : (
                    <p>Error: {error}</p>
                )}
                <button onClick={() => setError('')}>Trở lại</button>
            </div>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <ArrowHeader text="Danh sách nhân viên" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 2 }}>
                <SalaryCreateOptions
                    selected={selected}
                    user={user}
                    axiosJWT={axiosJWT}
                    staffs={staffs}
                    setStaffs={setStaffs}
                    setRows={setRows}
                    setError={setError}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',

                        paddingRight: '20px',
                        height: '60px',
                    }}
                >
                    <TextField
                        label="Tên nhân viên"
                        size="small"
                        variant="outlined"
                        value={filterName}
                        onChange={handleFilterNameChange}
                        sx={{ marginRight: '16px' }}
                    />
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel sx={{ backgroundColor: 'white' }} id="department-label">
                            Phòng ban
                        </InputLabel>
                        <Select
                            value={filterDepartment}
                            onChange={handleFilterDepartmentChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Filter by department' }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept._id} value={dept.name}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {loading ? (
                <h4>Loading data...</h4>
            ) : (
                <Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500, maxWidth: 1470, marginTop: 2, marginX: 4 }} aria-label="collapsible table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e6e9eb' }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < rows.length}
                                            checked={rows.length > 0 && selected.length === rows.length}
                                            onChange={(e) =>
                                                setSelected(e.target.checked ? rows.map((row) => row._id) : [])
                                            }
                                        />
                                    </TableCell>
                                    <TableCell sx={{ width: 10 }} />
                                    <TableCell sx={{ fontSize: '18px' }}>Họ và tên</TableCell>
                                    <TableCell sx={{ fontSize: '18px' }}>Email</TableCell>
                                    <TableCell sx={{ fontSize: '18px' }}>Chức vụ</TableCell>
                                    <TableCell sx={{ fontSize: '18px' }}>Phòng ban</TableCell>
                                    <TableCell sx={{ fontSize: '18px' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((row) => (
                                    <Row
                                        key={row._id}
                                        row={row}
                                        isSelected={selected.includes(row._id)}
                                        onSelect={handleSelect}
                                        user={user}
                                        axiosJWT={axiosJWT}
                                        staffs={staffs}
                                        setStaffs={setStaffs}
                                        setRows={setRows}
                                        setError={setError}
                                    />
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        sx={{ overflow: 'unset ' }}
                                        rowsPerPageOptions={[5, 10, 15, { label: 'All', value: totalRows }]}
                                        colSpan={3}
                                        labelRowsPerPage="Số hàng: "
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={Pagination}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>


                </Box>
            )}
        </Box>
    );
}