/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Modal, Input, Select, Form, Typography, Button } from 'antd'
import useFetchDepartmentId from '../../Hooks/useFetchDepartmentId'
import useFetchTaskTypes from '../../Hooks/useFetchTaskTypes'

//Lấy các thành phần cụ thể từ các đối tượng và gán vào các biến mới
const { TextArea } = Input
const { Option } = Select
const { Title } = Typography

function AddTaskModal({ modalTitle, isVisible, onClose, onTaskAdded }) {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [selectedTaskTypes, setSelectedTaskTypes] = useState(null)

    const [form] = Form.useForm()

    /* --------------------- Post Data Task ---------------------*/
    const handleSubmit = async values => {
        setConfirmLoading(true)
        const payload = {
            title: values.title,
            description: values.description,
            department_id: selectedDepartment,
            task_types_id: selectedTaskTypes,
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
    const getDepartmentId = useFetchDepartmentId()
    const getTaskTypesId = useFetchTaskTypes(selectedDepartment, isVisible)
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
                        label="Loại công việc"
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại công việc',
                            },
                        ]}>
                        <Select
                            placeholder="Chọn loại công việc"
                            onChange={value => setSelectedTaskTypes(value)}>
                            {getTaskTypesId.map(taskType => (
                                <Option key={taskType.id} value={taskType.id}>
                                    {taskType.type_name}
                                </Option>
                            ))}
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
