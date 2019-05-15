SELECT * FROM members;
SELECT * FROM rooms;
SELECT * FROM roomsMembers;

SELECT * FROM members
INNER JOIN roomsMembers ON roomsMembers.userId = members.id
WHERE name = "sfg" AND roomId = 1;

SELECT max(id) FROM rooms
INSERT INTO rooms(id) VALUES (2)

DELETE FROM members;
DELETE FROM rooms;