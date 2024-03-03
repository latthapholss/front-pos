import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import './Login.css'; // Import CSS file
import { Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MemberProfile from './Member-Profile';

import CashierPage from '../Admin/CashierPage';
import { post,  LOGIN_MEMBER, LOGIN } from '../Static/api'
import { useNavigate } from "react-router-dom";
import { LocalStorage, localStorageKeys } from '../Static/LocalStorage';
import {useUser} from "../context";

function Login_member() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { updatePerson } = useUser();

  const handleLogin = async () => {
    // Write code to connect to the API and perform login
    // const usertype = await api.login(username, password); // Commented out since `api` is not defined
    console.log("username:", username);
    console.log("password:", password);

    if (!username || username == "" || !password || password == "") {
        if (!username || username == "") {
            alert("กรุณากรอกผู้ใช้งาน")
        } else if (!password || password == "") {
            alert("กรุณากรอกรหัสผ่าน")
        }
    } else {
        let req = { username, password }
        await post(req, LOGIN_MEMBER).then(async (res) => {
            if (res.success) {
                await LocalStorage.setItem(localStorageKeys.loginSession,JSON.stringify(res.result));
                await updatePerson()
                navigate("/member/profile");
            } else {
                alert(res.message)
            }
        })
    }
  };

  return (
    <div className="container-wrapper">
      <Container maxWidth="sm">
        <Box fullWidth sx={{ bgcolor: "#696CFF", py: 2 }}>
          <Typography variant='h2' sx={{ color: 'white', textAlign: 'center' }}>
            สมาชิกร้านค้า
          </Typography>
        </Box>
        <Box sx={{ bgcolor: "white", p: 2 }}>
          <TextField
            className="textfield"
            label="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            className="textfield"
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography variant="body2" sx={{ textAlign: 'center', margin: '1rem 0' }}>
            ยังไม่มีบัญชีผู้ใช้?{' '}
            <Link component={RouterLink} to="/register" color="primary">
              สมัครสมาชิก
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
            เป็นพนักงานของร้าน : {' '}
            <Link component={RouterLink} to="/member/login_member" color="primary">
              เข้าสู่ระบบ
            </Link>
          </Typography>
          <Button
            className="button"
            variant="contained"
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Login_member;
