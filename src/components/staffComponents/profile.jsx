
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import WorkIcon from '@mui/icons-material/Work';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const Profile = ({ staffInfo }) => {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 8,
                marginBottom: 8,
                width: '30%',
            }}
        >
            <Avatar
                sx={{ width: 120, height: 120, marginBottom: 2 }}
                alt="User Avatar"
                src="/static/images/avatar.jpg"
            />
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    maxWidth: 400,
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    marginBottom: 4,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: "bold", alignSelf: "center" }} gutterBottom>
                    {staffInfo?.name}
                </Typography>
                <Typography variant="h6" sx={{ alignSelf: "center" }} gutterBottom>
                    Phòng {staffInfo.department_id?.name}
                </Typography>
                <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'row', }}>
                    <WorkIcon sx={{ marginRight: "10px", color: "#3dd1eb" }} />
                    <Typography sx={{ fontSize: "16px" }} gutterBottom>
                        {staffInfo.position_id?.title}
                    </Typography>
                </Box>


                <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'row', }}>
                    <ContactMailIcon sx={{ marginRight: "10px", color: "#3dd1eb" }} />
                    <Typography sx={{ fontSize: "16px" }}> {staffInfo?.email}</Typography>
                </Box>
                <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'row', }}>
                    <ContactPhoneIcon sx={{ marginRight: "10px", color: "#3dd1eb" }} />
                    <Typography sx={{ fontSize: "16px" }}> {staffInfo?.phone}</Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
