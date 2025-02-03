from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy
from sqlalchemy.exc import SQLAlchemyError
import uvicorn
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Build database URL from environment variables
DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"

# FastAPI setup
FASTAPI_HOST = "0.0.0.0"
FASTAPI_PORT = 7777
engine = sqlalchemy.create_engine(DATABASE_URL)

# Create FastAPI instance
app = FastAPI(
    title="FirstBase API",
    description="API for FirstBase message system",
    version="1.0.0"
)

# CORS setup
origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/messages")
async def get_messages(
    response: Response,
    page: int = 1,
    page_size: int = 20
):
    """Retrieve paginated messages from the database."""
    try:
        # Calculate offset for pagination
        offset = (page - 1) * page_size
        
        with engine.connect() as connection:
            # Get total count of messages
            count_query = sqlalchemy.text(
                "SELECT COUNT(*) as total FROM messages WHERE `status` = 1"
            )
            total_count = connection.execute(count_query).scalar()
            
            # Get paginated messages
            query = sqlalchemy.text(
                """
                SELECT * 
                FROM messages 
                WHERE `status` = 1 
                ORDER BY timeStamp DESC
                LIMIT :limit OFFSET :offset
                """
            )
            messages = connection.execute(
                query, 
                {"limit": page_size, "offset": offset}
            ).fetchall()
            
            return {
                "items": [message._asdict() for message in messages],
                "pagination": {
                    "total": total_count,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": (total_count + page_size - 1) // page_size
                }
            }
            
    except SQLAlchemyError as e:
        response.status_code = 500
        return {"error": "Database error occurred"}

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=FASTAPI_HOST,
        port=FASTAPI_PORT
    )
