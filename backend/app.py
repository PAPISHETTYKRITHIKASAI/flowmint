
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


# API to update an existing task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    connection = get_db_connection()

    # Check whether the task exists
    task = connection.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()

    if task is None:
        connection.close()
        return jsonify({"error": "Task not found"}), 404

    # Keep existing values if fields are not provided
    title = data.get("title", task["title"])
    description = data.get("description", task["description"])
    due_date = data.get("due_date", task["due_date"])
    priority = data.get("priority", task["priority"])
    status = data.get("status", task["status"])

    if not title:
        connection.close()
        return jsonify({"error": "Task title is required"}), 400

    connection.execute(
        """
        UPDATE tasks
        SET title = ?, description = ?, due_date = ?,
            priority = ?, status = ?
        WHERE id = ?
        """,
        (title, description, due_date, priority, status, task_id)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Task updated successfully!",
        "task_id": task_id
    }), 200
# API to delete a task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    connection = get_db_connection()

    cursor = connection.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        return jsonify({
            "error": "Task not found!"
        }), 404

    return jsonify({
        "message": "Task deleted successfully!",
        "task_id": task_id
    }), 200
if __name__ == "__main__":
    app.run(debug=True)
