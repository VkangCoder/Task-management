import { Button } from 'antd'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'

// eslint-disable-next-line react/prop-types
function Tab({ buttonTitle }) {
    const [activeView, setActiveView] = useState('all')
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
                <div>
                    <Button
                        className={`custom-btn-action ${
                            activeView === 'all' ? 'selected' : ''
                        }`}
                        onClick={() => setActiveView('all')}
                        type="default"
                        style={{ marginRight: 12 }}>
                        Tất cả (4)
                    </Button>
                    <Button
                        className={`custom-btn-action ${
                            activeView === 'delivering' ? 'selected' : ''
                        }`}
                        onClick={() => setActiveView('delivering')}
                        type="default"
                        style={{ marginRight: 12 }}>
                        Đang giao (2)
                    </Button>
                    <Button
                        className={`custom-btn-action ${
                            activeView === 'completed' ? 'selected' : ''
                        }`}
                        onClick={() => setActiveView('completed')}
                        type="default"
                        style={{ marginRight: 12 }}>
                        Đã hoàn thành (1)
                    </Button>
                    <Button
                        className={`custom-btn-action ${
                            activeView === 'deleted' ? 'selected' : ''
                        }`}
                        onClick={() => setActiveView('deleted')}
                        type="default"
                        style={{ marginRight: 12 }}>
                        Đã xóa (3)
                    </Button>
                </div>
                <Button
                    className="custom-action-btn-add"
                    icon={<AddIcon />}
                    style={{
                        width: 126,
                        height: 44,
                    }}
                    type="primary">
                    {buttonTitle}
                </Button>
            </div>
        </div>
    )
}

export default Tab
