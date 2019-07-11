SELECT * FROM members;
SELECT * FROM rooms;
SELECT * FROM stories;
SELECT * FROM roomsMembers;

SELECT MIN("order") FROM stories WHERE "ended" NOT NULL

DELETE FROM stories WHERE id = 5;

SELECT * FROM members
INNER JOIN roomsMembers ON roomsMembers.userId = members.id
WHERE name = "sfg" AND roomId = 1;


SELECT "order" FROM stories WHERE id = 2
UPDATE stories SET "order" = 3 WHERE id = 1;
UPDATE stories SET "order" = 1 WHERE id = 3;

UPDATE stories SET "order" = "order" + 1 WHERE id BETWEEN 1 AND 3;

DELETE FROM members;
DELETE FROM rooms;
DELETE FROM stories;
DELETE FROM roomsMembers;
SELECT "order"  WHERE id = 1;


UPDATE stories SET "order" = "order" + 1 
WHERE "order" >= (SELECT "order" FROM stories WHERE id = 1)
AND "order" < (SELECT "order" FROM stories WHERE id = 4)

UPDATE stories SET "order" = 1 WHERE id = 4