/* eslint-disable react/prop-types */
import { Modal, Typography, Descriptions, Tag } from 'antd'
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
                backgroundColor: backgroundColor,
                color: '#fff',
            }}>
            {props}
        </Tag>
    )
}

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
    // const [user, setUser] = useState()

    // const fetchUser = async () => {
    //     if(!AuthService.Authenticated()) {
    //         console.error('User is not authenticated.')
    //             return
    //     }
    //     try {
    //         const token = localStorage.getItem('accessToken')
    //         const response = await fetch(
    //             `https://task-management-be-ssq1.onrender.com/v1/users/getAllUsers?filterField=id&operator==&value=${selectedDepartment}`,
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     Authorization: `${token}`,
    //                 },
    //             }
    //         )
    //     } catch (err) {

    //     }
    // }

    const items = task
        ? [
              { label: 'Mã task', content: task.id },
              { label: 'Tên task', content: task.title },
              {
                  label: 'Mô tả',
                  content: (
                      <StyledDescription>
                          <i>{task.description}</i>
                      </StyledDescription>
                  ),
              },
              {
                  label: 'Phòng phân công',
                  content: (
                      <TagAssigneeCustom department_id={task.department_id} />
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
              { label: 'Ngày tạo', content: <b>{task.created_at}</b> },
              {
                  label: 'Người tạo',
                  content: <TagCustom props={task.created_by} />,
              },
              {
                  label: 'Người cập nhật',
                  content: <TagCustom props={task.updated_by} />,
              },
              { label: 'Ngày cập nhật', content: task.updated_at },

              {
                  label: 'Trạng thái',
                  content: (
                      <ul style={{ paddingLeft: 10 }}>
                          <li>
                              <b>Trạng thái cũ: </b>
                              {task.status_change?.old_value}
                          </li>
                          <li>
                              <b>Trạng thái mới: </b>
                              {task.status_change?.new_value}
                          </li>
                          <li>
                              <b>Thay đổi bởi: </b>
                              {task.status_change?.updated_by}
                          </li>
                      </ul>
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
