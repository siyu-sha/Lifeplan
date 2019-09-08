from django.core.management.base import BaseCommand
import csv
from budgeting.models import SupportItem, SupportItemGroup


def update_item(item, base_item):
    # locate objects
    support_item = SupportItem.objects.filter(id == item).first()
    base_item = SupportItem.objects.filter(id == base_item).first()
    group = SupportItemGroup.objects.filter(base_item=base_item).first()
    if not group:
        group = SupportItemGroup(base_item=base_item, name=base_item.name)
    # update support item's group
    support_item.support_item_group = group
    support_item.save()


class Command(BaseCommand):
    help = "Creates a support item group for every support item, then sets each support item's group to correspond"

    def handle(self, *args, **options):
        with open("budgeting/resources/item_group_map.csv") as file:
            item_maps = csv.reader(file)
            for row in item_maps:
                update_item(row[0], row[1])
        file.close()
