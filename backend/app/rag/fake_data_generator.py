import random
from typing import List, Dict, Any
from dataclasses import dataclass
import json

@dataclass
class PersonProfile:
    name: str
    age: int
    gender: str
    location: str
    job_title: str
    industry: str
    income_level: str
    annual_income: int
    education: str
    marital_status: str
    health_conditions: List[str]
    lifestyle_factors: List[str]
    hobbies: List[str]
    family_size: int
    years_experience: int

    def to_document_content(self) -> str:
        """Convert profile to document text for vector storage"""
        health_text = ", ".join(self.health_conditions) if self.health_conditions else "No known conditions"
        lifestyle_text = ", ".join(self.lifestyle_factors) if self.lifestyle_factors else "Standard lifestyle"
        hobbies_text = ", ".join(self.hobbies) if self.hobbies else "No specific hobbies mentioned"

        return f"""
Personal Profile: {self.name}

Demographics:
- Age: {self.age} years old
- Gender: {self.gender}
- Location: {self.location}
- Marital Status: {self.marital_status}
- Family Size: {self.family_size} members

Professional Information:
- Job Title: {self.job_title}
- Industry: {self.industry}
- Years of Experience: {self.years_experience}
- Income Level: {self.income_level}
- Annual Income: ${self.annual_income:,}
- Education: {self.education}

Health Information:
- Health Conditions: {health_text}
- Lifestyle Factors: {lifestyle_text}

Personal Interests:
- Hobbies: {hobbies_text}

Additional Context: This person lives in {self.location}, works as a {self.job_title} in the {self.industry} industry, and has {self.years_experience} years of professional experience. Their income level is considered {self.income_level} with an annual salary of ${self.annual_income:,}.
        """.strip()

    def to_metadata(self) -> Dict[str, Any]:
        """Convert profile to metadata for vector storage"""
        return {
            "person_id": self.name.lower().replace(" ", "_"),
            "age": self.age,
            "gender": self.gender,
            "location": self.location,
            "job_title": self.job_title,
            "industry": self.industry,
            "income_level": self.income_level,
            "annual_income": self.annual_income,
            "education": self.education,
            "marital_status": self.marital_status,
            "family_size": self.family_size,
            "years_experience": self.years_experience,
            "health_conditions": json.dumps(self.health_conditions),
            "lifestyle_factors": json.dumps(self.lifestyle_factors),
            "hobbies": json.dumps(self.hobbies),
            "data_type": "synthetic_personal_profile"
        }

class FakeDataGenerator:
    def __init__(self):
        self.first_names = [
            "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "William",
            "Mia", "James", "Charlotte", "Benjamin", "Amelia", "Lucas", "Harper", "Henry", "Evelyn", "Alexander",
            "Abigail", "Michael", "Emily", "Daniel", "Elizabeth", "Matthew", "Mila", "Aiden", "Ella", "Jackson",
            "Avery", "David", "Sofia", "Owen", "Camila", "Joseph", "Aria", "Carter", "Scarlett", "Samuel",
            "Victoria", "Wyatt", "Madison", "John", "Luna", "Jack", "Grace", "Luke", "Chloe", "Jayden"
        ]

        self.last_names = [
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
            "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
            "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
            "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
            "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
        ]

        self.locations = [
            "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
            "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
            "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
            "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
            "Boston, MA", "El Paso, TX", "Detroit, MI", "Nashville, TN", "Portland, OR",
            "Memphis, TN", "Oklahoma City, OK", "Las Vegas, NV", "Louisville, KY", "Baltimore, MD"
        ]

        self.industries = [
            "Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Construction",
            "Transportation", "Hospitality", "Media", "Real Estate", "Legal", "Consulting", "Government",
            "Non-profit", "Energy", "Agriculture", "Telecommunications", "Automotive", "Aerospace"
        ]

        self.job_titles = {
            "Technology": ["Software Engineer", "Data Scientist", "Product Manager", "DevOps Engineer", "UX Designer", "System Administrator", "Technical Writer"],
            "Healthcare": ["Registered Nurse", "Physician", "Medical Assistant", "Pharmacist", "Physical Therapist", "Healthcare Administrator", "Medical Technologist"],
            "Finance": ["Financial Analyst", "Investment Banker", "Accountant", "Financial Advisor", "Credit Analyst", "Actuary", "Portfolio Manager"],
            "Education": ["Teacher", "Principal", "School Counselor", "Professor", "Librarian", "Educational Administrator", "Instructional Designer"],
            "Manufacturing": ["Production Manager", "Quality Control Inspector", "Industrial Engineer", "Machine Operator", "Safety Manager", "Plant Supervisor"],
            "Retail": ["Store Manager", "Sales Associate", "Buyer", "Visual Merchandiser", "Customer Service Representative", "District Manager"],
            "Construction": ["Project Manager", "Construction Worker", "Architect", "Civil Engineer", "Electrician", "Plumber", "Site Supervisor"],
            "Transportation": ["Truck Driver", "Logistics Coordinator", "Fleet Manager", "Pilot", "Air Traffic Controller", "Dispatcher"],
            "Hospitality": ["Hotel Manager", "Chef", "Server", "Event Coordinator", "Concierge", "Housekeeping Manager"],
            "Media": ["Journalist", "Graphic Designer", "Video Editor", "Marketing Manager", "Content Writer", "Social Media Specialist"],
            "Real Estate": ["Real Estate Agent", "Property Manager", "Appraiser", "Real Estate Developer", "Leasing Consultant"],
            "Legal": ["Lawyer", "Paralegal", "Legal Secretary", "Judge", "Court Reporter", "Legal Assistant"],
            "Consulting": ["Management Consultant", "Business Analyst", "Strategy Consultant", "IT Consultant", "HR Consultant"],
            "Government": ["Government Administrator", "Policy Analyst", "Social Worker", "Public Health Official", "City Planner"],
            "Non-profit": ["Program Director", "Fundraiser", "Volunteer Coordinator", "Grant Writer", "Community Outreach Coordinator"],
            "Energy": ["Petroleum Engineer", "Renewable Energy Technician", "Power Plant Operator", "Energy Analyst", "Environmental Engineer"],
            "Agriculture": ["Farm Manager", "Agricultural Scientist", "Veterinarian", "Food Safety Inspector", "Agricultural Engineer"],
            "Telecommunications": ["Network Engineer", "Telecommunications Technician", "Customer Service Representative", "Sales Representative"],
            "Automotive": ["Automotive Technician", "Design Engineer", "Quality Inspector", "Sales Manager", "Service Advisor"],
            "Aerospace": ["Aerospace Engineer", "Aircraft Mechanic", "Test Pilot", "Quality Assurance Specialist", "Project Engineer"]
        }

        self.education_levels = [
            "High School Diploma", "Some College", "Associate Degree", "Bachelor's Degree",
            "Master's Degree", "Doctoral Degree", "Professional Degree", "Trade School Certificate"
        ]

        self.health_conditions = [
            "Hypertension", "Type 2 Diabetes", "Asthma", "Arthritis", "High Cholesterol", "Anxiety",
            "Depression", "ADHD", "Migraine", "Allergies", "Sleep Apnea", "Chronic Back Pain",
            "Hypothyroidism", "GERD", "Osteoporosis"
        ]

        self.lifestyle_factors = [
            "Regular Exercise", "Vegetarian Diet", "Vegan Diet", "Smoking", "Social Drinking",
            "Frequent Travel", "Remote Work", "Gym Membership", "Yoga Practice", "Meditation",
            "Outdoor Activities", "City Living", "Suburban Living", "Rural Living", "Pet Owner"
        ]

        self.hobbies = [
            "Reading", "Cooking", "Gardening", "Photography", "Hiking", "Cycling", "Swimming",
            "Painting", "Music", "Gaming", "Traveling", "Dancing", "Writing", "Fishing",
            "Golf", "Tennis", "Basketball", "Soccer", "Running", "Knitting", "Woodworking"
        ]

    def generate_person(self) -> PersonProfile:
        """Generate a single fake person profile"""
        first_name = random.choice(self.first_names)
        last_name = random.choice(self.last_names)
        name = f"{first_name} {last_name}"

        age = random.randint(22, 65)
        gender = random.choice(["Male", "Female", "Non-binary"])
        location = random.choice(self.locations)

        industry = random.choice(self.industries)
        job_title = random.choice(self.job_titles[industry])

        years_experience = max(0, age - random.randint(18, 25))

        # Income based on job and experience
        base_income = random.randint(30000, 150000)
        experience_bonus = years_experience * random.randint(1000, 3000)
        annual_income = base_income + experience_bonus

        if annual_income < 40000:
            income_level = "Low"
        elif annual_income < 80000:
            income_level = "Middle"
        elif annual_income < 120000:
            income_level = "Upper-Middle"
        else:
            income_level = "High"

        education = random.choice(self.education_levels)
        marital_status = random.choice(["Single", "Married", "Divorced", "Widowed", "Separated"])
        family_size = random.randint(1, 5) if marital_status == "Married" else random.randint(1, 2)

        # Health conditions (0-3 conditions)
        num_conditions = random.choices([0, 1, 2, 3], weights=[40, 35, 20, 5])[0]
        health_conditions = random.sample(self.health_conditions, num_conditions) if num_conditions > 0 else []

        # Lifestyle factors (1-4 factors)
        num_lifestyle = random.randint(1, 4)
        lifestyle_factors = random.sample(self.lifestyle_factors, num_lifestyle)

        # Hobbies (1-5 hobbies)
        num_hobbies = random.randint(1, 5)
        hobbies = random.sample(self.hobbies, num_hobbies)

        return PersonProfile(
            name=name,
            age=age,
            gender=gender,
            location=location,
            job_title=job_title,
            industry=industry,
            income_level=income_level,
            annual_income=annual_income,
            education=education,
            marital_status=marital_status,
            health_conditions=health_conditions,
            lifestyle_factors=lifestyle_factors,
            hobbies=hobbies,
            family_size=family_size,
            years_experience=years_experience
        )

    def generate_profiles(self, count: int = 100) -> List[PersonProfile]:
        """Generate multiple fake person profiles"""
        profiles = []
        used_names = set()

        while len(profiles) < count:
            profile = self.generate_person()
            if profile.name not in used_names:
                profiles.append(profile)
                used_names.add(profile.name)

        return profiles