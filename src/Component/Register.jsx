import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Link } from "@mui/material";
import { Box } from "@mui/system";
import { Link as RouterLink } from "react-router-dom";
import RegexHelper from "../Static/RegexHelper";
import { REGISTER_MEMBER, post } from "../Static/api";
import MuiAlertDialog from "./MuiAlertDialog";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const [validationState, setValidationState] = useState({
    email: false,
    fname: false,
    lname: false,
    password: false,
    cpassword: false,
    address: false,
    phone: false,
    user_username: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [user_username, setUserUsername] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const goToLogin = () => {
    navigate("/login");
    setOpen(false);
  };

  const handleRegister = async () => {
    if (RegexHelper.validateEmail(email)) {
      await setValidationState({ ...validationState, email: false });
      if (/^\d{10}$/.test(phone)) {
        await setValidationState({ ...validationState, phone: false });
        if (fname.length >= 2) {
          await setValidationState({ ...validationState, fname: false });
          if (lname.length >= 2) {
            await setValidationState({ ...validationState, lname: false });
            if (password.length >= 6 && password.length <= 20) {
              await setValidationState({ ...validationState, password: false });
              if (password === cpassword) {
                await setValidationState({
                  ...validationState,
                  cpassword: false,
                });
                if (address.trim() !== "") {
                  await setValidationState({
                    ...validationState,
                    address: false,
                  });
                  if (user_username.trim() !== "") {
                    await setValidationState({
                      ...validationState,
                      user_username: false,
                    });
                    let req = {
                      member_email: email,
                      member_fname: fname,
                      member_lname: lname,
                      user_password: password,
                      member_address: address,
                      member_phone: phone,
                      user_username: user_username,
                    };
                    await post(req, REGISTER_MEMBER).then(async (res) => {
                      if (res.success) {
                        let { mid, member_fname, member_lname } =
                          await res.result;
                        console.log(mid, member_fname, member_lname);
                        handleClickOpen();
                        // เด้ง SweetAlert ที่นี่เมื่อสมัครสมาชิกสำเร็จ
                        Swal.fire({
                          title: "สมัครสมาชิกสำเร็จ",
                          text: "ข้อความที่คุณต้องการแสดง",
                          icon: "success",
                          confirmButtonText: "ตกลง",
                        });
                      } else {
                        console.error(res.message);
                        // เด้ง SweetAlert ที่นี่เมื่อเกิดข้อผิดพลาด
                        Swal.fire({
                          title: "มีข้อผิดพลาด",
                          text: res.message,
                          icon: "error",
                          confirmButtonText: "ตกลง",
                        });
                      }
                    });
                  } else {
                    await setValidationState({
                      ...validationState,
                      user_username: true,
                    });
                    console.error("กรุณากรอกชื่อผู้ใช้");
                  }
                } else {
                  await setValidationState({
                    ...validationState,
                    address: true,
                  });
                  console.error("กรุณากรอกที่อยู่");
                }
              } else {
                await setValidationState({
                  ...validationState,
                  cpassword: true,
                });
                console.error("รหัสผ่านไม่ตรงกัน");
              }
            } else {
              await setValidationState({ ...validationState, password: true });
              console.error(
                "รหัสผ่านควรมีความยาวอยู่ระหว่าง 6 ถึง 20 ตัวอักษร"
              );
            }
          } else {
            await setValidationState({ ...validationState, lname: true });
            console.error("นามสกุลควรมีความยาวอย่างน้อย 2 ตัวอักษร");
          }
        } else {
          await setValidationState({ ...validationState, fname: true });
          console.error("ชื่อควรมีความยาวอย่างน้อย 2 ตัวอักษร");
        }
      } else {
        await setValidationState({ ...validationState, phone: true });
        console.error("กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง (10 หลัก)");
      }
    } else {
      await setValidationState({ ...validationState, email: true });
      console.error("กรุณากรอกอีเมลให้ถูกต้อง");
    }
  };

  useEffect(() => {
    console.log(validationState);
  }, [validationState]);

  useEffect(() => {
    console.log(description);
  }, [description]);

  return (
    <div className="container-wrapper">
      {/* <MuiAlertDialog
        open={open}
        title='สมัครสมาชิกสำเร็จแล้ว'
        description={description}
        btn1='ไปหน้า Login'
        btn1Func={goToLogin}
      /> */}
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: "#696CFF",
            py: 2,
            textAlign: "center",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h2">สมัครสมาชิก</Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "white",
            display: "grid",
            gap: 2,
            padding: 2,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
          }}
        >
          <TextField
            sx={{ mb: 2, gridColumn: "1 / span 2" }} // กำหนดให้ช่องนี้ขยายไปยัง 2 columns
            label="ชื่อผู้ใช้"
            value={user_username}
            onChange={(e) => setUserUsername(e.target.value)}
            fullWidth
            margin="normal"
            error={validationState.user_username}
          />
          <TextField
            sx={{ mb: 2, gridColumn: "1 / span 2" }}
            label="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            error={validationState.email}
          />
          <TextField
            sx={{ mb: 2 }}
            label="ชื่อ"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            fullWidth
            margin="normal"
            error={validationState.fname}
          />
          <TextField
            sx={{ mb: 2 }}
            label="นามสกุล"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            fullWidth
            margin="normal"
            error={validationState.lname}
          />
          <TextField
            sx={{ mb: 2, gridColumn: "1 / span 1" }} // กำหนดให้ช่องนี้ขยายไปยัง 2 columns
            label="ที่อยู่"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{ mb: 2 }}
            label="เบอร์โทรศัพท์"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{ mb: 2 }}
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={validationState.password}
          />
          <TextField
            sx={{ mb: 2 }}
            label="ยืนยันรหัสผ่าน"
            type="password"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={validationState.cpassword}
          />

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            คุณมีบัญชีผู้ใช้แล้ว?{" "}
            <Link component={RouterLink} to="/login" color="primary">
              เข้าสู่ระบบ
            </Link>
          </Typography>
          <Button
            sx={{ mt: 0, backgroundColor: "#55BD2A", color: "white" }}
            variant="contained"
            onClick={handleRegister}
          >
            สมัครสมาชิก
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Register;
