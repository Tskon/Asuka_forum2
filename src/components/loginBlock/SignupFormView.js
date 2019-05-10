import React from 'react'
import PropTypes from 'prop-types'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import '../../scss/loginBlock/loginModal.scss'

function SignupFormView(props) {
  return (
    <div>
      <DialogContentText className="side-modal__content-text">
        Зарегистрируйтесь со своим игровым ником, данные по клану можно будет заполнить в
        личном кабинете, после подтверждения участника администратором
      </DialogContentText>
      <TextField
        onChange={props.loginOnChangeHandler}
        autoFocus
        margin="dense"
        label="Логин (игровой ник)"
        name="login"
        type="text"
        autoComplete="username"
        fullWidth
      />
      <TextField
        onChange={props.passwordOnChangeHandler}
        margin="dense"
        label="Пароль"
        name="password"
        type="password"
        autoComplete="new-password"
        fullWidth
      />
      <TextField
        onChange={props.secondPasswordOnChangeHandler}
        margin="dense"
        label="Повторите пароль"
        type="password"
        autoComplete="new-password"
        fullWidth
      />
      <TextField
        onChange={props.secretOnChangeHandler}
        margin="dense"
        label="Секретное слово"
        name="secret"
        type="password"
        autoComplete="new-password"
        fullWidth
      />
    </div>
  )
}

SignupFormView.propTypes = {
  loginOnChangeHandler: PropTypes.func.isRequired,
  passwordOnChangeHandler: PropTypes.func.isRequired,
  secondPasswordOnChangeHandler: PropTypes.func.isRequired,
  secretOnChangeHandler: PropTypes.func.isRequired,
}

export default SignupFormView
