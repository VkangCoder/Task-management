import { useEffect, useState } from 'react'
import { Layout, Button, Input, Table, Space, Tag } from 'antd'
import HeaderComponent from '../../components/HeaderComponent'
import Tab from '../../pages/Task/Tab.jsx'
import './Task.css'
import * as AuthService from '../../util/validate.js'
import CustomPagination from '../../components/CustomPagination.jsx'
import { taskColumns } from '../../util/config.jsx'
const { Search } = Input

function Task() {
    const [taskData, setTaskData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [activeView, setActiveView] = useState('all') // Trạng thái activeView để lọc
    const [page, setPage] = useState(1)
    const pageLimit = 10

    useEffect(() => {
        const fetchData = async () => {
            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }

            try {
                const token = localStorage.getItem('accessToken')
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/tasks/getAllTasks?page=${page}&limit=${pageLimit}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                if (data && Array.isArray(data.metadata)) {
                    setTaskData(data.metadata)
                    filterTasks(data.metadata, activeView) // Lọc dữ liệu sau khi fetch
                    console.log(data.metadata)
                } else {
                    console.error(
                        'Expected an array of products, but received:',
                        data
                    )
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            }
        }

        fetchData()
    }, [page, activeView])

    const filterTasks = (tasks, view) => {
        let filtered = tasks
        if (view !== 'all') {
            filtered = tasks.filter(task => {
                switch (view) {
                    case 'delivering':
                        return task.current_status_id === 'Chưa tiếp nhận'
                    case 'received':
                        return task.current_status_id === 'Đã tiếp nhận'
                    case 'completed':
                        return task.current_status_id === 'Đã hoàn thành'
                    case 'deleted':
                        return task.current_status_id === 'Đã xóa'
                    default:
                        return true
                }
            })
        }
        setFilteredData(filtered)
    }

    useEffect(() => {
        filterTasks(taskData, activeView) // Lọc dữ liệu mỗi khi activeView thay đổi
    }, [activeView, taskData])

    return (
        <Layout style={{ marginBottom: 16 }}>
            <HeaderComponent
                title="Quản Lý Nhiệm vụ"
                subTitle="Các nhiệm vụ hiện có"
            />
            <Tab buttonTitle={'Thêm task'} onTabChange={setActiveView} />
            <Layout style={{ padding: '0 50px 0 50px' }}>
                <Search
                    placeholder="Tìm kiếm tên, trạng thái task"
                    style={{ marginBottom: 16, width: '100%' }}
                />
                <Table
                    columns={taskColumns}
                    dataSource={filteredData.map(task => ({
                        ...task,
                        key: task.id,
                    }))}
                    pagination={false}
                />
                <CustomPagination
                    total={50}
                    page={page}
                    setPage={setPage}
                    pageLimit={pageLimit}
                />
            </Layout>
        </Layout>
    )
}

export default Task
