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

import Pagination from '../pagination/paginationAction';
import StaffItem from './staffItem';
import StaffFilter from '../filter/satffFilter';
import ArrowHeader from '../appBar/arrowHeader';
import { fetchStaffsPaginationAPI, fetchStaffsFilterAPI } from '../../api';




export default function StaffList() {

    const [rows, setRows] = useState([])
    const [currentPage, setcurrentPage] = useState(0);
    const [apiCurrentPage, setApiCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0)
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState({})
    const [error, setError] = useState("")



    useEffect(() => {
        if (filterValue) {
            // Nếu có giá trị trong input, gọi API với tên nhân viên đã lọc
            fetchStaffsFilterAPI(apiCurrentPage, rowsPerPage, filterValue).then((response) => {

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
            fetchStaffsPaginationAPI(apiCurrentPage, rowsPerPage).then((response) => {

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
    }, [apiCurrentPage, rowsPerPage, filterValue]);
    const handleGoBack = () => {
        // setFilterValue({});
        setError("");
    };

    if (loading) {
        return <p>Loading...</p>; // Hiển thị thông báo loading trong lần render đầu tiên
    }

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

    // Avoid a layout jump when reaching the last page with empty rows.
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

    return (
        <>
            <ArrowHeader text="Danh sách nhân viên" />
            <StaffFilter onFilter={onFilter} />

            <TableContainer component={Paper} >

                <Table sx={{ minWidth: 500, maxWidth: 1470, marginTop: 2, marginX: 4 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell >Email</TableCell>
                            <TableCell >Chức vụ</TableCell>
                            <TableCell >Phòng ban</TableCell>
                            <TableCell ></TableCell>
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

            </TableContainer>

        </>

    );
}