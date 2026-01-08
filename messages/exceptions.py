class AppException(Exception):
    """Base class for all custom API exceptions."""
    pass


# Token
class ExpiredSignatureErrorToken(AppException):
    pass

class InvalidTokenErrorToken(AppException):
    pass



# Auth errors
class InvalidEmail(AppException):
    pass

class InvalidPassword(AppException):
    pass



# Admin errors
class InvalidToken(AppException):
    pass

class AdminAccessDenied(AppException):
    pass

class AdminInactive(AppException):
    pass

class AdminEmailExists(AppException):
    pass

class AdminNumberExists(AppException):
    pass

class AdminNotFound(AppException):
    pass

class AdminEmailMismatch(AppException):
    pass

class AdminStatusAlreadySet(AppException):
    pass



# Customer errors
class CustomerEmailExists(AppException):
    pass

class CustomerNumberExists(AppException):
    pass

class CustomerNotFound(AppException):
    pass

class CustomerEmailUsedByOther(AppException):
    pass

class CustomerNumberUsedByOther(AppException):
    pass



# Product errors
class ProductNameExists(AppException):
    pass

class ProductNotFound(AppException):
    pass



# Devis errors
class DevisNotFound(AppException):
    pass



# Customer category
class CustomerCategoryNameExists(AppException):
    pass

class CustomerCategoryNotFound(AppException):
    pass