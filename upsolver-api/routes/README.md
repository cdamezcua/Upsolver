# Endpoints

## Users

POST    /users/register
POST    /users/login
GET     /users/is-logged-in
POST    /users/logout
GET     /users

## Invitations

GET     /invitations
POST    /invitations/:invitationId/accept
POST    /invitations/:invitationId/reject

## Teams

GET     /teams
POST    /teams
GET     /teams/:teamId
GET     /teams/:teamId/members
GET     /teams/:teamId/members?membership=
GET     /teams/:teamId/invitations
POST    /teams/:teamId/invitations
DELETE  /teams/:teamId/invitations/:invitationId

## Groups

GET     /teams/:teamId/groups
GET     /teams/:teamId/groups/:groupId
POST    /teams/:teamId/groups

## Contests

POST    /teams/:teamId/groups/:groupId/contests

## Problems

GET     /teams/:teamId/groups/:groupId/contests/problems

## Submissions

GET     /teams/:teamId/groups/:groupId/submissions?membership=
PUT     /teams/:teamId/groups/:groupId/submissions?userId=&problemId=

## Messages

GET     /teams/:teamId/problems/:problemId/messages
POST    /teams/:teamId/problems/:problemId/messages

## Progresses

GET     /teams/:teamId/groups/:groupId/progresses?membership=
GET     /teams/:teamId/progresses?membership=