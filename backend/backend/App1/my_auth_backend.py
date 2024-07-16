from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend

class MyAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        User = get_user_model()
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None

    def is_logged_in(self, request):
        if request.user.is_authenticated:
            return True
        return False