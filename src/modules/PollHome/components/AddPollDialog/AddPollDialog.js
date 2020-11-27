import React from "react";

import { Formik, Field } from "formik";
import * as yup from "yup";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MenuItem from '@material-ui/core/MenuItem';

import XmlInput from "../XmlInput";

import {pollTypes, pollWays} from '../../lib/constants'

const TextInputComponent = ({ field, ...props }) => {
  const { errorMessage, label, type, touched } = props;
  const { name, value, onChange, onBlur } = field;
  return (
    <div>
      <TextField
        fullWidth
        type={type}
        name={name}
        label={label}
        value={value}
        error={touched && errorMessage ? true : false}
        helperText={touched && errorMessage ? errorMessage : undefined}
        onChange={onChange}
        onBlur={onBlur}
        InputLabelProps={{
          shrink: true
        }}
      />
    </div>
  );
};

const SelectInputComponent = ({ field, ...props }) => {
  const { errorMessage, label, touched, array } = props;
  const { name, value, onChange, onBlur } = field;
  return (
    <div>
      <TextField
        select
        fullWidth
        name={name}
        label={label}
        value={value}
        error={touched && errorMessage ? true : false}
        helperText={touched && errorMessage ? errorMessage : undefined}
        onChange={onChange}
        onBlur={onBlur}
        InputLabelProps={{
          shrink: true
        }}
      >
        {array.map((option, i) => (
          <MenuItem key={i} value={i}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

const AddPollDialog = ({ open, closeHndl, saveHndl }) => {
  const FILE_SIZE = 1024 * 1024;                              // 1 mb
  const codeRegExp = /^[A-Za-z]{3}[0-9]{2}-[0-9]{2}?$/
  const SUPPORTED_FORMATS = [
    "text/xml"
  ];
  const validationSchema = yup.object().shape({
    title: yup.string().required("Обязательное поле"),
    startdate: yup.date().required('Обязательное поле'),
    enddate: yup.date().required('Обязательное поле'),
    code: yup.string().matches(codeRegExp, 'Формат не валидный').required('Обязательное поле'),
    sample: yup.number().min(1, 'Не меньше одного').required('Обязательное поле'),
    type: yup.string().ensure().required('Обязательное поле'),
    way: yup.string().ensure().required('Обязательное поле'),
    xmlfile: yup
      .mixed()
      .required("Обязательное поле формы")
      .test(
        "fileSize",
        "Слишком большой файл",
        value => value && value.size <= FILE_SIZE
      )
      .test(
        "fileFormat",
        "Неподдерживаемый формат",
        value => value && SUPPORTED_FORMATS.includes(value.type)
      )
  });
  const submitHandling = (values, { setSubmitting }) => {
    saveHndl(values)
    closeHndl()
    setSubmitting(true);
  }
  return (
    <Dialog
      className="add-poll-dialog"
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      maxWidth={'sm'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Добавить опрос</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            xmlfile: undefined,
            title: undefined,
            startdate: undefined,
            enddate: undefined,
            code: undefined,
            sample: 10,
            type: 1,
            way: 1,
            comment: undefined
          }}
          validationSchema={validationSchema}
          validateOnBlur={true}
          onSubmit={submitHandling}
        >
          {
            ({
              saveHndl,
              values,
              errors,
              touched,
              dirty,
              isSubmitting,
              handleReset,
              handleSubmit,
              handleChange,
              handleBlur,
              setFieldValue
            }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={6}>
                      <Field
                        name="xmlfile"
                        component={XmlInput}
                        setFieldValue={setFieldValue}
                        errorMessage={errors["xmlfile"] ? errors["xmlfile"] : undefined}
                        touched={touched["xmlfile"]}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Field
                        name="title"
                        type="text"
                        label="Наименование"
                        setFieldValue={setFieldValue}
                        component={TextInputComponent}
                        errorMessage={errors["title"]}
                        touched={touched["title"]}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="startdate"
                        type="date"
                        label="Дата начала"
                        setFieldValue={setFieldValue}
                        component={TextInputComponent}
                        errorMessage={errors["startdate"]}
                        touched={touched["startdate"]}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="enddate"
                        type="date"
                        label="Дата окончания"
                        setFieldValue={setFieldValue}
                        component={TextInputComponent}
                        errorMessage={errors["enddate"]}
                        touched={touched["enddate"]}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="code"
                        label="Код опроса"
                        type="text"
                        setFieldValue={setFieldValue}
                        component={TextInputComponent}
                        errorMessage={errors["code"]}
                        touched={touched["code"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="sample"
                        type="number"
                        label="Выборка"
                        setFieldValue={setFieldValue}
                        component={TextInputComponent}
                        errorMessage={errors["sample"]}
                        touched={touched["sample"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="type"
                        label="Тип опроса"
                        array={pollTypes}
                        setFieldValue={setFieldValue}
                        component={SelectInputComponent}
                        errorMessage={errors["type"]}
                        touched={touched["type"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="way"
                        label="Способ проведения"
                        array={pollWays}
                        component={SelectInputComponent}
                        errorMessage={errors["way"]}
                        touched={touched["way"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="comment"
                        label="Комментарии"
                        component={TextInputComponent}
                        errorMessage={errors["comment"]}
                        touched={touched["comment"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                  <DialogActions>
                    <Button onClick={closeHndl} color="primary">
                      Отмена
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      Сохранить
                    </Button>
                  </DialogActions>
                </form>
              )
          }
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
export default AddPollDialog;