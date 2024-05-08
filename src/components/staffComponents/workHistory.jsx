import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


function WorkHistoryCard({ workHistory }) {
    return (
        <Card sx={{
            margin: "15px", border: "1px solid",
            background: workHistory.end_date !== "Đang tiến hành"
                ? 'linear-gradient(to right, rgba(104, 222, 237, 0.7), rgba(104, 222, 237, 0.1))' :
                'linear-gradient(to right,  rgba(131, 242, 131, 0.7), rgba(131, 242, 131, 0.1))',

        }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Vị trí : {workHistory.position_id.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ngày bắt đầu: {workHistory.start_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ngày kết thúc:  {workHistory.end_date ? workHistory.end_date : "Đang tiến hành"}
                </Typography>
            </CardContent>
        </Card>
    );
}

function WorkHistory({ workHistories }) {
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
                {workHistories.map((history, index) => (
                    <WorkHistoryCard key={index} workHistory={history} />
                ))}
            </Paper>
        </Box>
    );
}

export default WorkHistory;