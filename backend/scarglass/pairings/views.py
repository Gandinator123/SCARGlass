from rest_framework import generics, response
from .models import PairingModel
from .serializers import PairingSerializer
from django.db.models import Q
from datetime import date, timedelta
from django.utils import timezone

class PairingList(generics.ListAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer

  def filter_queryset(self, queryset):
    pair = self.request.query_params.get('pair')
    five_minutes_ago = timezone.now() + timedelta(seconds=-30)
    if pair == 'true':
      queryset = queryset.filter(Q(paired=True) & Q(date__gte = five_minutes_ago))

  def list(self, request):
    queryset = self.filter_queryset(queryset)
    serializer = PairingSerializer(queryset, many=True)
    return response.Response(serializer.data)

class PairingCreate(generics.CreateAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer

class PairingDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer