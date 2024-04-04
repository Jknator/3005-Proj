CREATE TABLE Members(
    member_id SERIAL PRIMARY KEY, 
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password varChar(255) NOT NULL, 
    height INTEGER, 
    weight INTEGER
);

CREATE TABLE Trainers(
    trainer_id SERIAL PRIMARY KEY, 
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password varChar(255) NOT NULL
);

CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY, 
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password varChar(255) NOT NULL
);

CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY, 
    room_name VARCHAR(255) NOT NULL
);

CREATE TABLE Equipments (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_status INTEGER NOT NULL
);

CREATE TABLE Availabilities(
    trainer_id INTEGER,
    day VARCHAR(255), 
    starting_time TIME, 
    ending_time TIME,
    is_group_session BOOLEAN, 
    PRIMARY KEY (day, starting_time, ending_time, trainer_id),
    FOREIGN KEY (trainer_id) REFERENCES Trainers (trainer_id)
);

CREATE TABLE BookedSessions( 
    member_id INTEGER,
    trainer_id INTEGER, 
    room_id INTEGER,
    day VARCHAR(255), 
    starting_time TIME, 
    ending_time TIME,
    FOREIGN KEY (member_id) REFERENCES Members (member_id),
    FOREIGN KEY (trainer_id) REFERENCES Trainers (trainer_id),
    FOREIGN KEY (room_id) REFERENCES Rooms (room_id)
);

CREATE TABLE Bills (
    transaction_id SERIAL PRIMARY KEY, 
    member_id INTEGER,
    amount INTEGER, 
    transaction_data INTEGER, 
    isPaid Boolean,
    FOREIGN KEY (member_id) REFERENCES Members (member_id)
);

CREATE TABLE FitnessGoals(
    goal_type varChar(255),
    member_id INTEGER,
    goal_date DATE,
    completed BOOLEAN DEFAULT false,
    FOREIGN KEY (member_id) REFERENCES Members (member_id),
    PRIMARY KEY (goal_type, member_id)
);

CREATE TABLE CallMaintenance( 
    admin_id INTEGER,
    equipment_id INTEGER,
    starting_date DATE,
    ending_date DATE,
    FOREIGN KEY (admin_id) REFERENCES Admins (admin_id),
    FOREIGN KEY (equipment_id) REFERENCES Equipments (equipment_id)
);

/*
Drop TABLE if exists CallMaintenance;
Drop Table if exists Equipments;
Drop Table if exists Admins;
Drop Table if exists BookedSessions;
Drop Table if exists Availabilities;
Drop Table if exists FitnessGoals;
Drop Table if exists Bills;
Drop Table if exists Members;
Drop Table if exists Trainers;
Drop Table if exists Rooms;
*/