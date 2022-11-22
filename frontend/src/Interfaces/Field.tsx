import { FC, useContext, ChangeEvent } from 'react';
import { FormContext } from './Form';

export interface Props {
    name: string;
    label?: string;
    type?: 'Text' | 'TextArea' | 'Password'; //can be any one of the three
}

//Define field component with props destructured
export const Field: FC<Props> = ({ name, label, type = 'Text' }) => {
    const { setValue, touched, setTouched, validate } = useContext(FormContext);
    // Add union to event handler so that so that a single strongly typed handler can be used for both input and text area.
    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        //check for set value as set value is optional in form
        if (setValue) {
            setValue(name, e.currentTarget.value);
        }
        // invoke validation rules
        if (touched[name]){
            if(validate){
                validate(name);
            }
        }
    };

    //Use blur event (when object looses focus -used in form validation) to tell the form when a field has been touched, then validate the field.
    const handleBlur = () => {
        if (setTouched) {
            setTouched(name);
        }
        if(validate) {
            validate(name);
        }
    }
    return(
        //All of the components beneath the provider(in form) can access the context via a Consumer component. Can use this within the Field component.
        <FormContext.Consumer>
            {/* Destructure context to value */}
            {({values, errors}) => (
                <div className="fieldComp">
                    {label && (
                        <label className="justBold" htmlFor={name}>
                            {label}
                        </label>
                    )}
                    {(type === 'Text' || type === 'Password') && (
                        <input 
                            type={type.toLocaleLowerCase()} 
                            id={name} 
                            value={values[name] === undefined ? '' : values[name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="formFieldTypes" />
                    )}
                    {type === 'TextArea' && (
                        <textarea 
                            id={name} 
                            value={values[name] === undefined ? '': values[name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="formFieldTypes justHeight" />
                    )}
                    {/* Use map to iterate through all if the errors and render each one in a div element */}
                    {errors[name] && errors[name].length > 0 && errors[name].map(error => (
                        <div key={error} className='errorText'>
                            {error}
                        </div>
                    ))}
                </div>
            )}
        </FormContext.Consumer>
    )
}