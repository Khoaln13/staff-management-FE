
import WorkHistory from "./workHistory";
import StaffDetailProfile from "./staffDetailProfile";



function InfoContent(selectedOption) {


    switch (selectedOption) {
        case 'work_history':

            return (
                <WorkHistory />
            );
        case 'salary':
            return (
                <p>salary</p>
            );
        case 'edit_profile':
            return (
                <StaffDetailProfile />

            );
        default:
            return null;
    }
}

export default InfoContent;