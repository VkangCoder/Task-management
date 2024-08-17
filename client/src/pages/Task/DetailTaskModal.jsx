/* eslint-disable react/prop-types */
import { Modal, Typography, Descriptions, Input, Button } from 'antd'
const { Title, Text } = Typography
import picture from '../../assets/fake img/Lẩu Tứ Xuyên.jpg'

const TagCurrentStatusCustom = ({ currentStatusId }) => {
    let color = '#CC0000' //mặc định là  Chưa tiếp nhận
    if (currentStatusId === 'Đã tiếp nhận') color = '#1F47D6' // Đã tiếp nhận
    else if (currentStatusId === 'Đã hoàn thành') color = '#348E1D' // Đã hoàn thành
    return (
        <span key={currentStatusId} style={{ color }}>
            {currentStatusId}
        </span>
    )
}

const StyledImage = ({ image }) => {
    return (
        <div
            style={{
                padding: '8px',
                border: '1px solid #ccc',
                marginBottom: '20px',
            }}>
            <img
                src={image}
                alt="Đính kèm"
                style={{ width: '100%', height: 'auto' }}
            />
        </div>
    )
}

const StyledDescription = ({ content }) => {
    return (
        <div
            style={{
                padding: '8px 12px',
                minHeight: '90px',
                background: '#fff',
                color: '#000',
                fontSize: '14px',
                overflow: 'auto',
            }}>
            <p>{content}</p>
        </div>
    )
}

function DetailTaskModal({ openDetail, onClose, task, modalTitle }) {
    const items = task
        ? [
              {
                  label: <Text strong>Người tạo</Text>,
                  content: <p>{task.created_by}</p>,
              },
              {
                  label: <Text strong>Ngày tạo</Text>,
                  content: <p>{task.created_at}</p>,
              },
              {
                  label: <Text strong>Phòng phân công</Text>,
                  content: <p>{task.department_id}</p>,
              },
              {
                  label: <Text strong>Trạng Thái</Text>,
                  content: (
                      <TagCurrentStatusCustom
                          currentStatusId={task.current_status_id}
                      />
                  ),
              },
              {
                  label: <Text strong>File đính kèm</Text>,
                  content: <a href="#">Link</a>,
              },
              {
                  label: <Text strong>Hình ảnh đính kèm</Text>,
                  content: <StyledImage image={picture} />,
              },
              {
                  label: <Text strong>Nội dung yêu cầu</Text>,
                  content: <StyledDescription content={task.description} />,
              },
              {
                  label: <Text strong>Đóng góp ý kiến</Text>,
                  content: (
                      <Input.TextArea
                          rows={4}
                          placeholder="Nhập đóng góp ý kiến"
                      />
                  ),
              },
          ]
        : []

    if (task && task.current_status_id === 'Đã hoàn thành') {
        items.splice(
            2,
            0,
            {
                label: <Text strong>Ngày xử lý</Text>,
                content: <p>{task.updated_at}</p>,
            },
            {
                label: <Text strong>Người xử lý</Text>,
                content: <p>{task.updated_by}</p>,
            }
        )
    }

    return (
        <Modal
            open={openDetail}
            onCancel={onClose}
            width={700}
            style={{ top: 20 }}
            footer={[
                <Button key="submit" type="primary" onClick={onClose}>
                    Xác nhận
                </Button>,
            ]}>
            <Title
                level={4}
                style={{
                    borderBottom: '1px solid #D9D9D9',
                    paddingBottom: '10px',
                }}>
                {modalTitle}
            </Title>
            <Descriptions
                column={1}
                size="small"
                style={{ marginBottom: '20px' }}>
                <Descriptions.Item span={2}>
                    <Descriptions column={2}>
                        {items.slice(0, 4).map((item, index) => (
                            <Descriptions.Item label={item.label} key={index}>
                                {item.content}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </Descriptions.Item>
                <Descriptions.Item span={2}>
                    <Descriptions column={1}>
                        {items.slice(4).map((item, index) => (
                            <Descriptions.Item label={item.label} key={index}>
                                {item.content}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    )
}

export default DetailTaskModal
