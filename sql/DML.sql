INSERT INTO Members(first_name, last_name, email, password) 
VALUES 
('Jason', 'Kwak', 'JasonKwak@gmail.com', 'password1'),
('Bob', 'Bobber', 'BobBobber@gmail.com', 'password2'),
('Hugh', 'Mungus', 'HughMungus@gmail.com', 'password3'),
('Jimmy', 'Neutron', 'JimmyNeutron@gmail.com', 'password4'),
('Hector', 'Dorcus', 'HectorDorcus@gmail.com', 'password5'),
('Random', 'Name', 'RandomName@gmail.com', 'password6'),
('Timmy', 'Goob', 'TimmyGoob@gmail.com', 'password7');

INSERT INTO Trainers(first_name, last_name, email, password) 
VALUES 
('Sarah', 'Kim', 'SarahKim@gmail.com', 'password8'),
('Sophia', 'Kim', 'SophiaKim@gmail.com', 'password9'),
('Ethan', 'Wakefield', 'EthanWakefield@gmail.com', 'password10'),
('Daniel', 'Wakefield', 'DanielWakefield@gmail.com', 'password11'),
('Michelle', 'Kim', 'MichelleKim@gmail.com', 'password12');

INSERT INTO Admins(first_name, last_name, email, password) 
VALUES 
('Stephanie', 'Kim', 'Stephanie@gmail.com', 'password13'),
('Randomer', 'Name', 'RandomerName@gmail.com', 'password14'),
('Terry', 'Kwak', 'TerryKwak@gmail.com', 'password15');

INSERT INTO Rooms(room_name)
VALUES
('Cardio Room'),
('Weight Room'),
('Group Exercise Studio'),
('Stretching Area'),
('Swimming Pool'),
('Cycling Studio'),
('Boxing/Martial Arts Room'),
('Personal Training Room 1'),
('Personal Training Room 2'),
('Personal Training Room 3');

INSERT INTO Equipments(equipment_name, equipment_status)
VALUES
('Treadmill', 87),
('Barbell', 42),
('Dumbbells', 30),
('Elliptical Trainer', 100),
('Stationary Bike', 78),
('Leg Press Machine', 24),
('Cable Machine', 2),
('Kettlebells', 67),
('Rowing Machine', 51),
('Smith Machine',3),
('Punching Bag', 58);

INSERT INTO Availabilities(trainer_id, day, starting_time, ending_time, is_group_session)
VALUES
(1, 'Sunday', '08:00:00', '10:00:00', false),
(1, 'Tuesday', '14:00:00', '16:00:00', true),
(1, 'Thursday', '18:00:00', '20:00:00', false),
(2, 'Monday', '09:00:00', '11:00:00', true),
(2, 'Wednesday', '13:00:00', '15:00:00', false),
(2, 'Friday', '16:30:00', '18:30:00', false),
(3, 'Sunday', '10:00:00', '12:00:00', false),
(3, 'Tuesday', '15:00:00', '17:00:00', true),
(3, 'Thursday', '19:00:00', '21:00:00', false),
(4, 'Tuesday', '08:30:00', '10:30:00', true),
(4, 'Thursday', '12:30:00', '14:30:00', false),
(4, 'Friday', '17:00:00', '19:00:00', false),
(5, 'Saturday', '09:30:00', '11:30:00', true),
(5, 'Tuesday', '14:30:00', '16:30:00', false),
(5, 'Friday', '18:30:00', '20:30:00', false);


