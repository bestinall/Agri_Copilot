from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.green_advisor_agent import GreenAdvisor

# ✅ Step 1: Initialize your app
app = FastAPI()

# ✅ Step 2: Add this CORS configuration block
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows requests from any origin (temporary for testing)
  # Your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# ✅ Step 3: Define input structure
class AdvisoryRequest(BaseModel):
    place: str
    goal: str

# ✅ Step 4: Define API endpoint
@app.post("/get-plan")
def get_advisory_result(req: AdvisoryRequest):
    api_key = "680e2cb8e46dd5f29c76d43c2b7b2694"  # Replace with your actual API key
    advisor = GreenAdvisor(api_key=api_key, place_name=req.place, goal=req.goal)
    result = advisor.get_plan()

    return {
        "place": result["place"],
        "weather_summary": result["weather_summary"],
        "weather_tags": result["weather_tags"],
        "plan_a": result["plan_a"],
        "plan_b": result["plan_b"],
        "llm_reasoning": result["llm_reasoning"],
        "townhall": result["townhall"]
    }
