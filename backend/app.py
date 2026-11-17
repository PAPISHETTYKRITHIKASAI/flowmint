
from flask import Flask

# Create the Flask application
app = Flask(__name__)

# Define the home route
@app.route("/")
def home():
    return "Welcome to TaskFlow API!"

# Run the application
if __name__ == "__main__":
    app.run(debug=True)
