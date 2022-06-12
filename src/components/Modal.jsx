import React, { useCallback, useState, useEffect } from "react";
import { Button, Modal } from 'react-bootstrap';
import UserService from "../services/Api";
import userHelper from "../utils/userHelper";

const Modals = ({
    setShow,
    show,
    setUsers,
    action,
    userData
}) => {
    useEffect(() => {
        if (!userHelper.isEmpty(userData)) {
            setUser(userData)
        }
    }, [userData])
    const handleClose = () => {
        setNameError("")
        setEmailError("")
        setPhoneError("")
        setShow(false)
    };
    const initialUserState = {
        id: null,
        fullname: "",
        email: "",
        phonenumber: ""
    };

    const isAdd = useCallback(() => action === 'add', [action])

    const [user, setUser] = useState(initialUserState);
    const [emailError, setEmailError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [nameError, setNameError] = useState("")

    const checkValidField = (user) => {
        const { fullname, email, phonenumber } = user
        if(!userHelper.isValidFullname(fullname)) {
            setNameError("Please enter valid full name !");
        }
        if(!userHelper.isValidEmail(email)) {
            setEmailError("Please enter valid email !");
        }
        if(!userHelper.isValidPhoneNumber(phonenumber)) {
            setPhoneError("Please enter valid phone number !");
        }
        return userHelper.isValidFullname(fullname) && userHelper.isValidEmail(email) && userHelper.isValidPhoneNumber(phonenumber)
    }

    const handleInputChange = (event) => {
        const { name, value } = event?.target;
        name === "fullname" && setNameError("")
        name === "email" && setEmailError("")
        name === "phonenumber" && setPhoneError("")
        setUser({ ...user, [name]: value });
    };
    const updateUser = () => {
        if(!checkValidField(user)){
            return;
        }
        UserService.update(user?.id, user)
            .then(data => {
                setUsers(prev => {
                    const newUsers = prev.map(obj => {
                        if (obj?.id === user?.id) {
                            return { ...obj, fullname: user.fullname, email: user.email, phonenumber: user.phonenumber }
                        }
                        return obj
                    })
                    return newUsers
                })
                setUser(initialUserState);
                setShow(false);
            })
    }
    const saveUser = () => {
        if(!checkValidField(user)){
            return;
        }
        var data = {
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber
        };
        UserService.create(data)
            .then(response => {
                setUsers(prev => [...prev, {
                    id: response?.data?.id,
                    fullname: response?.data?.fullname,
                    email: response?.data?.email,
                    phonenumber: response?.data?.phonenumber
                }])
                setUser(initialUserState);
                setShow(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{isAdd() ? 'Add user' : 'Edit user'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="form-group">
                            <label htmlFor="fullname" className="col-form-label">Full name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullname"
                                required
                                value={user?.fullname}
                                onChange={handleInputChange}
                                name="fullname"
                            />
                            {!!nameError && <small id="nameError" className="text-danger">
                                {nameError}
                            </small>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="col-form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                required
                                value={user?.email}
                                onChange={handleInputChange}
                                name="email"
                            />
                            {!!emailError && <small id="emailError" className="text-danger">
                                {emailError}
                            </small>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phonenumber" className="col-form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phonenumber"
                                required
                                value={user?.phonenumber}
                                onChange={handleInputChange}
                                name="phonenumber"
                            />
                            {!!phoneError && <small id="phoneError" className="text-danger">
                                {phoneError}
                            </small>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="mr-2" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={isAdd() ? saveUser : updateUser}>
                        {isAdd() ? 'Submit' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default React.memo(Modals);