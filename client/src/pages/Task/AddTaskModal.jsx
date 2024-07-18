/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import {
    Modal,
    Input,
    Select,
    DatePicker,
    Form,
    Typography,
    Button,
} from 'antd'
import * as AuthService from '../../util/validate'

//Lấy các thành phần cụ thể từ các đối tượng và gán vào các biến mới
const { TextArea } = Input
const { Option } = Select
const { Title } = Typography

function AddTaskModal({ modalTitle, isVisible, onClose, onTaskAdded }) {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [getDepartmentId, setGetDepartmentId] = useState([])
    const [getUserByDepartment, setGetUserByDepartment] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState(null)

    const [form] = Form.useForm()

    /* --------------------- Post Data Task ---------------------*/
    const handleSubmit = async values => {
        setConfirmLoading(true)
        const payload = {
            title: values.title,
            description: values.description,
            assignee_id: values.assignee_id,
            priority: values.priority,
            end_at: values.end_at ? values.end_at.format('YYYY-MM-DD') : null,
        }
        console.log('sending payload: ', payload)
        try {
            const token = localStorage.getItem('accessToken')
            const response = await fetch(
                `https://task-management-be-ssq1.onrender.com/v1/tasks/createTasks`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            )
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            console.log('Task created successfully:', data)
            //reset lại form
            form.resetFields()
            // Đóng modal sau khi thêm thành công
            onClose()
            // Gọi callback truyền từ cha
            if (onTaskAdded) {
                onTaskAdded()
            }
        } catch (error) {
            console.error('Error creating task:', error)
            if (error.response) {
                const errorData = await error.response.json()
                console.error('Detailed error response:', errorData)
            }
        } finally {
            setConfirmLoading(false)
        }
    }
    /* --------------------- Fetch Department ID ---------------------*/
    useEffect(() => {
        const fetchDepartments = async () => {
            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }
            try {
                const token = localStorage.getItem('accessToken')
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/departments/getAllListIdDepartments`,
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
                    setGetDepartmentId(data.metadata)
                    console.log(data.metadata)
                } else {
                    console.error(
                        'Expected an array of department, but received:',
                        data
                    )
                }
            } catch (error) {
                console.error('Error fetching department:', error)
            }
        }
        fetchDepartments()
    }, [])

    /* --------------------- Fetch Data user base on department ---------------------*/
    useEffect(() => {
        if (!selectedDepartment) return

        const fetchUsersByDepartment = async () => {
            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }
            try {
                const token = localStorage.getItem('accessToken')
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/users/getAllUsersByDepartmentId?filterField=department_id&operator==&value=${selectedDepartment}`,
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
                    setGetUserByDepartment(data.metadata)
                    console.log(data.metadata)
                } else {
                    setGetUserByDepartment([])
                    console.error(
                        'Expected an array of products, but received:',
                        data
                    )
                }
            } catch (error) {
                console.error('Error fetching User:', error)
            }
        }
        setGetUserByDepartment([])
        fetchUsersByDepartment()
    }, [selectedDepartment])

    return (
        <>
            <Modal
                open={isVisible}
                onOk={() => form.submit()}
                confirmLoading={confirmLoading}
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={confirmLoading}
                        onClick={() => form.submit()}>
                        Xác nhận
                    </Button>,
                ]}>
                <Title
                    level={4}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        borderBottom: '1px solid #D9D9D9',
                        paddingBottom: '16px',
                    }}>
                    {modalTitle}
                </Title>
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        label="Tên nhiệm vụ"
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên nhiệm vụ',
                            },
                        ]}>
                        <Input placeholder="Nhập tên task" />
                    </Form.Item>
                    <Form.Item
                        label="Phòng ban"
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn phòng ban',
                            },
                        ]}>
                        <Select
                            placeholder="Chọn phòng ban"
                            onChange={value => setSelectedDepartment(value)}>
                            {getDepartmentId.map(department => (
                                <Option
                                    key={department.id}
                                    value={department.id}>
                                    {department.department_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="assignee_id"
                        label="Người được giao"
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Vui chọn người được giao',
                            },
                        ]}>
                        <Select
                            placeholder="Chọn người được giao"
                            disabled={!selectedDepartment}>
                            {getUserByDepartment.map(user => (
                                <Option key={user.id} value={user.id}>
                                    {user.fullname}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="end_at"
                        label="Ngày hết hạn"
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ngày hết hạn',
                            },
                        ]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày hết hạn"
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Mức Độ Ưu Tiên"
                        name="priority"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn mức độ ưu tiên',
                            },
                        ]}>
                        <Select placeholder="Mức Độ Ưu Tiên">
                            <Option value="Thấp" />
                            <Option value="Trung bình" />
                            <Option value="Cao" />
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mô tả',
                            },
                        ]}>
                        <TextArea rows={4} placeholder="Nhập mô tả" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AddTaskModal
