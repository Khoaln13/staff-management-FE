
import WorkHistory from "./workHistory";
import StaffEdit from "./staffEdit";
import TimesheetList from "./timesheet";
import HolidayList from "./HolidayList";


function InfoContent(selectedOption) {


    switch (selectedOption) {
        case 'timesheet':

            return (
                <TimesheetList />
            );
        case 'work_history':

            return (
                <WorkHistory />
            );
        case 'salary':
            return (
                <p>salary</p>
            );
        case 'holiday':
            return (
                <HolidayList />
            );
        case 'edit_profile':
            return (
                <StaffEdit />

            );

        default:
            return null;
    }
}

export default InfoContent;