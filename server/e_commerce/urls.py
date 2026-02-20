from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    
    path('api/category/', include('apps.category.urls')),
    path('api/product/', include('apps.product.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/shipping/', include('apps.shipping.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payment/', include('apps.payment.urls')),
    path('api/coupons/', include('apps.coupons.urls')),
    #path('api/profile/', include('apps.user_profile.urls')),
    #path('api/wishlist/', include('apps.wishlist.urls')),
    #path('api/reviews/', include('apps.reviews.urls')),
    
    path('admin/', admin.site.urls),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# La linea anterior --  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  -- : crea el puente entre el servidor de desarrollo de Django y los archivos subimos, permitiendo que nuestro frontend independiente pueda acceder a los archivos multimedia (imágenes, videos, etc.) que subimos a través del panel de administración de Django.


#NO necesito esta línea si el frontend se sirve desde otro dominio/puerto/servidor 7777
#urlpatterns += [re_path(r'^.*',
#                        TemplateView.as_view(template_name='index.html'))]
