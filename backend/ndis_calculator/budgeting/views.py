from django.http import HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from djangorestframework_camel_case.parser import CamelCaseJSONParser
from djangorestframework_camel_case.render import CamelCaseJSONRenderer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import CustomUserSerializer

# Create your views here.


class DefaultView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse('Hello, World!')


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class Authentication(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = (CamelCaseJSONRenderer,)

    @api_view(['POST', ])
    @csrf_exempt
    def register(request):
        if request.method == 'POST':
            data = CamelCaseJSONParser().parse(request)
            data['username'] = data.get('email')
            serializer = CustomUserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)
