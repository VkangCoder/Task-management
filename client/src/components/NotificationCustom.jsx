/* eslint-disable react/prop-types */
import { notification } from 'antd'
import { useEffect } from 'react'

const NotificationCustom = ({ type, message, description, placement }) => {
    // Hàm để hiển thị thông báo
    const openNotification = () => {
        notification[type]({
            message: message,
            description: description,
            placement: placement,
        })
    }

    // Kích hoạt thông báo ngay khi component được render
    useEffect(() => {
        openNotification()
    }, [])

    return null // Component này không render gì cả, chỉ dùng để kích hoạt thông báo
}

NotificationCustom.defaultProps = {
    type: 'info', // Các loại: success, error, info, warning
    message: 'Thông báo mặc định',
    description: 'Đây là nội dung mặc định của thông báo.',
    placement: 'topRight', // Có thể thay đổi thành topRight, topLeft, bottomRight, bottomLeft
}

export default NotificationCustom
