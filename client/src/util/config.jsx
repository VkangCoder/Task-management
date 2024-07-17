import { Button, Space, Tag } from 'antd'

/**--------------------- Trang Task ---------------------*/
// Định danh button type cho tab trang task
export const taskTabButton = [
    { key: 'all', label: 'Tất cả' },
    { key: 'delivering', label: 'Chưa tiếp nhận' },
    { key: 'received', label: 'Đã tiếp nhận' },
    { key: 'completed', label: 'Đã hoàn thành' },
    { key: 'deleted', label: 'Đã xóa' },
]

// Định danh cột cho tab trang task
export const taskColumns = [
    {
        title: 'Mã task',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Tên task',
        dataIndex: 'title',
        key: 'title',
    },

    {
        title: 'Mức độ ưu tiên',
        dataIndex: 'priority',
        key: 'priority',
        render: priority => {
            let backgroundColor = '#CC0000' //mặc định là Cao
            if (priority === 'Trung bình')
                backgroundColor = '#DACF71' // Trung bình
            else if (priority === 'Thấp') backgroundColor = '#4DB134' // Thấp
            return (
                <Tag
                    key={priority}
                    style={{ backgroundColor, color: '#FFFFFF' }}>
                    {priority}
                </Tag>
            )
        },
    },
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
        title: 'Phân công',
        dataIndex: 'assignee_id',
        key: 'assignee_id',
        render: assignee => {
            let backgroundColor = 'rgb(31, 71, 214, 0.1)' //mặc định là cao
            return (
                <Tag
                    style={{
                        backgrounColor: backgroundColor,
                        color: '#c41d7f',
                    }}>
                    {assignee}
                </Tag>
            )
        },
    },
    {
        title: 'Ngày hết hạn',
        dataIndex: 'end_at',
        key: 'end_at',
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
