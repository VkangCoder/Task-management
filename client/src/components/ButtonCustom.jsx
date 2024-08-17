/* eslint-disable react/prop-types */
import { Button } from 'antd'
import AddIcon from '@mui/icons-material/Add'

function ButtonCustom({ buttonTitle, onClick }) {
    return (
        <Button
            icon={<AddIcon />}
            style={{
                width: 100,
                height: 40,
            }}
            type="primary"
            onClick={onClick}>
            {buttonTitle}
        </Button>
    )
}

export default ButtonCustom
