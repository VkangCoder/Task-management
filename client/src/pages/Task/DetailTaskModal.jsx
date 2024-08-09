/* eslint-disable react/prop-types */
import { Modal, Typography, Descriptions, Tag, Spin } from 'antd'
import TimeLineCustom from '../../components/TimeLineCustom'
const { Title } = Typography

const TagAssigneeCustom = ({ department_id }) => {
    let color = '#4B8BF4'
    if (department_id === 'Phòng Kế Toán') color = '#F4A641'
    else if (department_id === 'Phòng Marketing') color = '#34D399'
    return (
        <Tag
            key={department_id}
            style={{ backgroundColor: 'rgba(31, 71, 214, 0.1)', color: color }}>
            {department_id}
        </Tag>
    )
}

const TagCustom = ({ props }) => {
    let backgroundColor = '#034752'
    return (
        <Tag
            style={{
                fontSize: '14px',
                backgroundColor: backgroundColor,
                color: '#fff',
            }}>
            {props}
        </Tag>
    )
}

const TagPersonHandle = ({ props }) => {
    let style = {
        fontSize: '14px',
        backgroundColor: '#034752', // Mặc định là màu xanh dương đậm
        color: '#fff',
    }

    if (!props) {
        style.backgroundColor = '#CC0000' // Đỏ cho trạng thái 'Chưa tiếp nhận'
        style.color = '#fff'
        props = <strong>Chưa tiếp nhận</strong>
    }

    return <Tag style={style}>{props}</Tag>
}

const TagCurrentStatusCustom = ({ currentStatusId }) => {
    let color = '#CC0000' //mặc định là  Chưa tiếp nhận
    if (currentStatusId === 'Đã tiếp nhận') color = '#1F47D6' // Đã tiếp nhận
    else if (currentStatusId === 'Đã hoàn thành') color = '#348E1D' // Đã hoàn thành
    return (
        <span key={currentStatusId} style={{ color, marginLeft: '10px' }}>
            {currentStatusId}
        </span>
    )
}

const StyledDescription = ({ children }) => {
    return (
        <div
            style={{
                padding: '8px 12px',
                minHeight: '90px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                background: '#fff',
                color: '#000',
                fontSize: '14px',
                overflow: 'auto',
            }}>
            <p>{children}</p>
        </div>
    )
}

function DetailTaskModal({ openDetail, onClose, task, modalTitle }) {
    const items = task
        ? [
              { label: 'Mã nhiệm vụ', content: task.id },
              { label: 'Tên nhiệm vụ', content: task.title },
              {
                  label: 'Loại nhiệm vụ',
                  content: <Tag color="magenta">{task.task_types_id}</Tag>,
              },
              {
                  label: 'Phòng phân công',
                  content: (
                      <TagAssigneeCustom department_id={task.department_id} />
                  ),
              },
              {
                  label: 'Người tạo',
                  content: <TagCustom props={task.created_by} />,
              },
              {
                  label: 'Mô tả',
                  content: (
                      <StyledDescription>
                          <p style={{ fontSize: '16px' }}>{task.description}</p>
                      </StyledDescription>
                  ),
              },
              {
                  label: 'Trạng thái',
                  content: (
                      <TagCurrentStatusCustom
                          currentStatusId={task.current_status_id}
                      />
                  ),
              },
              {
                  label: 'Lịch sử trạng thái',
                  //   content: <TimeLineCustom taskStatus={task.id} />,
                  content:
                      task.current_status_id === 'Chưa tiếp nhận' ? (
                          <div>
                              <Spin />
                              <TagCurrentStatusCustom currentStatusId="Đang đợi tiếp nhận" />
                          </div>
                      ) : (
                          <TimeLineCustom taskStatus={task.id} />
                      ),
              },
          ]
        : []

    return (
        <Modal
            open={openDetail}
            onCancel={onClose}
            onOk={onClose}
            width={900}
            height={700}
            style={{ top: 50 }}>
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
            <Descriptions
                bordered
                column={1}
                size="small"
                items={items.map(item => ({
                    label: item.label,
                    children: item.content,
                }))}
            />
            {!task && <p>No task data available.</p>}
        </Modal>
    )
}

export default DetailTaskModal
