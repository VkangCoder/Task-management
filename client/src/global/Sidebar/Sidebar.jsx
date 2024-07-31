import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Typography } from 'antd'
import './sidebar.css'
import InsertChartIcon from '@mui/icons-material/InsertChart'
import TaskIcon from '@mui/icons-material/Task'
import LockIcon from '@mui/icons-material/Lock'
import HouseIcon from '@mui/icons-material/House'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'

const menuItemsOverview = [
    {
        key: '1',
        icon: <InsertChartIcon />,
        label: 'Thống kê',
    },
]
const menuItemsManagement = [
    {
        key: '2',
        icon: <TaskIcon />,
        label: 'Nhiệm vụ',
    },
    {
        key: '3',
        icon: <LockIcon />,
        label: 'Cấp Quyền',
    },
    {
        key: '4',
        icon: <HouseIcon />,
        label: 'Phòng Ban',
    },
    {
        key: '5',
        icon: <PersonIcon />,
        label: 'Người Dùng',
    },
]
const menuItemsLogOut = [
    {
        key: '6',
        icon: <LogoutIcon />,
        label: 'Đăng Xuất',
    },
]

function Sidebar() {
    // Giữ trạng thái chọn item
    const [selectedKey, setSelectedKey] = useState(
        localStorage.getItem('selectedKey') || null
    )
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedKey) {
            localStorage.setItem('selectedKey', selectedKey)
        }
    }, [selectedKey])

    const handleMenuClick = e => {
        setSelectedKey(e.key)
        switch (e.key) {
            case '1':
                navigate('/admin/dashboard', { replace: true })
                break
            case '2':
                navigate('/admin/task', { replace: true })
                break
            case '3':
                navigate('/admin/role', { replace: true })
                break
            case '4':
                navigate('/admin/department', { replace: true })
                break
            case '5':
                navigate('/admin/user', { replace: true })
                break
            case '6':
                localStorage.clear()
                navigate('/admin/logout', { replace: true })
                break
            default:
                break
        }
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: '80px',
                left: 0,
                height: '100%',
                width: '240px',
                background: '#fff',
                padding: '20px 0',
                borderRight: '1px solid #7F7F7F',
            }}>
            <div>
                <Typography
                    style={{
                        fontSize: 20,
                        fontFamily: 'Montserrat Alternates',
                        fontWeight: 'bold',
                        margin: '20px 0 12px 20px',
                    }}>
                    Tổng Quan
                </Typography>
                <Menu
                    defaultSelectedKeys={[1]}
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={menuItemsOverview}
                    style={{ border: 'none' }}
                />
            </div>
            <div>
                <Typography
                    style={{
                        fontSize: 20,
                        fontFamily: 'Montserrat Alternates',
                        fontWeight: 'bold',
                        margin: '40px 0 12px 20px',
                    }}>
                    Quản Lý
                </Typography>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={menuItemsManagement}
                    style={{ border: 'none' }}
                />
            </div>
            <div>
                <Typography
                    style={{
                        fontSize: 20,
                        fontFamily: 'Montserrat Alternates',
                        fontWeight: 'bold',
                        margin: '40px 0 12px 20px',
                    }}>
                    Tác vụ
                </Typography>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={menuItemsLogOut}
                    style={{ border: 'none' }}
                />
            </div>
        </div>
    )
}

export default Sidebar
