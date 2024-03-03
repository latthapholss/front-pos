import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';



export default function MemberUpdateManagement({ open, handleClose, memberData, handleEditMember, handleGetMember }) {

    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{selectedMember ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงาน'}</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TextField
                            sx={{ mb: 2 }}
                            label="ชื่อผู้ใช้"
                            value={user_username}
                            onChange={(e) => setUserUsername(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={validationState.user_username}
                        />
                        <TextField
                            sx={{ mb: 2 }}
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
                            sx={{ mb: 2 }}
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
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
                <Button onClick={handleSaveMember} variant="contained" color="primary">
                    {selectedMember ? 'อัปเดต' : 'บันทึก'}
                </Button>
            </DialogActions>
            <Snackbar
                open={isAlertOpen}
                autoHideDuration={6000} // Adjust the duration as needed
                onClose={() => setIsAlertOpen(false)}
            >
                <Alert severity="error">
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}
