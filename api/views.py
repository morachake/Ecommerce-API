
from django.http import JsonResponse
from  api.serializers import ProductSerializer
from api.models import Product, Order, OrderItem
# Create your views here.

def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return JsonResponse(serializer.data, safe=False)