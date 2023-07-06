# Upsolver

## Table of Contents

- [Upsolver](#upsolver)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [User Context](#user-context)
    - [Users Roles](#users-roles)
    - [User Personas](#user-personas)
      - [Of Contestants](#of-contestants)
      - [Of Coaches](#of-coaches)
    - [User Stories](#user-stories)
  - [Application Screens](#application-screens)
  - [Wireframe Mockup](#wireframe-mockup)
  - [Technical Challenges](#technical-challenges)
  - [Endpoints](#endpoints)
    - [User](#user)
  - [Data Model](#data-model)
    - [User](#user-1)
    - [Role](#role)
    - [Team](#team)
    - [Group](#group)
    - [Division](#division)
    - [Contest](#contest)
    - [Chat](#chat)
    - [ContestProblem](#contestproblem)
    - [Problem](#problem)
    - [Tag](#tag)
    - [Submission](#submission)

## Overview

Upsolver is a tool designed specifically for competitive programmers and team coaches, aimed at optimizing the upsolving process and streamlining team progress management.

## User Context

### Users Roles

- **Contestant:** user who wants to learn by upsolving problems and receive help from his coach in form of hints.

- **Coach:** user who Manages and guides competitive programming teams and provides hints to problems.

### User Personas

#### Of Contestants

- Diego is a 20-year-old Mexican man who is currently in his sophomore year of computer science. A year ago, he entered the world of competitive programming to learn more and be more attractive to companies that hire interns. Feeling frustrated with his progress, Diego sought the help of more experienced competitors and they told him that in order to improve he must do upsolving, which is when you try to solve the problems that you couldn’t solve during a contest, they also told him that he must do the upsolving with his team and not alone, as this will make it easier for him to be consistent. Diego appreciates the advice of his friends, but the idea of doing upsolving seems overwhelming. He has too many pending contests to upsolve, and it seems to him that doing so is an impossible task. Also, he gets a lot of anxiety asking his teammates about their progress with upsolving.

- Alexia is a 19-year-old student from Mexico who is currently studying her first year of engineering in data science and mathematics. She has a lot of experience in math competitions and upon entering university she was drawn to her to also participate in programming competitions, so she joined a team from her university. Her team is quite big, it has three competitors, a substitute, a coach and two co-coaches. To upsolve, Alexia's team currently uses a shared Excel file where everyone records their progress, and to ask for help when she's stuck with a problem, she does it via direct message to her coaches and teammates, because if she does it in a group chat everyone would get spoiled with the answer. Alexia is fine with the current system, but when there is a new contest and it is her turn to add it to the Excel file, it takes her a long time to capture the information of the problems. In addition, she feels that sometimes her trainers answer her questions with some annoyance, since they are questions that they have already answered for other people as well.

#### Of Coaches

- Leonardo is a 23-year-old Mexican man who is currently about to graduate from a computer science degree. During his time at the university, he competed in the ICPC, qualifying for two world finals and is currently the coach of several teams in Mexico. Leonardo likes to help his apprentices by answering their questions, but his job doesn’t give him much time to do so. Also, Leonardo is sometimes puzzled by not knowing the progress the teams he coaches are making and whether the time he is investing in them is helping them to improve.

- Sofia is a 24-year-old Mexican woman who just graduated and is currently working full time at Oracle MDC. A couple of months ago, an ICPC team from her old university contacted her to ask her to be her coach and she accepted. When talking with her new team, Sofía realized that they don’t do upsolving, so she plans to recommend that they do so she is looking for strategies to make it easier for them to start doing it.

### User Stories

1. As a competitor, I want to be able to create an account, so that I can access my team's information.
2.  As a competitor, I want to quickly add a contest to my list of pending upsolving contests, so that I can spend less time on organization and more on actual upsolving.
3.  As a competitor, I want to quickly access the problem I choose to start upsolving, so that I don't have to search for problem statements in different places and save time.
4.  As a competitor, I want to quickly record my progress, to make the process less cumbersome.
5.  As a competitor, I want to clearly see the progress I have made, to avoid feeling overwhelmed by the number of pending problems for upsolving.
6.  As a competitor, I want to see the progress of other team members and compare my progress with theirs, to stay motivated in my upsolving journey.
7.  As a competitor, I want to view a list of problems I have upsolved categorized by topics and with my notes, so that I can share examples of problems from a specific topic when I teach at my programming club.
8.  As a competitor, for a specific problem, I want to request hints from my coach and see the hints they have already given to other team members, to unblock myself and continue progressing in upsolving.
9.  As a coach, I want to create an account, to access the information of the teams I coach.
10.  As a coach, I want to view the progress of the teams I coach, to ensure that my assistance is benefiting them and to stay motivated to help them.
11.  As a coach, I want to provide hints to my learners when they ask for them, so that they can overcome challenges and continue with their training.
12.  As a coach, I want to see a summary of my teams' weekly progress, to evaluate their performance and consider it for future contest assignments.

## Application Screens

The application will have the following screens:
- Teams
- Contest Groups
- Contest Group Problem's Table
- Team's Information
- Problemset

## Wireframe Mockup

<img width="1064" alt="1" src="https://github.com/cdamezcua/Upsolver/assets/88699709/cc1d1de9-4e97-4e6f-bbc0-b255ae1ea2c6">
<img width="1064" alt="2" src="https://github.com/cdamezcua/Upsolver/assets/88699709/fa2f89b3-98d6-4837-83b6-62e9c52d28e3">
<img width="1064" alt="3" src="https://github.com/cdamezcua/Upsolver/assets/88699709/a3ff85d3-2cbf-45f1-8d7d-d44237d3c3ce">
<img width="1064" alt="4" src="https://github.com/cdamezcua/Upsolver/assets/88699709/21b37b3f-2017-4f3b-acad-fcccd4503336">
<img width="1064" alt="5" src="https://github.com/cdamezcua/Upsolver/assets/88699709/f8418bf1-cfae-4928-be93-24200d30ca96">

## Technical Challenges

Tentatively, the two technical challenges of this project will be:
1. to integrate a web scratcher into the application to populate the contest group tables quickly, and 
2. to make the discussion chats work in real time.
>It is also proposed as a possible third technical challenge to add push notifications.

## Endpoints

### User

| HTTP Verb 	| API Endpoint 	| Action                                                                 	|
|-----------	|--------------	|------------------------------------------------------------------------	|
| POST      	| /users       	| Create a new user in the database with the provided information.       	|
| GET       	| /users/{id}  	| Retrieve the details of a specific user based on the provided user ID. 	|
| PUT       	| /users/{id}  	| Update the details of a specific user based on the provided user ID.   	|
| DELETE    	| /users/{id}  	| Delete a specific user based on the provided user ID.                  	|

## Data Model

![upsolver-data-model](https://github.com/cdamezcua/Upsolver/assets/88699709/1d5f9e61-32ce-4065-9961-2e3d17032372)

### User

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | Unique identifier for each user |
| UK1 | username    | varchar   | Unique username chosen by the user |
| UK2 | email       | varchar   | Unique email address of the user |
|     | password    | varchar   | Encrypted password for the user's account |
|     | name        | varchar   | Full name of the user |
|     | creation_date | date    | Date when the user's account was created |

### Role

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK,FK1 | user_id | int | The primary key and foreign key referencing the User table |
| PK,FK2 | team_id | int | The primary key and foreign key referencing the Team table |
|     | name | varchar | The name of the role |

### Team

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | The primary key of the team |
|     | name        | varchar   | The name of the team |
|     | creation_date | date    | The date the team was created |

### Group

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | The primary key of the group |
| FK  | team_id     | int       | The foreign key referencing the Team table |
|     | url         | varchar   | The URL of the group |
|     | name        | varchar   | The name of the group |
|     | creation_date | date    | The date the group was created |

### Division

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | The primary key of the division |
| FK  | group_id    | int       | The foreign key referencing the Group table |
|     | name        | varchar   | The name of the division |

### Contest

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | The primary key of the contest |
| FK  | division_id | int       | The foreign key referencing the Division table |
|     | url         | varchar   | The URL of the contest |
|     | name        | varchar   | The name of the contest |
|     | start_date  | date      | The start date of the contest |

### Chat

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK,FK1 | team_id | int | The primary key and foreign key referencing the Team table |
| PK,FK2 | problem_id | int | The primary key and foreign key referencing the Problem table |
|     | tbd | tbd | To be determined |

### ContestProblem

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK,FK1 | contest_id | int | The primary key and foreign key referencing the Contest table |
| PK,FK2 | problem_id | int | The primary key and foreign key referencing the Problem table |
|     | url | varchar | The URL of the problem |
|     | index | varchar | The index of the problem |
|     | solved | int | Number of competitors who solved the problem during the contest |

### Problem

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | The primary key of the problem |
|     | url         | varchar   | The URL of the problem |
|     | name        | varchar   | The name of the problem |

### Tag

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | The primary key of the tag |
| FK  | user_id     | int       | The foreign key referencing the User table |
| FK  | problem_id  | int       | The foreign key referencing the Problem table |
|     | name        | varchar   | The name of the tag |

### Submission

| Key | Column Name | Data Type | Description |
| --- | ----------- | --------- | ----------- |
| PK  | id          | int       | The primary key of the submission |
| FK  | user_id     | int       | The foreign key referencing the User table |
| FK  | problem_id  | int       | The foreign key referencing the Problem table |
|     | veredict    | varchar   | The verdict of the submission |
|     | creation_date | date    | The date the submission was created |
