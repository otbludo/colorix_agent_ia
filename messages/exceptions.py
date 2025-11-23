class AppException(Exception):
    """Base class for all custom API exceptions."""
    pass


# Auth errors
class InvalidEmail(AppException):
    pass

class InvalidPassword(AppException):
    pass


# Admin errors
class AdminEmailExists(AppException):
    pass

class AdminNumberExists(AppException):
    pass

class AdminNotFound(AppException):
    pass

class AdminEmailMismatch(AppException):
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
