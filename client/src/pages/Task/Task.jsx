import { useEffect, useState } from 'react'
// import { Layout, Input, Table, Space, Button } from 'antd'
import { Layout, Table, Space, Button, Select } from 'antd'
import HeaderComponent from '../../components/HeaderComponent'
import './Task.css'
import * as AuthService from '../../util/validate.js'
import CustomPagination from '../../components/CustomPagination.jsx'
import { taskColumns } from '../../util/config.jsx'
import Tab from '../../components/Tab.jsx'
import AddTaskModal from './AddTaskModal.jsx'
import DetailTaskModal from './DetailTaskModal.jsx'
import useFetchDepartmentId from '../../Hooks/useFetchDepartmentId.jsx'

// const { Search } = Input
const { Option } = Select

function Task() {
    const [taskData, setTaskData] = useState([])
    //Fetch Data dựa trên current_status_id và Trạng thái activeView để lọc
    const [filteredData, setFilteredData] = useState([])
    const [activeView, setActiveView] = useState('all')
    //Phân trang
    const [page, setPage] = useState(1)
    //Các Modal
    const [isModalVisible, setModalVisible] = useState(false) //Mở Modal thêm
    const [isDetailModal, setIsDetailModal] = useState(false) //Mở Modal chi tiết
    // Refesh sau khi thêm data
    const [refreshData, setRefreshData] = useState(false)
    //task đã chọn
    const [selectedTask, setSelectedTask] = useState(null)
    //Bộ lộc
    const [departmentId, setDepartmentId] = useState(null)
    //Modal thêm
    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)
    //Modal chi tiết
    const openModalDetail = () => setIsDetailModal(true)
    const closeModalDetail = () => setIsDetailModal(false)
    //State Search
    // const [search, setSearch] = useState('')

    const pageLimit = 8

    // Mở chi tiết task đã chọn
    const handleOpenDetailModal = task => {
        setSelectedTask(task)
        openModalDetail()
    }

    /* --------------------- Fetch Department ID ---------------------*/
    const getDepartmentId = useFetchDepartmentId()

    /* --------------------- Fetch Data  ---------------------*/
    useEffect(() => {
        const fetchData = async () => {
            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }

            try {
                const token = localStorage.getItem('accessToken')
                const baseUrl =
                    'https://task-management-be-ssq1.onrender.com/v1/tasks/getAllTasks'
                let url = `${baseUrl}?page=${page}&limit=${pageLimit}`

                if (departmentId) {
                    url += `&filterField=department_id&operator==&value=${departmentId}`
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                if (data && Array.isArray(data.metadata)) {
                    setTaskData(data.metadata)
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
        // }, [page, activeView, refreshData, search, filterValues])
    }, [page, refreshData, departmentId])

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
                <div style={{ display: 'flex' }}>
                    <p>đwd</p>
                    <Select
                        defaultValue="Chọn phòng ban"
                        style={{ width: 200, marginBottom: 16 }}
                        onChange={value => setDepartmentId(value)}>
                        {getDepartmentId.map(department => (
                            <Option key={department.id} value={department.id}>
                                {department.department_name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <Table
                    columns={taskColumns.map(col => {
                        if (col.key === 'actions') {
                            return {
                                ...col,
                                render: (_, task) => (
                                    <Space>
                                        <Button
                                            onClick={() =>
                                                handleOpenDetailModal(task)
                                            }
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
                            }
                        }
                        return col
                    })}
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
            <DetailTaskModal
                modalTitle={'Chi Tiết Nhiệm Vụ'}
                openDetail={isDetailModal}
                onClose={closeModalDetail}
                task={selectedTask}
            />
        </Layout>
    )
}

export default Task
