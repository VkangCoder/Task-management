/* eslint-disable react/prop-types */
// BaseModal.jsx
import { Modal, Form, Button, Typography } from 'antd'

const { Title } = Typography

const BaseModal = ({
    children,
    isVisible,
    title,
    onClose,
    onFormSubmit,
    modalTitle,
}) => {
    const [form] = Form.useForm()

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                onFormSubmit(values)
                onClose()
            })
            .catch(errorInfo => {
                console.log('Validate Failed:', errorInfo)
            })
    }

    return (
        <Modal
            title={title}
            open={isVisible}
            // onOk={handleOk}
            onOk={() => form.submit()}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Đồng ý
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
            <Form form={form} layout="vertical">
                {children}
            </Form>
        </Modal>
    )
}

export default BaseModal
