import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function WorkHistoryCard({ workHistory }) {
    return (
        <Card sx={{ marginBottom: "8px", border: "1px solid" }}>
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
        <div>
            {workHistories.map((history, index) => (
                <WorkHistoryCard key={index} workHistory={history} />
            ))}
        </div>
    );
}

export default WorkHistory;