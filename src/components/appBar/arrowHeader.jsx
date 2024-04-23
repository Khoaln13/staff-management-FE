


const ArrowHeader = ({ text }) => {
    const arrowHeaderStyle = {
        position: 'relative',
        display: 'inline-block',
        padding: '10px 20px',
        marginTop: '-10px',
        backgroundColor: '#fff', // Màu nền của hình chữ nhật
        color: '#556cd6', // Màu chữ
        fontSize: '18px',
        borderTopRightRadius: '50px',
        borderBottomRightRadius: '50px',
        border: '2px solid #556cd6',

    };



    return (
        <div style={arrowHeaderStyle}>

            {text}
        </div>
    );
};

export default ArrowHeader;
