from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password

class UserManager(BaseUserManager):
  def create_user(self, email, name, password, **extra_fields):
    if not email:
      raise ValueError('The email must be set.')
    if not password:
      raise ValueError('The password must be set.')
    if not name:
      raise ValueError('The name mustbe set.')

    user = self.model(
      email = self.normalize_email(email),
      name = name,
      password = make_password(password),
    )

    user.save()
    return user
  
  def create_superuser(self, email, password, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('is_active', True)

    if extra_fields.get('is_staff') is not True:
      raise ValueError('Superuser must have is staff = True')
    if extra_fields.get('is_superuser') is not True:
      raise ValueError('Superuser must have is_superuser = True')

    return self.create_user(email, password, **extra_fields)