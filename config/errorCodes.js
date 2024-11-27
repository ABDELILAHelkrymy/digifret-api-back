module.exports = {
    authErrors: {
        register: {
            fields: {
                missed: {
                    code: "AUTH_REGISTER_FIELDS_MISSED",
                    status: 400,
                    message: "Please Enter all the Feilds!",
                },
                invalid: {
                    code: "AUTH_REGISTER_FIELDS_INVALID",
                    status: 400,
                },
            },
            user: {
                exists: {
                    code: "AUTH_REGISTER_USER_IEXISTS",
                    status: 400,
                    message: "User already exists!",
                },
                notExists: {
                    code: "AUTH_REGISTER_USER_NOTEXISTS",
                    status: 404,
                    message: "User not found with given provider data!",
                },
                create: {
                    code: "AUTH_REGISTER_USER_CREATE",
                    message: "Error while creating the user!",
                },
                update: {
                    code: "AUTH_REGISTER_USER_UPDATE",
                    message: "Error while updating the user!",
                },
                completed: {
                    code: "AUTH_REGISTER_USER_COMPLETED",
                    status: 400,
                    message: "User registration is already completed!",
                },
            },
            disabled: {
                code: "AUTH_EAMIL_REGISTER_DISABLED",
                status: 400,
                message: "Registration with email is disabled!",
            },
            company: {
                create: {
                    code: "AUTH_REGISTER_COMPANY_CREATE",
                    status: 500,
                    message: "Error while creating the company!",
                },
            },
        },
        login: {
            credentials: {
                code: "AUTH_LOGIN_CREDENTIALS",
                status: 401,
                message: "Invalid Email or Password!",
            },
            fields: {
                missed: {
                    code: "AUTH_LOGIN_FIELDS_MISSED",
                    status: 400,
                    message: "Please Enter all the required Fields!",
                },
                invalid: {
                    code: "AUTH_LOGIN_FIELDS_INVALID",
                    status: 400,
                    message: "Invalid arguments!",
                },
            },
            disabled: {
                code: "AUTH_EMAIL_LOGIN_DISABLED",
                status: 400,
                message: "Login with email is disabled!",
            },
        },
        resetPasswordRequest: {
            email: {
                code: "AUTH_RESETPWREQ_EMAIL",
                status: 404,
                message: "No user found with the email {email}!",
            },
        },
        resetPasswordAction: {
            token: {
                invalid: {
                    code: "AUTH_RESETPWACT_TOKEN_INVALID",
                    status: 404,
                    message: "No user found with the token {token}!",
                },
                expired: {
                    code: "AUTH_RESETPWACT_TOKEN_EXPIRED",
                    status: 400,
                    message: "The resetPasswordToken is expired!",
                },
            },
            password: {
                code: "AUTH_RESETPWACT_PASSWORD",
                status: 400,
                message: "The new password is required!",
            },
        },
        midlleware: {
            token: {
                missed: {
                    code: "AUTH_MIDLLEWARE_TOKEN_MISSED",
                    status: 401,
                    message: "No token provided!",
                },
                expired: {
                    code: "AUTH_MIDLLEWARE_TOKEN_EXPIRED",
                    status: 401,
                    message: "Token expired!",
                },
                other: {
                    code: "AUTH_MIDLLEWARE_TOKEN_OTHER",
                    status: 401,
                    message: "Token error!",
                },
            },
            roles: {
                oneRole: {
                    code: "AUTH_MIDLLEWARE_ROLES_ONEROLE",
                    status: 403,
                    message: "Required roles missed!",
                },
                allRoles: {
                    code: "AUTH_MIDLLEWARE_ROLES_ALLROLES",
                    status: 403,
                    message: "At least one of the required roles missed!",
                },
            },
        },
    },
    profileErrors: {
        notfound: {
            code: "PROFILE_USER_NOTFOUND",
            status: 404,
            message: "User with id : '{userId}' is not found!",
        },
        timeout: {
            code: "PROFILE_USER_TIMEOUT",
            status: 404,
            message: "Timeout - The user is not found!",
        },
    },
    attachmentsError: {
        upload: {
            unknownPath: {
                code: "ATTACHMENTS_UPLOAD_UNKNOWNPATH",
                status: 500,
                message:
                    "Internal error. The file is uploaded but path is not found!",
            },
            fileMissed: {
                code: "ATTACHMENTS_UPLOAD_FILEMISSED",
                status: 400,
                message: "File is missed!",
            },
            firebaseToken: {
                code: "ATTACHMENTS_UPLOAD_FIREBASETOKEN",
                status: 500,
                message: "Error while creating the firebase token!",
            },
        },
        download: {
            filenameMissed: {
                code: "ATTACHMENTS_DOWNLOAD_FILENAMEMISSED",
                status: 400,
                message: "Filename is missed!",
            },
            fileNotFound: {
                code: "ATTACHMENTS_DOWNLOAD_FILENOTFOUND",
                status: 404,
                message: "File not found!",
            },
            notAuthorized: {
                code: "ATTACHMENTS_DOWNLOAD_NOTAUTHORIZED",
                status: 403,
                message: "You are not authorized to download this file!",
            },
        },
    },
};
