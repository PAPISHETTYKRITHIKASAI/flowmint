
from flask import Flask, request, jsonify
from database import initialize_database, get_db_connection

app = Flask(__name__)

# Initialize database
initialize_database()


@app.route("/")
def home():
    return "Welcome to Flowmint API!"


# API to create a new task
@app.route("/tasks", methods=["POST"])
def create_task():

    data = request.get_json()

    title = data.get("title")
    description = data.get("description", "")
    due_date = data.get("due_date")
    priority = data.get("priority", "Medium")

    if not title:
        return jsonify({"error": "Task title is required"}), 400

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO tasks (title, description, due_date, priority)
        VALUES (?, ?, ?, ?)
        """,
        (title, description, due_date, priority)
    )

    connection.commit()

    task_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Task created successfully!",
        "task_id": task_id
    }), 201


# API to retrieve all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():

    connection = get_db_connection()

    tasks = connection.execute(
        "SELECT * FROM tasks ORDER BY created_at DESC"
    ).fetchall()

    connection.close()

    task_list = []

    for task in tasks:
        task_list.append(dict(task))

    return jsonify(task_list), 200

if __name__ == "__main__":
    app.run(debug=True)
