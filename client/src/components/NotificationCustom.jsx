/* eslint-disable react/prop-types */
import { List, Popover } from 'antd'
import useFetchNotifiByUser from '../Hooks/useFetchNotifiByUser'

const NotificationCustom = ({ children }) => {
    const notifications = useFetchNotifiByUser()

    const notificationContent = (
        <List
            itemLayout="vertical"
            bordered
            dataSource={notifications}
            renderItem={item => (
                <List.Item
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '12px',
                    }}>
                    <div style={{ fontWeight: 'bold' }}>{item.noti_type}</div>
                    <p>{item.noti_content}</p>

                    <p>
                        <b>Người gửi:</b> {item.noti_sender_id}
                    </p>
                    <p>
                        <b>Ngày:</b>{' '}
                        {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <p>
                        <b>Trạng thái:</b> {item.notification_status_id}
                    </p>
                </List.Item>
            )}
        />
    )
    return (
        <Popover
            placement="bottomRight"
            style={{ width: '500px' }}
            content={notificationContent}
            title={<h2>Thông Báo</h2>}>
            {children}
        </Popover>
    )
}

export default NotificationCustom
