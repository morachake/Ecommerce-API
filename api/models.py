import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
# Create your models here.


class User(AbstractBaseUser):
    pass 

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveBigIntegerField()
    image = models.ImageField(upload_to='products/',blank=True, null=True)
    
    @property
    def in_Stock(self):
        return self.stock > 0
    
    def __str__(self):
        return self.name

class Order(models.Model):
    class orderStatus(models.TextChoices):
        PENDING = 'Pending'
        COMPLETED = 'Completed'
        CANCELLED = 'Cancelled'
    
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=orderStatus.choices, 
        default=orderStatus.PENDING
        )
    
    def __str__(self):
        return f"Order {self.order_id} by {self.user.username}"