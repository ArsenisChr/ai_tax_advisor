from fastapi import FastAPI

app = FastAPI(
    title="AI Tax Advisor API",
    description="REST API for the AI Tax Advisor application",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"message": "AI Tax Advisor API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}