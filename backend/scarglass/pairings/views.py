from rest_framework import generics, response
from .models import PairingModel
from .serializers import PairingSerializer
from django.db.models import Q
from datetime import date, timedelta
from django.utils import timezone

class PairingList(generics.ListAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer

  def get_queryset(self):
      return PairingModel.objects.all()

  def filter_queryset(self, queryset):
    pair = self.request.query_params.get('pair')
    five_minutes_ago = timezone.now() + timedelta(minutes=-5)
    if pair == 'true':
      queryset = queryset.filter(Q(paired=True) & Q(date__gte = five_minutes_ago))

    return queryset

  def list(self, request):
    queryset = self.filter_queryset(self.get_queryset())
    serializer = self.get_serializer(queryset, many=True)
    return response.Response(serializer.data)

class PairingCreate(generics.CreateAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer

class PairingDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer