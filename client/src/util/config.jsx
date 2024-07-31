import { Button, Space, Tag } from 'antd'

/**--------------------- Trang Task ---------------------*/
// Định danh button type cho tab trang task
export const taskTabButton = [
    { key: 'all', label: 'Tất cả' },
    { key: 'delivering', label: 'Chưa tiếp nhận' },
    { key: 'received', label: 'Đã tiếp nhận' },
    { key: 'completed', label: 'Đã hoàn thành' },
]

// Định danh cột cho tab trang task
export const taskColumns = [
    {
        title: 'Mã nhiệm vụ',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Tên nhiệm vụ',
        dataIndex: 'title',
        key: 'title',
    },
    // {
    //     title: 'Mức độ ưu tiên',
    //     dataIndex: 'priority',
    //     key: 'priority',
    //     render: priority => {
    //         let backgroundColor = '#CC0000' //mặc định là Cao
    //         if (priority === 'Trung bình')
    //             backgroundColor = '#DACF71' // Trung bình
    //         else if (priority === 'Thấp') backgroundColor = '#4DB134' // Thấp
    //         return (
    //             <Tag
    //                 key={priority}
    //                 style={{ backgroundColor, color: '#FFFFFF' }}>
    //                 {priority}
    //             </Tag>
    //         )
    //     },
    // },
    {
        title: 'Tạo bởi',
        dataIndex: 'created_by',
        key: 'created_by',
        render: current_status_id => {
            let color = '#fff'
            return (
                <Tag
                    key={current_status_id}
                    style={{ color, background: '#034752' }}>
                    {current_status_id}
                </Tag>
            )
        },
    },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
    {
        title: 'Trạng thái',
        dataIndex: 'current_status_id',
        key: 'current_status_id',
        render: current_status_id => {
            let color = '#CC0000' //mặc định là  Chưa tiếp nhận
            if (current_status_id === 'Đã tiếp nhận')
                color = '#1F47D6' // Đã tiếp nhận
            else if (current_status_id === 'Đã hoàn thành') color = '#348E1D' // Đã hoàn thành
            return (
                <span key={current_status_id} style={{ color }}>
                    {current_status_id}
                </span>
            )
        },
    },
    {
        title: 'Phòng ban được giao',
        dataIndex: 'department_id',
        key: 'department_id',
        render: current_status_id => {
            let color = '#4B8BF4'
            if (current_status_id === 'Phòng Kế Toán') color = '#F4A641'
            else if (current_status_id === 'Phòng Marketing') color = '#34D399'
            return (
                <Tag key={current_status_id} style={{ color }}>
                    {current_status_id}
                </Tag>
            )
        },
    },

    {
        title: 'Tác vụ',
        key: 'actions',
        render: () => (
            <Space>
                <Button
                    style={{
                        border: '1px solid #152B3D',
                        width: '73px',
                        height: '26px',
                        color: '#152B3D',
                    }}
                    type="link">
                    Chi tiết
                </Button>
                <Button
                    style={{
                        border: '1px solid #CC0000',
                        width: '73px',
                        height: '26px',
                        color: '#CC0000',
                    }}
                    type="link">
                    Xóa
                </Button>
            </Space>
        ),
    },
]
