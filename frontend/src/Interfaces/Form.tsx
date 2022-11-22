import { FC, useState, createContext, FormEvent } from 'react';
import { PrimaryButton } from '../PrimaryButton';
import { BootstrapButton } from '../Components/LovelyButton';

export interface Values {
    //Indexable type, index signature is defined rather than specific properties. 
    //The type in the square brackets defines the type for the keys in the object  and they type after the colon defines the return type when indexed.
    [key: string]: any;
}

//Indexable type where an array of validation error messages is associated with a field name.
export interface Errors {
    [key: string]: string[];
}

//For rendering validation errors if the field has been touched and lost focus. Trach whether this is the case for each field.
export interface Touched {
    [key: string]: boolean;
}

// Context will now contain the form values and a function to update them.
interface FormContextProps {
    values: Values;
    setValue?: (fiieldName: string, value: any) => void;
    errors: Errors;
    validate?: (fieldName: string) => void;
    touched: Touched;
    setTouched?: (fieldName: string) => void;
}

// We are required to pass in an initial value for the context, which is why we made the setValue function prop optional
export const FormContext = createContext<FormContextProps>({
    values: {},
    errors: {},
    touched: {}
});

//Validator will be a function that takes in the field value as well as an optional additional parameter. The validator will return an error message if the check fails and an empty string if it passes.
//TypeScript alias: creates a new name for a type. To define a type alias, we use the type keyword, followed by the alias name, followed by the type that we want to alias
type Validator = (value: any, args?: any) => string;

//Field population validation
export const required: Validator = (value: any): string =>
    value === undefined || value === null || value === '' ? 'This must be populated' : '';

//Min number of characters
export const minLength: Validator = (value: any, length: number,): string =>
    value && value.length < length ? `This must be at least ${length} characters` : '';

interface Validation {
    validator: Validator;
    arg?: any;
}

interface ValidationProp{
    [key: string]: Validation | Validation[];
}

//The function will be pass the field values from the form and will return an object containing whether the submission was successful
export interface SubmitResult {
    success: boolean;
    errors?: Errors;
}

interface Props {
    submitCaption?: string;
    validationRules?: ValidationProp;
    onSubmit: (values: Values) => Promise<SubmitResult> | void;
    submitResult?: SubmitResult;
    successMessage?: string;
    failureMessage?: string;
}

//children here to render content nested within the form.
export const Form: FC<Props> = ({ submitCaption, children, validationRules, onSubmit, submitResult, successMessage = 'Success', failureMessage = 'Something went wrong' }) => {
    const [values, setValues] = useState<Values>({});
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});
    //Submitting - submittion in progress, Submitted - form has been submitted, submit error - submission failed
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    //Validate function, return an empty array if there are no rules to check.
    const validate = (fieldName: string): string[] => {
        if(!validationRules){
            return [];
        }
        if (!validationRules[fieldName]){
            return[];
        }
        //Rules can either be a single validation object or an array of Validation objects. Implement working with an array of rules.
        //Need to keep TypeScript happy by casting validationRules[fieldName] in each option to IValidation[]using the as keyword.
        const rules = Array.isArray(validationRules[fieldName]) ? (validationRules[fieldName] as Validation[]) : ([validationRules[fieldName]] as Validation[]);
        //Iterate rules, invoking teh validator and collecting any errors in a fieldErrors array
        const fieldErrors: string[] = [];
        rules.forEach(rule => {
            const error = rule.validator(values[fieldName], rule.arg);
            if(error) {
                fieldErrors.push(error);
            }
        });
        //Update errors state with new errors
        const newErrors = { ...errors, [fieldName]: fieldErrors };
        setErrors (newErrors);
        return fieldErrors;
    };

    //Submission of the form function
    //Asynchronnously call the onSubmit function. update hte errors state from the submission result and set the submitError state accordingly.
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()){
            setSubmitting(true);
            setSubmitError(false);
            const result = await onSubmit(values);

            // The result may be passed through as a prop
            if (result === undefined) {
                return;
            }
            setErrors(result.errors || {});
            setSubmitError(!result.success);
            setSubmitting(false);
            setSubmitted(true);
        }
    }

    //Iterate through the validation rules for each field, invoking each rule and updating the errors state. Return any errors found.
    const validateForm = () => {
        const newErrors: Errors = {};
        let haveError: boolean = false;
        if (validationRules) {
            Object.keys(validationRules).forEach(fieldName => {
                newErrors[fieldName] = validate(fieldName);
                if (newErrors[fieldName].length > 0) {
                    haveError = true
                }
            })
        }
        setErrors(newErrors);
        return !haveError;
    };

    const disabled = submitResult ? submitResult.success : submitting || (submitted && !submitError);
    const showError = submitResult ? !submitResult.success : submitted && submitError;
    const showSuccess = submitResult ? submitResult.success : submitted && !submitError;

    //The form contains a field set tag that will hold the form content along with a container for our Submit button.
    //We then redner any nested child components before the Submit button using the children prop
    // ... spread syntax expands the properties in the object that is referenced after the dots. It can also be used on arrays to expand the elements in the array.
    // ...values will expand the values for each field and because of [fieldName]: value at the end of the object literal, it will override the previous value from the values object
    return (
        // Use the FormContext Provider to give the children components of the form access to it.
        <FormContext.Provider value ={{
            values,
            setValue: (fieldName: string, value: any) => {
                setValues({ ...values, [fieldName]: value });
            },
            errors,
            validate,
            touched,
            setTouched: (fieldName: string) => {
                setTouched({ ...touched, [fieldName]: true})
            }
        }}>
            <form noValidate={true} onSubmit={handleSubmit}>
                {/* Disable the form when hsubmission is in progress or the form has been successfully submitted */}
                <fieldset className="formFieldset" disabled={disabled}>
                    {children}
                    <div className="formChildren">
                        <BootstrapButton>{submitCaption}</BootstrapButton>
                    </div>
                    {showError && <p className="errorText">{failureMessage}</p>}
                    {showSuccess && <p className="successMesasge">{successMessage}</p>}
                    {/* {submitted && submitError && (
                        <p className="errorText">{failureMessage}</p>
                    )}
                    {submitted && !submitError && (
                        <p className="successText">{successMessage}</p>
                    )} */}
                </fieldset>
            </form>
        </FormContext.Provider>
    );
}