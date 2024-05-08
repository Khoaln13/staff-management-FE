
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
const StaffDetailProfile = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 8,
                marginBottom: 8,
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
                <Avatar
                    sx={{ width: 120, height: 120, marginBottom: 2 }}
                    alt="User Avatar"
                    src="/static/images/avatar.jpg"
                />
                <Typography variant="h4" gutterBottom>
                    John Doe
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Frontend Developer
                </Typography>

                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="subtitle2">Contact Information</Typography>
                    <Typography variant="body2">Email: john.doe@example.com</Typography>
                    <Typography variant="body2">Phone: +1234567890</Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default StaffDetailProfile;
