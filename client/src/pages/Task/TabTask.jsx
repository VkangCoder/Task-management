/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Button } from 'antd'
import { taskTabButton } from '../../util/config'

function TabTask({ onTabChange }) {
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
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '40px 50px',
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
            </div>
        </div>
    )
}
export default TabTask
