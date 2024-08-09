/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Timeline, Tag, Radio } from 'antd'
import useFetchTaskStatusId from '../Hooks/useFetchTaskStatusId'

const TimeLineCustom = ({ taskStatus }) => {
    const [mode, setMode] = useState('left') // Ban đầu chế độ là "left"
    const onChange = e => {
        setMode(e.target.value)
    }

    const getStatusId = useFetchTaskStatusId(taskStatus)

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

        return <Tag style={style}> {props}</Tag>
    }

    function getColorForStatus(status) {
        switch (status) {
            case 'Đã hoàn thành':
                return 'green'
            case 'Đã tiếp nhận':
                return 'blue'
            default:
                return 'gray'
        }
    }

    return (
        <>
            <Radio.Group
                onChange={onChange}
                value={mode}
                style={{ marginBottom: 20 }}>
                <Radio.Button value="left">Trái</Radio.Button>
                <Radio.Button value="right">Phải</Radio.Button>
            </Radio.Group>
            <Timeline mode={mode}>
                {getStatusId.map(status => (
                    <Timeline.Item
                        key={status.key}
                        color={getColorForStatus(status.status)}
                        label={status.time} // Thêm label để hiển thị ngày giờ
                    >
                        <h4>{status.title}</h4>
                        <TagPersonHandle props={status.handler} />
                        <p>{status.description}</p>
                    </Timeline.Item>
                ))}
            </Timeline>
        </>
    )
}
export default TimeLineCustom
