from django.http import HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from djangorestframework_camel_case.parser import CamelCaseJSONParser
from djangorestframework_camel_case.render import CamelCaseJSONRenderer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from .serializers import *
from rest_framework import status, viewsets


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

    @api_view(['POST', ])
    @csrf_exempt
    def register(request):
        if request.method == 'POST':
            request.data['username'] = request.data.get('email')
            serializer = ParticipantSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                tokens = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return Response({'id':user.id, 'tokens':tokens}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Participant(APIView):
    permission_classes = (IsAuthenticated,)

    @api_view(['GET', ])
    @csrf_exempt
    def id(request):
        if request.method == 'GET':
            serializer = ParticipantSerializer(request.user)
            data = serializer.data
            data['id'] = request.user.id
            return Response(data)

    @api_view(['PUT', ])
    @csrf_exempt
    def update(request, pk):
        try:
            user = Participant.objects.get(pk=pk)
        except Participant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            request.data['username'] = request.data.get('email')
            serializer = ParticipantSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)

class SupportGroupViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List all support groups and their support categories
    """

    queryset = SupportGroup.objects.all()
    serializer_class = SupportGroupSerializer

class SupportItem(APIView):
    permission_classes = (IsAuthenticated,)

    @api_view(['GET', ])
    @csrf_exempt
    def getList(request):
        if request.method == 'GET':
            birth_year=request.GET.get('birth-year')
            postcode=request.GET.get('postcode')
            registration_group_id = request.GET.get('registration-grou-id',default='-1')
            support_category_id = request.GET.get('support-category-id')
            if registration_group_id=='-1':
                items = SupportItem.objects.filter(support_category=support_category_id)
            else:
                items = SupportItem.objects.filter(support_category=support_category_id,registration_group=registration_group_id)
            tokens=[]
            for item in items:
                token={}
                token['id']=item.id
                token['number']=item.number
                token['name']=item.name
                token['description']=item.description
                token['unit']=item.unit
                if postcode[0]==0 or postcode[0]==5 or postcode[0]==6 or postcode[0]==7:
                    if item.price_NA_SA_TAS_WA is not None:
                        token['price'] = item.price_NA_SA_TAS_WA
                    else:
                        token['price'] = item.price_national
                else:
                    if item.price_ACT_NSW_QLD_VIC is not None:
                         token['price'] = item.price_ACT_NSW_QLD_VIC
                    else:
                        token['price'] = item.price_national
                tokens.append(token)
            return Response(tokens,status=status.HTTP_200_OK)
