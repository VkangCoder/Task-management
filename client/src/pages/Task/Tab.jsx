/* eslint-disable react/prop-types */
import { Button } from 'antd'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { taskTabButton } from '../../util/config'
import AddModal from '../../components/AddModal'

function Tab({ buttonTitle, onTabChange }) {
    const [activeView, setActiveView] = useState('all')
    //Modal State
    const [isModalVisible, setModalVisible] = useState(false)

    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)

    const handleTabClick = view => {
        setActiveView(view)
        onTabChange(view) // Gọi hàm onTabChange khi tab được thay đổi
    }

    const renderButton = tab => (
        <Button
            key={tab.key}
            className={`custom-btn-action ${
                activeView === tab.key ? 'selected' : ''
            }`}
            onClick={() => handleTabClick(tab.key)}
            type="default"
            style={{ marginRight: 12 }}>
            {tab.label}
        </Button>
    )

    return (
        <div
            style={{
                margin: '24px 0',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '0 50px',
                height: '50px',
            }}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <div>{taskTabButton.map(tab => renderButton(tab))}</div>
                <Button
                    className="custom-action-btn-add"
                    icon={<AddIcon />}
                    style={{
                        width: 126,
                        height: 44,
                    }}
                    type="primary"
                    onClick={openModal}>
                    {buttonTitle}
                </Button>
            </div>
            <AddModal
                modalTitle={'Thêm Nhiệm Vụ'}
                isVisible={isModalVisible}
                onOpen={openModal}
                onClose={closeModal}
            />
        </div>
    )
}

export default Tab
