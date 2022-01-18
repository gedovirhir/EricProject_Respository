import {FC} from "react";
import {ScaleLoader} from "react-spinners";
import './CustomSpinner.scss';

interface CustomSpinnerProps {
  color?: 'primary' | string;
}

const CustomSpinner: FC<CustomSpinnerProps> = ({color}) => {
  switch (color) {
    case 'primary':
      color = '#4eb5f1'
  }
  return (
    <div className={'customSpinner-wrapper'}>
      <ScaleLoader
        color={color}/>
    </div>
  )
}

export default CustomSpinner;