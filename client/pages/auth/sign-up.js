import Link from 'next/link'
import React, { useReducer, useState } from "react";
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from "@mui/material";

import useHttp from "../../hooks/http-hook";
import AuthAppBar from "../../components/AuthAppBar";
import CustomSnackbar from "../../components/Snackbar";

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
  const { isLoading, sendRequest, error, clearError } = useHttp();
  const [user, setUser] = useState();
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = inputState;
    try {
      const response = await sendRequest(
        "http://104.155.158.22:5000/api/users/sign-up",
        "POST",
        JSON.stringify({ email, password }),
        {
          "Content-Type": "application/json",
        }
      );
      setUser(response.user);
      setTimeout(()=>{
        router.push('/auth/login');
      },3500);
    } catch (error) {}
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <AuthAppBar session={null}/>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <div className={styles.heading}>
          <h1>Sign Up</h1>
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
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", value: e.target.value })
            }
          />
          <br />
          <Button variant="contained" type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
        <div style={{margin: '1rem 0'}}></div>
        <Link href="/auth/login">
          <a>Click here to login</a>
        </Link>
        <CustomSnackbar
          message={error? error: ''}
          severity="error"
          open={!!error}
          handleClose={clearError}
          duration={5000}
        />
        <CustomSnackbar
          message="Sign up successful, login to continue"
          severity="success"
          open={!!user}
          handleClose={()=>setUser(null)}
          duration={3000}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4}></Grid>
    </Grid>
  );
};

export default SignUp;
