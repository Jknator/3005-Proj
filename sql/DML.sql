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
('Supa', 'Manner', 'SupaManner@gmail.com', 'password15');

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

INSERT INTO Equipments(equipment_name)
VALUES
('Treadmill'),
('Barbell'),
('Dumbbells'),
('Elliptical Trainer'),
('Stationary Bike'),
('Leg Press Machine'),
('Cable Machine'),
('Kettlebells'),
('Rowing Machine'),
('Smith Machine'),
('Punching Bag');

INSERT INTO Availabilities(trainer_id, day, starting_time, ending_time, is_group_session)
VALUES
(1, 1, '08:00:00', '10:00:00', false),
(1, 3, '14:00:00', '16:00:00', true),
(1, 5, '18:00:00', '20:00:00', false),
(2, 2, '09:00:00', '11:00:00', true),
(2, 4, '13:00:00', '15:00:00', false),
(2, 6, '16:30:00', '18:30:00', false),
(3, 1, '10:00:00', '12:00:00', false),
(3, 3, '15:00:00', '17:00:00', true),
(3, 5, '19:00:00', '21:00:00', false),
(4, 2, '08:30:00', '10:30:00', true),
(4, 4, '12:30:00', '14:30:00', false),
(4, 6, '17:00:00', '19:00:00', false),
(5, 1, '09:30:00', '11:30:00', true),
(5, 3, '14:30:00', '16:30:00', false),
(5, 5, '18:30:00', '20:30:00', false);


