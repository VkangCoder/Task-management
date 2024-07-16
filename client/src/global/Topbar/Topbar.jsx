import { BellFilled } from '@ant-design/icons'
import TaskFlowLogo from '../../assets/TaskFlow.png'
import user from '../../assets/user.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Header } from 'antd/es/layout/layout'
import { Avatar, Typography } from 'antd'

const { Title } = Typography
function Topbar() {
    return (
        <Header
            className="Box"
            style={{
                width: '100%',
                height: '80px',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                borderBottom: '1px solid #7F7F7F',
                position: 'sticky',
                top: '0',
                zIndex: 1000,
            }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    style={{
                        width: '70px',
                        height: '70px',
                        marginRight: '10px',
                        animation: 'logo-spin infinite 8s linear',
                    }}
                    src={
                        <img
                            style={{
                                width: '50px',
                                height: '50px',
                            }}
                            src={TaskFlowLogo}
                        />
                    }
                    alt="Task Flow"
                />
                <h2
                    style={{
                        fontFamily: 'Montserrat Alternates',
                        fontWeight: 'bolder',
                        margin: 0,
                        fontSize: '24px',
                        lineHeight: '40px',
                    }}>
                    Task Flow
                </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar
                    src={user}
                    alt="Người Dùng"
                    style={{
                        width: '45px',
                        height: '45px',
                        objectFit: 'cover',
                        borderRadius: '100px',
                        border: '1px solid #505050',
                    }}
                />
                <Title level={5} style={{ fontFamily: 'Poppins', margin: 0 }}>
                    Quách Vĩnh Khang
                </Title>
                <KeyboardArrowDownIcon />
                <BellFilled />
            </div>
        </Header>
    )
}

export default Topbar
