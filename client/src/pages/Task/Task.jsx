import { useEffect, useState } from 'react'
// import { Layout, Button, Input, Table, Space, Tag } from 'antd'
import { Layout, Input, Table } from 'antd'
import HeaderComponent from '../../components/HeaderComponent'
import './Task.css'
import * as AuthService from '../../util/validate.js'
import CustomPagination from '../../components/CustomPagination.jsx'
import { taskColumns } from '../../util/config.jsx'
import Tab from '../../components/Tab.jsx'
import AddTaskModal from './AddTaskModal.jsx'
const { Search } = Input

function Task() {
    const [taskData, setTaskData] = useState([])
    //Fetch Data dựa trên current_status_id và Trạng thái activeView để lọc
    const [filteredData, setFilteredData] = useState([])
    const [activeView, setActiveView] = useState('all')
    //Phân trang
    const [page, setPage] = useState(1)
    //Mở Modal thêm
    const [isModalVisible, setModalVisible] = useState(false)
    // Refesh sau khi thêm data
    const [refreshData, setRefreshData] = useState(false)

    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)

    const pageLimit = 10

    /* --------------------- Fetch Data ---------------------*/
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
                    // Lọc dữ liệu sau khi fetch và kích hoạt view  current_status_id
                    filterTasks(data.metadata, activeView)
                    console.log(data.metadata)
                } else {
                    console.error(
                        'Expected an array of Task, but received:',
                        data
                    )
                }
            } catch (error) {
                console.error('Error fetching Task:', error)
            }
        }

        fetchData()
    }, [page, activeView, refreshData])

    // Bộ lộc current_status_id
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

    /* --------------------- Lọc dữ liệu mỗi khi activeView thay đổi ---------------------*/
    useEffect(() => {
        filterTasks(taskData, activeView)
    }, [activeView, taskData])

    return (
        <Layout style={{ marginBottom: 16 }}>
            <HeaderComponent
                title="Quản Lý Nhiệm vụ"
                subTitle="Các nhiệm vụ hiện có"
            />
            <Tab
                buttonTitle={'Thêm task'}
                onTabChange={setActiveView}
                onClick={openModal}
            />
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
            <AddTaskModal
                modalTitle={'Thêm Nhiệm Vụ'}
                isVisible={isModalVisible}
                onClose={closeModal}
                onTaskAdded={() => {
                    setRefreshData(prev => !prev)
                    closeModal()
                }}
            />
        </Layout>
    )
}

export default Task
