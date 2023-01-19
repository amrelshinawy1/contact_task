Assignment
Backend Developer

Contact Application

Explanation:
This Project provide API for a normal cloud base contact application

User Story:
- As a User I can Register
- As a User I can Login To App
- As a User I can insert contact
(Name,Middle name,Surname,Phone number,note,Address,Location(latitude and longitude)
- As a User I can update contact
- As a User I can find a contact by name,middle name,surname
- As a User I can delete a contact
- As a User I can not enter wrong format data(can not enter character as
phone number)
- As a User I can I can search in contacts by some part of name(by writing
“jame” should be able to find “james”
- As a User I can search nearby contacts, by choosing distance and my
current location
- As a User I can see My contacts history(when user change a contact old
information should save as history)

Specs:
- Each Contact has Name, Middle name,Surname,Phone
number,Note,Address,Location (latitude and longitude)

Assignment
Backend Developer

- Name ,Surname and phone number is mandatory ,rest of fields are
optional
- API should use one cloud authentication method(we suggest firebase
authentication or AWS(cognito)
- You are free to choose any database you want, with your explanation
about your reasons
- You should insert 100k contacts by generating some random name and
number
- We will test API by maximum 5 RPS
- All fields should validate before inserting
- For finding a contact API should response with all related result but sorted
in best way, for example finding “james” in contacts should find james in
“name”,”middle name” and “last name” field and also return not exact
match results too
- You should Provide a api to give nearby a location result for example as
request we send latitude and longitude and distance , you should pass all
the contact around that location by that distance
- You should log all of the contact changes by time, means whenever a
contact changes you should keep the log, and in one api you should pass
the logs(pagination need)