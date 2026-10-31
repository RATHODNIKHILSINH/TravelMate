
from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# 1. DESTINATIONS
class Destination(models.Model):
    CATEGORY_CHOICES = [
        ("Beach", "Beach"),
        ("Mountain", "Mountain"),
        ("Heritage", "Heritage"),
        ("Nature", "Nature"),
        ("Adventure", "Adventure"),
        ("City", "City"),
    ]

    name = models.CharField(max_length=150)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    estimated_budget = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )
    duration = models.CharField(max_length=50, blank=True)
    image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# 2. PLACES / ATTRACTIONS
class Place(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="places",
    )
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    estimated_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    image = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name} - {self.destination.name}"


# 3. TRIPS / MY TRIPS
class Trip(models.Model):
    STATUS_CHOICES = [
        ("Upcoming", "Upcoming"),
        ("Ongoing", "Ongoing"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trips",
    )
    title = models.CharField(max_length=150)
    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="trips",
    )
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Upcoming",
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_date"]

    def __str__(self):
        return self.title


# 4. ITINERARY DAYS
class ItineraryDay(models.Model):
    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="itinerary_days",
    )
    day_number = models.PositiveIntegerField()
    date = models.DateField(null=True, blank=True)
    title = models.CharField(max_length=150, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["day_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["trip", "day_number"],
                name="unique_trip_day_number",
            )
        ]

    def __str__(self):
        return f"{self.trip.title} - Day {self.day_number}"


# 5. ITINERARY ACTIVITIES
class ItineraryItem(models.Model):
    day = models.ForeignKey(
        ItineraryDay,
        on_delete=models.CASCADE,
        related_name="activities",
        null=True,
        blank=True,
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    estimated_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ["start_time", "id"]

    def __str__(self):
        return self.title


# 6. FAVORITES
class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorites",
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(destination__isnull=False, place__isnull=True)
                    | models.Q(destination__isnull=True, place__isnull=False)
                ),
                name="favorite_has_one_target",
            ),
            models.UniqueConstraint(
                fields=["user", "destination"],
                condition=models.Q(destination__isnull=False),
                name="unique_user_favorite_destination",
            ),
            models.UniqueConstraint(
                fields=["user", "place"],
                condition=models.Q(place__isnull=False),
                name="unique_user_favorite_place",
            ),
        ]

    def __str__(self):
        return f"{self.user} - Favorite"


# 7. EXPENSES
class Expense(models.Model):
    CATEGORY_CHOICES = [
        ("Transport", "Transport"),
        ("Accommodation", "Accommodation"),
        ("Food", "Food"),
        ("Activities", "Activities"),
        ("Shopping", "Shopping"),
        ("Other", "Other"),
    ]

    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="expenses",
    )
    title = models.CharField(max_length=150)
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="Other",
    )
    expense_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-expense_date", "-id"]

    def __str__(self):
        return f"{self.title} - {self.amount}"


# 8. BUDGET PLANNER
class Budget(models.Model):
    PERIOD_CHOICES = [
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
        ("custom", "Custom"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="budgets",
    )
    name = models.CharField(max_length=150)
    period_type = models.CharField(
        max_length=20,
        choices=PERIOD_CHOICES,
        default="monthly",
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    alert_threshold = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.80,
        validators=[MinValueValidator(0), MaxValueValidator(1)],
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# 9. NOTIFICATIONS
class Notification(models.Model):
    TYPE_CHOICES = [
        ("trip", "Trip Update"),
        ("reminder", "Reminder"),
        ("system", "System"),
        ("budget", "Budget Alert"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=150)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default="system",
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


# 10. USER PROFILE
class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="travel_profile",
    )
    phone = models.CharField(max_length=20, blank=True)
    profile_image = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    home_city = models.CharField(max_length=100, blank=True)
    preferred_currency = models.CharField(max_length=10, default="INR")

    def __str__(self):
        return f"{self.user} Profile"


# 11. HELP & SUPPORT TICKETS
class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ("Open", "Open"),
        ("In Progress", "In Progress"),
        ("Resolved", "Resolved"),
        ("Closed", "Closed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="support_tickets",
    )
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Open",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject


# 12. DESTINATION REVIEWS
class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="travel_reviews",
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "destination"],
                name="unique_user_destination_review",
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.destination.name}"
