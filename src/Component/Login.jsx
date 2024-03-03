import React, { useState } from "react";
import { Container, TextField, Button, Typography, Link } from "@mui/material";
import "./Login.css";
import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Swal from "sweetalert2";

import CashierPage from "../Admin/CashierPage";
import { post, LOGIN } from "../Static/api";
import { useNavigate } from "react-router-dom";
import { LocalStorage, localStorageKeys } from "../Static/LocalStorage";
import { useUser } from "../context";

function Login() {
  const navigate = useNavigate();
  const [user_username, setUserUsername] = useState(""); // Use 'user_username' instead of 'email'
  const [password, setPassword] = useState("");
  const { updatePerson } = useUser();

  const handleLogin = async () => {
    // Initialize error messages for username and password
    let usernameError = "";
    let passwordError = "";

    if (!user_username || user_username === "") {
      usernameError = "กรุณากรอกผู้ใช้งาน";
    }
    if (!password || password === "") {
      passwordError = "กรุณากรอกรหัสผ่าน";
    }

    // Check if there are any errors
    if (usernameError || passwordError) {
      // Display error messages using SweetAlert2
      if (usernameError && passwordError) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: `${usernameError}\n${passwordError}`,
        });
      } else if (usernameError) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: usernameError,
        });
      } else if (passwordError) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: passwordError,
        });
      }
    } else {
      let req = { user_username, user_password: password };
      console.log("Sending login request:", req);
      await post(req, LOGIN).then(async (res) => {
        console.log("Login API response:", res);
        if (res.success) {
          console.log("Login successful!");
          await LocalStorage.setItem(
            localStorageKeys.loginSession,
            JSON.stringify(res.result)
          );
          await updatePerson();

          // Check user_type and navigate accordingly
          if (res.result.user_type === 0) {
            navigate("/admin/dashboard");
          } else if (res.result.user_type === 1) {
            navigate("/admin/dashboard");
          } else if (res.result.user_type === 2) {
            navigate("/member/promotion");
            console.log("JSON Response:", res.result);
          } else {
            console.log("Invalid user type:", res.result.user_type);
            // You can handle this case with custom messages or UI updates
          }
        } else {
          // Display login failed message using SweetAlert2
          Swal.fire({
            icon: "error",
            title: "เข้าสู่ระบบล้มเหลว",
            text: res.message,
          });
          // You can handle the failed login case with custom messages or UI updates
        }
      });
    }
  };

  return (
    <div className="container-wrapper">
      <Container maxWidth="sm">
        <Box fullWidth sx={{ bgcolor: "#696CFF", py: 2 }}>
          <Typography variant="h2" sx={{ color: "white", textAlign: "center" }}>
            ระบบจัดการร้านค้า
          </Typography>
        </Box>
        <Box sx={{ bgcolor: "white", p: 2 }}>
          <TextField
            className="textfield"
            label="ชื่อผู้ใช้"
            value={user_username} // Use 'user_username' instead of 'email'
            onChange={(e) => setUserUsername(e.target.value)} // Use 'setUserUsername' instead of 'setEmail'
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
          <Typography
            variant="body2"
            sx={{ textAlign: "center", margin: "1rem 0" }}
          >
            ยังไม่มีบัญชีผู้ใช้?{" "}
            <Link component={RouterLink} to="/register" color="primary">
              สมัครสมาชิก
            </Link>
          </Typography>
          <Button
            sx={{ justifyContent: "center" }}
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

export default Login;
