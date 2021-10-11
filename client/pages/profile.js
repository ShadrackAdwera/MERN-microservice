import React from "react";
import { getSession, signOut } from "next-auth/client"
import axios from 'axios';

import AuthAppBar from "../components/AuthAppBar"
import { getAuth } from "../utils/getAuth";
const Profile = ({user, session}) => {
    return <React.Fragment>
        <AuthAppBar session={session} signOut={signOut}/>
        <div className="centered">{`Email: ${user && user.user? user.user.email: 'Not logged in'}`}</div>
    </React.Fragment>
}

export async function getServerSideProps({req}){
    const session = await getSession({req});
    const auth = getAuth(session.user.email);
    const response = await axios.get('http://104.155.158.22:5000/api/users/currentUser', { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        }
     })
     const { data } = response;
     return {
         props: {
             user: data,
             session
         }
     }
}

export default Profile;