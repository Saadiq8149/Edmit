import fastapi
from fastapi import FastAPI
import sqlite3
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware

app = FastAPI()

# Add CORS middleware with unrestricted policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/get_states")
async def get_states():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM states")
    rows = cursor.fetchall()
    states = [dict(row) for row in rows]  # Convert each row to a dictionary
    conn.close()
    return {"states": states}  # Return the list of dicts as JSON

@app.get("/api/get_colleges")
async def get_colleges():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM colleges")
    rows = cursor.fetchall()
    colleges = [dict(row) for row in rows]
    conn.close()
    return {"colleges": colleges}

@app.get("/api/get_colleges_by_state/{state_id}")
async def get_colleges_by_state(state_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM colleges WHERE state_id = ?", (state_id,))
    rows = cursor.fetchall()
    colleges = [dict(row) for row in rows]
    conn.close()
    return {"colleges": colleges}

@app.get("/api/get_cutoffs_by_state/{state_id}")
async def get_cutoffs_by_state(state_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.*
        FROM cutoffs c
        INNER JOIN (
            SELECT category, MAX(closing_rank) as max_rank
            FROM cutoffs
            WHERE state_id = ?
            GROUP BY category
        ) m ON c.category = m.category AND c.closing_rank = m.max_rank
        WHERE c.state_id = ?
    """, (state_id, state_id))
    rows = cursor.fetchall()
    # print(rows)
    cutoffs = [dict(row) for row in rows]
    for cutoff in cutoffs:
        cursor.execute("SELECT name FROM colleges WHERE id = ?", (cutoff['college_id'],))
        college_row = cursor.fetchone()
        cutoff['college_name'] = college_row['name'] if college_row else "Unknown"
    conn.close()
    return {"cutoffs": cutoffs}

@app.get("/api/get_cutoffs_by_college/{college_id}")
async def get_cutoffs_by_college(college_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cutoffs WHERE college_id = ?", (college_id,))
    rows = cursor.fetchall()
    cutoffs = [dict(row) for row in rows]
    conn.close()
    return {"cutoffs": cutoffs}

@app.get("/api/get_college_name_by_id/{college_id}")
async def get_college_name_by_id(college_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM colleges WHERE id = ?", (college_id,))
    row = cursor.fetchone()
    college_name = row['name'] if row else None
    conn.close()
    return {"college_name": college_name}

@app.get("/api/get_state_name_by_id/{state_id}")
async def get_state_name_by_id(state_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM states WHERE id = ?", (state_id,))
    row = cursor.fetchone()
    state_name = row['name'] if row else None
    conn.close()
    return {"state_name": state_name}

@app.get("/api/get_categories_by_state/{state_id}")
async def get_categories_by_state(state_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT category FROM cutoffs WHERE state_id = ?", (state_id,))
    rows = cursor.fetchall()
    categories = [row['category'] for row in rows]
    conn.close()
    return {"categories": categories}

def get_connection():
    conn = sqlite3.connect('cutoffs_database.db')
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)
