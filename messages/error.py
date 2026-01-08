from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from .exceptions import *
from .exceptions import DevisNotFound


def create_exception_handler(status_code: int, detail: dict):
    async def handler(request: Request, exc: AppException):
        return JSONResponse(detail, status_code=status_code)
    return handler


def register_error_handlers(app: FastAPI):


    app.add_exception_handler(
        InvalidToken,
        create_exception_handler(
            status.HTTP_401_UNAUTHORIZED,
            {"detail": "Token invalide", "code": "invalid_token"}
        )
    )


    app.add_exception_handler(
        AdminAccessDenied,
        create_exception_handler(
            status.HTTP_403_FORBIDDEN,
            {
                "detail": "Action réservée aux administrateurs ou superadmins.",
                "code": "admin_access_denied"
            }
        )
    )

    app.add_exception_handler(
        AdminInactive,
        create_exception_handler(
            status.HTTP_403_FORBIDDEN,
            {
                "detail": "Votre compte n'est pas actif.",
                "code": "admin_inactive"
            }
        )
    )

    app.add_exception_handler(
        InvalidEmail,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Email incorrect", "code": "invalid_email"}
        )
    )

    app.add_exception_handler(
        InvalidPassword,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Mot de passe incorrect", "code": "invalid_password"}
        )
    )

    app.add_exception_handler(
        AdminEmailExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Cet email admin est déjà utilisé.", "code": "admin_email_exists"}
        )
    )

    app.add_exception_handler(
        AdminNumberExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Ce numéro admin est déjà utilisé.", "code": "admin_number_exists"}
        )
    )

    app.add_exception_handler(
        AdminNotFound,
        create_exception_handler(
            status.HTTP_404_NOT_FOUND,
            {"detail": "Administrateur introuvable.", "code": "admin_not_found"}
        )
    )

    app.add_exception_handler(
        AdminEmailMismatch,
        create_exception_handler(
            status.HTTP_403_FORBIDDEN,
            {"detail": "Cet email ne correspond pas au compte connecté.", "code": "email_mismatch"}
        )
    )

    # Customers

    app.add_exception_handler(
        CustomerEmailExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Cet email client est déjà utilisé.", "code": "customer_email_exists"}
        )
    )

    app.add_exception_handler(
        CustomerNumberExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Ce numéro client est déjà utilisé.", "code": "customer_number_exists"}
        )
    )

    app.add_exception_handler(
        CustomerNotFound,
        create_exception_handler(
            status.HTTP_404_NOT_FOUND,
            {"detail": "Client introuvable.", "code": "customer_not_found"}
        )
    )

    app.add_exception_handler(
        CustomerEmailUsedByOther,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Cet email est déjà utilisé par un autre client.", "code": "email_used_by_other"}
        )
    )

    app.add_exception_handler(
        CustomerNumberUsedByOther,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Ce numéro est déjà utilisé par un autre client.", "code": "number_used_by_other"}
        )
    )

    app.add_exception_handler(
        AdminStatusAlreadySet,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {
                "detail": "L'administrateur a déjà ce statut. Aucune modification effectuée.",
                "code": "admin_status_already_set"
            }
        )
    )

# Product errors

    app.add_exception_handler(
        ProductNameExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Un produit avec ce nom existe déjà.", "code": "product_name_exists"}
        )
    )


    app.add_exception_handler(
        ProductNotFound,
        create_exception_handler(
            status.HTTP_404_NOT_FOUND,
            {"detail": "Produit introuvable.", "code": "product_not_found"}
        )
    )


# Customer categorie errors

    app.add_exception_handler(
        CustomerCategoryNameExists,
        create_exception_handler(
            status.HTTP_400_BAD_REQUEST,
            {"detail": "Une catégorie avec ce nom existe déjà.", "code": "customer_category_exists"}
        )
    )

    app.add_exception_handler(
        CustomerCategoryNotFound,
        create_exception_handler(
            status.HTTP_404_NOT_FOUND,
            {"detail": "Aucune categorie trouve.", "code": "customer_category_not_found"}
        )
    )

    app.add_exception_handler(
        ExpiredSignatureErrorToken,
        create_exception_handler(
            status.HTTP_401_UNAUTHORIZED,
            {"detail": "Token expiré"}
        )
    )

    app.add_exception_handler(
        InvalidTokenErrorToken,
        create_exception_handler(
            status.HTTP_401_UNAUTHORIZED,
            {"detail": "Token invalide"}
        )
    )

    # Devis errors
    app.add_exception_handler(
        DevisNotFound,
        create_exception_handler(
            status.HTTP_404_NOT_FOUND,
            {"detail": "Devis introuvable.", "code": "devis_not_found"}
        )
    )


