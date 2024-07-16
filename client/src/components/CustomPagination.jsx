/* eslint-disable react/prop-types */
import { Input, Pagination } from 'antd'
// import {  Button } from 'antd'

function CustomPagination({ total, page, setPage, pageLimit }) {
    const handleJump = e => {
        const pageNumber = parseInt(e.target.value, 10)
        if (pageNumber >= 1 && pageNumber <= Math.ceil(total / pageLimit)) {
            setPage(pageNumber)
        }
    }

    return (
        <div
            style={{
                height: 68,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '0 0 8px 8px',
            }}>
            <Pagination
                total={total}
                pageSize={pageLimit}
                current={page}
                onChange={page => setPage(page)}
                // pageSizeOptions={[10, 20, 50, 100]}
            />
            <div
                style={{
                    marginRight: '10px',
                    display: 'flex',
                }}>
                {/* <Button onClick={handleJump}>Đến</Button> */}
                <p style={{ margin: '0 10px 0 0', lineHeight: '32px' }}>
                    Đến Trang
                </p>
                <Input
                    placeholder="Nhập số trang"
                    onPressEnter={handleJump}
                    style={{ width: '150px' }}
                />
            </div>
        </div>
    )
}

export default CustomPagination
