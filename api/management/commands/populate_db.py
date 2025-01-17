import random
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import lorem_ipsum
from api.models import User, Product, Order, OrderItem

class Command(BaseCommand):
    help = 'Creates application data'

    def handle(self, *args, **kwargs):
        # Get or create superuser
        user = User.objects.filter(username='admin').first()
        if not user:
            user = User.objects.create_superuser(username='admin', password='test')

        # Create more products with detailed information
        products = [
            Product(name="A Scanner Darkly", description=lorem_ipsum.paragraph(), price=Decimal('12.99'), stock=4),
            Product(name="Coffee Machine", description=lorem_ipsum.paragraph(), price=Decimal('70.99'), stock=6),
            Product(name="Velvet Underground & Nico", description=lorem_ipsum.paragraph(), price=Decimal('15.99'), stock=11),
            Product(name="Enter the Wu-Tang (36 Chambers)", description=lorem_ipsum.paragraph(), price=Decimal('17.99'), stock=2),
            Product(name="Digital Camera", description=lorem_ipsum.paragraph(), price=Decimal('350.99'), stock=4),
            Product(name="Watch", description=lorem_ipsum.paragraph(), price=Decimal('500.05'), stock=0),
            Product(name="Smartphone", description=lorem_ipsum.paragraph(), price=Decimal('899.99'), stock=10),
            Product(name="Laptop", description=lorem_ipsum.paragraph(), price=Decimal('1200.00'), stock=7),
            Product(name="Gaming Console", description=lorem_ipsum.paragraph(), price=Decimal('499.99'), stock=8),
            Product(name="Bluetooth Speaker", description=lorem_ipsum.paragraph(), price=Decimal('150.00'), stock=15),
            Product(name="Headphones", description=lorem_ipsum.paragraph(), price=Decimal('199.99'), stock=12),
            Product(name="E-Book Reader", description=lorem_ipsum.paragraph(), price=Decimal('120.00'), stock=9),
            Product(name="Smartwatch", description=lorem_ipsum.paragraph(), price=Decimal('300.00'), stock=5),
            Product(name="Tablet", description=lorem_ipsum.paragraph(), price=Decimal('600.00'), stock=4),
            Product(name="Camera Lens", description=lorem_ipsum.paragraph(), price=Decimal('250.00'), stock=3),
        ]

        # Bulk create products and re-fetch from the database
        Product.objects.bulk_create(products, ignore_conflicts=True)
        products = Product.objects.all()

        # Create dummy orders tied to the superuser
        for _ in range(10):  # Increased the number of orders
            order = Order.objects.create(user=user)
            num_items = random.randint(2, 5)  # Randomize the number of items per order
            for product in random.sample(list(products), num_items):
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=random.randint(1, 5)  # Increased the possible quantity per item
                )

        self.stdout.write(self.style.SUCCESS("Sample data created successfully."))
