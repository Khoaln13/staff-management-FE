import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import { useDispatch, useSelector } from 'react-redux';


import Pagination from '../pagination/paginationAction';
import StaffItem from './staffItem';
import StaffFilter from '../filter/satffFilter';
import ArrowHeader from '../appBar/arrowHeader';
import { fetchStaffsPaginationAPI, fetchStaffsFilterAPI } from '../../api';
import { loginSuccess } from '../../redux/authSlice';
import { createAxios } from '../../redux/createInstance';


export default function StaffList() {

    const [rows, setRows] = useState([])
    const [currentPage, setcurrentPage] = useState(0);
    const [apiCurrentPage, setApiCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0)
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState()
    const [error, setError] = useState("")
    const user = useSelector((state) => state.auth.login.currentUser)
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess)

    const handleGoBack = () => {

        setError("");
    };



    const emptyRows = rowsPerPage - rows.length;

    const handleChangePage = (event, newPage) => {
        setcurrentPage(newPage);
        setApiCurrentPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setApiCurrentPage(1);
        setcurrentPage(0);
    };

    const onFilter = (name, department) => {
        setApiCurrentPage(1);
        setFilterValue({
            name: name,
            department: department
        });
    }



    useEffect(() => {
        if (user) {
            if (filterValue) {
                // Nếu có giá trị trong input, gọi API với tên nhân viên đã lọc
                fetchStaffsFilterAPI(apiCurrentPage, rowsPerPage, filterValue, user.accessToken, axiosJWT).then((response) => {

                    setRows(response.staffs);
                    setcurrentPage(response.currentPage - 1);
                    setApiCurrentPage(response.currentPage);
                    setLoading(false);
                    setRowsPerPage(response.limit);
                    setTotalRows(response.totalStaffs);

                }).catch(error => {
                    console.error("Error fetching staff data: ", error);
                    setError("" + error)
                    setLoading(false);
                });
            } else {
                // Nếu không có giá trị trong input, gọi API như bình thường
                fetchStaffsPaginationAPI(apiCurrentPage, rowsPerPage, user.accessToken, axiosJWT).then((response) => {

                    setRows(response.staffs);
                    setcurrentPage(response.currentPage - 1);
                    setApiCurrentPage(response.currentPage);
                    setLoading(false);
                    setRowsPerPage(response.limit);
                    setTotalRows(response.totalStaffs);

                }).catch(error => {
                    console.error("Error fetching staff data: ", error);
                    setError("" + error)
                    setLoading(false);
                });
            }
        }
    }, [apiCurrentPage, rowsPerPage, filterValue]);
    if (error) {
        return (
            <div>
                {error === "AxiosError: Request failed with status code 404" ? (
                    <p>Không tìm thấy dữ liệu.</p>
                ) : (
                    <p>Error: {error}</p>

                )}
                <button onClick={handleGoBack}>Trở lại</button>
            </div>
        );
    }

    return (
        <>
            <ArrowHeader text="Danh sách nhân viên" />
            <StaffFilter onFilter={onFilter} />
            {loading ? <h4>Loading data...</h4> : (<TableContainer component={Paper} >

                <Table sx={{ minWidth: 500, maxWidth: 1470, marginTop: 2, marginX: 4 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ fontSize: "18px" }}>Họ và tên</TableCell>
                            <TableCell sx={{ fontSize: "18px" }}>Email</TableCell>
                            <TableCell sx={{ fontSize: "18px" }}>Chức vụ</TableCell>
                            <TableCell sx={{ fontSize: "18px" }}>Phòng ban</TableCell>
                            <TableCell sx={{ fontSize: "18px" }}></TableCell>
                        </TableRow>
                    </TableHead>

                    <>
                        <TableBody>
                            {rows.map((row) => (
                                <StaffItem staff={row} key={row.name} />
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
                                    rowsPerPageOptions={[5, 10, 15, { label: 'All', value: totalRows }]}
                                    colSpan={3}
                                    count={totalRows}
                                    rowsPerPage={rowsPerPage}
                                    page={currentPage}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                'aria-label': 'Rows per page',
                                            },
                                            native: true,
                                        },
                                    }}
                                    labelRowsPerPage="Số hàng: "
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={Pagination}
                                />
                            </TableRow>
                        </TableFooter>
                    </>

                </Table>

            </TableContainer>)};


        </>

    );
}