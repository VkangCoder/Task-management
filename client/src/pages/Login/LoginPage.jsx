import TaskFlowLogo from '../../assets/TaskFlow.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    EyeFilled,
    EyeInvisibleFilled,
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Typography, notification } from 'antd'
const { Title } = Typography
import * as AuthService from '../../util/validate.js'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [api, contextHolder] = notification.useNotification()
    const showPassword = false

    const navigate = useNavigate()

    // Kiểm tra xác thực trước khi render
    useEffect(() => {
        const checkLoggedIn = async () => {
            if (AuthService.Authenticated()) {
                navigate('/admin')
            }
        }
        checkLoggedIn()
    }, [navigate])

    useEffect(() => {
        if (loginSuccess) {
            setTimeout(() => {
                navigate('/admin')
            }, 3000) // Chờ 2 giây trước khi chuyển trang
        }
    }, [loginSuccess, navigate])

    const handleLogin = async () => {
        const result = await AuthService.login(email, password)
        if (result.success) {
            openNotificationWithIcon('success')
            setLoginSuccess(true)
        } else {
            openNotificationWithIcon('error') // Giả sử sử dụng 'error' khi đăng nhập thất bại
        }
    }

    const openNotificationWithIcon = type => {
        api[type]({
            message:
                type === 'success'
                    ? 'Đăng Nhập Thành Công'
                    : 'Đăng Nhập Thất Bại',
            description:
                type === 'success'
                    ? 'Bạn sẽ được chuyển đến trang quản trị trong vài giây.'
                    : 'Vui lòng thử lại.',
            duration: 2.5,
        })
    }

    return (
        <main className="login-page">
            {contextHolder}
            {/* ------------ Header  ------------*/}
            <div className="header">
                <img src={TaskFlowLogo} alt="Logo" className="logo" />
                <h1 className="title">Task Flow</h1>
            </div>

            {/* ------------ Login Form ------------*/}

            <Form
                style={{
                    background: '#fff',
                    width: '554px',
                    padding: '100px 50px',
                    borderRadius: '20px',
                }}
                name="normal_login"
                className="login-form"
                // onFinish={onFinish}
            >
                <Title
                    level={2}
                    style={{
                        fontFamily: [
                            'Inter',
                            'system-ui',
                            'Arial',
                            'sans-serif',
                        ],
                        fontWeight: 'bolder',
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginBottom: '30px',
                    }}>
                    Đăng Nhập
                </Title>
                <Typography style={{ color: '#344054' }}>
                    Địa chỉ e-mail
                </Typography>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'vui lòng nhập đúng địa chỉ email',
                        },
                    ]}>
                    <Input
                        onChange={e => setEmail(e.target.value)}
                        style={{ height: '48px' }}
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="E-mail"
                    />
                </Form.Item>
                <Typography style={{ color: '#344054' }}>Mật Khẩu</Typography>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập đúng mật khẩu',
                        },
                    ]}>
                    <Input.Password
                        onChange={e => setPassword(e.target.value)}
                        style={{ height: '48px' }}
                        type={showPassword ? 'text' : 'password'}
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        placeholder="Password"
                        iconRender={visible =>
                            visible ? <EyeFilled /> : <EyeInvisibleFilled />
                        }
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox style={{ fontWeight: 'bold' }}>
                            Ghi nhớ tôi
                        </Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button
                        onClick={handleLogin}
                        style={{
                            width: '100%',
                            height: '52px',
                            background: '#152B3D',
                            color: '#fff',
                        }}
                        type="button"
                        htmlType="submit"
                        className="login-form-button">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </main>
    )
}

export default LoginPage
