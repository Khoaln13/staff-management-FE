
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Divider from '@mui/material/Divider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';

const Profile = ({ staffInfo }) => {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 4,
                marginBottom: 2,
                width: '40%',
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    paddingBottom: 4,
                    maxWidth: 400,
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 4,
                }}
            >
                <Avatar
                    sx={{ width: 120, height: 120, marginY: 2 }}
                    alt="User Avatar"
                    src="/static/images/avatar.jpg"
                />
                <Typography variant="h5" sx={{ fontWeight: "bold", alignSelf: "center" }} gutterBottom>
                    {staffInfo?.name}
                </Typography>

                <Box sx={{ width: 330, marginTop: 2 }}>
                    <Paper sx={{
                        padding: 2,
                        marginBottom: 2,
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
                    }}>
                        <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>Thông tin cá nhân</Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <CakeIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                            <Typography variant="h7"> {staffInfo.dateOfBirth}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <WcIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                            <Typography variant="h7"> {staffInfo.gender === 'male' ? 'Nam' : 'Nữ'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                            <Typography variant="h7"> {staffInfo.address}</Typography>
                        </Box>
                    </Paper>
                    <Paper sx={{
                        padding: 2,
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' // Thêm đổ bóng
                    }}>
                        <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>Thông tin liên hệ</Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <EmailIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                            <Typography variant="h7"> {staffInfo.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <PhoneIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                            <Typography variant="h7"> {staffInfo.phone}</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
