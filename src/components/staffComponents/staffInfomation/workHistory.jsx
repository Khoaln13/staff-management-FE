import { useState, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import Button from '@mui/material/Button';
import { userInfoContext } from './staffInfo';
import PositionEditForm from '../../Forms/positionEditForm';
import { useSelector } from 'react-redux';

function WorkHistoryCard({ workHistory }) {
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: 'none',
            overflowX: 'auto',
        }}>
            <CardContent sx={{
                width: 500,
                padding: 2,
                border: '1px solid rgba(0, 0, 0, 0.2)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                margin: 2,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <GroupsIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                    <Typography variant="h7">Phòng {workHistory.department_id?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <WorkIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                    <Typography variant="h7"> {workHistory.position_id?.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Ngày bắt đầu: {workHistory.start_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ngày kết thúc: {workHistory.end_date}
                </Typography>
            </CardContent>
        </Card>
    );
}

function WorkHistory() {
    const useUserInfo = useContext(userInfoContext);
    const workHistories = useUserInfo.workHistories;
    const currentWork = workHistories.find(workHistory => workHistory.end_date === null);
    const passedWorks = workHistories.filter(workHistory => workHistory.end_date !== null);
    const user = useSelector((state) => state.auth.login.currentUser);

    const isAdmin = user.user.role_id.name === 'admin';
    const [showPositionEditForm, setShowPositionEditForm] = useState(false); // State to toggle PositionEditForm

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 2,

            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                }}
            >
                <Paper sx={{
                    width: '80%',
                    padding: 2,
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    marginLeft: '-20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                }}>
                    <Typography variant='subtitle2'>Công việc hiện tại</Typography>
                    <Divider sx={{ my: 1 }}></Divider>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <GroupsIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                        <Typography variant="h7">Phòng {currentWork?.department_id?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <WorkIcon sx={{ marginRight: 2, width: "20px", height: "20px", color: "#5298fa" }} />
                        <Typography variant="h7"> {currentWork?.position_id?.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Ngày bắt đầu: {currentWork?.start_date}
                    </Typography>
                    {isAdmin && (
                        <Button
                            variant="outlined"
                            onClick={() => setShowPositionEditForm(!showPositionEditForm)}
                            sx={{
                                width: "200px",
                                margin: "20px",
                                alignSelf: "center",
                                backgroundColor: showPositionEditForm ? 'blue' : 'transparent',
                                color: showPositionEditForm ? 'white' : 'inherit',
                                '&:hover': {
                                    backgroundColor: showPositionEditForm ? '#2e79f2' : 'rgba(0, 0, 0, 0.04)',
                                },
                                fontSize: '14px',
                            }}
                        >
                            Thay đổi công việc
                        </Button>
                    )}
                    {showPositionEditForm && <PositionEditForm />}
                </Paper>
                <Typography variant='subtitle2' sx={{ alignSelf: "left", marginTop: 2 }}>Lịch sử công việc</Typography>
                <Box sx={{
                    // maxHeight: 400, // Adjust the height as needed

                    width: '100%',
                }}>
                    {passedWorks.map((history, index) => (
                        <WorkHistoryCard key={index} workHistory={history} />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}

export default WorkHistory;
