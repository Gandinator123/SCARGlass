from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
import uuid
from .managers import UserManager

def upload_to(instance, filename):
  return 'users/{id}/{filename}'.format(id=instance.id, filename=filename)

class UserModel(AbstractBaseUser, PermissionsMixin):
  email = models.EmailField(max_length=255, unique=True)
  name = models.CharField(max_length=255)
  password = models.CharField(max_length=255)
  date = models.DateTimeField(auto_now_add=True)

  avatar = models.ImageField(upload_to=upload_to, default="avatar.png")

  is_staff = models.BooleanField(default=False)
  is_active = models.BooleanField(default=True)
  is_superuser = models.BooleanField(default = False)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []

  objects = UserManager()

  def __str__(self):
      return self.name
  