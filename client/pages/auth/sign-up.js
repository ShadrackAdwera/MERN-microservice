import React from 'react';
import { Button, Grid, TextField  } from '@mui/material';

import AuthAppBar from '../../components/AuthAppBar';
import styles from './sign-up.module.css';

const SignUp = () => {
    return <Grid container spacing={2}>
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
            <form className={styles.form}>
            <TextField label='email' name='email' type='email' required variant="standard"/>
            <TextField label='password' name='password' type='password' required variant="standard"/>
            <br />
            <Button variant='contained' type='submit'>Submit</Button>
            </form>
        </Grid>
        <Grid item xs={12} sm={12} md={4}></Grid>
    </Grid>

}

export default SignUp;