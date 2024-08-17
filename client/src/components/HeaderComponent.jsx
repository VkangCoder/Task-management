import { Header } from 'antd/es/layout/layout'
import Typography from 'antd/es/typography/Typography'
const { Title } = Typography

// eslint-disable-next-line react/prop-types
function HeaderComponent({ title }) {
    return (
        <Header
            style={{
                background: '#fff',
                height: '78px',
                display: 'flex',
                alignItems: 'center',
            }}>
            <div
                style={{
                    height: '46px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                <Title
                    style={{
                        fontSize: 20,
                        lineHeight: '1.5em',
                        marginBottom: 0,
                    }}>
                    {title}
                </Title>
            </div>
        </Header>
    )
}

export default HeaderComponent
