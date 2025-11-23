from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from .exceptions import *


def create_exception_handler(status_code: int, detail: dict):
    async def handler(request: Request, exc: AppException):
        return JSONResponse(detail, status_code=status_code)
    return handler


def register_error_handlers(app: FastAPI):


    app.add_exception_handler(
        InvalidEmail,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Email incorrect", "code": "invalid_email"}
        )
    )

    app.add_exception_handler(
        InvalidPassword,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Mot de passe incorrect", "code": "invalid_password"}
        )
    )

    app.add_exception_handler(
        AdminEmailExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Cet email admin est déjà utilisé.", "code": "admin_email_exists"}
        )
    )

    app.add_exception_handler(
        AdminNumberExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Ce numéro admin est déjà utilisé.", "code": "admin_number_exists"}
        )
    )

    app.add_exception_handler(
        AdminNotFound,
        create_exception_handler(
            status.HTTP_404_NOT_FOUND,
            {"message": "Administrateur introuvable.", "code": "admin_not_found"}
        )
    )

    app.add_exception_handler(
        AdminEmailMismatch,
        create_exception_handler(
            status.HTTP_403_FORBIDDEN,
            {"message": "Cet email ne correspond pas au compte connecté.", "code": "email_mismatch"}
        )
    )

    # Customers

    app.add_exception_handler(
        CustomerEmailExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Cet email client est déjà utilisé.", "code": "customer_email_exists"}
        )
    )

    app.add_exception_handler(
        CustomerNumberExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Ce numéro client est déjà utilisé.", "code": "customer_number_exists"}
        )
    )

    app.add_exception_handler(
        CustomerNotFound,
        create_exception_handler(
            status.HTTP_404_NOT_FOUND,
            {"message": "Client introuvable.", "code": "customer_not_found"}
        )
    )

    app.add_exception_handler(
        CustomerEmailUsedByOther,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Cet email est déjà utilisé par un autre client.", "code": "email_used_by_other"}
        )
    )

    app.add_exception_handler(
        CustomerNumberUsedByOther,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"message": "Ce numéro est déjà utilisé par un autre client.", "code": "number_used_by_other"}
        )
    )

