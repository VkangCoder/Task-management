import { Layout } from 'antd'
import HeaderComponent from '../../components/HeaderComponent'

function User() {
    return (
        <Layout style={{ marginBottom: 16 }}>
            <HeaderComponent
                title="Quản lý người dùng"
                subTitle="Các người dùng hiện có"
            />
        </Layout>
    )
}

export default User
