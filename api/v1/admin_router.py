import os
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, status, Request, Query, Form
from sqlalchemy.orm import Session
from db.database import get_db, AsyncSession
from utils.admin_utils import AdminCRUD
from schemas.admin_schemas import AdminUpdateInit
from schemas.customer_schemas import CustomerCreate, CustomerGet, CustomerDelete, CustomerUpdate, CustomerRecovery, CustomerStatus
from schemas.product_schemas import ProductCreate, ProductUpdate, ProductDelete, ProductRecovery, ProductStatus
from utils.manage_customers_utils import CustomerCRUD
from utils.manage_product_utils import ProductCRUD
from utils.customer_category_utils import CustomerCategoryCRUD
from schemas.customer_category_schemas import CustomerCategoryCreate, CustomerCategoryUpdate, CustomerCategoryDelete, CustomerCategoryRecovery, CustomerCategoryStatus
from dependencies.auth import superadmin_required, admin_required
from utils.stat_utils import StatsCRUD
from utils.audit_logs_utils import auditLogsCRUD
from fastapi.templating import Jinja2Templates


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)



router = APIRouter()




# -----------------------------------------------------------------------------
# manage customer
#------------------------------------------------------------------------------

tags=["customer"]

@router.post("/add-customer", status_code=status.HTTP_201_CREATED)
async def add_customer(customer_data: CustomerCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.create_customer(customer_data, current_user)
   

@router.put("/modify_customer", status_code=status.HTTP_200_OK)
async def modify_customer(customer_data: CustomerUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.update_customer(customer_data, current_user)


@router.delete("/delete_customer",status_code=status.HTTP_200_OK)
async def delete_customer(customer_data: CustomerDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.delete_customer(customer_data, current_user)


@router.post("/recovery_customer",status_code=status.HTTP_200_OK)
async def recovery_customer(customer_data: CustomerRecovery, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.recovery_customer(customer_data, current_user)


@router.get("/get_customer", status_code=status.HTTP_200_OK)
async def get_customer(customer_data: CustomerStatus | None = Query(None), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.get_customer(customer_data, current_user)




@router.post("/request-update-info", status_code=status.HTTP_200_OK)
async def request_update_info(admin_data: AdminUpdateInit, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return  await admin_crud.request_update_info(admin_data, current_user)


@router.get("/update-info", response_class=HTMLResponse)
async def update_info_page(request: Request, token: str, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    admin = await admin_crud.get_admin_from_token(token)

    # Rendu du formulaire HTML
    return templates.TemplateResponse("update_info.html", {
        "request": request,
        "token": token,
        "email": current_user["email"],
        "phone": current_user["number"] or ""
    })


@router.post("/apply-update", status_code=status.HTTP_200_OK)
async def apply_update(token: str = Form(...), new_email: str = Form(...), new_phone: str = Form(...), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    admin = await admin_crud.get_admin_from_token(token)

    # Mise à jour des informations
    admin.email = new_email
    admin.number = new_phone
    db.add(admin)
    await db.commit()
    await db.refresh(admin)

    return HTMLResponse(content="<h3>Vos informations ont été mises à jour avec succès !</h3>")





@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_stats(current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    stats_service = StatsCRUD(db)
    return await stats_service.get_stats()


@router.get("/audit_logs", status_code=status.HTTP_200_OK)
async def get_audit_logs(current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    logs_service = auditLogsCRUD(db)
    return await logs_service.get_audit_logs()



# -----------------------------------------------------------------------------
# manage product
#------------------------------------------------------------------------------

@router.post("/create_product", status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = ProductCRUD(db)
    return await customer_crud.create_product(product_data, current_user)


@router.put("/update_product", status_code=status.HTTP_201_CREATED)
async def update_product(product_data: ProductUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = ProductCRUD(db)
    return await customer_crud.update_product(product_data, current_user)


@router.delete("/delete_product", status_code=status.HTTP_200_OK)
async def delete_product(product_data: ProductDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    product_crud = ProductCRUD(db)
    return await product_crud.delete_product(product_data, current_user)


@router.post("/recovery_product", status_code=status.HTTP_200_OK)
async def recovery_product(product_data: ProductRecovery, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    product_crud = ProductCRUD(db)
    return await product_crud.recovery_product(product_data, current_user)


@router.get("/get_product", status_code=status.HTTP_200_OK)
async def get_product(product_data: ProductStatus | None = Query(None), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    product_crud = ProductCRUD(db)
    return await product_crud.get_product(product_data, current_user)




# -----------------------------------------------------------------------------
# manage customer category
#------------------------------------------------------------------------------

@router.post("/add_category_customer", status_code=status.HTTP_201_CREATED)
async def add_customer_category(category_data: CustomerCategoryCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.create_customer_category(category_data, current_user)


@router.put("/update_customer_category", status_code=status.HTTP_200_OK)
async def update_customer_category(category_data: CustomerCategoryUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.update_customer_category(category_data, current_user)


@router.delete("/delete_customer_category")
async def delete_customer_category(category_data: CustomerCategoryDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db),):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.delete_customer_category(category_data, current_user)


@router.post("/recovery_customer_category")
async def recovery_customer_category(category_data: CustomerCategoryRecovery, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.recovery_customer_category(category_data, current_user)


@router.get("/get_customer_category", status_code=status.HTTP_200_OK)
async def get_customer_category(category_data: CustomerCategoryStatus | None = Query(None), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.get_customer_category(category_data, current_user)

