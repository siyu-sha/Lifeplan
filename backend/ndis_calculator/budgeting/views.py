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
                return Response({'id': user.id, 'tokens': tokens}, status=status.HTTP_201_CREATED)
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


class SupportItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List support items filtered by query parameters
    """
    ACT_NSW_QLD_VIC = [(200, 299), (1000, 2999), (4000, 4999), (9000, 9999), (3000, 3999), (8000, 8999)]

    serializer_class = SupportItemSerializer

    # override default list function
    def list(self, request):
        queryset = SupportItem.objects.all()
        # birth_year = request.query_params.get('birth-year')
        postcode = request.query_params.get('postcode')
        registration_group_id = request.query_params.get('registration-group-id', None)
        support_category_id = request.query_params.get('support-category-id')


        if registration_group_id is not None:
            queryset = queryset.filter(registration_group_id=registration_group_id)

        queryset = queryset.filter(support_category_id=support_category_id)

        serializer = self.serializer_class(queryset, many=True)

        for support_item in serializer.data:
            # check if postcode is in ACT_NSW_QLD_VIC
            if support_item['price_ACT_NSW_QLD_VIC'] is not None:
                for postcode_range in self.ACT_NSW_QLD_VIC:
                    if postcode_range[0] <= int(postcode) <= postcode_range[1]:
                        support_item['price'] = support_item['price_ACT_NSW_QLD_VIC']
                        break
            elif support_item['price_NT_SA_TAS_WA'] is not None:
                support_item['price'] = support_item['price_NT_SA_TAS_WA']
            else:
                support_item['price'] = support_item['price_national']

            # strip unneeded keys
            support_item.pop('price_NT_SA_TAS_WA', None)
            support_item.pop('price_ACT_NSW_QLD_VIC', None)
            support_item.pop('price_national', None)
            support_item.pop('price_remote', None)
            support_item.pop('price_very_remote', None)

        return Response(serializer.data, status=status.HTTP_200_OK)

    # def getList(request):
    #     if request.method == 'GET':
    #         # birth_year = request.query_params.get('birth-year')
    #         postcode = request.query_params.get('postcode')
    #         registration_group_id = request.query_params.get('registration-group-id', None)
    #         support_category_id = request.query_params.get('support-category-id')
    #         if registration_group_id == '-1':
    #             items = SupportItem.objects.filter(support_category=support_category_id)
    #         else:
    #             items = SupportItem.objects.filter(support_category=support_category_id,
    #                                                registration_group=registration_group_id)
    #         tokens = []
    #         for item in items:
    #             token = {}
    #             token['id'] = item.id
    #             token['number'] = item.number
    #             token['name'] = item.name
    #             token['description'] = item.description
    #             token['unit'] = item.unit
    #             if postcode[0] == 0 or postcode[0] == 5 or postcode[0] == 6 or postcode[0] == 7:
    #                 if item.price_NT_SA_TAS_WA is not None:
    #                     token['price'] = item.price_NT_SA_TAS_WA
    #                 else:
    #                     token['price'] = item.price_national
    #             else:
    #                 if item.price_ACT_NSW_QLD_VIC is not None:
    #                     token['price'] = item.price_ACT_NSW_QLD_VIC
    #                 else:
    #                     token['price'] = item.price_national
    #             tokens.append(token)
    #         return Response(tokens, status=status.HTTP_200_OK)
