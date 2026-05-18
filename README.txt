
# SOLAR POWER PREDICTION PROJECT

## INTRODUCTION

This project is a Solar Power Prediction System that predicts solar energy generation using a Machine Learning model. It consists of a React-based frontend and a Django backend that communicates through APIs.

## PROJECT STRUCTURE

solar-prediction-project
│
├── frontend   (React Application)
├── backend    (Django Application)
└── README.txt

## TECHNOLOGIES USED

Frontend:

* React.js
* HTML, CSS, JavaScript
* npm

Backend:

* Python
* Django
* Django REST Framework
* Machine Learning Model

---

## FRONTEND SETUP (React)

Step 1: Open terminal and go to frontend folder
cd frontend

Step 2: Install dependencies (IMPORTANT - node_modules is not included in zip)
npm install

Step 3: Run the frontend
npm start

Frontend will run on:
[http://localhost:3000](http://localhost:3000)

---

## BACKEND SETUP (Django)

Step 1: Go to backend folder
cd backend

Step 2: Create virtual environment
python -m venv venv

Step 3: Activate virtual environment

For Windows:
venv\Scripts\activate

For Linux/Mac:
source venv/bin/activate

Step 4: Install dependencies
pip install -r requirements.txt

Step 5: Apply migrations
python manage.py makemigrations
python manage.py migrate

Step 6: Run backend server
python manage.py runserver

Backend will run on:
[http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## IMPORTANT NOTES

1. The node_modules folder is not included in the project ZIP because it is very large.
2. After extracting the project, you MUST run:
   npm install
   inside the frontend folder.
3. Make sure Node.js and npm are installed before running frontend.
4. Make sure Python and pip are installed before running backend.

---

## FEATURES

* User-friendly React interface
* Solar power prediction using Machine Learning
* Django REST API integration
* Fast and efficient prediction system
* Input-based result generation

---

## WORKING FLOW

1. User enters input values in the frontend
2. React sends request to Django backend
3. Backend processes data using ML model
4. Prediction result is generated
5. Result is sent back to frontend and displayed

---

## COMMON COMMANDS

Frontend:
cd frontend
npm install
npm start

Backend:
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver


---

## PROJECT TITLE

Solar Power Prediction System

