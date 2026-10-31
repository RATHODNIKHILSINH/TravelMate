from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.contrib.auth.models import User

def login_view(request):
    # If user is already logged in, go to Home
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        if not username or not password:
            messages.error(request, "Please enter username and password.")
            return render(request, "login.html")

        user = authenticate(
            request=request,
            username=username,
            password=password
        )

        if user is not None:
            login(request, user)

            # Redirect to requested page if available
            next_url = request.POST.get("next") or request.GET.get("next")

            if next_url:
                return redirect(next_url)

            # Successful login → Home page
            return redirect("home")

        else:
            messages.error(request, "Invalid username or password.")

    return render(request, "login.html")


def logout_view(request):
    logout(request)
    return redirect("login")

# def register(request):

#     if request.user.is_authenticated:
#         return redirect("home")

#     if request.method == "POST":

#         username = request.POST.get("username", "").strip()
#         email = request.POST.get("email", "").strip()
#         password = request.POST.get("password", "")
#         confirm_password = request.POST.get("confirm_password", "")

#         # Empty fields
#         if not username or not email or not password or not confirm_password:
#             messages.error(request, "Please fill all fields.")
#             return render(request, "Register.html")

#         # Password match
#         if password != confirm_password:
#             messages.error(request, "Passwords do not match.")
#             return render(request, "Register.html")

#         # Username already exists
#         if User.objects.filter(username=username).exists():
#             messages.error(request, "Username already exists.")
#             return render(request, "Register.html")

#         # Email already exists
#         if User.objects.filter(email=email).exists():
#             messages.error(request, "Email is already registered.")
#             return render(request, "Register.html")

#         # Create user
#         user = User.objects.create_user(
#             username=username,
#             email=email,
#             password=password
#         )

#         messages.success(
#             request,
#             "Registration successful! You can now login."
#         )

#         return redirect("login")

#     return render(request, "Register.html")

@login_required
def home(request):

    # If not logged in, send to login
    if not request.user.is_authenticated:
        return redirect('login')

    features = [
        {
            "number": "01",
            "title": "Explore Destinations",
            "desc": "Discover amazing places around the world and get travel inspiration.",
            "icon": "📍"
        },
        {
            "number": "02",
            "title": "Places to Visit",
            "desc": "Find must-visit attractions and activities at your chosen destination.",
            "icon": "🗺️"
        },
        {
            "number": "03",
            "title": "Trip Planner",
            "desc": "Create and organize your trips with ease.",
            "icon": "📅"
        },
        {
            "number": "04",
            "title": "Itinerary",
            "desc": "Plan your day-wise itinerary and never miss anything.",
            "icon": "📋"
        },
        {
            "number": "05",
            "title": "Budget Planner",
            "desc": "Estimate your trip budget and plan expenses in advance.",
            "icon": "💰"
        },
        {
            "number": "06",
            "title": "Expense Tracker",
            "desc": "Track your expenses during the trip and stay within budget.",
            "icon": "💸"
        },
        {
            "number": "07",
            "title": "Favorites",
            "desc": "Save your favorite destinations and places for future trips.",
            "icon": "❤️"
        },
        {
            "number": "08",
            "title": "Trip Management",
            "desc": "Manage your trips all in one place with full control.",
            "icon": "🧳"
        },
        {
            "number": "09",
            "title": "Profile",
            "desc": "Manage your profile, preferences and travel settings.",
            "icon": "👤"
        },
        {
            "number": "10",
            "title": "Dashboard",
            "desc": "Get a quick overview of your trips, budgets and activities.",
            "icon": "🖥️"
        },
    ]

    return render(
        request,
        'home.html',
        {
            'features': features
        }
    )


@login_required
def dashboard(request):

    return render(
        request,
        'dashboard.html'
    )

@login_required
def itinerary(request):

    itinerary_data = [
        {
            "day": "01",
            "date": "12 October",
            "title": "Arrival & City Exploration",
            "location": "Ahmedabad",

            "activities": [
                {
                    "time": "09:00 AM",
                    "title": "Hotel Check-in",
                    "description": "Check in to the hotel and freshen up.",
                    "icon": "🏨"
                },
                {
                    "time": "11:00 AM",
                    "title": "Sabarmati Ashram",
                    "description": "Explore the historic Sabarmati Ashram.",
                    "icon": "🏛️"
                },
                {
                    "time": "02:00 PM",
                    "title": "Lunch",
                    "description": "Enjoy traditional Gujarati cuisine.",
                    "icon": "🍽️"
                },
                {
                    "time": "05:00 PM",
                    "title": "Riverfront",
                    "description": "Enjoy an evening walk at Sabarmati Riverfront.",
                    "icon": "🌅"
                }
            ],

            "budget": "₹2,500"
        },

        {
            "day": "02",
            "date": "13 October",
            "title": "Heritage & Culture",
            "location": "Ahmedabad",

            "activities": [
                {
                    "time": "08:00 AM",
                    "title": "Breakfast",
                    "description": "Breakfast at the hotel.",
                    "icon": "☕"
                },
                {
                    "time": "10:00 AM",
                    "title": "Adalaj Stepwell",
                    "description": "Visit the beautiful historic stepwell.",
                    "icon": "🏰"
                },
                {
                    "time": "01:00 PM",
                    "title": "Lunch",
                    "description": "Relax and enjoy lunch.",
                    "icon": "🍛"
                },
                {
                    "time": "04:00 PM",
                    "title": "Old City Tour",
                    "description": "Explore the heritage streets of Ahmedabad.",
                    "icon": "🚶"
                }
            ],

            "budget": "₹2,000"
        },

        {
            "day": "03",
            "date": "14 October",
            "title": "Nature & Relaxation",
            "location": "Ahmedabad",

            "activities": [
                {
                    "time": "08:30 AM",
                    "title": "Breakfast",
                    "description": "Start your day with a healthy breakfast.",
                    "icon": "🥐"
                },
                {
                    "time": "10:30 AM",
                    "title": "Kankaria Lake",
                    "description": "Spend time exploring Kankaria Lake.",
                    "icon": "🌊"
                },
                {
                    "time": "02:00 PM",
                    "title": "Lunch",
                    "description": "Enjoy lunch at a nearby restaurant.",
                    "icon": "🍴"
                },
                {
                    "time": "06:00 PM",
                    "title": "Shopping",
                    "description": "Explore local markets and shopping areas.",
                    "icon": "🛍️"
                }
            ],

            "budget": "₹3,000"
        }
    ]

    return render(
        request,
        "itinerary.html",
        {
            "itinerary_data": itinerary_data
        }
    )


@login_required
def my_trips(request):

    trips = [
        {
            "id": "01",
            "title": "Goa Beach Escape",
            "location": "Goa, India",
            "start_date": "15 Oct 2026",
            "end_date": "19 Oct 2026",
            "duration": "5 Days",
            "budget": "₹25,000",
            "spent": "₹18,500",
            "status": "Upcoming",
            "progress": 25,
            "icon": "🏝️"
        },

        {
            "id": "02",
            "title": "Manali Adventure",
            "location": "Manali, Himachal Pradesh",
            "start_date": "02 Nov 2026",
            "end_date": "07 Nov 2026",
            "duration": "6 Days",
            "budget": "₹32,000",
            "spent": "₹29,400",
            "status": "Upcoming",
            "progress": 10,
            "icon": "🏔️"
        },

        {
            "id": "03",
            "title": "Rajasthan Heritage Tour",
            "location": "Jaipur, Rajasthan",
            "start_date": "10 Aug 2026",
            "end_date": "15 Aug 2026",
            "duration": "6 Days",
            "budget": "₹28,000",
            "spent": "₹27,200",
            "status": "Completed",
            "progress": 100,
            "icon": "🏰"
        }
    ]

    return render(
        request,
        "MyTrip.html",
        {
            "trips": trips
        }
    )



@login_required
def favorites(request):

    favorites_data = [
        {
            "id": "01",
            "name": "Goa",
            "location": "Goa, India",
            "description": "Beautiful beaches, nightlife, sunsets and relaxing coastal experiences.",
            "category": "Beach",
            "rating": "4.8",
            "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
            "icon": "🏝️"
        },
        {
            "id": "02",
            "name": "Manali",
            "location": "Himachal Pradesh, India",
            "description": "Mountains, snow, adventure activities and peaceful natural scenery.",
            "category": "Mountain",
            "rating": "4.7",
            "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
            "icon": "🏔️"
        },
        {
            "id": "03",
            "name": "Jaipur",
            "location": "Rajasthan, India",
            "description": "Explore royal palaces, forts, local culture and traditional markets.",
            "category": "Heritage",
            "rating": "4.6",
            "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245",
            "icon": "🏰"
        },
        {
            "id": "04",
            "name": "Kerala",
            "location": "Kerala, India",
            "description": "Backwaters, beaches, greenery and peaceful nature experiences.",
            "category": "Nature",
            "rating": "4.9",
            "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
            "icon": "🌴"
        },
        {
            "id": "05",
            "name": "Ladakh",
            "location": "Ladakh, India",
            "description": "High-altitude landscapes, monasteries and unforgettable road trips.",
            "category": "Adventure",
            "rating": "4.8",
            "image": "https://images.unsplash.com/photo-1548013146-72479768bada",
            "icon": "🏔️"
        },
        {
            "id": "06",
            "name": "Udaipur",
            "location": "Rajasthan, India",
            "description": "Lakes, palaces, romantic views and beautiful Rajasthani architecture.",
            "category": "Heritage",
            "rating": "4.7",
            "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245",
            "icon": "🏯"
        }
    ]

    return render(
        request,
        "Favorites.html",
        {
            "favorites": favorites_data
        }
    )



@login_required
def destinations(request):

    destinations_data = [
        {
            "id": "01",
            "name": "Goa",
            "location": "India",
            "description": "Relax on beautiful beaches, enjoy nightlife and experience Goa's coastal culture.",
            "category": "Beach",
            "rating": "4.8",
            "budget": "₹15,000",
            "duration": "4-5 Days",
            "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
            "icon": "🏝️"
        },
        {
            "id": "02",
            "name": "Manali",
            "location": "Himachal Pradesh, India",
            "description": "Experience snow-covered mountains, adventure activities and peaceful valleys.",
            "category": "Mountain",
            "rating": "4.7",
            "budget": "₹18,000",
            "duration": "5-6 Days",
            "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
            "icon": "🏔️"
        },
        {
            "id": "03",
            "name": "Jaipur",
            "location": "Rajasthan, India",
            "description": "Discover magnificent forts, royal palaces, traditional markets and rich history.",
            "category": "Heritage",
            "rating": "4.6",
            "budget": "₹12,000",
            "duration": "3-4 Days",
            "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41",
            "icon": "🏰"
        },
        {
            "id": "04",
            "name": "Kerala",
            "location": "Kerala, India",
            "description": "Explore peaceful backwaters, tropical forests, beaches and beautiful landscapes.",
            "category": "Nature",
            "rating": "4.9",
            "budget": "₹20,000",
            "duration": "5-7 Days",
            "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
            "icon": "🌴"
        },
        {
            "id": "05",
            "name": "Ladakh",
            "location": "Ladakh, India",
            "description": "Discover dramatic mountains, monasteries and unforgettable high-altitude landscapes.",
            "category": "Adventure",
            "rating": "4.8",
            "budget": "₹25,000",
            "duration": "6-8 Days",
            "image": "https://images.unsplash.com/photo-1548013146-72479768bada",
            "icon": "🏔️"
        },
        {
            "id": "06",
            "name": "Udaipur",
            "location": "Rajasthan, India",
            "description": "Enjoy beautiful lakes, magnificent palaces and the romantic atmosphere of the city.",
            "category": "Heritage",
            "rating": "4.7",
            "budget": "₹13,000",
            "duration": "3-4 Days",
            "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245",
            "icon": "🏯"
        },
        {
            "id": "07",
            "name": "Andaman",
            "location": "Andaman & Nicobar, India",
            "description": "Enjoy crystal-clear water, coral reefs, beaches and exciting water activities.",
            "category": "Beach",
            "rating": "4.9",
            "budget": "₹28,000",
            "duration": "5-7 Days",
            "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
            "icon": "🌊"
        },
        {
            "id": "08",
            "name": "Rishikesh",
            "location": "Uttarakhand, India",
            "description": "Experience river rafting, mountains, yoga, spirituality and outdoor adventures.",
            "category": "Adventure",
            "rating": "4.6",
            "budget": "₹10,000",
            "duration": "3-4 Days",
            "image": "https://images.unsplash.com/photo-1597074866923-dc0589150358",
            "icon": "🧗"
        }
    ]

    return render(
        request,
        "Destinations.html",
        {
            "destinations": destinations_data
        }
    )



@login_required
def reports(request):
    return render(request, "Reports.html")


@login_required
def budget(request):
    return render(request, "Budget.html")


@login_required
def settings(request):
    return render(request, "Settings.html")


@login_required
def expense(request):
    return render(request, "Expense.html")




@staff_member_required
def admin_dashboard(request):
    return render(request, "admin_dashboard.html")



def register(request):
    return render(request, "Register.html")



@login_required
def help_support(request):
    return render(request, "Help.html")



@login_required
def profile(request):
    return render(request, "Profile.html")



@login_required
def notifications(request):
    return render(request, "Notifications.html")