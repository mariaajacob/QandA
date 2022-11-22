import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

 // Custom validator. (Must return an object which keys are symmetrical to values, NON Yup
//  const validate = (values: FormValues) => {
//     let errors: FormikErrors<FormValues> = {};
//     if(!values.content){
//         errors.content = 'Required'
//     } else if(values.content.length < 50) {
//         errors.content = 'Must be greater than 50 characters.'
//     }

//     return errors
//  }

 const AnswerForm = () => {
     //Pass useFormik() hook to initial form values, validate function called when values change or fields are blurred, a submit function will be called on submit.
     // Can be used within Formik tag
    //  const formik = useFormik({
    //      initialValues: {
    //          content: ''
    //      },
    //      validationSchema: Yup.object({
    //          firstName: Yup.string()
    //             .min(50, 'Must be greater than 50 characters')
    //             .required('Required')
    //      }), 
    //      onSubmit: values => {
    //          alert(JSON.stringify(values, null, 2));
             
    //      }
    //  });

    //<Formik> accepts a function as its children (aka render prop). Argument is same object returned by useFormik
     return (
         <Formik
            initialValues={{ content: '' }}
            validationSchema={
                Yup.object({
                    content: Yup.string()
                        .min(50, 'Must be greater than 50 characters')
                        .required('Required')
                })
            }
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
         >
            <Form>
                <label htmlFor="content">Content</label>
                <Field name="content" as="textarea" className="form-textarea" />
                <ErrorMessage name="content" />
            
                <button type="submit">Submit</button>
            </Form>
        </Formik>
     );
 };