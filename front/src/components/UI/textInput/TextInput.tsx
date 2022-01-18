import {FC, HTMLInputTypeAttribute} from 'react';
import './TextInput.scss';
import {generateUniqueId} from "../../../helpers";

interface TextInputProps {
  placeholder: string;
  name: string;
  type?: HTMLInputTypeAttribute;
}

const TextInput: FC<TextInputProps> = ({placeholder, name, type = 'input'}) => {
  const uniqueId = generateUniqueId();
  return (
    <div className='customTextInput'>
      <input type={type}
             className='customTextInput-input'
             placeholder={placeholder}
             name={name}
             id={uniqueId}
             required/>
      <label htmlFor={uniqueId} className='customTextInput-label'>
        {placeholder}
      </label>
    </div>
  )
}

export default TextInput;