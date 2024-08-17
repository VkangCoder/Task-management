import { useEffect, useState } from 'react'
// import { Layout, Input, Table, Space, Button } from 'antd'
import { Layout, Table, Space, Button, Select } from 'antd'
import HeaderComponent from '../../components/HeaderComponent'
import './Task.css'
import * as AuthService from '../../util/validate.js'
import CustomPagination from '../../components/CustomPagination.jsx'
import { taskColumns } from '../../util/config.jsx'
import AddTaskModal from './AddTaskModal.jsx'
import DetailTaskModal from './DetailTaskModal.jsx'
import useFetchDepartmentId from '../../Hooks/useFetchDepartmentId.jsx'
import NotificationCustom from '../../components/NotificationCustom.jsx'
import TabTask from './TabTask.jsx'
import CountDisplay from '../../components/CountDisplay.jsx'
import InfoIcon from '@mui/icons-material/Info'
import DeleteIcon from '@mui/icons-material/Delete'
import ButtonCustom from '../../components/ButtonCustom.jsx'
// const { Search } = Input
const { Option } = Select

function Task() {
    const [taskData, setTaskData] = useState([])
    const [totalTaskCount, setTotalTaskCount] = useState(0)
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
    //State thông báo
    const [showNotification, setShowNotification] = useState(false)
    //Modal thêm
    const openModal = () => setModalVisible(true)

    const closeModal = () => {
        setModalVisible(false)
    }
    //Modal chi tiết
    const openModalDetail = () => setIsDetailModal(true)
    const closeModalDetail = () => setIsDetailModal(false)

    const pageLimit = 8

    // Mở chi tiết task đã chọn
    const handleOpenDetailModal = task => {
        setSelectedTask(task)
        openModalDetail()
    }

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false)
            }, 3000) // Reset sau 3 giây

            return () => clearTimeout(timer)
        }
    }, [showNotification])

    /* --------------------- Fetch Department ID ---------------------*/
    const getDepartmentId = useFetchDepartmentId()

    /* --------------------- Fetch Data  ---------------------*/
    useEffect(() => {
        const fetchData = async () => {
            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }

            const token = localStorage.getItem('accessToken')
            const baseUrl =
                'https://task-management-be-ssq1.onrender.com/v1/tasks/getAllTasks'
            const headers = {
                Authorization: `${token}`,
            }

            // Đường dẫn lấy dữ liệu phân trang
            let paginatedUrl = `${baseUrl}?page=${page}&limit=${pageLimit}`
            if (departmentId) {
                paginatedUrl += `&filterField=department_id&operator==&value=${departmentId}`
            }

            // Đường dẫn lấy tổng số nhiệm vụ (không phân trang)
            let totalCountUrl = `${baseUrl}`
            if (departmentId) {
                totalCountUrl += `?filterField=department_id&operator==&value=${departmentId}`
            }

            try {
                // Gọi API lấy dữ liệu phân trang
                const paginatedResponse = await fetch(paginatedUrl, {
                    method: 'GET',
                    headers,
                })
                const paginatedData = await paginatedResponse.json()
                if (!paginatedResponse.ok)
                    throw new Error(
                        `HTTP error! status: ${paginatedResponse.status}`
                    )
                if (paginatedData && Array.isArray(paginatedData.metadata)) {
                    setTaskData(paginatedData.metadata)
                } else {
                    console.error(
                        'Expected an array of Task, but received:',
                        paginatedData
                    )
                }

                // Gọi API lấy tổng số nhiệm vụ
                const totalCountResponse = await fetch(totalCountUrl, {
                    method: 'GET',
                    headers,
                })
                const totalCountData = await totalCountResponse.json()
                if (!totalCountResponse.ok)
                    throw new Error(
                        `HTTP error! status: ${totalCountResponse.status}`
                    )
                if (totalCountData && Array.isArray(totalCountData.metadata)) {
                    setTotalTaskCount(totalCountData.metadata.length)
                } else {
                    console.error(
                        'Expected an array of Task, but received:',
                        totalCountData
                    )
                }
            } catch (error) {
                console.error('Error fetching Task:', error)
            }
        }

        fetchData()
    }, [page, refreshData, departmentId])

    // Bộ lộc current_status_id
    const filterTasks = (tasks, view) => {
        let filtered = tasks
        switch (view) {
            case 'request':
                filtered = tasks.filter(
                    task =>
                        task.current_status_id === 'Chưa tiếp nhận' ||
                        task.current_status_id === 'Đã tiếp nhận'
                )
                break
            case 'completed':
                filtered = tasks.filter(
                    task =>
                        task.current_status_id === 'Đã hoàn thành' ||
                        task.current_status_id === 'Đã từ chối'
                )
                break
            default:
                filtered = tasks
                break
        }
        setFilteredData(filtered)
    }

    /* --------------------- Lọc dữ liệu mỗi khi activeView thay đổi ---------------------*/
    useEffect(() => {
        filterTasks(taskData, activeView)
    }, [activeView, taskData])

    return (
        <Layout style={{ marginBottom: 16 }}>
            <HeaderComponent title="Danh sách các nhiệm vụ" />
            <TabTask buttonTitle={'Thêm'} onTabChange={setActiveView} />
            <Layout style={{ padding: '0 50px 0 50px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CountDisplay count={totalTaskCount} />
                    <Select
                        defaultValue="Chọn phòng ban"
                        style={{ width: 200, margin: '0 10px' }}
                        onChange={value => setDepartmentId(value)}>
                        {getDepartmentId.map(department => (
                            <Option key={department.id} value={department.id}>
                                {department.department_name}
                            </Option>
                        ))}
                    </Select>
                    <ButtonCustom buttonTitle={'Thêm'} onClick={openModal} />
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
                                                color: '#152B3D',
                                            }}
                                            type="link">
                                            <InfoIcon />
                                        </Button>

                                        <Button
                                            style={{
                                                color: '#152b3d',
                                            }}
                                            type="link">
                                            <DeleteIcon />
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
                    setShowNotification(true)
                }}
            />
            {showNotification && (
                <NotificationCustom
                    type="success"
                    message="Tạo Nhiệm Vụ Thành Công"
                    description="Nhiệm vụ đã được thêm thành công vào cơ sở dữ liệu."
                    placement="topRight"
                />
            )}
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
