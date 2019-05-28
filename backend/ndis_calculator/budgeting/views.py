import hashlib
from django.http import HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from djangorestframework_camel_case.parser import CamelCaseJSONParser
from djangorestframework_camel_case.render import CamelCaseJSONRenderer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
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

                user = CustomUser.objects.filter(email=data.get('email')).first()
                refresh = RefreshToken.for_user(user)
                tokens = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }

                return Response(tokens)
            return Response(serializer.errors)


class Participant(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (CamelCaseJSONParser,)
    renderer_classes = (CamelCaseJSONRenderer,)

    @api_view(['GET', ])
    @csrf_exempt
    def id(request):
        if request.method == 'GET':
            serializer = CustomUserSerializer(request.user)
            return Response(serializer.data)

    @api_view(['PUT', ])
    @csrf_exempt
    def update(request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            request.data['username'] = request.data.get('email')
            serializer = CustomUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)
