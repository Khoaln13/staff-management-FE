import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FilterAltSharpIcon from '@mui/icons-material/FilterAltSharp';
import FilterAltOffSharpIcon from '@mui/icons-material/FilterAltOffSharp';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useSelector } from 'react-redux';



function StaffFilter({ onFilter }) {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const departments = useSelector((state) => state.company.departments.departments);
    const handleFilterNameChange = (event) => {
        setName(event.target.value);
    };

    const handleFilterDepartmentChange = (event) => {
        setDepartment(event.target.value);
    };

    const handleFilterButtonClick = () => {
        onFilter(name, department);
    };



    return (
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "20px", paddingRight: "20px", height: "60px" }}>


            {isFilterOpen && (
                <>
                    <input
                        type="text"
                        placeholder="Tên nhân viên..."
                        value={name}
                        onChange={handleFilterNameChange}
                        style={{ textAlign: "center", borderColor: " rgba(0, 0, 0, 0.27) ", borderWidth: "1px", borderRadius: "4px", fontSize: "15px" }}
                    />
                    <Box sx={{ mx: 1 }}>
                        <FormControl sx={{ minWidth: 200 }} size="small">
                            <InputLabel sx={{ backgroundColor: "white" }} id="department-label">Phòng ban</InputLabel>
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
                    <IconButton
                        onClick={handleFilterButtonClick}
                        sx={{
                            backgroundColor: '#5fc29e',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#5fc29e',
                                color: 'white',
                                borderRadius: '4px',
                                filter: 'brightness(90%)'
                            }
                        }}
                    >
                        <PersonSearchIcon />
                    </IconButton>

                </>
            )}
            <div style={{ marginLeft: "10px" }}>
                <IconButton onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ backgroundColor: '#388267', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                    {
                        isFilterOpen ? <FilterAltOffSharpIcon /> : <FilterAltSharpIcon />
                    }
                </IconButton>
            </div>
        </div>
    );
}

export default StaffFilter;
