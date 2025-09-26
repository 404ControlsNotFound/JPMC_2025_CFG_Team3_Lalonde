import random
from typing import List
from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import datetime

class PersonProfile(BaseModel):
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
    case_logs: dict[datetime, str]

    model_config = ConfigDict(extra="ignore", arbitrary_types_allowed=True)
    
    @field_serializer('case_logs')
    def serialize_case_logs(self, case_logs: dict[datetime, str]) -> dict[int, str]:
        """Convert datetime keys to timestamps for JSON serialization"""
        return {
            int(dt.timestamp()): log_entry 
            for dt, log_entry in case_logs.items()
        }

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

Case Logs:
{''.join([f"- {dt.strftime('%Y-%m-%d')}: {log_entry}\n" for dt, log_entry in sorted(self.case_logs.items())]) if self.case_logs else "No case logs available."}

Additional Context: This person lives in {self.location}, works as a {self.job_title} in the {self.industry} industry, and has {self.years_experience} years of professional experience. Their income level is considered {self.income_level} with an annual salary of ${self.annual_income:,}.
        """.strip()

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
        
        # Generate case logs (random historical records)
        case_logs = {}
        num_cases = random.randint(0, 5)  # 0-5 case entries
        
        if num_cases > 0:
            from datetime import datetime, timedelta
            
            case_log_data = [
                """
                **Initial Intake and Assessment (9/25/2025):**
                Client (Mr. John D.) presented with chief complaint of increasing **social isolation** since the passing of his spouse 6 months ago. He appears physically frail but alert. Reports difficulty with meal preparation and managing household chores. Financial situation appears stable, but he's unaware of local senior resources.
                *Action: Scheduled a follow-up home visit next week. Provided pamphlets for Meals on Wheels and the local Senior Center activities.*
                """,
                """
                **Reported Feelings of Isolation and Loneliness (10/02/2025):**
                During the home visit, Mr. D. expressed feeling profoundly **lonely** and stated, "The days are too long." He spends most of the day watching television. He has limited mobility and relies on a cane. Environment is tidy. No immediate safety risks observed.
                *Action: Completed referral form for the **Friendly Visitor Program**. Contacted local church to inquire about their weekly luncheon and transportation options.*
                """,
                """
                **Referral to Community Seniors Program (10/09/2025):**
                Confirmed Mr. D.'s enrollment in the **Senior Center's** weekly book club and a light exercise class starting on Thursday. He voiced initial reluctance but agreed to try one session. Transportation will be provided by the center's shuttle service.
                *Action: Confirmed shuttle pick-up time. Set calendar reminder for 3 days prior to the first session to offer an encouraging check-in call.*
                """,
                """
                **Noted Signs of Early-Stage Cognitive Decline (10/23/2025):**
                During a check-in call, Mr. D. was confused about the day of the week and repeated a story told earlier in the conversation. He had forgotten to take his morning blood pressure medication. Daughter (Ms. Sarah D.) expressed concern over recent confusion.
                *Action: Suggested Ms. D. schedule an appointment with the primary care physician (PCP) for a **Memory Screening**. Provided information on organizing medication with a pill box.*
                """,
                """
                **Discussion of Financial Difficulties (11/06/2025):**
                Mr. D. disclosed that his monthly utility bills have become difficult to manage, cutting into his grocery budget. He is worried about heating costs this winter. He is living solely on his Social Security benefit.
                *Action: Helped client complete the application for the **Low Income Home Energy Assistance Program (LIHEAP)**. Scheduled an appointment to review eligibility for supplementary **SNAP benefits** (food stamps).*
                """,
                """
                **Follow-up Regarding Medication Adherence (11/20/2025):**
                Daughter reported that Mr. D.'s new pill organizer has helped significantly; no missed doses this week. PCP confirmed mild cognitive impairment but no immediate need for institutional care.
                *Action: Reinforced the importance of using the pill box. Will monitor medication management during subsequent visits.*
                """,
                """
                **Facilitated Family Mediation Session (12/04/2025):**
                Meeting held with Mr. D., his daughter, and his son regarding escalating tension over who will take primary responsibility for care. Daughter is feeling burned out. Son is geographically distant but willing to provide financial support.
                *Action: Established a rotation schedule for caregiving tasks. Discussed the option of **Respite Care** for the daughter. Agreed to revisit the plan in 30 days.*
                """,
                """
                **Arrangement for Home Safety Assessment (12/18/2025):**
                Noted several loose rugs and a dim hallway light during the last visit, posing a **fall risk**. Client initially resisted changes, viewing them as 'unnecessary fuss.'
                *Action: Contacted the Occupational Therapist (OT) from the local hospital to schedule a professional **Home Safety Evaluation**. Secured a grant application for the installation of essential grab bars in the bathroom.*
                """,
                """
                **Contacted Adult Protective Services (01/08/2026):**
                Received an anonymous call alleging that the client's caregiver was verbally abusive and withholding necessary hygiene assistance. No visible physical injuries. Client seemed reluctant to talk about the caregiver.
                *Action: Filed a report with **Adult Protective Services (APS)** due to potential neglect/abuse concern. Immediately began identifying temporary, alternative care options for the client during the investigation period.*
                """,
                """
                **Scheduled Benefit Review and Advocacy (01/22/2026):**
                The LIHEAP application was denied due to a paperwork error (missing signature). Client is overwhelmed by complex forms and letters.
                *Action: Rescheduled an in-person meeting to meticulously review all denied claims. Contacted the agency to clarify the specific denial reason and will act as the client's advocate to **re-submit the LIHEAP application** and ensure all entitlements are fully accessed.*
                """
            ]
            
            # Generate dates going back up to 2 years
            for _ in range(num_cases):
                days_back = random.randint(1, 730)  # Up to 2 years back
                case_date = datetime.now() - timedelta(days=days_back)
                case_log = random.choice(case_log_data)
                case_logs[case_date] = case_log
                

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
            years_experience=years_experience,
            case_logs=case_logs
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