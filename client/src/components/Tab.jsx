/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Button } from 'antd'
import AddIcon from '@mui/icons-material/Add'
// import AddModal from './AddModal'
import { taskTabButton } from '../util/config'

function Tab({ buttonTitle, onTabChange, onClick }) {
    const [activeView, setActiveView] = useState('all')

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
                    onClick={onClick}>
                    {buttonTitle}
                </Button>
            </div>
        </div>
    )
}
export default Tab
