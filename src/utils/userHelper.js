/* eslint-disable import/no-anonymous-default-export */
export default {
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    },
    isValidEmail(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    },
    isValidPhoneNumber(phone) {
        return /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(phone.trim())
    },
    isValidFullname(name) {
        return /^([a-zA-Zà-úÀ-Ú]{2,})+\s+([a-zA-Zà-úÀ-Ú\s]{2,})?([a-zA-Zà-úÀ-Ú]{2,})$/.test(name.trim())
    }
}