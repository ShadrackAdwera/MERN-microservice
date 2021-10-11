import Link from 'next/link'
import React, { useReducer, useState, useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from "@mui/material";
import { signIn, getSession } from 'next-auth/client';

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

const Login = (props) => {
  const { session } = props;
  const [inputState, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState();
  const [error, setError] = useState();
  
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = inputState;
    try {
      const response = await signIn("credentials", { redirect: false, email, password });
        console.log(response);
      if(response.error) {
        throw new Error(response.error);
      }

      if(!response.error) {
          console.log('Method to login. . . ');
          setUser('Logging in user');
          //login(response.user);
          setTimeout(()=>{
            router.push('/');
          },3500);
      }
    } catch (error) {
        console.log(error);
        setError('Invalid email or password');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <AuthAppBar session={session}/>
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
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", value: e.target.value })
            }
          />
          <br />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
        <div style={{margin: '1rem 0'}}></div>
        <Link href="/auth/sign-up">
          <a>Click here to sign up</a>
        </Link>
        <CustomSnackbar
          message={error? error: ''}
          severity="error"
          open={!!error}
          handleClose={()=>setError(null)}
          duration={5000}
        />
        <CustomSnackbar
          message="Login successful"
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

export async function getServerSideProps({req}) {
    const session = await getSession({req});
    if(session) {

        return {
            props: {
                session
            },
            redirect: {
                destination: '/',
                permanent: false
            }

        }
    }
    return {
        props: {
            session: null
        }
    }
}

export default Login;
