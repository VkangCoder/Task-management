/* eslint-disable react/prop-types */
const CountDisplay = ({ count }) => {
    return (
        <div
            style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: '2px solid orange', // Đặt độ dày và màu sắc của viền
                backgroundColor: 'transparent', // Đặt màu nền trong suốt
                color: 'orange',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                margin: '10px 10px',
            }}>
            {count}
        </div>
    )
}
export default CountDisplay
