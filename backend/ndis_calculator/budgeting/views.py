from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Participant,
    Plan,
    PlanCategory,
    PlanItem,
    RegistrationGroup,
    SupportCategory,
    SupportGroup,
    SupportItem,
    SupportItemGroup,
)
from .serializers import (
    ParticipantSerializer,
    PlanCategorySerializer,
    PlanItemSerializer,
    PlanSerializer,
    RegistrationGroupSerializer,
    SupportGroupSerializer,
    SupportItemGroupSerializer,
    SupportItemSerializer,
)

# Create your views here.


class DefaultView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse("Hello, World!")


# DO NOT COPY THE STRUCTURE OF THE FOLLOWING CLASS
class Authentication(APIView):
    permission_classes = (AllowAny,)

    @api_view(["POST"])
    @csrf_exempt
    def register(request):
        if request.method == "POST":
            request.data["username"] = request.data.get("email")
            serializer = ParticipantSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                tokens = {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
                return Response(
                    {"id": user.id, "tokens": tokens},
                    status=status.HTTP_201_CREATED,
                )
            print(serializer.errors)
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )


# DO NOT COPY THE STRUCTURE OF THE FOLLOWING CLASS
class ParticipantView(APIView):
    permission_classes = (IsAuthenticated,)

    @api_view(["GET"])
    @csrf_exempt
    def current_user(request):
        if request.method == "GET":
            serializer = ParticipantSerializer(request.user)
            data = serializer.data
            return Response(data)

    @api_view(["PUT"])
    @csrf_exempt
    def update(request, pk):
        try:
            user = Participant.objects.get(pk=pk)
        except Participant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == "PUT":
            request.data["username"] = request.data.get("email")
            serializer = ParticipantSerializer(
                user, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)


class PlanViewSet(viewsets.ModelViewSet):
    """
    This viewset provides `list`, `create`, `retrieve`, `update`
    and `destroy` actions to manipulate the Plan model.
    """

    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        plan_serializer = self.serializer_class(data=request.data)
        if plan_serializer.is_valid():
            plan = plan_serializer.save(participant=self.request.user)
            plan_categories = []
            for support_category in SupportCategory.objects.all():
                plan_category_serializer = PlanCategorySerializer(
                    data={
                        "plan": plan_serializer.data["id"],
                        "support_category": support_category.id,
                        "budget": 0,
                    }
                )
                if plan_category_serializer.is_valid():
                    plan_categories.append(plan_category_serializer)
                else:
                    plan.delete()
                    return Response(
                        plan_category_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            for plan_category in plan_categories:
                plan_category.save()
            return Response(
                plan_serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            plan_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


class PlanCategoryViewSet(viewsets.ModelViewSet):
    """
    This viewset provides `list`, `create`, `retrieve`, and
    `update` actions to manipulate the Plan Category model.
    """

    queryset = PlanCategory.objects.all()
    serializer_class = PlanCategorySerializer
    permission_classes = (IsAuthenticated,)

    def destroy(self, request, pk=None):
        pass


class PlanItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD of Plan Item model.
    Only authenticated participants who are owners of the plan which the plan item belongs to can access.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = PlanItemSerializer

    def list(self, request, **kwargs):
        queryset1 = PlanItem.objects.all()
        queryset2 = PlanCategory.objects.all()
        plan_id = request.query_params.get("plan-id")
        pc_querysets_ids = [
            o.id for o in queryset2 if o.plan().__eq__(plan_id)
        ]

        if pc_querysets_ids is not None:
            queryset1 = queryset1.filter(id__in=pc_querysets_ids)
        if queryset1 is not None:
            serializer = self.serializer_class(queryset1, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, plan_category_id):
        # check if plan category and corresponding plan exists
        try:
            plan_category = PlanCategory.objects.get(pk=plan_category_id)
            plan = Plan.objects.get(pk=plan_category.plan_id)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # check if plan belongs to user and the referenced plan category corresponds to the body
        if plan.participant_id != request.user.id:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # create plan
        serializer = self.serializer_class(
            data={**request.data, "plan_category": plan_category_id}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, plan_item_id):
        try:
            plan_item = PlanItem.objects.get(pk=plan_item_id)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        data = JSONParser().parse(request)
        serializer = PlanItemSerializer(plan_item, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=400)

    def destroy(self, request, plan_category_id=None):
        if plan_category_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        items = []
        id_list = request.data.getlist("plan_item_id_list")
        for plan_item_id in id_list:
            item = PlanItem.objects.filter(pk=plan_item_id).first()
            if (
                item is not None
            ):  # it means the id of the plan item does not exist
                return Response(status=status.HTTP_400_BAD_REQUEST)
            elif item[0].plan_category.id != plan_category_id:
                # it means the id of the plan item does not belong to the target plan category
                return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                items.append(item[0])
        # only when all id are correct, the deleting operation will be executed.
        for item in items:
            if item.plan.participant_id == request.user.id:
                item.delete()
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        return Response(status=status.HTTP_200_OK)


class SupportGroupViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List all support groups and their support categories
    """

    queryset = SupportGroup.objects.all()
    serializer_class = SupportGroupSerializer


class SupportItemGroupViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List support item groups by query params.
    """

    serializer_class = SupportItemGroupSerializer

    def list(self, request, **kwargs):
        queryset = SupportItemGroup.objects.all()

        registration_group_id = request.query_params.get(
            "registration-group-id"
        )
        support_category_id = request.query_params.get("support-category-id")

        # support item queryset - list of support items
        si_queryset = SupportItem.objects.all().filter(
            support_category_id=support_category_id
        )
        if registration_group_id is not None:
            si_queryset = si_queryset.filter(
                registration_group_id=registration_group_id
            )

        # values list - list of all ids in si_queryset [id1,id2] etc.
        queryset = queryset.filter(
            base_item_id__in=si_queryset.values_list("id", flat=True)
        )

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SupportItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List support items filtered by query parameters
    """

    ACT_NSW_QLD_VIC = [
        (200, 299),
        (1000, 2999),
        (4000, 4999),
        (9000, 9999),
        (3000, 3999),
        (8000, 8999),
    ]

    serializer_class = SupportItemSerializer

    # override default list function
    def list(self, request, **kwargs):
        queryset = SupportItem.objects.all()
        # birth_year = request.query_params.get('birth-year')
        postcode = request.query_params.get("postcode")
        registration_group_id = request.query_params.get(
            "registration-group-id", None
        )
        support_category_id = request.query_params.get("support-category-id")

        if registration_group_id is not None:
            queryset = queryset.filter(
                registration_group_id=registration_group_id
            )

        queryset = queryset.filter(support_category_id=support_category_id)

        serializer = self.serializer_class(queryset, many=True)

        for support_item in serializer.data:
            # check if postcode is in ACT_NSW_QLD_VIC
            if support_item["price_ACT_NSW_QLD_VIC"] is not None:
                for postcode_range in self.ACT_NSW_QLD_VIC:
                    if postcode_range[0] <= int(postcode) <= postcode_range[1]:
                        support_item["price"] = support_item[
                            "price_ACT_NSW_QLD_VIC"
                        ]
                        break
            elif support_item["price_NT_SA_TAS_WA"] is not None:
                support_item["price"] = support_item["price_NT_SA_TAS_WA"]
            else:
                support_item["price"] = support_item["price_national"]

            # strip unneeded keys
            support_item.pop("price_NT_SA_TAS_WA", None)
            support_item.pop("price_ACT_NSW_QLD_VIC", None)
            support_item.pop("price_national", None)
            support_item.pop("price_remote", None)
            support_item.pop("price_very_remote", None)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RegistrationGroupViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List all Registration groups
    """

    queryset = RegistrationGroup.objects.all()
    serializer_class = RegistrationGroupSerializer


# TODO: remove after a while
# class PlanItemView(APIView):
#     permission_classes = (IsAuthenticated,)
#
#     @api_view(["POST"])
#     @csrf_exempt
#     def create(request, participantID, planCategoryID):
#         support_item_group_id = request.data.get("support_item_group_i_d")
#         price = request.data.get("price")
#         number = request.data.get("number")
#         try:
#             Participant.objects.get(pk=participantID)
#             supportItemGroup = SupportItemGroup.objects.get(
#                 pk=support_item_group_id
#             )
#             planCategory = PlanCategory.objects.get(pk=planCategoryID)
#         except ObjectDoesNotExist:
#             return Response(status=status.HTTP_400_BAD_REQUEST)
#         else:
#             try:
#                 PlanItem.objects.create(
#                     plan_category=planCategory,
#                     support_item_group=supportItemGroup,
#                     quantity=number,
#                     price_actual=price,
#                 )
#             except ValidationError:
#                 return Response(status=status.HTTP_400_BAD_REQUEST)
#             else:
#                 return Response(status=status.HTTP_200_OK)
