import { useContext } from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import StaffEditForm from '../../Forms/staffEditForm';
import { userInfoContext } from './staffInfo';

const StaffEdit = () => {
    const useUserInfo = useContext(userInfoContext);
    const staffInfo = useUserInfo?.staffFullInfo


    return (
        staffInfo && (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 2,
                    marginBottom: 2,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        width: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        marginBottom: 4,
                    }}
                >

                    <StaffEditForm />

                </Paper>
            </Box>
        )
    );
};

export default StaffEdit;
