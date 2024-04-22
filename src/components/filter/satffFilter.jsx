import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

import { fetchDepartmentsAPI } from '../../api';

function StaffFilter({ onFilter }) {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);

    const handleFilterNameChange = (event) => {

        setName(event.target.value);

    };
    const handleFilterDepartmentChange = (event) => {
        setDepartment(event.target.value);
    }
    const handleFilterButtonClick = () => {
        onFilter(name, department);
    };
    useEffect(() => {

        fetchDepartmentsAPI()
            .then((response) => {

                // Lưu trữ danh sách các phòng ban vào state departments
                setDepartments(response);
            })
            .catch((error) => {
                console.error("Error fetching departments: ", error);
            });
    }, []);
    return (
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "20px", paddingRight: "20px", height: "60px" }}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleFilterNameChange}
            />
            <Box sx={{ mx: 1 }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel sx={{ backgroundColor: "white" }} id="department-label">Departments</InputLabel>
                    <Select
                        labelId="department-label"
                        value={department}
                        onChange={handleFilterDepartmentChange}
                    >
                        <MenuItem value="">
                            All Departments
                        </MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept._id} value={dept.name}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <button
                onClick={handleFilterButtonClick}
                style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Filter
            </button>
        </div>
    );
}

export default StaffFilter;
