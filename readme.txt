to run the project 
1) open terminal in folder 
2) npm i
3) node index.js  or nodemon


120 car parking capacity 
20 % reserved = 24 slots
other slots - general = 96 slots


server - nodeJS
REST using express
database - mongoDB
queue - BULL module(backed by redis)
cron - node-cron NPM module



The booking mechanism has been automated using queueing sytem since its a first come first serve model.


Whenever a user books a slot, the user will be alloted a temporary booking id.
A small worker runs in the background and allocates parking slots to users.


The user need to fetch booking status using api  (parking/fetchBookingStatus/:userId)


2 queues have been created reserved and general.
General people enter only general queue.
Reserved people enter reserved queueat first. If all reserved slots are booked, 
then the reserved user is pushed to general queue with higher priority over general users. 



A cron runs in the background every 1 min 
to check the available slots and reduce the standard wait time from 30 mins to 15 mins.



API structure with appropriate standards. - suitable for micro services architecture.
For easy test run for your team, i have skipped the .env file structure.


Scope for further improvements -
- We can implement redis caching and create cache for available, booked, slots and update cache on every change.
- Even the counter for booked slots can be stored in cache and can be updated frequently.

- kill switch to disable all online bookings.
- option for the user to cancel his booking.
- option for user to book more than 1 parking space.
- option to mark a slot under maintenance.


