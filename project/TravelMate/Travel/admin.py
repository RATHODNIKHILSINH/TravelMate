from django.contrib import admin
from .models import (
    Destination,
    Place,
    Trip,
    ItineraryDay,
    ItineraryItem,
    Favorite,
    Expense,
    Budget,
    Notification,
    UserProfile,
    SupportTicket,
    Review,
)

admin.site.register(Destination)
admin.site.register(Place)
admin.site.register(Trip)
admin.site.register(ItineraryDay)
admin.site.register(ItineraryItem)
admin.site.register(Favorite)
admin.site.register(Expense)
admin.site.register(Budget)
admin.site.register(Notification)
admin.site.register(UserProfile)
admin.site.register(SupportTicket)
admin.site.register(Review)