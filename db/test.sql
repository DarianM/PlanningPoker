SELECT * FROM members;
SELECT * FROM rooms;
SELECT * FROM stories;
SELECT * FROM roomsMembers;

SELECT * FROM members
INNER JOIN roomsMembers ON roomsMembers.userId = members.id
WHERE name = "sfg" AND roomId = 1;

DELETE FROM members;
DELETE FROM rooms;