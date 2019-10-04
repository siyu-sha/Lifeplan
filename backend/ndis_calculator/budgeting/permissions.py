from rest_framework import permissions


class IsPlanOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of the plan to access any related views
    """

    def has_object_permission(self, request, view, obj):
        return obj.participant_id == request.user
