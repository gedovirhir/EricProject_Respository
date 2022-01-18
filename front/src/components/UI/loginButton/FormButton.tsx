import './FormButton.scss';
import {ButtonHTMLAttributes, FC, FormEvent, HTMLInputTypeAttribute} from "react";

interface LoginButtonProps {
  type?: 'submit' | undefined;
  name: string;
  onClick: (arg0: any) => void;
}

const FormButton: FC<LoginButtonProps> = ({type, name, onClick}) => {
  return (
    <button
      className={'formButton'}
      onClick={(e) => onClick(e)}
      type={type}>{name}</button>
  )
}

export default FormButton;