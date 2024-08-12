import { Button } from 'antd'
import AddIcon from '@mui/icons-material/Add'

function ButtonCustom(buttonTitle, onClick) {
    return (
        <Button
            icon={<AddIcon />}
            style={{
                width: 126,
                height: 44,
            }}
            type="primary"
            onClick={onClick}>
            {buttonTitle}
        </Button>
    )
}

export default ButtonCustom
