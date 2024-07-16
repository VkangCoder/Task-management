import { Route, Routes } from 'react-router-dom'
import { Layout } from 'antd'
const { Content, Sider } = Layout
import Topbar from '../../global/Topbar/Topbar'
import Sidebar from '../../global/Sidebar/Sidebar'
import MainPage from '../MainPage/MainPage'
import DashBoard from '../Dashboard/DashBoard'
import Task from '../Task/Task'
import FormPage from '../FormPage/FormPage'
import Role from '../Role/Role'
import Department from '../Department/Department'
import User from '../User/User'
import Logout from '../Logout/Logout'

function AdminPage() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Topbar />
            <Layout>
                <Sider width="240">
                    <Sidebar />
                </Sider>
                <Content>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="dashboard" element={<DashBoard />} />
                        <Route path="task" element={<Task />} />
                        <Route path="form" element={<FormPage />} />
                        <Route path="role" element={<Role />} />
                        <Route path="department" element={<Department />} />
                        <Route path="user" element={<User />} />
                        <Route path="logout" element={<Logout />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminPage
