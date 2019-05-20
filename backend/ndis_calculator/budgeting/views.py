from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.


class DefaultView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse('Hello, World!')


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
