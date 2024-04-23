
import WorkHistory from "./workHistory";
function InfoContent(selectedOption, workHistories) {


    switch (selectedOption) {
        case 'work_history':

            return (
                <WorkHistory workHistories={workHistories} />
            );
        case 'salary':
            return (
                <p>salary</p>
            );
        case 'edit_profile':
            return (
                <p>edit_profile</p>

            );
        default:
            return null;
    }
}

export default InfoContent;