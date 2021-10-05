import React, { useReducer } from "react";
import { Button, Grid, TextField } from "@mui/material";

import useHttp from "../../hooks/http-hook";
import AuthAppBar from "../../components/AuthAppBar";
import styles from "./sign-up.module.css";

const initialState = {
  email: "",
  password: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.value };
    case "SET_PASSWORD":
      return { ...state, password: action.value };
    case "CLEAR":
      return state;
    default:
      return state;
  }
};

const SignUp = () => {
  const [inputState, dispatch] = useReducer(reducer, initialState);
  const { isLoading, sendRequest } = useHttp();

  const submitHandler = async(e) => {
    e.preventDefault();
    const { email, password } = inputState;
    try {
        const response = await sendRequest('http://104.154.227.48:5000/api/users/sign-up', 'POST', JSON.stringify({email, password}), {
        'Content-Type':'application/json'
    });
    console.log(response);
    } catch (error) {
        alert(error.message);
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <AuthAppBar />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <div className={styles.heading}>
          <h1>Login</h1>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={4}></Grid>
      <Grid item xs={12} sm={12} md={4}>
        <form className={styles.form} onSubmit={submitHandler}>
          <TextField
            label="email"
            name="email"
            type="email"
            required
            variant="standard"
            value={inputState.value}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", value: e.target.value })
            }
          />
          <TextField
            label="password"
            name="password"
            type="password"
            required
            variant="standard"
            value={inputState.password}
            onChange={e=>dispatch({type: 'SET_PASSWORD', value: e.target.value})}
          />
          <br />
          <Button variant="contained" type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Grid>
      <Grid item xs={12} sm={12} md={4}></Grid>
    </Grid>
  );
};

export default SignUp;
